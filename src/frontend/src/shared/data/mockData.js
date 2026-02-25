export const currentUser = {
  id: "me",
  name: "Nguyen Van An",
  avatar: "https://i.pravatar.cc/150?img=3",
};

export const mockContacts = [
  { id: "u1", name: "Tran Thi Bich", avatar: "https://i.pravatar.cc/150?img=5", status: "online" },
  { id: "u2", name: "Pham Minh Duc", avatar: "https://i.pravatar.cc/150?img=8", status: "online" },
  { id: "u3", name: "Hoang Thi Mai", avatar: "https://i.pravatar.cc/150?img=11", status: "offline" },
  { id: "u4", name: "Le Van Hung", avatar: "https://i.pravatar.cc/150?img=14", status: "online" },
  { id: "u5", name: "Vo Thi Thu", avatar: "https://i.pravatar.cc/150?img=20", status: "offline" },
  { id: "u6", name: "Dang Quoc Khanh", avatar: "https://i.pravatar.cc/150?img=25", status: "online" },
];

export const mockConversations = [
  {
    id: "conv-u1",
    userId: "u1",
    messages: [
      { id: "m1", senderId: "u1", text: "Hey! Dạo này bạn thế nào rồi?", time: "09:10" },
      { id: "m2", senderId: "me", text: "Mình ổn, đang code dự án mới nè.", time: "09:12" },
      { id: "m3", senderId: "u1", text: "Dự án gì vậy, nghe hay đó!", time: "09:13" },
      { id: "m4", senderId: "me", text: "Clone lại giao diện Facebook bằng React 😄", time: "09:15" },
      { id: "m5", senderId: "u1", text: "Wao xịn quá, cho mình xem với nhé!", time: "09:16" },
    ],
  },
  {
    id: "conv-u2",
    userId: "u2",
    messages: [
      { id: "m1", senderId: "u2", text: "Chiều nay có đi đá bóng không?", time: "08:00" },
      { id: "m2", senderId: "me", text: "Có, 4h tại sân gần nhà nhé!", time: "08:05" },
      { id: "m3", senderId: "u2", text: "Ok, mình sẽ rủ thêm mấy đứa nữa.", time: "08:07" },
    ],
  },
  {
    id: "conv-u3",
    userId: "u3",
    messages: [
      { id: "m1", senderId: "me", text: "Bạn đã review PR của mình chưa?", time: "07:30" },
      { id: "m2", senderId: "u3", text: "Rồi, mình có để lại vài comment nhỏ thôi.", time: "07:45" },
      { id: "m3", senderId: "me", text: "Ok, mình sẽ fix lại ngay!", time: "07:46" },
    ],
  },
  {
    id: "conv-u4",
    userId: "u4",
    messages: [
      { id: "m1", senderId: "u4", text: "Bữa nay ăn gì chưa bạn?", time: "12:00" },
      { id: "m2", senderId: "me", text: "Chưa, đang bận làm việc quên ăn 😅", time: "12:10" },
    ],
  },
  {
    id: "conv-u5",
    userId: "u5",
    messages: [
      { id: "m1", senderId: "u5", text: "Tài liệu học Tailwind mình đã share rồi nhé!", time: "11:00" },
      { id: "m2", senderId: "me", text: "Cảm ơn bạn rất nhiều 🙏", time: "11:02" },
    ],
  },
  {
    id: "conv-u6",
    userId: "u6",
    messages: [
      { id: "m1", senderId: "u6", text: "Meeting lúc 3h chiều nha mọi người!", time: "10:30" },
      { id: "m2", senderId: "me", text: "Ok, mình sẽ tham gia đúng giờ.", time: "10:31" },
    ],
  },
];

export const mockPosts = [
  {
    id: "post1",
    userId: "u1",
    content: "Hôm nay trời đẹp quá, ngồi làm việc ở quán cà phê thật sự rất thoải mái ☕. Ai cũng nên thử một lần!",
    likes: 42,
    comments: 8,
    shares: 3,
    time: "2 giờ trước",
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600",
  },
  {
    id: "post2",
    userId: "u2",
    content:
      "Vừa hoàn thành khóa học React Hooks! Cảm giác hiểu rõ hơn rất nhiều về useState và useEffect 🚀. Recommend cho các bạn đang học frontend.",
    likes: 88,
    comments: 21,
    shares: 12,
    time: "5 giờ trước",
    image: null,
  },
  {
    id: "post3",
    userId: "u3",
    content: "Cuối tuần này nhóm mình tổ chức đi picnic ở Vườn Quốc gia 🌿🏕️. Ai muốn tham gia thì inbox mình nhé!",
    likes: 115,
    comments: 34,
    shares: 7,
    time: "8 giờ trước",
    image: "https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=600",
  },
  {
    id: "post4",
    userId: "u4",
    content: "Hôm nay thử nấu món bò sốt tiêu xanh, ra lò thơm ngon lắm! Ai muốn công thức thì inbox mình 🍖",
    likes: 67,
    comments: 15,
    shares: 2,
    time: "12 giờ trước",
    image: null,
  },
];

export const mockStories = [
  { id: "s1", userId: "u1", thumbnail: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300" },
  { id: "s2", userId: "u2", thumbnail: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300" },
  { id: "s3", userId: "u3", thumbnail: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300" },
  { id: "s4", userId: "u4", thumbnail: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=300" },
];
