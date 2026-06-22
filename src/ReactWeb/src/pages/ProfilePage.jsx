import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import { useAuth } from "../contexts/authContext";
import { usePersonalInfo } from "../hooks/usePersonalInfo";
import { useUserPosts } from "../hooks/useUserPosts";
import { useUserMedias } from "../hooks/useUserMedias";
import { useSchools } from "../hooks/useSchools";
import { updateUserInfoApi, uploadAvatarApi, uploadCoverPhotoApi } from "../apis/userApi";
import AboutTab from "../components/Profile/AboutTab";
import FriendsTab from "../components/Profile/FriendsTab";
import FollowingTab from "../components/Profile/FollowingTab";
import MediaTab from "../components/Profile/MediaTab";
import ProfileReelsTab from "../components/Profile/ProfileReelsTab";
import CreateReelModal from "../components/Profile/CreateReelModal";
import CreatePostModal from "../components/Profile/CreatePostModal";
import {
  Camera,
  Plus,
  Edit2,
  ChevronDown,
  GraduationCap,
  Home,
  MapPin,
  Clock,
  Lock,
  Search,
  Grid,
  List as ListIcon,
  Smile,
  Image as ImageIcon,
  Video,
  X,
  Globe,
  ThumbsUp,
  MessageCircle,
  Share2,
  Heart,
  ArrowLeft,
  Play
} from "lucide-react";
import PostCard from "../components/Feed/PostCard";
import { useProfileFriends } from "../hooks/useProfileFriends";
import { useProfileReels } from "../hooks/useProfileReels";
import ReelViewModal from "../components/Reels/ReelViewModal";
import { useReels } from "../contexts/ReelsContext";
import { toggleLikeReelApi, deleteReelApi } from "../apis/reelApi";
import ProfileRelationshipActions from "../components/Profile/ProfileRelationshipActions";
import ProfileStoryRing from "../components/Story/ProfileStoryRing";
import { useProfileStories } from "../hooks/useProfileStories";

const DEFAULT_AVATAR = import.meta.env.VITE_DEFAULT_AVATAR;

function formatCompactCount(value) {
  const num = Number(value || 0);
  if (!Number.isFinite(num)) return "0";
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(num);
}


export default function ProfilePage() {
  const navigate = useNavigate();
  const { user: authUser, setUser: setAuthUser } = useAuth();
  const { userId } = useParams();
  const viewUserId = userId || authUser?.id;
  const isOwnProfile = !userId || String(authUser?.id) === String(userId);
  const { personalInfo, loading: infoLoading, error: infoError, setPersonalInfo } = usePersonalInfo(viewUserId);
  const { schools, loading: schoolsLoading, fetchSchools } = useSchools(viewUserId);
  const { medias: userPhotos, isLoading: photosLoading, error: photosError, loadMore: loadMorePhotos } = useUserMedias({ userId: viewUserId, mediaType: "image", pageSize: 9 });
  const { medias: userVideos, isLoading: videosLoading, error: videosError, loadMore: loadMoreVideos } = useUserMedias({ userId: viewUserId, mediaType: "video", pageSize: 12 });
  const { friends: profileFriends, loading: friendsLoading } = useProfileFriends(viewUserId);
  const { reels: profileReels, isLoading: reelsLoading, error: reelsError, refresh: refreshProfileReels, hasMore: reelsHasMore, loadMore: loadMoreReels, toggleLike: toggleReelLike, deleteReel: deleteProfileReel } = useProfileReels(viewUserId, { initialPage: 1, pageSize: 12 });
  const { reelChosen, source, closeReel, updateReel, removeReel, nextReel, prevReel, getChosenIndex, openReel, syncFromProfile } = useReels();
  const { group: profileStoriesGroup, hasStories: profileHasActiveStories } = useProfileStories(viewUserId);

  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const [avatarUploading, setAvatarUploading] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);

  // Theme state: defaults to white theme (light mode) as requested!
  const [darkMode, setDarkMode] = useState(false);

  // Tab control
  const [activeTab, setActiveTab] = useState("all"); // all, about, friends, photos

  // Edit Profile / Bio States
  const [bio, setBio] = useState(personalInfo?.bio || "");
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState(personalInfo?.bio || "");

  const [profileDetails, setProfileDetails] = useState(personalInfo?.details || {});
  const [profileName, setProfileName] = useState(personalInfo ? `${personalInfo.firstName} ${personalInfo.lastName}` : "");

  // Posts loaded from server for this profile
  const { posts: postsList, isLoading: postsLoading, refresh: refreshPosts, createPost: createUserPost } = useUserPosts(viewUserId, { initialPage: 1, pageSize: 10 });

  useEffect(() => {
    if (!viewUserId) return;
    setBio("");
    setBioInput("");
    setProfileDetails({});
    setProfileName("");
    // posts are managed by useUserPosts; nothing local to reset
    setIsEditingBio(false);
    setIsCreateModalOpen(false);
    setIsCreateReelOpen(false);
  }, [viewUserId]);

  useEffect(() => {
    if (personalInfo) {
      setBio(personalInfo.bio || "");
      setBioInput(personalInfo.bio || "");
      if (personalInfo.firstName || personalInfo.lastName) {
        setProfileName(`${personalInfo.firstName} ${personalInfo.lastName}`);
      }

      const genderStr = personalInfo.gender === 0 ? "Male" : "Female";

      const relMapping = {
        0: "Single",
        1: "In a relationship",
        2: "Engaged",
        3: "Married",
        4: "In an open relationship",
        5: "It's complicated",
        6: "Separated",
        7: "Divorced",
        8: "Widowed"
      };
      const relationshipStr = relMapping[personalInfo.relationshipStatus] ?? "Not specified";

      const formatDateToDayMonth = (dateStr) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return "";
        return date.toLocaleDateString("en-US", { day: "numeric", month: "long" });
      };

      setProfileDetails(prev => ({
        ...prev,
        currentCity: personalInfo.currentLocation || "",
        hometown: personalInfo.hometown || "",
        birthDate: personalInfo.dateOfBirth ? formatDateToDayMonth(personalInfo.dateOfBirth) : "",
        birthYear: personalInfo.dateOfBirth ? personalInfo.dateOfBirth.split("-")[0] : "",
        gender: genderStr || "",
        relationship: relationshipStr || "",
        website: personalInfo.website || "",
        pronoun: ""
      }));
    }
  }, [personalInfo]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreateReelOpen, setIsCreateReelOpen] = useState(false);


  // Localized User details
  const displayUser = {
    name: profileName || (authUser ? `${authUser.firstName || ""} ${authUser.lastName || ""}`.trim() : ""),
    avatar: personalInfo?.avatarUrl || authUser?.avatarUrl || DEFAULT_AVATAR,
    coverPhoto: personalInfo?.coverPhotoUrl || authUser?.coverPhotoUrl,
    friendsCount: profileFriends.length 
  };

  const handleSaveBio = async () => {
    if (!isOwnProfile) return;
    try {
      const updateData = {
        firstName: personalInfo?.firstName || "",
        lastName: personalInfo?.lastName || "",
        dateOfBirth: personalInfo?.dateOfBirth || "2000-01-01",
        gender: personalInfo?.gender || 0,
        bio: bioInput,
        currentLocation: profileDetails.currentCity,
        hometown: profileDetails.hometown,
        website: personalInfo?.website || "",
        relationshipStatus: personalInfo?.relationshipStatus || 0
      };

      await updateUserInfoApi(updateData);
      setBio(bioInput);
      setIsEditingBio(false);
    } catch (error) {
      console.error("Failed to update bio", error);
    }
  };

  const handleCancelBio = () => {
    setBioInput(bio);
    setIsEditingBio(false);
  };

  const handleAvatarUpload = async (file) => {
    if (!file || !isOwnProfile) return;
    try {
      setAvatarUploading(true);
      const response = await uploadAvatarApi(file);
      if (response?.Url) {
        setPersonalInfo(prev => prev ? { ...prev, avatarUrl: response.Url } : prev);
        setAuthUser(prev => prev ? { ...prev, avatarUrl: response.Url } : prev);
      }
    } catch (error) {
      console.error("Avatar upload failed", error);
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleCoverUpload = async (file) => {
    if (!file || !isOwnProfile) return;
    try {
      setCoverUploading(true);
      const response = await uploadCoverPhotoApi(file);
      if (response?.Url) {
        setPersonalInfo(prev => prev ? { ...prev, coverPhotoUrl: response.Url } : prev);
        setAuthUser(prev => prev ? { ...prev, coverPhotoUrl: response.Url } : prev);
      }
    } catch (error) {
      console.error("Cover photo upload failed", error);
    } finally {
      setCoverUploading(false);
    }
  };

  const handleAvatarFileSelect = async (event) => {
    const file = event.target.files?.[0];
    if (file) {
      await handleAvatarUpload(file);
    }
    event.target.value = "";
  };

  const handleCoverFileSelect = async (event) => {
    const file = event.target.files?.[0];
    if (file) {
      await handleCoverUpload(file);
    }
    event.target.value = "";
  };

  const handleUpdateProfileField = async (field, value) => {
    if (!isOwnProfile) return;
    try {
      const updateData = {
        firstName: personalInfo?.firstName || "",
        lastName: personalInfo?.lastName || "",
        dateOfBirth: personalInfo?.dateOfBirth || "2000-01-01",
        gender: personalInfo?.gender || 0,
        bio: bio,
        currentLocation: profileDetails.currentCity,
        hometown: profileDetails.hometown,
        website: personalInfo?.website || "",
        relationshipStatus: personalInfo?.relationshipStatus || 0
      };

      if (field === 'currentCity') updateData.currentLocation = value;
      if (field === 'hometown') updateData.hometown = value;
      if (field === 'website') updateData.website = value;
      if (field === 'birthYear') {
        const parts = (personalInfo?.dateOfBirth || "2005-10-07").split("-");
        updateData.dateOfBirth = `${value}-${parts[1] || "10"}-${parts[2] || "07"}`;
      }
      if (field === 'dateOfBirth') {
        updateData.dateOfBirth = value;
      }
      if (field === 'gender') {
        updateData.gender = (value === 'Male' || value === 'Nam') ? 0 : 1;
      }
      if (field === 'relationship') {
        const mapping = {
          'Single': 0,
          'In a relationship': 1,
          'Engaged': 2,
          'Married': 3,
          'In an open relationship': 4,
          "It's complicated": 5,
          'Separated': 6,
          'Divorced': 7,
          'Widowed': 8,
          'Not specified': null
        };
        updateData.relationshipStatus = mapping[value] !== undefined ? mapping[value] : null;
      }

      await updateUserInfoApi(updateData);

      if (field === 'dateOfBirth') {
        const date = new Date(value);
        setProfileDetails(prev => ({
          ...prev,
          birthDate: !isNaN(date.getTime()) ? date.toLocaleDateString("en-US", { day: "numeric", month: "long" }) : "",
          birthYear: !isNaN(date.getTime()) ? String(date.getFullYear()) : ""
        }));
      } else {
        setProfileDetails(prev => ({
          ...prev,
          [field]: value
        }));
      }
    } catch (error) {
      console.error("Failed to update profile field", error);
      if (field === 'dateOfBirth') {
        const date = new Date(value);
        setProfileDetails(prev => ({
          ...prev,
          birthDate: !isNaN(date.getTime()) ? date.toLocaleDateString("en-US", { day: "numeric", month: "long" }) : "",
          birthYear: !isNaN(date.getTime()) ? String(date.getFullYear()) : ""
        }));
      } else {
        setProfileDetails(prev => ({
          ...prev,
          [field]: value
        }));
      }
    }
  };

  const handleOpenEditDetails = () => {
    setActiveTab("about");
  };

  const handleCreatePost = async (payload) => {
    if (!isOwnProfile) return;
    try {
      await createUserPost(payload);
      await refreshPosts();
    } catch (err) {
      console.error("Create post failed:", err);
    }
  };

  const handleCreateReel = async () => {
    if (!isOwnProfile) return;

    try {
      await refreshProfileReels();
      setActiveTab("reels");
    } catch (err) {
      console.error("Refresh reels failed:", err);
    }
  };

  const handleLikeReelFromModal = async (reelId) => {
    const target = profileReels.find((r) => r.id === reelId);
    if (!target) return;
    const wasLiked = target.isLikedByCurrentUser;
    updateReel({
      id: reelId,
      isLikedByCurrentUser: !wasLiked,
      likeCount: wasLiked ? target.likeCount - 1 : target.likeCount + 1,
      likes: formatCompactCount(wasLiked ? target.likeCount - 1 : target.likeCount + 1),
    });
    try {
      const result = await toggleLikeReelApi(reelId);
      updateReel({
        id: reelId,
        isLikedByCurrentUser: result.isLiked,
        likeCount: result.likeCount ?? target.likeCount,
        likes: formatCompactCount(result.likeCount ?? target.likeCount),
      });
    } catch {
      updateReel({
        id: reelId,
        isLikedByCurrentUser: wasLiked,
        likeCount: target.likeCount,
        likes: formatCompactCount(target.likeCount),
      });
    }
  };

  const handleDeleteReelFromModal = async (reelId) => {
    await deleteProfileReel(reelId);
  };

  // Sync profile reels into context when they change (for scroll navigation)
  useEffect(() => {
    if (profileReels.length > 0 && source === "profile") {
      syncFromProfile(profileReels, reelsHasMore);
    }
  }, [profileReels, reelsHasMore, source, syncFromProfile]);

  // Likes are handled within PostCard component; no local like handling required.

  // Set page title
  useEffect(() => {
    document.title = `${displayUser.name} | Facebook Profile`;
  }, [displayUser.name]);

  // Color tokens depending on light/dark mode
  const theme = {
    bg: darkMode ? "bg-[#18191a]" : "bg-[#f0f2f5]",
    card: darkMode ? "bg-[#242526]" : "bg-white",
    text: darkMode ? "text-[#e4e6eb]" : "text-[#050505]",
    textSub: darkMode ? "text-[#b0b3b8]" : "text-[#65676b]",
    border: darkMode ? "border-[#3e4042]" : "border-[#e4e6eb]",
    input: darkMode ? "bg-[#3a3b3c]" : "bg-[#f0f2f5]",
    btnGray: darkMode ? "bg-[#3a3b3c] hover:bg-[#4e4f50] text-[#e4e6eb]" : "bg-[#e4e6eb] hover:bg-[#d8dadf] text-[#050505]",
    activeTab: "text-[#1877f2] border-[#1877f2]",
    sidebarHr: darkMode ? "border-[#3e4042]" : "border-[#e4e6eb]",
    tabHover: darkMode ? "hover:bg-[#3a3b3c]" : "hover:bg-[#f2f2f2]"
  };
  if (infoLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#18191a]">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (infoError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#18191a] px-4 text-center">
        <div className="max-w-lg rounded-2xl bg-white dark:bg-[#242526] shadow-sm p-8">
          <h2 className="text-2xl font-bold mb-3 text-[#111827] dark:text-[#e4e6eb]">Unable to load profile</h2>
          <p className="text-sm text-[#4b5563] dark:text-[#b0b3b8] mb-6">
            {infoError?.message || 'Something went wrong while loading this profile. Please try again later.'}
          </p>
          <button onClick={() => window.location.reload()} className="px-4 py-2 rounded-lg bg-[#1877f2] text-white hover:bg-blue-600 transition-all">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 ${theme.bg}`}>
      {/* Navbar Integration */}
      <Navbar />

      {/* Profile Container */}
      <div className="pt-14 max-w-[1095px] mx-auto px-4 md:px-8">

        {/* ========================================================
            1. HEADER SECTION (Cover, Avatar, Bio, Buttons)
            ======================================================== */}
        <div className={`${theme.card} rounded-b-xl shadow-md relative transition-colors duration-200`}>

          {/* Cover Photo */}
          <div className="relative h-[250px] md:h-[350px] bg-[#2d3139] overflow-hidden rounded-b-xl">
            <img
              src={displayUser.coverPhoto}
              alt="Cover"
              className="w-full h-full object-cover"
            />
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleCoverFileSelect}
            />
            {/* Edit Cover Photo Button */}
            {isOwnProfile && (
              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                className="absolute bottom-4 right-4 bg-black/60 hover:bg-black/80 text-white px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all"
              >
                <Camera size={16} />
                <span className="hidden sm:inline">{coverUploading ? "Uploading..." : "Upload cover image"}</span>
              </button>
            )}
          </div>

          {/* Avatar and Info Grid */}
          <div className="px-8 pb-4 pt-1 flex flex-col md:flex-row items-center md:items-end justify-between gap-6 relative">

            {/* Avatar & Basic Info */}
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-[80px] md:-mt-[45px] z-10 w-full md:w-auto text-center md:text-left">
              {/* Avatar with story ring + avatar menu */}
              <div className="relative group w-[168px] h-[168px]">
                <ProfileStoryRing
                  userId={viewUserId}
                  avatarUrl={displayUser.avatar}
                  name={displayUser.name}
                  hasActiveStories={profileHasActiveStories}
                  hasUnseenStories={profileStoriesGroup?.hasUnseenStories}
                  size="xl"
                  isOwnProfile={isOwnProfile}
                  onUploadAvatar={() => avatarInputRef.current?.click()}
                  onSeeStories={() => navigate(`/profile/${viewUserId}/stories`)}
                  darkMode={darkMode}
                />
                {/* Hidden file input for avatar upload */}
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarFileSelect}
                />
              </div>

              {/* Bio & Details text */}
              <div className="mb-2">
                <h1 className={`text-3xl font-extrabold tracking-tight flex items-center justify-center md:justify-start gap-2 ${theme.text}`}>
                  {displayUser.name}
                </h1>


                {/* Bio Panel */}
                <div className="mt-3 flex flex-col items-center md:items-start">
                  {!isEditingBio ? (
                    <div className="flex items-center gap-2 group">
                      <span className={`text-[15px] italic font-medium ${theme.text}`}>{bio || "Add a bio..."}</span>
                      {
                        isOwnProfile && (
                          <button
                            onClick={() => setIsEditingBio(true)}
                            className={`opacity-0 group-hover:opacity-100 p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-all text-xs ${theme.textSub}`}
                            title="Edit bio"
                          >
                            <Edit2 size={12} />
                          </button>
                        )
                      }

                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 mt-1 w-[200px]">
                      <textarea
                        value={bioInput}
                        onChange={(e) => setBioInput(e.target.value)}
                        placeholder="Write something about yourself..."
                        maxLength={100}
                        className={`w-full p-2 text-sm rounded-lg border outline-none ${darkMode ? "bg-[#3a3b3c] border-[#3e4042] text-white" : "bg-white border-gray-300 text-black"} focus:border-[#1877f2]`}
                        rows={2}
                      />
                      <div className="flex justify-end gap-2 text-xs font-semibold">
                        <button onClick={handleCancelBio} className={`px-3 py-1.5 rounded-lg ${theme.btnGray}`}>Cancel</button>
                        <button onClick={handleSaveBio} className="px-3 py-1.5 rounded-lg bg-[#1877f2] hover:bg-blue-600 text-white">Save</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Header Action Buttons */}
            {isOwnProfile ? (
              <div className="flex items-center gap-3 z-10 w-full md:w-auto justify-center">
                <button
                  onClick={() => navigate('/stories/create')}
                  className="flex-1 md:flex-initial bg-[#1877f2] hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer">
                  <Plus size={16} />
                  Add to Story
                </button>
                <button
                  onClick={handleOpenEditDetails}
                  className={`flex-1 md:flex-initial font-semibold px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${theme.btnGray}`}
                >
                  <Edit2 size={16} />
                  Edit Profile
                </button>
                <button className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all cursor-pointer ${theme.btnGray}`}>
                  <ChevronDown size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 z-10 w-full md:w-auto justify-center">
                <ProfileRelationshipActions
                  profile={personalInfo}
                  isOwnProfile={isOwnProfile}
                  isDarkMode={darkMode}
                  onUpdate={(updates) => setPersonalInfo((prev) => prev ? { ...prev, ...updates } : prev)}
                />
              </div>
            )}

          </div>

          <hr className={`mx-8 mt-2 ${theme.sidebarHr}`} />

          {/* Navigation Tabs */}
          <div className="flex overflow-x-auto scrollbar-none px-6 mt-1">
            {[
              { id: "all", label: "All" },
              { id: "about", label: "About" },
              { id: "friends", label: "Friends" },
              { id: "media", label: "Media" },
              { id: "reels", label: "Reels" },
              { id: "following", label: "Following" },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-4 font-semibold text-sm border-b-[3px] border-transparent transition-all cursor-pointer whitespace-nowrap ${theme.tabHover}
                  ${activeTab === tab.id ? `${theme.activeTab} text-[#1877f2]` : theme.textSub}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

        </div>

        {/* ========================================================
            2. PAGE BODY CONTENT LAYOUT
            ======================================================== */}
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-4 pb-20">

          {/* ==================== LEFT SIDEBAR ==================== */}
          {activeTab === "all" && (
            <div className="lg:col-span-5 flex flex-col gap-4">

              {/* Introduction Card */}
              <div className={`${theme.card} rounded-xl shadow p-4 transition-colors duration-200`}>
                <h2 className={`text-xl font-bold mb-3 ${theme.text}`}>Personal Information</h2>

                {/* Intro Items List */}
                <div className="flex flex-col gap-3.5 text-[15px]">

                  {schools && schools.map(school => (
                    <div key={school.id} className={`flex items-start gap-3 ${theme.text}`}>
                      <GraduationCap className="w-5 h-5 flex-shrink-0 text-gray-500 mt-0.5" />
                      <span>
                        {school.type === 1 || school.type === 2 ? "Studied at" : "Previously studied at"} <span className="font-semibold">{school.name}</span>
                      </span>
                    </div>
                  ))}


                  {profileDetails.currentCity && (
                    <div className={`flex items-start gap-3 ${theme.text}`}>
                      <Home className="w-5 h-5 flex-shrink-0 text-gray-500 mt-0.5" />
                      <span>
                        Lives in <span className="font-semibold">{profileDetails.currentCity}</span>
                      </span>
                    </div>
                  )}

                  {profileDetails.hometown && (
                    <div className={`flex items-start gap-3 ${theme.text}`}>
                      <MapPin className="w-5 h-5 flex-shrink-0 text-gray-500 mt-0.5" />
                      <span>
                        From <span className="font-semibold">{profileDetails.hometown}</span>
                      </span>
                    </div>
                  )}

                  {profileDetails.relationship && profileDetails.relationship !== 'Not specified' && (
                    <div className={`flex items-start gap-3 ${theme.text}`}>
                      <Heart className="w-5 h-5 flex-shrink-0 text-gray-500 mt-0.5" />
                      <span>{profileDetails.relationship}</span>
                    </div>
                  )}
                  {schools && schools.map(school => (
                    <div key={school.id} className={`flex items-start gap-3 ${theme.text}`}>
                      <GraduationCap className="w-5 h-5 flex-shrink-0 text-gray-500 mt-0.5" />
                      <span>
                        {school.type === 1 || school.type === 2
                          ? "Studied at"
                          : "Previously studied at"}{" "}
                        <span className="font-semibold">{school.name}</span>
                      </span>
                    </div>
                  ))}
                  {personalInfo?.website && (
                    <div className={`flex items-start gap-3 ${theme.text}`}>
                      <Globe className="w-5 h-5 flex-shrink-0 text-gray-500 mt-0.5" />
                      <span>
                        Website: <a href={personalInfo.website.startsWith('http') ? personalInfo.website : `https://${personalInfo.website}`} target="_blank" rel="noopener noreferrer" className="text-[#1877f2] hover:underline font-semibold">{personalInfo.website}</a>
                      </span>
                    </div>
                  )}

                  {profileDetails.birthYear && (
                    <div className={`flex items-start gap-3 ${theme.text}`}>
                      <Clock className="w-5 h-5 flex-shrink-0 text-gray-500 mt-0.5" />
                      <div className="flex items-center gap-1.5">
                        <span>Born in <span className="font-semibold">{profileDetails.birthYear}</span></span>
                        <Lock size={13} className="text-gray-400" title="Only me" />
                      </div>
                    </div>
                  )}

                  <div className={`flex items-start gap-3 ${theme.textSub}`}>
                    <Clock className="w-5 h-5 flex-shrink-0 text-gray-500 mt-0.5" />
                    <span>
                      {personalInfo?.createdAt ? (
                        `Joined in ${new Date(personalInfo.createdAt).toLocaleString('en-US', { month: 'long' })} ${new Date(personalInfo.createdAt).getFullYear()}`
                      ) : (
                        profileDetails.joinedDate
                      )}
                    </span>
                  </div>
                </div>

                {/* Edit details button */}
                {isOwnProfile && (
                  <button
                    onClick={handleOpenEditDetails}
                    className={`w-full mt-4 py-2 font-semibold text-sm rounded-lg transition-all cursor-pointer ${theme.btnGray}`}
                  >
                    Edit details
                  </button>
                )}

                {/* Featured section */}
                <div className={`mt-5 pt-4 border-t ${theme.sidebarHr}`}>
                  <h3 className={`text-sm font-semibold mb-3 ${theme.text}`}>Featured Stories</h3>
                  <button
                    onClick={() => navigate("/stories/create")}
                    className={`w-full py-2 font-semibold text-sm rounded-lg transition-all cursor-pointer ${theme.btnGray}`}
                  >
                    Add Featured Story
                  </button>
                </div>
              </div>
              {/* Photos Gallery Box */}
              {
                userPhotos.length > 0 && (
                  <div className={`${theme.card} rounded-xl shadow p-4 transition-colors duration-200`}>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h2 className={`text-xl font-bold ${theme.text}`}>Media</h2>
                      </div>
                      <button
                        onClick={() => setActiveTab("media")}
                        className="text-[#1877f2] cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30 px-3 py-1.5 rounded-lg text-[15px] font-medium transition-all"
                      >
                        See all media
                      </button>
                    </div>

                    {/* 3x3 Media Grid */}
                    <div className="grid grid-cols-3 gap-1 rounded-lg overflow-hidden">
                      {photosLoading && userPhotos.length === 0 ? (
                        <div className="col-span-3 flex items-center justify-center py-8 text-sm text-[#65676b]">Loading media...</div>
                      ) : userPhotos.length === 0 ? (
                        <div className="col-span-3 flex items-center justify-center py-8 text-sm text-[#65676b]">No media yet.</div>
                      ) : (
                        userPhotos.slice(0, 9).map((photo) => (
                          <div key={photo.id} className="aspect-square bg-gray-700 hover:brightness-90 transition-all cursor-pointer">
                            <img src={photo.mediaUrl} alt="User media" className="w-full h-full object-cover" />
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )
              }

              {/* Friends Box */}
              {
                profileFriends.length > 0 && (
                  <div className={`${theme.card} rounded-xl shadow p-4 transition-colors duration-200`}>
                    <div className="flex items-center justify-between mb-1">
                      <div>
                        <h2 className={`text-xl font-bold ${theme.text}`}>Friends</h2>
                      </div>
                      <button
                        onClick={() => setActiveTab("friends")}
                        className="text-[#1877f2] cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30 px-3 py-1.5 rounded-lg text-[15px] font-medium transition-all"
                      >
                        See all friends
                      </button>
                    </div>

                    {/* 3x3 Friends Grid */}
                    <div className="grid grid-cols-3 gap-2">
                      {friendsLoading && profileFriends.length === 0 ? (
                        <div className="col-span-3 flex items-center justify-center py-8 text-sm text-[#65676b]">Loading friends...</div>
                      ) : profileFriends.length === 0 ? (
                        <div className="col-span-3 flex items-center justify-center py-8 text-sm text-[#65676b]">No friends yet.</div>
                      ) : (
                        profileFriends.slice(0, 9).map((friend) => (
                          <div onClick={() => navigate(`/profile/${friend.id}`)} key={friend.id} className="cursor-pointer group flex flex-col min-w-0">
                            <div className="aspect-square bg-gray-200 dark:bg-[#3a3b3c] rounded-md overflow-hidden relative hover:opacity-90 transition-opacity">
                              <img src={friend.avatarUrl || DEFAULT_AVATAR} alt={friend.fullName || friend.userName || "Friend"} className="w-full h-full object-cover" />
                            </div>
                            <span className={`text-sm font-semibold mt-1.5 leading-tight truncate group-hover:underline ${theme.text}`}>
                              {friend.fullName || friend.userName}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>)
              }

            </div>
          )}

          {/* ==================== MAIN CONTENT FEED ==================== */}
          <div className={`flex flex-col gap-4 ${activeTab === "all" ? "lg:col-span-7" : "lg:col-span-12"}`}>

            {/* --- CASE A: 'ALL' / DEFAULT TAB --- */}
            {activeTab === "all" && (
              <>
                {/* Create Post Card */}
                {isOwnProfile && (
                  <div className={`${theme.card} rounded-xl shadow p-4 transition-colors duration-200`}>
                    <div className="flex items-center gap-3 pb-3 border-b border-gray-200 dark:border-[#3e4042]">
                      <img
                        src={displayUser.avatar}
                        alt={displayUser.name}
                        className="w-10 h-10 rounded-full object-cover border"
                      />
                      <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className={`flex-1 text-left px-4 py-2.5 rounded-full text-[15px] transition-all cursor-pointer text-gray-500 ${darkMode ? 'bg-[#3a3b3c] hover:bg-[#4e4f50] text-gray-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-500'}`}
                      >
                        What’s on your mind, {displayUser.name}?
                      </button>
                    </div>

                    {/* Actions inside create card */}
                    <div className="flex items-center justify-around pt-3">
                      <button onClick={() => setIsCreateModalOpen(true)} className={`flex items-center justify-center gap-2 flex-1 py-2 rounded-lg transition-all font-semibold text-sm ${theme.textSub} ${theme.tabHover}`}>
                        <Video size={18} className="text-red-500" />
                        <span>Live Video</span>
                      </button>
                      <button onClick={() => setIsCreateModalOpen(true)} className={`flex items-center justify-center gap-2 flex-1 py-2 rounded-lg transition-all font-semibold text-sm ${theme.textSub} ${theme.tabHover}`}>
                        <ImageIcon size={18} className="text-green-500" />
                        <span>Photo/video</span>
                      </button>
                      <button onClick={() => setIsCreateModalOpen(true)} className={`flex items-center justify-center gap-2 flex-1 py-2 rounded-lg transition-all font-semibold text-sm ${theme.textSub} ${theme.tabHover}`}>
                        <Smile size={18} className="text-yellow-500" />
                        <span>Feeling/activity</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Post Filters & Settings Box */}
                <div className={`${theme.card} rounded-xl shadow p-4 flex flex-col gap-3 transition-colors duration-200`}>
                  <div className="flex items-center justify-between">
                    <h3 className={`text-lg font-bold ${theme.text}`}>Posts</h3>
                    <div className="flex items-center gap-2">
                      <button className={`px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${theme.btnGray}`}>
                        <Search size={14} />
                        Filters
                      </button>
                      <button className={`px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${theme.btnGray}`}>
                        <Edit2 size={14} />
                        Manage posts
                      </button>
                    </div>
                  </div>

                  <hr className={theme.sidebarHr} />

                  <div className="flex items-center justify-between">
                    <button className="flex-1 flex items-center justify-center gap-2 py-2 border-b-2 border-[#1877f2] text-[#1877f2] font-semibold text-sm">
                      <ListIcon size={16} />
                      List view
                    </button>
                    <button className={`flex-1 flex items-center justify-center gap-2 py-2 font-semibold text-sm ${theme.textSub} ${theme.tabHover} rounded-lg`}>
                      <Grid size={16} />
                      Grid view
                    </button>
                  </div>
                </div>

                {/* Feed Section (Shows empty state or dynamically created posts) */}
                {postsList.length === 0 ? (
                  <div className={`${theme.card} rounded-xl shadow p-12 flex flex-col items-center justify-center text-center transition-colors duration-200`}>
                    <div className={`w-20 h-20 rounded-full ${theme.input} flex items-center justify-center text-3xl mb-4 shadow-inner`}>
                      📭
                    </div>
                    <h3 className={`text-xl font-bold mb-1.5 ${theme.text}`}>{isOwnProfile ? 'No posts found' : 'This user has not shared any posts yet'}</h3>
                    <p className={`text-sm max-w-sm ${theme.textSub}`}>
                      {isOwnProfile
                        ? 'No posts found. Share your first moment now!'
                        : 'This user has not shared any posts yet. Please check back later.'}
                    </p>
                    {isOwnProfile && (
                      <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="mt-5 px-5 py-2.5 bg-[#1877f2] hover:bg-blue-600 text-white font-bold rounded-lg text-sm shadow-md transition-all cursor-pointer"
                      >
                        Create a new post
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {postsList.map((post) => (
                      <PostCard
                        key={post.id}
                        post={{
                          ...post,
                          authorName: post.authorName || displayUser.name,
                          authorAvatarUrl: post.authorAvatarUrl || displayUser.avatar,
                        }}
                      />
                    ))}
                  </div>
                )}
              </>
            )}

            {activeTab === "about" && (
              <AboutTab theme={theme} schools={schools} profileDetails={profileDetails} dateOfBirth={personalInfo?.dateOfBirth} handleEdit={isOwnProfile ? handleUpdateProfileField : undefined} fetchSchools={fetchSchools} canEdit={isOwnProfile} />
            )}

            {activeTab === "friends" && (
              <FriendsTab userId={viewUserId} theme={theme} />
            )}

            {activeTab === "media" && (
              <MediaTab
                theme={theme}
                userPhotos={userPhotos}
                userVideos={userVideos}
                photosLoading={photosLoading}
                videosLoading={videosLoading}
                photosError={photosError}
                videosError={videosError}
                loadMorePhotos={loadMorePhotos}
                loadMoreVideos={loadMoreVideos}
              />
            )}
            {activeTab === "reels" && (
              <ProfileReelsTab
                theme={theme}
                reels={profileReels}
                isLoading={reelsLoading}
                error={reelsError}
                canCreate={isOwnProfile}
                hasMore={reelsHasMore}
                loadMore={loadMoreReels}
                onLike={toggleReelLike}
                onDelete={deleteProfileReel}
                onCreateReel={() => setIsCreateReelOpen(true)}
              />
            )}
            {activeTab === "following" && (
              <FollowingTab theme={theme} userId={viewUserId} />
            )}
            {/* ========================================================
          3. DIALOGS & OVERLAYS (Post Creator, Details Editor)
          ======================================================== */}

            {/* A. CREATE POST MODAL DIALOG */}
            <CreatePostModal
              isOpen={isCreateModalOpen}
              onClose={() => setIsCreateModalOpen(false)}
              displayUser={displayUser}
              onSubmit={handleCreatePost}
              theme={theme}
            />

            <CreateReelModal
              isOpen={isCreateReelOpen}
              onClose={() => setIsCreateReelOpen(false)}
              displayUser={displayUser}
              onSubmit={handleCreateReel}
            />



          </div>
        </div>
      </div>

      {/* Unified Reel Viewer Modal */}
      {reelChosen && source === "profile" && (
        <ReelViewModal
          reel={reelChosen}
          reelsList={profileReels}
          onClose={closeReel}
          onLike={handleLikeReelFromModal}
          onDelete={handleDeleteReelFromModal}
          canDelete={isOwnProfile}
          onNext={nextReel}
          onPrev={prevReel}
          hasPrev={getChosenIndex() > 0}
          hasNext={getChosenIndex() < profileReels.length - 1}
        />
      )}
    </div>
  );
}
