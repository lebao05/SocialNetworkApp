import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import { useAuth } from "../contexts/authContext";
import { usePersonalInfo } from "../hooks/usePersonalInfo";
import { useSchools } from "../hooks/useSchools";
import { updateUserInfoApi } from "../apis/userApi";
import AboutTab from "../components/Profile/AboutTab";
import FriendsTab from "../components/Profile/FriendsTab";
import PhotosTab from "../components/Profile/PhotosTab";
import {
  Camera,
  Plus,
  Edit2,
  MoreHorizontal,
  ChevronDown,
  Briefcase,
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
  Users,
  Moon,
  Sun,
  ThumbsUp,
  MessageCircle,
  Share2
} from "lucide-react";

// Mock User matching the user's screenshots exactly
const mockProfileUser = {
  id: 99,
  name: "Lê Bảo",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80", // High quality portrait
  coverPhoto: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&auto=format&fit=crop&q=80", // Premium aesthetic abstract background
  bio: "belief",
  friendsCount: 230,
  details: {
    educationCollege: "Trường Đại học Khoa học Tự nhiên, Đại học Quốc gia TP.HCM",
    educationCollegeYear: "2023",
    educationHighSchool: "Trường THPT Nguyễn Trãi",
    currentCity: "Ho Chi Minh City",
    hometown: "Từ Tuy An, Phú Yên, Vietnam",
    birthYear: "2005",
    joinedDate: "Đã tham gia vào tháng 5 năm 2018"
  }
};

// Mock Friends matching the screenshot names exactly
const mockFriends = [
  { id: 101, name: "Nguyễn Trần Đăng Khoa", mutual: 23, avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80" },
  { id: 102, name: "Bùi Duy Anh", mutual: 60, avatar: "" }, // empty triggers default gray avatar
  { id: 103, name: "Vũ Thành Toàn", mutual: 37, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80" },
  { id: 104, name: "Quỳnh Tran", mutual: 22, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80" },
  { id: 105, name: "Vu Phan Anh", mutual: 19, avatar: "" },
  { id: 106, name: "Tran Hoang Bach", mutual: 0, avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80" },
  { id: 107, name: "Phương Nguyễn", mutual: 26, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" },
  { id: 108, name: "Phạm Việt Nhật", mutual: 23, avatar: "" },
  { id: 109, name: "Nguyễn Trí Nhân", mutual: 41, avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80" }
];

// Mock Gallery Photos
const mockPhotos = [
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80", // photo 1
  "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=300&auto=format&fit=crop&q=80", // photo 2
  "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=300&auto=format&fit=crop&q=80", // photo 3
  "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=300&auto=format&fit=crop&q=80", // photo 4
  "https://images.unsplash.com/photo-1520201163981-8cc95007dd2a?w=300&auto=format&fit=crop&q=80", // photo 5
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=300&auto=format&fit=crop&q=80", // photo 6
  "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=300&auto=format&fit=crop&q=80", // photo 7
  "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=300&auto=format&fit=crop&q=80", // photo 8
  "https://images.unsplash.com/photo-1472214222541-d510753a4907?w=300&auto=format&fit=crop&q=80"  // photo 9
];

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const { personalInfo, loading: infoLoading } = usePersonalInfo(authUser?.id);
  const { schools, loading: schoolsLoading } = useSchools(authUser?.id);

  // Theme state: defaults to white theme (light mode) as requested!
  const [darkMode, setDarkMode] = useState(false);

  // Tab control
  const [activeTab, setActiveTab] = useState("all"); // all, about, friends, photos

  // Edit Profile / Bio States
  const [bio, setBio] = useState(mockProfileUser.bio);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState(mockProfileUser.bio);

  // User Profile details editable state
  const [profileDetails, setProfileDetails] = useState(mockProfileUser.details);
  const [profileName, setProfileName] = useState(mockProfileUser.name);
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [editForm, setEditForm] = useState({
    name: mockProfileUser.name,
    college: mockProfileUser.details.educationCollege,
    highSchool: mockProfileUser.details.educationHighSchool,
    currentCity: mockProfileUser.details.currentCity,
    hometown: mockProfileUser.details.hometown,
    birthYear: mockProfileUser.details.birthYear
  });

  // Post States (Start with empty list to match the "Không có bài viết" screenshot)
  const [postsList, setPostsList] = useState([]);

  useEffect(() => {
    if (personalInfo) {
      setBio(personalInfo.bio || "");
      setBioInput(personalInfo.bio || "");
      setProfileName(`${personalInfo.firstName} ${personalInfo.lastName}`);
      setProfileDetails(prev => ({
        ...prev,
        currentCity: personalInfo.currentLocation || "",
        hometown: personalInfo.hometown || "",
        birthYear: personalInfo.dateOfBirth ? personalInfo.dateOfBirth.split("-")[0] : ""
      }));
    }
  }, [personalInfo]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostImage, setNewPostImage] = useState("");

  // Localized User details
  const displayUser = {
    name: profileName,
    avatar: personalInfo?.avatarUrl || authUser?.avatarUrl || mockProfileUser.avatar,
    coverPhoto: personalInfo?.coverPhotoUrl || mockProfileUser.coverPhoto,
    friendsCount: mockProfileUser.friendsCount
  };

  const handleSaveBio = async () => {
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

  const handleUpdateProfileField = async (field, value) => {
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
      if (field === 'birthYear') updateData.dateOfBirth = `${value}-01-01`;
      if (field === 'gender') updateData.gender = value === 'Nam' ? 0 : 1;
      if (field === 'relationship') {
        const mapping = {
          'Độc thân': 0,
          'Đang hẹn hò': 1,
          'Đã đính hôn': 2,
          'Đã kết hôn': 3,
          'Trong một mối quan hệ mở': 4,
          'Phức tạp': 5,
          'Đã ly thân': 6,
          'Đã ly hôn': 7,
          'Góa': 8
        };
        updateData.relationshipStatus = mapping[value] ?? 0;
      }

      await updateUserInfoApi(updateData);
      
      setProfileDetails(prev => ({
        ...prev,
        [field]: value
      }));
    } catch (error) {
      console.error("Failed to update profile field", error);
    }
  };

  const handleOpenEditDetails = () => {
    setEditForm({
      name: profileName,
      college: profileDetails.educationCollege,
      highSchool: profileDetails.educationHighSchool,
      currentCity: profileDetails.currentCity,
      hometown: profileDetails.hometown,
      birthYear: profileDetails.birthYear
    });
    setIsEditingDetails(true);
  };

  const handleSaveDetails = async (e) => {
    e.preventDefault();
    try {
      const [firstName, ...lastNameParts] = editForm.name.split(" ");
      const lastName = lastNameParts.join(" ");

      const updateData = {
        firstName: firstName || "",
        lastName: lastName || "",
        dateOfBirth: `${editForm.birthYear}-01-01`,
        gender: personalInfo?.gender || 0,
        bio: bio,
        currentLocation: editForm.currentCity,
        hometown: editForm.hometown,
        website: personalInfo?.website || "",
        relationshipStatus: personalInfo?.relationshipStatus || 0
      };

      await updateUserInfoApi(updateData);

      setProfileName(editForm.name);
      setProfileDetails({
        ...profileDetails,
        currentCity: editForm.currentCity,
        hometown: editForm.hometown,
        birthYear: editForm.birthYear
      });
      setIsEditingDetails(false);
    } catch (error) {
      console.error("Failed to update details", error);
    }
  };

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newPostContent.trim() && !newPostImage) return;

    const newPost = {
      id: Date.now(),
      user: displayUser.name,
      avatar: displayUser.avatar,
      time: "Vừa xong",
      privacy: "public",
      content: newPostContent,
      image: newPostImage || null,
      likes: 0,
      likedBy: [],
      comments: 0,
      shares: 0,
      liked: false
    };

    setPostsList([newPost, ...postsList]);
    setNewPostContent("");
    setNewPostImage("");
    setIsCreateModalOpen(false);
  };

  const handleLikePost = (postId) => {
    setPostsList(postsList.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.liked ? post.likes - 1 : post.likes + 1,
          liked: !post.liked
        };
      }
      return post;
    }));
  };

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

  return (
    <div className={`min-h-screen transition-colors duration-200 ${theme.bg}`}>
      {/* Navbar Integration */}
      <Navbar />

      {/* Profile Container */}
      <div className="pt-14 max-w-[1095px] mx-auto px-4 md:px-8">

        {/* ========================================================
            1. HEADER SECTION (Cover, Avatar, Bio, Buttons)
            ======================================================== */}
        <div className={`${theme.card} rounded-b-xl shadow-md overflow-hidden relative transition-colors duration-200`}>

          {/* Cover Photo */}
          <div className="relative h-[250px] md:h-[350px] bg-[#2d3139]">
            <img
              src={displayUser.coverPhoto}
              alt="Cover"
              className="w-full h-full object-cover"
            />
            {/* Edit Cover Photo Button */}
            <button className="absolute bottom-4 right-4 bg-black/60 hover:bg-black/80 text-white px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer">
              <Camera size={16} />
              <span className="hidden sm:inline">Thêm ảnh bìa</span>
            </button>

            {/* Dark Mode Floating Toggle Switch */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer"
              title={darkMode ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
            >
              {darkMode ? <Sun size={18} className="text-yellow-400 animate-spin-slow" /> : <Moon size={18} />}
            </button>
          </div>

          {/* Avatar and Info Grid */}
          <div className="px-8 pb-4 pt-1 flex flex-col md:flex-row items-center md:items-end justify-between gap-6 relative">

            {/* Avatar & Basic Info */}
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-[80px] md:-mt-[45px] z-10 w-full md:w-auto text-center md:text-left">
              {/* Avatar circle */}
              <div className="relative group w-[168px] h-[168px]">
                {displayUser.avatar ? (
                  <img
                    src={displayUser.avatar}
                    alt={displayUser.name}
                    className={`w-[168px] h-[168px] rounded-full border-4 ${darkMode ? "border-[#242526]" : "border-white"} object-cover shadow-lg`}
                  />
                ) : (
                  <div className={`w-[168px] h-[168px] rounded-full border-4 ${darkMode ? "border-[#242526]" : "border-white"} bg-[#8a8d91] flex items-center justify-center text-white text-5xl font-bold shadow-lg`}>
                    {displayUser.name.charAt(0)}
                  </div>
                )}
                {/* Camera icon over avatar on hover */}
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera size={28} className="text-white" />
                </div>
              </div>

              {/* Bio & Details text */}
              <div className="mb-2">
                <h1 className={`text-3xl font-extrabold tracking-tight flex items-center justify-center md:justify-start gap-2 ${theme.text}`}>
                  {displayUser.name}
                </h1>

                <p className={`text-[15px] font-semibold mt-1 flex items-center justify-center md:justify-start gap-1 cursor-pointer hover:underline ${theme.textSub}`}>
                  {displayUser.friendsCount} người bạn
                </p>

                {/* Overlapping Mutual Friends Avatars */}
                <div className="flex items-center justify-center md:justify-start -space-x-2 mt-2 overflow-hidden">
                  {mockFriends.slice(0, 8).map((friend, i) => (
                    friend.avatar ? (
                      <img
                        key={friend.id}
                        src={friend.avatar}
                        alt={friend.name}
                        className="w-8 h-8 rounded-full border-2 border-transparent ring-2 ring-[#242526] object-cover"
                        style={{ zIndex: 10 - i }}
                      />
                    ) : (
                      <div
                        key={friend.id}
                        className="w-8 h-8 rounded-full border-2 border-transparent ring-2 ring-[#242526] bg-gray-500 flex items-center justify-center text-[10px] text-white font-bold"
                        style={{ zIndex: 10 - i }}
                      >
                        {friend.name.charAt(0)}
                      </div>
                    )
                  ))}
                </div>

                {/* Bio Panel */}
                <div className="mt-3 flex flex-col items-center md:items-start">
                  {!isEditingBio ? (
                    <div className="flex items-center gap-2 group">
                      <span className={`text-[15px] italic font-medium ${theme.text}`}>{bio || "Thêm tiểu sử..."}</span>
                      <button
                        onClick={() => setIsEditingBio(true)}
                        className={`opacity-0 group-hover:opacity-100 p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-all text-xs ${theme.textSub}`}
                        title="Sửa tiểu sử"
                      >
                        <Edit2 size={12} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 mt-1 w-[260px]">
                      <textarea
                        value={bioInput}
                        onChange={(e) => setBioInput(e.target.value)}
                        placeholder="Nội dung tiểu sử..."
                        maxLength={100}
                        className={`w-full p-2 text-sm rounded-lg border outline-none ${darkMode ? "bg-[#3a3b3c] border-[#3e4042] text-white" : "bg-white border-gray-300 text-black"} focus:border-[#1877f2]`}
                        rows={2}
                      />
                      <div className="flex justify-end gap-2 text-xs font-semibold">
                        <button onClick={handleCancelBio} className={`px-3 py-1.5 rounded-lg ${theme.btnGray}`}>Hủy</button>
                        <button onClick={handleSaveBio} className="px-3 py-1.5 rounded-lg bg-[#1877f2] hover:bg-blue-600 text-white">Lưu</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Header Action Buttons */}
            <div className="flex items-center gap-3 z-10 w-full md:w-auto justify-center">
              <button className="flex-1 md:flex-initial bg-[#1877f2] hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer">
                <Plus size={16} />
                Thêm vào tin
              </button>
              <button
                onClick={handleOpenEditDetails}
                className={`flex-1 md:flex-initial font-semibold px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${theme.btnGray}`}
              >
                <Edit2 size={16} />
                Chỉnh sửa trang cá nhân
              </button>
              <button className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all cursor-pointer ${theme.btnGray}`}>
                <ChevronDown size={18} />
              </button>
            </div>

          </div>

          <hr className={`mx-8 mt-2 ${theme.sidebarHr}`} />

          {/* Navigation Tabs */}
          <div className="flex overflow-x-auto scrollbar-none px-6 mt-1">
            {[
              { id: "all", label: "Tất cả" },
              { id: "about", label: "Giới thiệu" },
              { id: "friends", label: "Bạn bè" },
              { id: "photos", label: "Ảnh" },
              { id: "following", label: "Đang theo dõi" },
              { id: "more", label: "Xem thêm" }
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
                <h2 className={`text-xl font-bold mb-3 ${theme.text}`}>Thông tin cá nhân</h2>

                {/* Intro Items List */}
                <div className="flex flex-col gap-3.5 text-[15px]">

                  {schools && schools.map(school => (
                    <div key={school.id} className={`flex items-start gap-3 ${theme.text}`}>
                      <GraduationCap className="w-5 h-5 flex-shrink-0 text-gray-500 mt-0.5" />
                      <span>
                        {school.type === 1 || school.type === 2 ? "Học tại" : "Từng học tại"} <span className="font-semibold">{school.name}</span>
                      </span>
                    </div>
                  ))}


                  {profileDetails.currentCity && (
                    <div className={`flex items-start gap-3 ${theme.text}`}>
                      <Home className="w-5 h-5 flex-shrink-0 text-gray-500 mt-0.5" />
                      <span>
                        Sống tại <span className="font-semibold">{profileDetails.currentCity}</span>
                      </span>
                    </div>
                  )}

                  {profileDetails.hometown && (
                    <div className={`flex items-start gap-3 ${theme.text}`}>
                      <MapPin className="w-5 h-5 flex-shrink-0 text-gray-500 mt-0.5" />
                      <span>
                        Đến từ <span className="font-semibold">{profileDetails.hometown}</span>
                      </span>
                    </div>
                  )}

                  {profileDetails.birthYear && (
                    <div className={`flex items-start gap-3 ${theme.text}`}>
                      <Clock className="w-5 h-5 flex-shrink-0 text-gray-500 mt-0.5" />
                      <div className="flex items-center gap-1.5">
                        <span>Sinh năm <span className="font-semibold">{profileDetails.birthYear}</span></span>
                        <Lock size={13} className="text-gray-400" title="Chỉ mình tôi" />
                      </div>
                    </div>
                  )}

                  <div className={`flex items-start gap-3 ${theme.textSub}`}>
                    <Clock className="w-5 h-5 flex-shrink-0 text-gray-500 mt-0.5" />
                    <span>
                      {personalInfo?.createdAt ? (
                        `Đã tham gia vào tháng ${new Date(personalInfo.createdAt).getMonth() + 1} năm ${new Date(personalInfo.createdAt).getFullYear()}`
                      ) : (
                        profileDetails.joinedDate
                      )}
                    </span>
                  </div>
                </div>

                {/* Edit details button */}
                <button
                  onClick={handleOpenEditDetails}
                  className={`w-full mt-4 py-2 font-semibold text-sm rounded-lg transition-all cursor-pointer ${theme.btnGray}`}
                >
                  Chỉnh sửa chi tiết
                </button>

                {/* Tin nổi bật section */}
                <div className={`mt-5 pt-4 border-t ${theme.sidebarHr}`}>
                  <h3 className={`text-sm font-semibold mb-3 ${theme.text}`}>Tin nổi bật</h3>
                  <button className={`w-full py-2 font-semibold text-sm rounded-lg transition-all cursor-pointer ${theme.btnGray}`}>
                    Thêm tin nổi bật
                  </button>
                </div>
              </div>

              {/* Photos Gallery Box */}
              <div className={`${theme.card} rounded-xl shadow p-4 transition-colors duration-200`}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h2 className={`text-xl font-bold ${theme.text}`}>Ảnh</h2>
                  </div>
                  <button
                    onClick={() => setActiveTab("photos")}
                    className="text-[#1877f2] hover:bg-blue-100 dark:hover:bg-blue-900/30 px-3 py-1.5 rounded-lg text-[15px] font-medium transition-all"
                  >
                    Xem tất cả ảnh
                  </button>
                </div>

                {/* 3x3 Photo Grid */}
                <div className="grid grid-cols-3 gap-1 rounded-lg overflow-hidden">
                  {mockPhotos.map((url, i) => (
                    <div key={i} className="aspect-square bg-gray-700 hover:brightness-90 transition-all cursor-pointer">
                      <img src={url} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Friends Box */}
              <div className={`${theme.card} rounded-xl shadow p-4 transition-colors duration-200`}>
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <h2 className={`text-xl font-bold ${theme.text}`}>Bạn bè</h2>
                    <p className={`text-sm ${theme.textSub}`}>{displayUser.friendsCount} người bạn</p>
                  </div>
                  <button
                    onClick={() => setActiveTab("friends")}
                    className="text-[#1877f2] hover:bg-blue-100 dark:hover:bg-blue-900/30 px-3 py-1.5 rounded-lg text-[15px] font-medium transition-all"
                  >
                    Xem tất cả bạn bè
                  </button>
                </div>

                {/* 3x3 Friends Grid */}
                <div className="grid grid-cols-3 gap-x-3 gap-y-4 mt-3">
                  {mockFriends.map((friend) => (
                    <div key={friend.id} className="cursor-pointer group flex flex-col">
                      <div className="aspect-square bg-gray-700 rounded-lg overflow-hidden relative hover:brightness-95 transition-all">
                        {friend.avatar ? (
                          <img src={friend.avatar} alt={friend.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-[#3a3b3c] dark:bg-[#4e4f50] flex items-center justify-center text-white text-3xl font-semibold">
                            {friend.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <span className={`text-xs font-semibold mt-1.5 leading-tight truncate group-hover:underline ${theme.text}`}>
                        {friend.name}
                      </span>
                      {friend.mutual > 0 && (
                        <span className={`text-[10px] ${theme.textSub}`}>
                          {friend.mutual} bạn chung
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ==================== MAIN CONTENT FEED ==================== */}
          <div className={`flex flex-col gap-4 ${activeTab === "all" ? "lg:col-span-7" : "lg:col-span-12"}`}>

            {/* --- CASE A: 'ALL' / DEFAULT TAB --- */}
            {activeTab === "all" && (
              <>
                {/* Create Post Card */}
                <div className={`${theme.card} rounded-xl shadow p-4 transition-colors duration-200`}>
                  <div className="flex items-center gap-3 pb-3 border-b border-gray-200 dark:border-[#3e4042]">
                    <img
                      src={displayUser.avatar}
                      alt={displayUser.name}
                      className="w-10 h-10 rounded-full object-cover border"
                    />
                    <button
                      onClick={() => setIsCreateModalOpen(true)}
                      className={`flex-1 text-left px-4 py-2.5 rounded-full text-[15px] transition-all cursor-pointer text-gray-500 bg-gray-100 hover:bg-gray-200 dark:bg-[#3a3b3c] dark:hover:bg-[#4e4f50] dark:text-gray-400`}
                    >
                      {displayUser.name} ơi, bạn đang nghĩ gì thế?
                    </button>
                  </div>

                  {/* Actions inside create card */}
                  <div className="flex items-center justify-around pt-3">
                    <button onClick={() => setIsCreateModalOpen(true)} className={`flex items-center justify-center gap-2 flex-1 py-2 rounded-lg transition-all font-semibold text-sm ${theme.textSub} dark:hover:bg-[#3a3b3c] hover:bg-gray-100`}>
                      <Video size={18} className="text-red-500" />
                      <span>Video trực tiếp</span>
                    </button>
                    <button onClick={() => setIsCreateModalOpen(true)} className={`flex items-center justify-center gap-2 flex-1 py-2 rounded-lg transition-all font-semibold text-sm ${theme.textSub} dark:hover:bg-[#3a3b3c] hover:bg-gray-100`}>
                      <ImageIcon size={18} className="text-green-500" />
                      <span>Ảnh/video</span>
                    </button>
                    <button onClick={() => setIsCreateModalOpen(true)} className={`flex items-center justify-center gap-2 flex-1 py-2 rounded-lg transition-all font-semibold text-sm ${theme.textSub} dark:hover:bg-[#3a3b3c] hover:bg-gray-100`}>
                      <Smile size={18} className="text-yellow-500" />
                      <span>Cảm xúc/hoạt động</span>
                    </button>
                  </div>
                </div>

                {/* Post Filters & Settings Box */}
                <div className={`${theme.card} rounded-xl shadow p-4 flex flex-col gap-3 transition-colors duration-200`}>
                  <div className="flex items-center justify-between">
                    <h3 className={`text-lg font-bold ${theme.text}`}>Bài viết</h3>
                    <div className="flex items-center gap-2">
                      <button className={`px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${theme.btnGray}`}>
                        <Search size={14} />
                        Bộ lọc
                      </button>
                      <button className={`px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${theme.btnGray}`}>
                        <Edit2 size={14} />
                        Quản lý bài viết
                      </button>
                    </div>
                  </div>

                  <hr className={theme.sidebarHr} />

                  <div className="flex items-center justify-between">
                    <button className="flex-1 flex items-center justify-center gap-2 py-2 border-b-2 border-[#1877f2] text-[#1877f2] font-semibold text-sm">
                      <ListIcon size={16} />
                      Chế độ xem danh sách
                    </button>
                    <button className={`flex-1 flex items-center justify-center gap-2 py-2 font-semibold text-sm ${theme.textSub} dark:hover:bg-[#3a3b3c] hover:bg-gray-100 rounded-lg`}>
                      <Grid size={16} />
                      Chế độ xem lưới
                    </button>
                  </div>
                </div>

                {/* Feed Section (Shows "Không có bài viết" empty state or dynamically created posts) */}
                {postsList.length === 0 ? (
                  <div className={`${theme.card} rounded-xl shadow p-12 flex flex-col items-center justify-center text-center transition-colors duration-200`}>
                    <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-[#3a3b3c] flex items-center justify-center text-3xl mb-4 shadow-inner">
                      📭
                    </div>
                    <h3 className={`text-xl font-bold mb-1.5 ${theme.text}`}>Không có bài viết</h3>
                    <p className={`text-sm max-w-sm ${theme.textSub}`}>
                      Không tìm thấy bài viết nào của bạn. Hãy chia sẻ khoảnh khắc đầu tiên của bạn ngay lúc này nhé!
                    </p>
                    <button
                      onClick={() => setIsCreateModalOpen(true)}
                      className="mt-5 px-5 py-2.5 bg-[#1877f2] hover:bg-blue-600 text-white font-bold rounded-lg text-sm shadow-md transition-all cursor-pointer"
                    >
                      Tạo bài viết mới
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {postsList.map((post) => (
                      <div key={post.id} className={`${theme.card} rounded-xl shadow overflow-hidden transition-colors duration-200`}>
                        {/* Post Header */}
                        <div className="flex items-center justify-between p-4">
                          <div className="flex items-center gap-3">
                            <img src={post.avatar} alt={post.user} className="w-10 h-10 rounded-full object-cover border" />
                            <div>
                              <div className={`font-semibold text-[15px] flex items-center gap-1.5 ${theme.text}`}>
                                {post.user}
                              </div>
                              <div className={`text-xs flex items-center gap-1.5 ${theme.textSub}`}>
                                {post.time} · <Globe size={12} />
                              </div>
                            </div>
                          </div>
                          <button className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${theme.textSub} dark:hover:bg-[#3a3b3c] hover:bg-gray-100`}>
                            ···
                          </button>
                        </div>

                        {/* Post Content */}
                        {post.content && (
                          <p className={`px-4 pb-3 text-[15px] whitespace-pre-wrap ${theme.text}`}>
                            {post.content}
                          </p>
                        )}

                        {/* Post Image */}
                        {post.image && (
                          <div className="bg-[#18191a] max-h-[500px] overflow-hidden flex items-center justify-center border-y dark:border-[#3e4042]">
                            <img src={post.image} alt="Post Attachment" className="w-full object-cover" />
                          </div>
                        )}

                        {/* Stats Panel */}
                        <div className="flex items-center justify-between px-4 py-2.5 text-xs">
                          <div className="flex items-center gap-1.5 cursor-pointer hover:underline text-[#1877f2] font-medium">
                            <span className="flex items-center justify-center bg-[#1877f2] text-white w-4 h-4 rounded-full text-[10px]">👍</span>
                            <span className={theme.textSub}>{post.likes}</span>
                          </div>
                          <div className={`flex gap-3 ${theme.textSub}`}>
                            <span className="cursor-pointer hover:underline">{post.comments} bình luận</span>
                            <span className="cursor-pointer hover:underline">{post.shares} lượt chia sẻ</span>
                          </div>
                        </div>

                        <hr className={`mx-4 ${theme.sidebarHr}`} />

                        {/* Reaction Buttons */}
                        <div className="flex items-center p-1">
                          <button
                            onClick={() => handleLikePost(post.id)}
                            className={`flex-1 py-2 font-semibold text-sm flex items-center justify-center gap-2 rounded-lg transition-all dark:hover:bg-[#3a3b3c] hover:bg-gray-100 ${post.liked ? "text-[#1877f2]" : theme.textSub}`}
                          >
                            <ThumbsUp size={16} />
                            Thích
                          </button>
                          <button className={`flex-1 py-2 font-semibold text-sm flex items-center justify-center gap-2 rounded-lg transition-all dark:hover:bg-[#3a3b3c] hover:bg-gray-100 ${theme.textSub}`}>
                            <MessageCircle size={16} />
                            Bình luận
                          </button>
                          <button className={`flex-1 py-2 font-semibold text-sm flex items-center justify-center gap-2 rounded-lg transition-all dark:hover:bg-[#3a3b3c] hover:bg-gray-100 ${theme.textSub}`}>
                            <Share2 size={16} />
                            Chia sẻ
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {activeTab === "about" && (
              <AboutTab theme={theme} schools={schools} profileDetails={profileDetails} handleEdit={handleUpdateProfileField} />
            )}

            {activeTab === "friends" && (
              <FriendsTab theme={theme} displayUser={displayUser} mockFriends={mockFriends} />
            )}

            {activeTab === "photos" && (
              <PhotosTab theme={theme} mockPhotos={mockPhotos} />
            )}

            {/* ========================================================
          3. DIALOGS & OVERLAYS (Post Creator, Details Editor)
          ======================================================== */}

            {/* A. CREATE POST MODAL DIALOG */}
            {isCreateModalOpen && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center px-4 animate-fade-in">
                <div className={`${theme.card} w-full max-w-[500px] rounded-xl shadow-2xl overflow-hidden flex flex-col border dark:border-[#3e4042]`}>
                  {/* Header */}
                  <div className="flex items-center justify-between p-4 border-b dark:border-[#3e4042]">
                    <div className="w-8" /> {/* Balance spacer */}
                    <h2 className={`text-xl font-bold ${theme.text}`}>Tạo bài viết</h2>
                    <button
                      onClick={() => setIsCreateModalOpen(false)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${theme.btnGray}`}
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {/* Form body */}
                  <form onSubmit={handleCreatePost} className="p-4 flex flex-col gap-4">

                    {/* User badge */}
                    <div className="flex items-center gap-3">
                      <img src={displayUser.avatar} alt={displayUser.name} className="w-10 h-10 rounded-full object-cover border" />
                      <div>
                        <p className={`font-semibold text-sm ${theme.text}`}>{displayUser.name}</p>
                        <span className={`text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-[#3a3b3c] flex items-center gap-1 w-max font-semibold ${theme.textSub}`}>
                          <Globe size={11} /> Công khai <ChevronDown size={11} />
                        </span>
                      </div>
                    </div>

                    {/* Text textarea */}
                    <textarea
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      placeholder={`${displayUser.name} ơi, bạn đang nghĩ gì thế?`}
                      className={`w-full h-36 bg-transparent resize-none text-[18px] outline-none border-none border-transparent p-1 focus:ring-0 ${theme.text}`}
                      autoFocus
                    />

                    {/* Optional image input url block */}
                    <div className="flex flex-col gap-1">
                      <label className={`text-xs font-bold ${theme.textSub}`}>Liên kết ảnh (tùy chọn)</label>
                      <div className={`flex items-center gap-2 rounded-lg p-1 ${theme.input}`}>
                        <input
                          type="url"
                          value={newPostImage}
                          onChange={(e) => setNewPostImage(e.target.value)}
                          placeholder="https://example.com/image.jpg"
                          className="bg-transparent text-sm w-full outline-none px-2 py-1 text-inherit"
                        />
                        {newPostImage && (
                          <button
                            type="button"
                            onClick={() => setNewPostImage("")}
                            className="text-red-500 hover:bg-black/10 dark:hover:bg-white/10 p-1 rounded"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Image Preview Block */}
                    {newPostImage && (
                      <div className="border rounded-lg overflow-hidden max-h-[140px] bg-black/20 flex items-center justify-center">
                        <img
                          src={newPostImage}
                          alt="Preview"
                          className="max-h-[140px] object-contain"
                          onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1594322436404-5a0526db4d13?w=400&q=80"; // error placeholder
                          }}
                        />
                      </div>
                    )}

                    {/* Actions panel */}
                    <div className="border rounded-lg p-3 flex items-center justify-between dark:border-[#3e4042]">
                      <span className={`text-sm font-semibold ${theme.text}`}>Thêm vào bài viết của bạn</span>
                      <div className="flex items-center gap-1 text-lg">
                        <span className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full cursor-pointer" title="Ảnh/Video">🖼️</span>
                        <span className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full cursor-pointer" title="Cảm xúc">😊</span>
                        <span className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full cursor-pointer" title="Check-in">📍</span>
                        <span className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full cursor-pointer" title="File GIF">👾</span>
                      </div>
                    </div>

                    {/* Submit btn */}
                    <button
                      type="submit"
                      disabled={!newPostContent.trim() && !newPostImage}
                      className="w-full py-2.5 bg-[#1877f2] hover:bg-blue-600 disabled:bg-[#1877f2]/50 disabled:cursor-not-allowed text-white font-bold rounded-lg text-sm transition-all"
                    >
                      Đăng bài
                    </button>

                  </form>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
