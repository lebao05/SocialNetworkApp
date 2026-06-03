export const groupInfo = {
  id: 1,
  shortName: "test",
  name: "Dien Dan Ket Noi Dam Me Phan Khoi Lon Tren Cung Dan S.",
  privacy: "Nhom Cong khai",
  adminPrivacy: "Nhom Rieng tu",
  members: "127,4K thanh vien",
  adminMembers: "1 thanh vien",
  avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=group-test",
  cover: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1600&q=85",
};

export const mockGroupRole = "admin";

export const groupTabs = ["About", "Discussion", "Featured", "People", "Media"];

export const groupAvatarSeeds = [
  "rider-1",
  "rider-2",
  "rider-3",
  "rider-4",
  "rider-5",
  "rider-6",
  "rider-7",
  "rider-8",
  "rider-9",
  "rider-10",
  "rider-11",
  "rider-12",
];

export const groupRules = [
  {
    title: "Hay tu te va lich su",
    body: "Tat ca chung ta cung co mat o day de tao nen mot moi truong than thien. Hay ton trong tat ca moi nguoi.",
  },
  {
    title: "Khong dung ngon tu gay thu ghet hoac bat nat",
    body: "Hay dam bao moi nguoi cam thay an toan. Moi hinh thuc bat nat deu khong duoc cho phep.",
  },
  {
    title: "Khong quang cao hoac spam",
    body: "Trong nhom, hay cho di nhieu hon nhan lai. Ban khong duoc tu quang ba, spam va dang lien ket khong phu hop.",
  },
  {
    title: "Ton trong quyen rieng tu cua moi nguoi",
    body: "Cac cuoc thao luan chan thuc co the nhay cam va rieng tu. Khong tiet lo noi dung duoc chia se trong nhom ra ben ngoai.",
  },
];

export const groupMembers = [
  { id: 1, name: "Phan Khoi Lon tren cung dan S", role: "Quan tri vien", note: "", seed: "admin-1" },
  { id: 2, name: "Do Bui", role: "Quan tri vien", note: "Founder, Director, CEO tai Phan Khoi Lon tren cung dan S", seed: "admin-2" },
  { id: 3, name: "Trinh Huynh Hoai Bao", role: "Nguoi kiem duyet", note: "Admin tai Cong Dong AGV", seed: "mod-1" },
  { id: 4, name: "Pham Nhat", role: "Nguoi kiem duyet", note: "Lam viec tai Cong ty Nhiet dien Mong Duong", seed: "mod-2" },
  { id: 5, name: "Kiet Hai Muoi BA", role: "Nguoi kiem duyet", note: "Event Manager tai DTN communication", seed: "mod-3" },
  { id: 6, name: "Thanh Lam", role: "Nguoi kiem duyet", note: "Founder tai TL Motor - Coffee & Service", seed: "mod-4" },
];

export const groupMediaImages = [
  "https://images.unsplash.com/photo-1517846693594-1567da72af75?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1558981359-219d6364c9c8?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1558981285-6f0c94958bb6?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1571646034647-52e6ea84b28c?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1600990910741-22fcf37b91f0?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1622185135505-2d795003994a?auto=format&fit=crop&w=500&q=80",
];

export const adminSidebarSections = [
  {
    title: "Manage",
    items: [
      { label: "Community Home", view: "home", icon: "Home" },
    ],
  },
  {
    title: "Admin Tools",
    items: [
      { label: "Member Requests", sub: "0 new today", view: "member-requests", icon: "UserPlus" },
      { label: "Pending Posts", sub: "0 new today", view: "pending-posts", icon: "Newspaper" },
      { label: "Reported Content", sub: "0 new today", view: "reported-content", icon: "Flag" },
      { label: "Community Roles", view: "community-roles", icon: "Badge" },
    ],
  },
  {
    title: "Settings",
    items: [
      { label: "Group Settings", sub: "Manage discussions, permissions and roles", view: "group-settings", icon: "Settings" },
    ],
  },
  {
    title: "Insights",
    items: [
      { label: "Growth", view: "growth", icon: "ChartNoAxesCombined" },
      { label: "Engagement", view: "engagement", icon: "ThumbsUp" },
      { label: "Members", view: "members", icon: "Users" },
    ],
  },
];

export const adminActivityLog = [
  { id: 1, day: "Today", actor: "Le Bao", action: "changed the group color.", time: "19:06 May 30, 2026", seed: "activity-1" },
  { id: 2, day: "May 29, 2026", actor: "Le Bao", action: "created the group.", time: "20:48 May 29, 2026", seed: "activity-2" },
  { id: 3, day: "May 29, 2026", actor: "Le Bao", action: "added Member as a contributor.", time: "20:48 May 29, 2026", seed: "activity-3" },
  { id: 4, day: "May 29, 2026", actor: "Le Bao", action: "changed the setting to enable anonymous posting in this group.", time: "20:48 May 29, 2026", seed: "activity-4" },
];

export const settingsSections = [
  {
    title: "Thiet lap nhom",
    rows: [
      { label: "Ten va mo ta", value: "", action: "edit" },
      { label: "Phan gioi thieu thanh vien moi", value: "Tat", action: "expand" },
      { label: "Quyen rieng tu", value: "Rieng tu", action: "expand" },
      { label: "An nhom", value: "Hien thi", action: "edit" },
      { label: "Vi tri", value: "", action: "edit" },
    ],
  },
  {
    title: "Tuy chinh nhom",
    rows: [
      { label: "Dia chi web", value: "www.facebook.com/groups/1527791392018624/", action: "edit" },
      { label: "Mau cua nhom", value: "green", action: "toggle" },
      { label: "Huy hieu", value: "7 huy hieu", action: "edit" },
      { label: "Ben lien ket voi nhom", value: "Khong co ben lien ket", action: "edit" },
    ],
  },
  {
    title: "Quan ly thanh vien",
    rows: [
      { label: "Ai co the tham gia nhom", value: "Chi trang ca nhan", action: "edit" },
      { label: "Ai co the phe duyet yeu cau lam thanh vien", value: "Bat cu ai trong nhom", action: "edit" },
      { label: "Nhung ai duoc phe duyet truoc vao nhom", value: "Khong co ai", action: "edit" },
    ],
  },
  {
    title: "Quan ly noi dung thao luan",
    rows: [
      { label: "Tham gia an danh", value: "Bat", action: "edit" },
      { label: "Ai co the dang", value: "Bat cu ai trong nhom", action: "edit" },
      { label: "Phe duyet bai viet", value: "Tat", action: "edit" },
      { label: "Phe duyet noi dung chinh sua", value: "Tat", action: "edit" },
      { label: "Chinh sua dinh dang bai viet", value: "", action: "edit" },
      { label: "Sap xep bai viet", value: "Phu hop nhat", action: "edit" },
    ],
  },
];

export const insightSummary = {
  growth: {
    totalMembers: 1,
    requests: 0,
    reviewed: 0,
    approved: 0,
    declined: 0,
  },
  engagement: {
    posts: 0,
    activeMembers: 0,
    comments: 0,
    reactions: 0,
    topDays: [],
  },
  admins: [
    { label: "Quan tri vien", value: 1 },
    { label: "Nguoi kiem duyet", value: 0 },
  ],
  members: {
    total: 1,
    active: 0,
    newThisWeek: 1,
  },
};
