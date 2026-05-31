import React, { useState } from "react";
import {
  Bell,
  ChevronDown,
  ChevronUp,
  Earth,
  Eye,
  FileText,
  History,
  MoreHorizontal,
  Plus,
  Search,
  Share2,
  UserPlus,
  Users,
} from "lucide-react";
import Navbar from "../components/Navbar/Navbar";
import CreatePost from "../components/Feed/CreatePost";
import CreatePostModal from "../components/Profile/CreatePostModal";
import PostCard from "../components/Feed/PostCard";
import GroupAdminInsights from "../components/group/GroupAdminInsights";
import GroupAdminManage from "../components/group/GroupAdminManage";
import GroupAdminSettings from "../components/group/GroupAdminSettings";
import GroupAdminSidebar from "../components/group/GroupAdminSidebar";
import { useAuth } from "../contexts/authContext";
import {
  groupAvatarSeeds,
  groupInfo,
  groupMediaImages,
  groupMembers,
  groupRules,
  groupTabs,
  mockGroupRole,
} from "../data/groupMockData";
import { groupPosts } from "../data/mockData";

const settingsViews = ["group-settings", "features"];
const insightViews = ["growth", "engagement", "admins", "members"];

function normalizeRole(value) {
  return String(value || "").trim().toLowerCase();
}

function hasAdminRole(user) {
  const roleValues = [
    user?.role,
    user?.Role,
    user?.groupRole,
    user?.GroupRole,
    user?.membershipRole,
    user?.MembershipRole,
    ...(Array.isArray(user?.roles) ? user.roles : []),
    ...(Array.isArray(user?.Roles) ? user.Roles : []),
    ...(Array.isArray(user?.groupRoles) ? user.groupRoles : []),
  ];

  return roleValues.some((role) => ["admin", "administrator", "quan tri vien", "quản trị viên"].includes(normalizeRole(role)));
}

function AvatarStack({ count = 12, size = "h-8 w-8" }) {
  return (
    <div className="flex items-center">
      {groupAvatarSeeds.slice(0, count).map((seed, index) => (
        <img
          key={seed}
          src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${seed}`}
          alt=""
          className={`${size} rounded-full border-2 border-white bg-[#e4e6eb] object-cover ${index > 0 ? "-ml-2" : ""}`}
        />
      ))}
    </div>
  );
}

function HeaderButton({ children, primary = false }) {
  return (
    <button
      type="button"
      className={`flex h-9 items-center gap-2 rounded-md px-3 text-[15px] font-semibold transition-colors ${
        primary ? "bg-[#0866ff] text-white hover:bg-[#075ce5]" : "bg-[#e4e6eb] text-[#050505] hover:bg-[#d8dadf]"
      }`}
    >
      {children}
    </button>
  );
}

function InfoRow({ icon, title, children }) {
  return (
    <div className="flex gap-3">
      {React.createElement(icon, {
        size: 20,
        className: "mt-0.5 shrink-0 text-[#65676b]",
        fill: "currentColor",
        strokeWidth: 1.8,
      })}
      <div>
        <div className="text-[15px] font-semibold text-[#050505]">{title}</div>
        <div className="text-[13px] leading-snug text-[#65676b]">{children}</div>
      </div>
    </div>
  );
}

function SectionCard({ title, subtitle, children }) {
  return (
    <section className="rounded-lg border border-[#dddfe2] bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center gap-1 border-b border-[#ced0d4] pb-3">
        <h2 className="text-[17px] font-bold text-[#050505]">{title}</h2>
        {subtitle && <span className="text-[15px] text-[#65676b]">· {subtitle}</span>}
      </div>
      {children}
    </section>
  );
}

function FeaturedTab({ contentOffsetClass }) {
  return (
    <main className={contentOffsetClass}>
      <div className="mx-auto grid w-full max-w-[1000px] grid-cols-1 gap-3 px-3 py-3 lg:grid-cols-[minmax(0,580px)_330px]">
        <div className="space-y-3">
          {groupPosts.slice(0, 2).map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
        <aside className="hidden space-y-3 lg:block">
          <SectionCard title="Gioi thieu">
            <p className="mb-3 text-[13px] leading-relaxed text-[#050505]">
              Chung ta khong the noi ve dam me voi mot nguoi chua tung co dam me.
            </p>
            <div className="space-y-3">
              <InfoRow icon={Earth} title="Cong khai">Bat ky ai cung co the nhin thay moi nguoi trong nhom va nhung gi ho dang.</InfoRow>
              <InfoRow icon={Eye} title="Hien thi">Ai cung co the tim thay nhom nay.</InfoRow>
            </div>
          </SectionCard>
          <SectionCard title="File phuong tien moi day">
            <div className="grid grid-cols-2 gap-1 overflow-hidden rounded-md">
              {groupMediaImages.slice(0, 4).map((src) => (
                <img key={src} src={src} alt="" className="aspect-square w-full object-cover" />
              ))}
            </div>
            <button type="button" className="mt-3 h-9 w-full rounded-md bg-[#e4e6eb] text-[14px] font-semibold hover:bg-[#d8dadf]">
              Xem tat ca
            </button>
          </SectionCard>
        </aside>
      </div>
    </main>
  );
}

function PeopleTab({ contentOffsetClass }) {
  return (
    <main className={contentOffsetClass}>
      <div className="mx-auto w-full max-w-[580px] px-3 py-3">
        <section className="rounded-lg border border-[#dddfe2] bg-white p-4 shadow-sm">
          <h2 className="text-[17px] font-bold">Thanh vien · 127.372</h2>
          <p className="mt-1 text-[13px] text-[#65676b]">
            Nguoi va Trang moi tham gia nhom nay se hien thi tai day. <button className="font-semibold text-[#050505] hover:underline">Tim hieu them</button>
          </p>
          <div className="mt-3 flex h-9 items-center gap-2 rounded-full bg-[#f0f2f5] px-3 text-[#65676b]">
            <Search size={16} />
            <span className="text-[14px]">Tim thanh vien</span>
          </div>
          <div className="mt-4 border-t border-[#ced0d4] pt-4">
            <h3 className="mb-3 text-[14px] font-bold">Quan tri vien va nguoi kiem duyet · 6</h3>
            <div className="space-y-3">
              {groupMembers.map((member) => (
                <div key={member.id} className="flex items-center gap-3">
                  <img src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${member.seed}`} alt="" className="h-12 w-12 rounded-full bg-[#e4e6eb]" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[14px] font-bold">{member.name}</div>
                    <div className="text-[12px] font-semibold text-[#0866ff]">{member.role}</div>
                    {member.note && <div className="truncate text-[12px] text-[#65676b]">{member.note}</div>}
                  </div>
                  <button type="button" className="flex h-9 items-center gap-2 rounded-md bg-[#e4e6eb] px-3 text-[13px] font-semibold hover:bg-[#d8dadf]">
                    <UserPlus size={15} /> Theo doi
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function MediaTab({ contentOffsetClass }) {
  return (
    <main className={contentOffsetClass}>
      <div className="mx-auto w-full max-w-[900px] px-3 py-3">
        <section className="rounded-lg border border-[#dddfe2] bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-[18px] font-bold">File phuong tien</h2>
            <div className="flex gap-4 text-[13px] font-semibold text-[#0866ff]">
              <button type="button">+ Tao album</button>
              <button type="button">Them anh/video</button>
            </div>
          </div>
          <div className="mt-4 flex gap-5 border-b border-[#ced0d4] text-[14px] font-semibold">
            <button type="button" className="border-b-2 border-[#0866ff] pb-3 text-[#0866ff]">Anh</button>
            <button type="button" className="pb-3 text-[#65676b]">Video</button>
            <button type="button" className="pb-3 text-[#65676b]">Album</button>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-1 sm:grid-cols-4 md:grid-cols-6">
            {groupMediaImages.map((src) => (
              <img key={src} src={src} alt="" className="aspect-square w-full object-cover" />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function GroupHome({ activeTab, setActiveTab, contentOffsetClass, displayUser, posts, setIsCreateModalOpen }) {
  const theme = {
    card: "bg-white text-[#050505]",
    textSub: "text-[#65676b]",
    tabHover: "hover:bg-[#f2f2f2]",
  };

  return (
    <>
      <header className={`${contentOffsetClass} bg-white pt-14 shadow-sm`}>
        <div className="mx-auto max-w-[1000px]">
          <div className="relative h-[280px] overflow-hidden rounded-b-lg bg-[#d8dadf] sm:h-[320px]">
            <img src={groupInfo.cover} alt="Motorcycle riders" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 bg-[#007c9b] px-4 py-2 text-[13px] font-semibold text-white">
              Nhom cua Phan Khoi Lon tren cung dan S
            </div>
          </div>

          <div className="px-4 py-5">
            <h1 className="text-[28px] font-bold leading-tight sm:text-[32px]">{groupInfo.name}</h1>
            <div className="mt-1 flex items-center gap-1 text-[14px] text-[#65676b]">
              <Earth size={15} />
              <span>{groupInfo.privacy}</span>
              <span>·</span>
              <span>{groupInfo.members}</span>
            </div>

            <div className="mt-3 flex flex-col gap-4 border-b border-[#ced0d4] pb-5 lg:flex-row lg:items-end lg:justify-between">
              <AvatarStack />
              <div className="flex flex-wrap items-center gap-2">
                <HeaderButton primary>
                  <Plus size={18} />
                  Moi
                </HeaderButton>
                <HeaderButton>
                  <Share2 size={17} fill="currentColor" />
                  Chia se
                </HeaderButton>
                <HeaderButton>
                  <Users size={17} fill="currentColor" />
                  Da tham gia
                  <ChevronDown size={16} />
                </HeaderButton>
                <button type="button" className="flex h-9 w-10 items-center justify-center rounded-md bg-[#e4e6eb] hover:bg-[#d8dadf]">
                  <ChevronDown size={18} />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <nav className="flex min-w-0 items-center gap-1 overflow-x-auto">
                {groupTabs.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`h-12 shrink-0 px-3 text-[14px] font-semibold ${
                      activeTab === tab ? "border-b-2 border-[#0866ff] text-[#0866ff]" : "rounded-md text-[#65676b] hover:bg-[#f2f2f2]"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
              <div className="hidden items-center gap-2 pl-3 sm:flex">
                <button type="button" className="flex h-9 w-10 items-center justify-center rounded-md bg-[#e4e6eb] hover:bg-[#d8dadf]">
                  <Search size={18} />
                </button>
                <button type="button" className="flex h-9 w-10 items-center justify-center rounded-md bg-[#e4e6eb] hover:bg-[#d8dadf]">
                  <MoreHorizontal size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {activeTab === "Gioi thieu" ? (
        <main className={contentOffsetClass}>
          <div className="mx-auto w-full max-w-[580px] space-y-2 px-3 py-3">
            <SectionCard title="Gioi thieu ve nhom nay">
              <p className="mb-4 text-[14px] leading-relaxed text-[#050505]">
                Chung ta khong the noi ve dam me voi mot nguoi chua tung co dam me.
              </p>
              <div className="space-y-4">
                <InfoRow icon={Earth} title="Cong khai">
                  Bat ky ai cung co the nhin thay moi nguoi trong nhom va nhung gi ho dang.
                </InfoRow>
                <InfoRow icon={Eye} title="Hien thi">
                  Ai cung co the tim thay nhom nay.
                </InfoRow>
                <InfoRow icon={History} title="Lich su">
                  Da tao nhom vao 17 thang 3, 2018. Lan gan nhat doi ten la vao 17 thang 8, 2024.
                </InfoRow>
              </div>
            </SectionCard>

            <SectionCard title="Quy tac nhom cua quan tri vien">
              <div className="divide-y divide-[#f0f2f5]">
                {groupRules.map((rule, index) => (
                  <div key={rule.title} className="grid grid-cols-[24px_1fr_28px] gap-2 py-4 first:pt-0 last:pb-0">
                    <div className="pt-1 text-[13px] text-[#65676b]">{index + 1}</div>
                    <div>
                      <h3 className="text-[14px] font-bold text-[#050505]">{rule.title}</h3>
                      <p className="mt-2 text-[13px] leading-relaxed text-[#65676b]">{rule.body}</p>
                    </div>
                    <div className="flex flex-col items-center gap-3 text-[#65676b]">
                      <ChevronUp size={18} />
                      <MoreHorizontal size={20} />
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        </main>
      ) : activeTab === "Dang chu y" ? (
        <FeaturedTab contentOffsetClass={contentOffsetClass} />
      ) : activeTab === "Moi nguoi" ? (
        <PeopleTab contentOffsetClass={contentOffsetClass} />
      ) : activeTab === "File phuong tien" ? (
        <MediaTab contentOffsetClass={contentOffsetClass} />
      ) : (
        <main className={contentOffsetClass}>
          <div className="mx-auto w-full max-w-[580px] space-y-3 px-3 py-3">
            <CreatePost
              displayUser={displayUser}
              setIsCreateModalOpen={setIsCreateModalOpen}
              isOwnProfile={true}
              theme={theme}
              darkMode={false}
            />

            <section className="rounded-lg border border-[#dddfe2] bg-white p-3 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[15px] font-bold">Dang chu y <Bell size={14} className="text-[#65676b]" /></div>
                  <button type="button" className="mt-1 text-[13px] font-semibold text-[#0866ff] hover:underline">
                    3 muc moi
                  </button>
                </div>
                <ChevronDown size={18} className="text-[#050505]" />
              </div>
            </section>

            <div className="flex items-center justify-between px-1 text-[14px] font-semibold text-[#006d8f]">
              <button type="button" className="flex items-center gap-1 hover:underline">
                Phu hop nhat <ChevronDown size={14} />
              </button>
              <button type="button" className="flex items-center gap-1 hover:underline">
                Tat ca chu de <ChevronDown size={14} />
              </button>
            </div>

            {posts.length > 0 ? (
              posts.map((post) => <PostCard key={post.id} post={post} />)
            ) : (
              <div className="rounded-lg border border-[#dddfe2] bg-white p-8 text-center text-[15px] text-[#65676b] shadow-sm">
                Chua co bai viet nao trong nhom.
              </div>
            )}
          </div>
        </main>
      )}
    </>
  );
}

function AdminContent({ view }) {
  if (settingsViews.includes(view)) return <GroupAdminSettings view={view} />;
  if (insightViews.includes(view)) return <GroupAdminInsights view={view} />;
  return <GroupAdminManage view={view} />;
}

export default function GroupPage() {
  const groupId = 1;
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("Thao luan");
  const [adminView, setAdminView] = useState("home");
  const [posts, setPosts] = useState(groupPosts);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const isAdmin = mockGroupRole === "admin" || hasAdminRole(currentUser) || currentUser?.isAdmin === true || currentUser?.IsAdmin === true;
  const contentOffsetClass = isAdmin ? "lg:pl-[292px]" : "";
  const displayUser = {
    name: currentUser ? `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim() || "Ban" : "Ban",
    avatar: currentUser?.avatarUrl || currentUser?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
  };

  const handleCreatePost = (payload) => {
    const newPost = {
      id: Date.now(),
      groupId,
      authorName: displayUser.name,
      authorAvatarUrl: displayUser.avatar,
      createdAt: new Date().toISOString(),
      visibility: payload.visibility ?? 0,
      content: payload.content || "",
      locationTag: payload.locationTag || null,
      feelingActivity: payload.feelingActivity || null,
      media: [],
      reactionCounts: [],
      commentCount: 0,
      shares: 0,
      commentsData: [],
    };

    setPosts((prev) => [newPost, ...prev]);
    setIsCreateModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] text-[#050505]">
      <Navbar />
      {isAdmin && <GroupAdminSidebar activeView={adminView} onViewChange={setAdminView} />}

      {isAdmin && adminView !== "home" ? (
        <AdminContent view={adminView} />
      ) : (
        <GroupHome
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          contentOffsetClass={contentOffsetClass}
          displayUser={displayUser}
          posts={posts}
          setIsCreateModalOpen={setIsCreateModalOpen}
        />
      )}

      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        displayUser={displayUser}
        onSubmit={handleCreatePost}
      />

      <button
        type="button"
        className="fixed bottom-5 right-5 hidden h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-black/10 hover:bg-[#f2f2f2] sm:flex"
      >
        <FileText size={20} />
      </button>
    </div>
  );
}
