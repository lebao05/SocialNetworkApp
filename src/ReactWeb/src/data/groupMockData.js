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

export const groupTabs = ["Gioi thieu", "Thao luan", "Dang chu y", "Moi nguoi", "File phuong tien"];

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
    title: "Quan ly",
    items: [
      { label: "Trang chu cua cong dong", view: "home", icon: "Home" },
    ],
  },
  {
    title: "Cong cu quan tri",
    items: [
      { label: "Yeu cau lam thanh vien", sub: "0 muc moi hom nay", view: "member-requests", icon: "UserPlus" },
      { label: "Bai viet dang cho", sub: "0 muc moi hom nay", view: "pending-posts", icon: "Newspaper" },
      { label: "Nhat ky hoat dong", view: "activity-log", icon: "Clock" },
      { label: "Quy tac nhom", view: "group-rules", icon: "BookOpen" },
      { label: "Noi dung bi thanh vien bao cao", sub: "0 muc moi hom nay", view: "reported-content", icon: "Flag" },
      { label: "Thong bao kiem duyet", sub: "0 muc moi hom nay", view: "moderation-alerts", icon: "MessageSquareWarning" },
      { label: "Vai tro trong cong dong", view: "community-roles", icon: "Badge" },
    ],
  },
  {
    title: "Cai dat",
    items: [
      { label: "Cai dat nhom", sub: "Quan ly cuoc thao luan, quyen va vai tro", view: "group-settings", icon: "Settings" },
    ],
  },
  {
    title: "Thong tin chi tiet",
    items: [
      { label: "Muc do tang truong", view: "growth", icon: "ChartNoAxesCombined" },
      { label: "Luot tuong tac", view: "engagement", icon: "ThumbsUp" },
      { label: "Thanh vien", view: "members", icon: "Users" },
    ],
  },
];

export const adminActivityLog = [
  { id: 1, day: "Hom nay", actor: "Le Bao", action: "da thay doi mau cua nhom.", time: "19:06 30 Thang 5, 2026", seed: "activity-1" },
  { id: 2, day: "29 Thang 5, 2026", actor: "Le Bao", action: "da tao nhom.", time: "20:48 29 Thang 5, 2026", seed: "activity-2" },
  { id: 3, day: "29 Thang 5, 2026", actor: "Le Bao", action: "da them Dong gop vao nhom.", time: "20:48 29 Thang 5, 2026", seed: "activity-3" },
  { id: 4, day: "29 Thang 5, 2026", actor: "Le Bao", action: "da thay doi phan cai dat de bat tinh nang tham gia an danh trong nhom nay.", time: "20:48 29 Thang 5, 2026", seed: "activity-4" },
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
    blocked: 0,
  },
  engagement: {
    posts: 0,
    activeMembers: 0,
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
