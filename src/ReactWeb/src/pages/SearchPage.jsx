import React, { useMemo, useState } from "react";
import { Clapperboard, FileText, MoreHorizontal, Search, ThumbsUp, Users, UsersRound } from "lucide-react";
import Navbar from "../components/Navbar/Navbar";
import { searchGroups, searchPeople, searchPosts, searchQuery, searchReels, searchTabs } from "../data/searchMockData";

const iconMap = {
  Clapperboard,
  FileText,
  Users,
  UsersRound,
};

function SidebarTab({ tab, active, onClick }) {
  const Icon = iconMap[tab.icon] || FileText;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-12 w-full items-center gap-3 rounded-lg px-2 text-left ${
        active ? "bg-[#e7f3ff] text-[#0866ff]" : "text-[#050505] hover:bg-[#f2f2f2]"
      }`}
    >
      <span className={`flex h-9 w-9 items-center justify-center rounded-full ${active ? "bg-[#0866ff] text-white" : "bg-[#e4e6eb]"}`}>
        <Icon size={18} />
      </span>
      <span className="text-[14px] font-semibold">{tab.label}</span>
    </button>
  );
}

function SearchSidebar({ activeTab, onTabChange }) {
  return (
    <aside className="fixed left-0 top-14 z-20 hidden h-[calc(100vh-56px)] w-[280px] overflow-y-auto border-r border-[#dddfe2] bg-white p-2 lg:block">
      <h1 className="px-1 py-2 text-[22px] font-bold">Search results</h1>
      <div className="my-2 border-t border-[#dddfe2]" />
      <div className="px-1 pb-2 text-[13px] font-semibold text-[#65676b]">Filters</div>
      <div className="space-y-1">
        {searchTabs.map((tab) => (
          <SidebarTab key={tab.key} tab={tab} active={activeTab === tab.key} onClick={() => onTabChange(tab.key)} />
        ))}
      </div>
    </aside>
  );
}

function GroupResult({ group }) {
  return (
    <article className="grid grid-cols-[56px_1fr_auto] gap-3 py-2">
      <img src={group.image} alt="" className="h-14 w-14 rounded-md object-cover" />
      <div className="min-w-0">
        <h3 className="truncate text-[15px] font-bold">{group.name}</h3>
        <p className="text-[12px] text-[#65676b]">
          {group.privacy} · {group.members}
          {group.postsToday ? ` · ${group.postsToday}` : ""}
        </p>
        <p className="line-clamp-1 text-[12px] text-[#65676b]">{group.description}</p>
        {group.mutual && <p className="mt-1 text-[12px] text-[#65676b]">{group.mutual}</p>}
      </div>
      <button type="button" className="self-center rounded-md bg-[#e7f3ff] px-4 py-2 text-[13px] font-semibold text-[#0866ff] hover:bg-[#dbeeff]">
        Join
      </button>
    </article>
  );
}

function GroupsCard() {
  return (
    <section className="rounded-lg border border-[#dddfe2] bg-white p-4 shadow-sm">
      <h2 className="text-[18px] font-bold">Groups</h2>
      <div className="mt-2 divide-y divide-[#f0f2f5]">
        {searchGroups.map((group) => (
          <GroupResult key={group.id} group={group} />
        ))}
      </div>
      <button type="button" className="mt-3 h-9 w-full rounded-md bg-[#e4e6eb] text-[13px] font-semibold hover:bg-[#d8dadf]">
        See all
      </button>
    </section>
  );
}

function ImageGrid({ images }) {
  return (
    <div className="mt-3 grid grid-cols-3 gap-1 overflow-hidden rounded-md">
      <img src={images[0]} alt="" className="col-span-2 row-span-2 aspect-square h-full w-full object-cover" />
      <img src={images[1]} alt="" className="aspect-square w-full object-cover" />
      <img src={images[2]} alt="" className="aspect-square w-full object-cover" />
      <img src={images[3]} alt="" className="aspect-square w-full object-cover" />
      <div className="relative">
        <img src={images[4]} alt="" className="aspect-square w-full object-cover" />
        <div className="absolute inset-0 flex items-center justify-center bg-black/45 text-[28px] font-bold text-white">+10</div>
      </div>
    </div>
  );
}

function PostCard({ post }) {
  return (
    <article className="rounded-lg border border-[#dddfe2] bg-white shadow-sm">
      <div className="p-4">
        <div className="mb-2 text-[13px]">
          <span className="font-bold">{post.actor}</span> is a member.
        </div>
        <div className="flex items-start gap-2">
          <img src={post.avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <h3 className="truncate text-[14px] font-bold">{post.group} · <span className="text-[#0866ff]">Join</span></h3>
                <p className="text-[12px] text-[#65676b]">{post.time}</p>
              </div>
              <MoreHorizontal size={20} className="text-[#65676b]" />
            </div>
            <p className="mt-3 text-[13px] leading-relaxed">{post.content}</p>
          </div>
        </div>
      </div>
      <ImageGrid images={post.images} />
      <div className="flex items-center justify-between border-t border-[#dddfe2] px-4 py-2 text-[13px] text-[#65676b]">
        <div className="flex items-center gap-5">
          <span className="flex items-center gap-1"><ThumbsUp size={16} /> {post.reactions}</span>
          <span>{post.comments}</span>
          <span>{post.shares}</span>
        </div>
        <div className="flex -space-x-1">
          <span className="h-4 w-4 rounded-full bg-[#0866ff]" />
          <span className="h-4 w-4 rounded-full bg-[#f02849]" />
        </div>
      </div>
    </article>
  );
}

function PostsResults() {
  return (
    <div className="space-y-3">
      <GroupsCard />
      {searchPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

function PeopleResults() {
  return (
    <section className="rounded-lg border border-[#dddfe2] bg-white p-4 shadow-sm">
      <h2 className="text-[18px] font-bold">People</h2>
      <div className="mt-2 divide-y divide-[#f0f2f5]">
        {searchPeople.map((person) => (
          <article key={person.id} className="grid grid-cols-[56px_1fr_auto] gap-3 py-3">
            <img src={person.avatar} alt="" className="h-14 w-14 rounded-full object-cover" />
            <div>
              <h3 className="text-[15px] font-bold">{person.name}</h3>
              <p className="text-[13px] text-[#65676b]">{person.note}</p>
            </div>
            <button type="button" className="self-center rounded-md bg-[#e4e6eb] px-4 py-2 text-[13px] font-semibold hover:bg-[#d8dadf]">
              See
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function GroupsResults() {
  return <GroupsCard />;
}

function ReelsResults() {
  return (
    <section className="rounded-lg border border-[#dddfe2] bg-white p-4 shadow-sm">
      <h2 className="text-[18px] font-bold">Reels</h2>
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {searchReels.map((reel) => (
          <article key={reel.id} className="overflow-hidden rounded-lg border border-[#dddfe2]">
            <img src={reel.image} alt="" className="aspect-[9/14] w-full object-cover" />
            <div className="p-3">
              <h3 className="line-clamp-2 text-[14px] font-bold">{reel.title}</h3>
              <p className="mt-1 text-[12px] text-[#65676b]">{reel.author}</p>
              <p className="text-[12px] text-[#65676b]">{reel.views}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function SearchPage() {
  const [activeTab, setActiveTab] = useState("posts");
  const title = useMemo(() => searchTabs.find((tab) => tab.key === activeTab)?.label || "Posts", [activeTab]);

  return (
    <div className="min-h-screen bg-[#f0f2f5] text-[#050505]">
      <Navbar />
      <SearchSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="pt-14 lg:pl-[280px]">
        <div className="mx-auto w-full max-w-[620px] px-3 py-6">
          <div className="mb-3 flex items-center gap-2 rounded-lg bg-white p-3 shadow-sm ring-1 ring-[#dddfe2] lg:hidden">
            <Search size={16} className="text-[#65676b]" />
            <span className="text-[14px] text-[#65676b]">{searchQuery}</span>
          </div>
          <h1 className="mb-3 text-[20px] font-bold lg:hidden">{title}</h1>
          {activeTab === "posts" && <PostsResults />}
          {activeTab === "people" && <PeopleResults />}
          {activeTab === "groups" && <GroupsResults />}
          {activeTab === "reels" && <ReelsResults />}
        </div>
      </main>
    </div>
  );
}
