import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Settings, Star, Users, X } from "lucide-react";
import Navbar from "../components/Navbar/Navbar";

const joinedGroups = [
  {
    id: 1,
    name: "EC-23HTTT",
    active: "1 ngay truoc",
    members: "82 thanh vien",
    postsToday: 3,
    image: "https://picsum.photos/seed/ec23/320/180",
  },
  {
    id: 2,
    name: "Hieu Biet Hon Moi Ngay",
    active: "1 gio truoc",
    members: "218K thanh vien",
    postsToday: 28,
    image: "https://picsum.photos/seed/knowledge/320/180",
  },
  {
    id: 3,
    name: "Dien Dan Ket Noi Dam Me Phan Khoi Lon Tren Cung Dan S.",
    active: "4 gio truoc",
    members: "127,4K thanh vien",
    postsToday: 10,
    image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 4,
    name: "The Forum IELTS Community",
    active: "14 phut truoc",
    members: "94K thanh vien",
    postsToday: 16,
    image: "https://picsum.photos/seed/ielts/320/180",
  },
  {
    id: 5,
    name: "Cung Duong Phuot Bui (Biker Viet Nam)",
    active: "19 phut truoc",
    members: "61K thanh vien",
    postsToday: 12,
    image: "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 6,
    name: "Thiet ke phan mem 23KTPM1",
    active: "5 gio truoc",
    members: "45 thanh vien",
    postsToday: 2,
    image: "https://picsum.photos/seed/software23/320/180",
  },
  {
    id: 7,
    name: "Tai Lieu - HCMUS",
    active: "4 gio truoc",
    members: "32K thanh vien",
    postsToday: 7,
    image: "https://picsum.photos/seed/hcmus/320/180",
  },
  {
    id: 8,
    name: "Tuyen dung NodeJS/ReactJS VietNam",
    active: "1 gio truoc",
    members: "76K thanh vien",
    postsToday: 21,
    image: "https://picsum.photos/seed/reactjobs/320/180",
  },
];

const suggestedGroups = [
  {
    id: 101,
    name: "Biet thi thua thot, khong biet thi doc REVIEW!",
    members: "1,2 trieu thanh vien",
    postsToday: 10,
    image: "https://picsum.photos/seed/reviewgroup/420/220",
    friends: "Thanh Van va 8 nguoi ban la thanh vien",
  },
  {
    id: 102,
    name: "Hoc IELTS",
    members: "548K thanh vien",
    postsToday: 10,
    image: "https://picsum.photos/seed/ieltsstudy/420/220",
    friends: "Truong Dat va 8 nguoi ban la thanh vien",
  },
  {
    id: 103,
    name: "Khong Gioi IELTS - Xoa Group ^^",
    members: "446K thanh vien",
    postsToday: 7,
    image: "https://picsum.photos/seed/noielts/420/220",
    friends: "Vuong Ngoc va 9 nguoi ban la thanh vien",
  },
  {
    id: 104,
    name: "Cuoi Cho No Khoe",
    members: "1,1 trieu thanh vien",
    postsToday: 10,
    image: "https://picsum.photos/seed/funnygroup/420/220",
  },
  {
    id: 105,
    name: "Phuot",
    members: "275K thanh vien",
    postsToday: 10,
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 106,
    name: "Phuot Ha Noi",
    members: "180K thanh vien",
    postsToday: 10,
    image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 107,
    name: "Tu Vung IELTS Hay",
    members: "853K thanh vien",
    postsToday: 6,
    image: "https://picsum.photos/seed/ieltsvocab/420/220",
    friends: "Bui Duy Anh va 24 nguoi ban la thanh vien",
  },
  {
    id: 108,
    name: "PhuotLuon.Com",
    members: "1,2 trieu thanh vien",
    postsToday: 10,
    image: "https://picsum.photos/seed/phuotluon/420/220",
  },
  {
    id: 109,
    name: "5+ tu vung IELTS hay moi ngay",
    members: "579K thanh vien",
    postsToday: 10,
    image: "https://picsum.photos/seed/vocabdaily/420/220",
    friends: "Tran Nguyen Long Vu va 8 nguoi ban la thanh vien",
  },
  {
    id: 110,
    name: "REVIEW PHU YEN TAT TAN TAT",
    members: "1,2 trieu thanh vien",
    postsToday: 10,
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 111,
    name: "Viet De Truong Thanh",
    members: "314K thanh vien",
    postsToday: 10,
    image: "https://picsum.photos/seed/crazymind/420/220",
  },
  {
    id: 112,
    name: "IELTS NGOC BACH",
    members: "814K thanh vien",
    postsToday: 9,
    image: "https://picsum.photos/seed/ngocbach/420/220",
    friends: "Bui Duy Anh va 10 nguoi ban la thanh vien",
  },
];

function SidebarItem({ icon: Icon, label, active = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left ${
        active ? "bg-[#e7f3ff]" : "hover:bg-[#f2f2f2]"
      }`}
    >
      <span className={`flex h-9 w-9 items-center justify-center rounded-full ${active ? "bg-[#0866ff] text-white" : "bg-[#e4e6eb]"}`}>
        <Icon size={18} />
      </span>
      <span className="text-[15px] font-semibold">{label}</span>
    </button>
  );
}

function SuggestedGroupCard({ group }) {
  return (
    <article className="overflow-hidden rounded-lg border border-[#dddfe2] bg-white shadow-sm">
      <div className="relative">
        <img src={group.image} alt="" className="aspect-[1.9/1] w-full object-cover" />
        <button
          type="button"
          aria-label="Bo qua goi y"
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/55"
        >
          <X size={16} />
        </button>
      </div>
      <div className="p-3">
        <h2 className="line-clamp-2 min-h-[40px] text-[15px] font-bold leading-snug text-[#050505]">{group.name}</h2>
        <p className="mt-1 text-[13px] text-[#65676b]">
          {group.members} · {group.postsToday}+ bai viet/ngay
        </p>
        <div className="mt-2 flex min-h-[34px] items-center gap-2">
          <div className="flex shrink-0">
            {Array.from({ length: 3 }).map((_, index) => (
              <img
                key={`${group.id}-${index}`}
                src={`https://api.dicebear.com/9.x/avataaars/svg?seed=suggest-${group.id}-${index}`}
                alt=""
                className={`h-6 w-6 rounded-full border-2 border-white bg-[#e4e6eb] ${index > 0 ? "-ml-2" : ""}`}
              />
            ))}
          </div>
          <p className="line-clamp-2 text-[12px] leading-snug text-[#65676b]">{group.friends || "Co nhieu bai viet moi phu hop voi ban"}</p>
        </div>
        <button type="button" className="mt-3 h-9 w-full rounded-md bg-[#e4e6eb] text-[14px] font-semibold hover:bg-[#d8dadf]">
          Tham gia nhom
        </button>
      </div>
    </article>
  );
}

function GroupCard({ group }) {
  return (
    <article className="overflow-hidden rounded-lg border border-[#dddfe2] bg-white shadow-sm">
      <img src={group.image} alt="" className="aspect-[16/9] w-full object-cover" />
      <div className="p-4">
        <h2 className="line-clamp-2 min-h-[44px] text-[16px] font-bold leading-snug text-[#050505]">{group.name}</h2>
        <p className="mt-1 text-[13px] text-[#65676b]">{group.members}</p>
        <p className="mt-1 text-[13px] text-[#65676b]">{group.postsToday} bai viet moi hom nay</p>
        <Link
          to={`/groups/${group.id}`}
          className="mt-4 flex h-9 w-full items-center justify-center rounded-md bg-[#e7f3ff] text-[14px] font-semibold text-[#0866ff] hover:bg-[#dbeeff]"
        >
          Xem nhom
        </Link>
      </div>
    </article>
  );
}

export default function GroupsPage() {
  const [activeTab, setActiveTab] = useState("discover");
  const isDiscover = activeTab === "discover";

  return (
    <div className="min-h-screen bg-[#f0f2f5] text-[#050505]">
      <Navbar />

      <aside className="fixed left-0 top-14 z-20 hidden h-[calc(100vh-56px)] w-[280px] overflow-y-auto border-r border-[#dddfe2] bg-white p-2 lg:block">
        <div className="mb-2 flex items-center justify-between">
          <h1 className="text-[22px] font-bold">Nhom</h1>
          <button type="button" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e4e6eb] hover:bg-[#d8dadf]">
            <Settings size={18} />
          </button>
        </div>

        <div className="mb-3 flex h-9 items-center gap-2 rounded-full bg-[#f0f2f5] px-3 text-[#65676b]">
          <Search size={16} />
          <span className="text-[14px]">Tim kiem nhom</span>
        </div>

        <SidebarItem icon={Star} label="Kham pha" active={isDiscover} onClick={() => setActiveTab("discover")} />
        <SidebarItem icon={Users} label="Nhom cua ban" active={!isDiscover} onClick={() => setActiveTab("joined")} />

        <Link to="/groups/create" className="my-3 flex h-9 w-full items-center justify-center gap-2 rounded-md bg-[#e7f3ff] text-[14px] font-semibold text-[#0866ff] hover:bg-[#dbeeff]">
          <Plus size={16} />
          Tao nhom moi
        </Link>

      </aside>

      <main className="pt-14 lg:pl-[280px]">
        <div className="mx-auto max-w-[1120px] px-4 py-6">
          <div className="mb-4 grid grid-cols-2 gap-2 lg:hidden">
            <button
              type="button"
              onClick={() => setActiveTab("discover")}
              className={`h-10 rounded-md text-[14px] font-semibold ${isDiscover ? "bg-[#0866ff] text-white" : "bg-white text-[#050505]"}`}
            >
              Kham pha
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("joined")}
              className={`h-10 rounded-md text-[14px] font-semibold ${!isDiscover ? "bg-[#0866ff] text-white" : "bg-white text-[#050505]"}`}
            >
              Nhom cua ban
            </button>
          </div>

          <div className="mb-4 flex flex-col gap-3 border-b border-[#ced0d4] pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-[24px] font-bold">{isDiscover ? "Kham pha" : "Nhom cua ban"}</h1>
              <p className="mt-1 text-[14px] text-[#65676b]">
                {isDiscover
                  ? "Tim cac nhom goi y va cac cong dong co the ban quan tam."
                  : "Danh sach nhom mock de chon va mo trang chi tiet nhom."}
              </p>
            </div>
            <div className="flex h-10 items-center gap-2 rounded-full bg-white px-3 text-[#65676b] shadow-sm ring-1 ring-[#dddfe2] sm:w-[280px]">
              <Search size={16} />
              <span className="text-[14px]">Tim kiem nhom</span>
            </div>
          </div>

          {isDiscover ? (
            <section>
              <h2 className="mb-3 text-[18px] font-bold">Goi y khac</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {suggestedGroups.map((group) => (
                  <SuggestedGroupCard key={group.id} group={group} />
                ))}
              </div>
            </section>
          ) : (
            <section>
              <h2 className="mb-3 text-[18px] font-bold">Nhom cua ban</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {joinedGroups.map((group) => (
                  <GroupCard key={group.id} group={group} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
