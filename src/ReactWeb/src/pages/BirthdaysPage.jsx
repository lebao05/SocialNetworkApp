import React, { useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import {
  MoreHorizontal,
  Send,
  ChevronDown,
} from "lucide-react";
import { useBirthdays } from "../hooks/useBirthdays";

const DEFAULT_AVATAR = import.meta.env.VITE_DEFAULT_AVATAR;

function BirthdayListItem({ person, note, actionLabel = "Send message" }) {
  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-[#e4e6eb] bg-white p-4 transition hover:shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <img
          src={person.avatarUrl || DEFAULT_AVATAR}
          alt={person.fullName}
          className="h-14 w-14 rounded-full object-cover ring-1 ring-black/5"
        />
        <div className="min-w-0">
          <p className="truncate text-[16px] font-semibold text-[#050505]">{person.fullName}</p>
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
            Showing {friends.length}/{Math.min(totalCount, 10)} of 10 max per month
          </p>
        </div>
        <div className="rounded-full bg-[#f0f2f5] px-3 py-1 text-xs font-semibold text-[#65676b]">{totalCount}</div>
      </div>
      <div className="space-y-3 p-5 sm:p-6">
        {friends.map((person) => (
          <BirthdayListItem
            key={person.userId}
            person={person}
            note={`Day ${person.day} • Turning ${person.ageTurning} • ${person.mutualFriendsCount} mutual friends`}
            actionLabel="Send early wish"
          />
        ))}
      </div>
    </section>
  );
}

export default function BirthdaysPage() {
  const { todayBirthdays, upcomingBirthdays, monthlyBirthdays, allBirthdays, isLoading, error } = useBirthdays();

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <Navbar />

      <div className="pt-14">
        <div className="mx-auto max-w-[1100px] px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
          <div className="mb-6 rounded-2xl border border-[#e4e6eb] bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="text-[28px] font-bold leading-tight text-[#050505]">Birthdays</h1>
                <p className="mt-1 text-[14px] text-[#65676b]">View friends' birthdays throughout the year</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="rounded-full bg-[#e7f3ff] px-3 py-1.5 text-xs font-semibold text-[#1877f2]">
                  {todayBirthdays.length} today
                </div>
                <div className="rounded-full bg-[#f0f2f5] px-3 py-1.5 text-xs font-semibold text-[#65676b]">
                  {monthlyBirthdays.length} months with birthdays
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <SectionCard
              title="Birthdays today"
              subtitle={`${todayBirthdays.length} friends having birthdays today`}
              rightNode={
                <div className="rounded-full bg-[#fff4df] px-3 py-1.5 text-xs font-semibold text-[#b7791f]">
                  Don&apos;t miss a wish
                </div>
              }
            >
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex animate-pulse gap-3 rounded-2xl border border-[#e4e6eb] bg-white p-4">
                      <div className="h-14 w-14 rounded-full bg-gray-200" />
                      <div className="flex-1 space-y-2 pt-2">
                        <div className="h-4 w-32 rounded bg-gray-200" />
                        <div className="h-3 w-48 rounded bg-gray-200" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : todayBirthdays.length > 0 ? (
                <div className="space-y-3">
                  {todayBirthdays.map((person) => (
                    <BirthdayListItem
                      key={person.userId}
                      person={person}
                      note={`Today ${person.fullName} turns ${person.ageTurning} • ${person.mutualFriendsCount} mutual friends`}
                      actionLabel="Send wish"
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-[#d8dadf] bg-[#fafbfc] px-6 py-14 text-center">
                  <h3 className="text-lg font-bold text-[#050505]">No birthdays today</h3>
                  <p className="mt-2 text-sm text-[#65676b]">Check back tomorrow to wish your friends happy birthday.</p>
                </div>
              )}
            </SectionCard>

            <SectionCard
              title="Friends' birthdays this year"
              subtitle="Birthdays grouped by month, up to 10 people per month"
              rightNode={
                <div className="inline-flex items-center gap-2 rounded-full bg-[#f0f2f5] px-3 py-1.5 text-xs font-semibold text-[#65676b]">
                  <ChevronDown size={14} />
                  {monthlyBirthdays.length} months with birthdays
                </div>
              }
            >
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 animate-pulse rounded-2xl border border-[#e4e6eb] bg-gray-100" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {monthlyBirthdays.map((group) => (
                    <MonthSection
                      key={group.month}
                      monthLabel={group.label}
                      friends={group.friends}
                      totalCount={group.totalCount}
                    />
                  ))}
                  {monthlyBirthdays.length === 0 && (
                    <p className="text-sm text-[#65676b]">No upcoming birthdays found.</p>
                  )}
                </div>
              )}
            </SectionCard>

            <section className="rounded-2xl border border-[#e4e6eb] bg-white px-5 py-4 shadow-sm sm:px-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-[20px] font-bold text-[#050505]">All birthdays</h2>
                  <p className="mt-1 text-[14px] text-[#65676b]">{allBirthdays.length} people in your birthday list</p>
                </div>
                <button
                  type="button"
                  className="inline-flex cursor-pointer items-center justify-center rounded-full bg-[#e7f3ff] px-4 py-2 text-sm font-semibold text-[#1877f2] transition hover:bg-[#dbeeff]"
                >
                  Manage notifications
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
