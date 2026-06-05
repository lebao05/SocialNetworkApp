import React, { useMemo, useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import {
  Search,
  MoreHorizontal,
  Send,
  ChevronDown,
} from "lucide-react";
import { birthdays as birthdayData } from "../data/mockData";

const DEFAULT_AVATAR = import.meta.env.VITE_DEFAULT_AVATAR;
const MAX_PER_MONTH = 10;
const MONTH_LABELS = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];

const YEARLY_BIRTHDAYS = [
  { id: 101, name: "Hà Linh", avatar: "https://i.pravatar.cc/150?img=44", month: 1, day: 18, mutualFriends: 18, age: 22 },
  { id: 102, name: "Khánh Vy", avatar: "https://i.pravatar.cc/150?img=45", month: 1, day: 24, mutualFriends: 6, age: 23 },
  { id: 103, name: "Thanh Tâm", avatar: "https://i.pravatar.cc/150?img=46", month: 1, day: 30, mutualFriends: 9, age: 21 },
  { id: 104, name: "Ngọc Hân", avatar: "https://i.pravatar.cc/150?img=49", month: 2, day: 9, mutualFriends: 9, age: 21 },
  { id: 105, name: "Minh Anh", avatar: "https://i.pravatar.cc/150?img=50", month: 2, day: 13, mutualFriends: 11, age: 22 },
  { id: 106, name: "Thảo Nhi", avatar: "https://i.pravatar.cc/150?img=51", month: 2, day: 22, mutualFriends: 5, age: 20 },
  { id: 107, name: "Duy Anh", avatar: "https://i.pravatar.cc/150?img=12", month: 3, day: 27, mutualFriends: 26, age: 24 },
  { id: 108, name: "Gia Huy", avatar: "https://i.pravatar.cc/150?img=13", month: 3, day: 6, mutualFriends: 8, age: 25 },
  { id: 109, name: "Hoài Nam", avatar: "https://i.pravatar.cc/150?img=16", month: 3, day: 19, mutualFriends: 10, age: 23 },
  { id: 110, name: "Mai Anh", avatar: "https://i.pravatar.cc/150?img=32", month: 4, day: 14, mutualFriends: 12, age: 23 },
  { id: 111, name: "Yến Nhi", avatar: "https://i.pravatar.cc/150?img=33", month: 4, day: 18, mutualFriends: 4, age: 22 },
  { id: 112, name: "Thu Trang", avatar: "https://i.pravatar.cc/150?img=34", month: 4, day: 28, mutualFriends: 7, age: 24 },
  { id: 113, name: "Quốc Bảo", avatar: "https://i.pravatar.cc/150?img=15", month: 5, day: 5, mutualFriends: 14, age: 25 },
  { id: 114, name: "Nhật Minh", avatar: "https://i.pravatar.cc/150?img=17", month: 5, day: 12, mutualFriends: 9, age: 22 },
  { id: 115, name: "Kim Oanh", avatar: "https://i.pravatar.cc/150?img=18", month: 5, day: 25, mutualFriends: 6, age: 21 },
  { id: 116, name: "Bảo Châu", avatar: "https://i.pravatar.cc/150?img=47", month: 6, day: 21, mutualFriends: 16, age: 22 },
  { id: 117, name: "Lan Hương", avatar: "https://i.pravatar.cc/150?img=52", month: 6, day: 4, mutualFriends: 12, age: 24 },
  { id: 118, name: "Khôi Nguyên", avatar: "https://i.pravatar.cc/150?img=53", month: 6, day: 16, mutualFriends: 3, age: 23 },
  { id: 119, name: "Tuấn Kiệt", avatar: "https://i.pravatar.cc/150?img=11", month: 7, day: 11, mutualFriends: 11, age: 24 },
  { id: 120, name: "Hải Đăng", avatar: "https://i.pravatar.cc/150?img=54", month: 7, day: 20, mutualFriends: 13, age: 22 },
  { id: 121, name: "Uyên Nhi", avatar: "https://i.pravatar.cc/150?img=55", month: 7, day: 28, mutualFriends: 7, age: 21 },
  { id: 122, name: "Minh Khôi", avatar: "https://i.pravatar.cc/150?img=8", month: 8, day: 3, mutualFriends: 19, age: 23 },
  { id: 123, name: "Tường Vy", avatar: "https://i.pravatar.cc/150?img=56", month: 8, day: 8, mutualFriends: 5, age: 22 },
  { id: 124, name: "Bảo Trâm", avatar: "https://i.pravatar.cc/150?img=57", month: 8, day: 31, mutualFriends: 8, age: 24 },
  { id: 125, name: "Linh Hoa", avatar: "https://i.pravatar.cc/150?img=14", month: 9, day: 29, mutualFriends: 8, age: 20 },
  { id: 126, name: "Tuệ Lâm", avatar: "https://i.pravatar.cc/150?img=58", month: 9, day: 2, mutualFriends: 10, age: 23 },
  { id: 127, name: "Đức Huy", avatar: "https://i.pravatar.cc/150?img=59", month: 9, day: 17, mutualFriends: 6, age: 25 },
  { id: 128, name: "Phong", avatar: "https://i.pravatar.cc/150?img=22", month: 10, day: 12, mutualFriends: 7, age: 26 },
  { id: 129, name: "Gia Bảo", avatar: "https://i.pravatar.cc/150?img=20", month: 10, day: 18, mutualFriends: 11, age: 22 },
  { id: 130, name: "Hồng Nhung", avatar: "https://i.pravatar.cc/150?img=21", month: 10, day: 26, mutualFriends: 4, age: 21 },
  { id: 131, name: "Nam", avatar: "https://i.pravatar.cc/150?img=28", month: 11, day: 8, mutualFriends: 5, age: 22 },
  { id: 132, name: "Kiều Anh", avatar: "https://i.pravatar.cc/150?img=23", month: 11, day: 15, mutualFriends: 8, age: 24 },
  { id: 133, name: "Bích Ngọc", avatar: "https://i.pravatar.cc/150?img=24", month: 11, day: 27, mutualFriends: 6, age: 23 },
  { id: 134, name: "Mai Nguyen", avatar: "https://i.pravatar.cc/150?img=39", month: 12, day: 24, mutualFriends: 13, age: 24 },
  { id: 135, name: "An Nhiên", avatar: "https://i.pravatar.cc/150?img=25", month: 12, day: 5, mutualFriends: 9, age: 22 },
  { id: 136, name: "Trọng Nhân", avatar: "https://i.pravatar.cc/150?img=26", month: 12, day: 14, mutualFriends: 7, age: 25 },
];

function BirthdayListItem({ person, note, actionLabel = "Nhắn tin" }) {
  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-[#e4e6eb] bg-white p-4 transition hover:shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <img
          src={person.avatar || DEFAULT_AVATAR}
          alt={person.name}
          className="h-14 w-14 rounded-full object-cover ring-1 ring-black/5"
        />
        <div className="min-w-0">
          <p className="truncate text-[16px] font-semibold text-[#050505]">{person.name}</p>
          <p className="mt-0.5 text-[13px] leading-5 text-[#65676b]">{note}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:pl-4">
        <button
          type="button"
          className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#1877f2] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#166fe5]"
        >
          <Send size={15} />
          {actionLabel}
        </button>
        <button
          type="button"
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[#f0f2f5] text-[#050505] transition hover:bg-[#e4e6eb]"
        >
          <MoreHorizontal size={18} />
        </button>
      </div>
    </article>
  );
}

function SectionCard({ title, subtitle, rightNode, children }) {
  return (
    <section className="rounded-2xl border border-[#e4e6eb] bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-[#eef0f3] px-5 py-4 sm:flex-row sm:items-start sm:justify-between sm:px-6">
        <div>
          <h2 className="text-[22px] font-bold leading-tight text-[#050505]">{title}</h2>
          {subtitle && <p className="mt-1 text-[14px] text-[#65676b]">{subtitle}</p>}
        </div>
        {rightNode}
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

function MonthSection({ monthLabel, friends, totalCount }) {
  return (
    <section className="rounded-2xl border border-[#e4e6eb] bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-[#eef0f3] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <h3 className="text-[20px] font-bold text-[#050505]">{monthLabel}</h3>
          <p className="mt-1 text-[14px] text-[#65676b]">
            Hiển thị {friends.length}/{Math.min(totalCount, MAX_PER_MONTH)} người, tối đa {MAX_PER_MONTH} mỗi tháng
          </p>
        </div>
        <div className="rounded-full bg-[#f0f2f5] px-3 py-1 text-xs font-semibold text-[#65676b]">{totalCount}</div>
      </div>
      <div className="space-y-3 p-5 sm:p-6">
        {friends.map((person) => (
          <BirthdayListItem
            key={person.id}
            person={person}
            note={`Ngày ${person.day} • Tròn ${person.age} tuổi • ${person.mutualFriends} bạn chung`}
            actionLabel="Nhắn trước"
          />
        ))}
      </div>
    </section>
  );
}

export default function BirthdaysPage() {
  const [search, setSearch] = useState("");

  const todayBirthdays = useMemo(
    () =>
      birthdayData.map((person, index) => ({
        ...person,
        age: 20 + index + 1,
        mutualFriends: [14, 21, 8, 17][index] ?? 10,
      })),
    []
  );

  const allBirthdays = useMemo(() => [...todayBirthdays, ...YEARLY_BIRTHDAYS], [todayBirthdays]);

  const filteredTodayBirthdays = useMemo(() => {
    if (!search.trim()) return todayBirthdays;
    const q = search.toLowerCase();
    return todayBirthdays.filter((person) => person.name.toLowerCase().includes(q));
  }, [search, todayBirthdays]);

  const filteredYearlyBirthdays = useMemo(() => {
    if (!search.trim()) return YEARLY_BIRTHDAYS;
    const q = search.toLowerCase();
    return YEARLY_BIRTHDAYS.filter((person) => person.name.toLowerCase().includes(q));
  }, [search]);

  const monthlyBirthdays = useMemo(() => {
    return MONTH_LABELS.map((label, index) => {
      const monthFriends = filteredYearlyBirthdays
        .filter((person) => person.month === index + 1)
        .sort((a, b) => a.day - b.day);

      return {
        month: index + 1,
        label,
        totalCount: monthFriends.length,
        friends: monthFriends.slice(0, MAX_PER_MONTH),
      };
    }).filter((group) => group.totalCount > 0);
  }, [filteredYearlyBirthdays]);

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <Navbar />

      <div className="pt-14">
        <div className="mx-auto max-w-[1100px] px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
          <div className="mb-6 rounded-2xl border border-[#e4e6eb] bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="text-[28px] font-bold leading-tight text-[#050505]">Sinh nhật</h1>
                <p className="mt-1 text-[14px] text-[#65676b]">Xem sinh nhật bạn bè trong cả 12 tháng</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="rounded-full bg-[#e7f3ff] px-3 py-1.5 text-xs font-semibold text-[#1877f2]">
                  {todayBirthdays.length} hôm nay
                </div>
                <div className="rounded-full bg-[#f0f2f5] px-3 py-1.5 text-xs font-semibold text-[#65676b]">
                  {monthlyBirthdays.length} tháng có sinh nhật
                </div>
              </div>
            </div>

            <div className="relative mt-5">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#65676b]" size={18} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Tìm kiếm sinh nhật"
                className="w-full rounded-full border border-transparent bg-[#f0f2f5] py-2.5 pl-10 pr-4 text-[15px] text-[#050505] outline-none transition focus:border-[#1877f2] focus:bg-white"
              />
            </div>
          </div>

          <div className="space-y-6">
            <SectionCard
              title="Sinh nhật hôm nay"
              subtitle={`${filteredTodayBirthdays.length} người bạn đang có sinh nhật hôm nay`}
              rightNode={
                <div className="rounded-full bg-[#fff4df] px-3 py-1.5 text-xs font-semibold text-[#b7791f]">
                  Đừng bỏ lỡ lời chúc nào
                </div>
              }
            >
              {filteredTodayBirthdays.length > 0 ? (
                <div className="space-y-3">
                  {filteredTodayBirthdays.map((person) => (
                    <BirthdayListItem
                      key={person.id}
                      person={person}
                      note={`Hôm nay ${person.name} tròn ${person.age} tuổi • ${person.mutualFriends} bạn chung`}
                      actionLabel="Gửi lời chúc"
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-[#d8dadf] bg-[#fafbfc] px-6 py-14 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#f0f2f5] text-[#65676b]">
                    <Search size={22} />
                  </div>
                  <h3 className="text-lg font-bold text-[#050505]">Không tìm thấy sinh nhật hôm nay</h3>
                  <p className="mt-2 text-sm text-[#65676b]">Thử tên khác hoặc xoá từ khoá tìm kiếm.</p>
                </div>
              )}
            </SectionCard>

            <SectionCard
              title="Sinh nhật bạn bè trong 12 tháng"
              subtitle="Danh sách sinh nhật được nhóm theo từng tháng, tối đa 10 người mỗi tháng"
              rightNode={
                <div className="inline-flex items-center gap-2 rounded-full bg-[#f0f2f5] px-3 py-1.5 text-xs font-semibold text-[#65676b]">
                  <ChevronDown size={14} />
                  {monthlyBirthdays.length} tháng có sinh nhật
                </div>
              }
            >
              <div className="space-y-4">
                {monthlyBirthdays.map((group) => (
                  <MonthSection
                    key={group.month}
                    monthLabel={group.label}
                    friends={group.friends}
                    totalCount={group.totalCount}
                  />
                ))}
              </div>
            </SectionCard>

            <section className="rounded-2xl border border-[#e4e6eb] bg-white px-5 py-4 shadow-sm sm:px-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-[20px] font-bold text-[#050505]">Tất cả sinh nhật</h2>
                  <p className="mt-1 text-[14px] text-[#65676b]">{allBirthdays.length} người trong danh sách sinh nhật của bạn</p>
                </div>
                <button
                  type="button"
                  className="inline-flex cursor-pointer items-center justify-center rounded-full bg-[#e7f3ff] px-4 py-2 text-sm font-semibold text-[#1877f2] transition hover:bg-[#dbeeff]"
                >
                  Quản lý thông báo
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
