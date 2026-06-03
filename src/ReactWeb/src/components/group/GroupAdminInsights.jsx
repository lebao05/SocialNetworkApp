import { useState } from "react";
import { Download, Info, Shield, Users } from "lucide-react";
import { useGroupInsights } from "../../hooks/useGroupInsights";

function TopBar({ fromDate, toDate, onDateRangeChange, onExport }) {
  return (
    <div className="border-b border-[#d8dadf] bg-white">
      <div className="mx-auto flex max-w-[760px] items-center justify-between px-4 py-4">
        <input
          type="date"
          value={fromDate || ""}
          onChange={(e) => onDateRangeChange(e.target.value || null, toDate)}
          className="h-9 cursor-pointer rounded-md border border-[#d8dadf] bg-white px-3 text-[13px] font-semibold"
        />
        <span className="text-[13px] text-[#65676b]">to</span>
        <input
          type="date"
          value={toDate || ""}
          onChange={(e) => onDateRangeChange(fromDate, e.target.value || null)}
          className="h-9 cursor-pointer rounded-md border border-[#d8dadf] bg-white px-3 text-[13px] font-semibold"
        />
        <button
          type="button"
          onClick={onExport}
          className="flex h-9 items-center gap-2 rounded-md bg-[#e4e6eb] px-3 text-[13px] font-semibold hover:bg-[#d8dadf]"
        >
          <Download size={15} />
          Export
        </button>
      </div>
    </div>
  );
}

function LineChart({ spike = true }) {
  return (
    <div className="relative mt-4 h-[230px]">
      <div className="absolute inset-x-0 top-0 border-t border-[#ced0d4]" />
      <div className="absolute inset-x-0 bottom-9 border-t border-[#ced0d4]" />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 560 230" preserveAspectRatio="none">
        <polyline
          points={spike ? "16,186 150,186 280,186 420,186 520,186 544,46" : "16,186 150,186 280,186 420,186 544,186"}
          fill="none"
          stroke="#0866ff"
          strokeWidth="3"
        />
      </svg>
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 text-[12px] text-[#65676b]">
        <span>3 Thang 5</span>
        <span>10 Thang 5</span>
        <span>17 Thang 5</span>
        <span>24 Thang 5</span>
      </div>
      <span className="absolute right-0 top-[-6px] text-[12px] text-[#65676b]">1</span>
      <span className="absolute bottom-9 right-0 text-[12px] text-[#65676b]">0</span>
    </div>
  );
}

function ChartCard({ title, subtitle, spike = true, children }) {
  return (
    <section className="rounded-lg border border-[#dddfe2] bg-white p-4 shadow-sm">
      <h2 className="text-[15px] font-bold">
        {title} <Info size={14} className="inline text-[#65676b]" fill="currentColor" />
      </h2>
      {subtitle && <p className="text-[12px] text-[#65676b]">{subtitle}</p>}
      <LineChart spike={spike} />
      {children}
    </section>
  );
}

function GrowthView({ insights }) {
  const { totalMembers, requests, reviewed, approved, declined } = insights;
  const pending = Math.max(0, requests - reviewed);

  return (
    <main className="min-h-[calc(100vh-56px)] bg-[#f0f2f5] pt-14 lg:pl-[292px]">
      <div className="mx-auto max-w-[760px] space-y-3 px-4 py-4">
        <ChartCard
          title={`Total members: ${totalMembers.toLocaleString()}`}
          subtitle="29 May 2026"
        />
        <ChartCard
          title={`${pending} pending membership requests`}
          subtitle="2 May 2026 - 29 May 2026"
          spike={false}
        >
          <button
            type="button"
            className="mt-3 h-9 w-full cursor-pointer rounded-md bg-[#e4e6eb] text-[13px] font-semibold hover:bg-[#d8dadf]"
          >
            View all requests
          </button>
        </ChartCard>
        <section className="rounded-lg border border-[#dddfe2] bg-white p-4 shadow-sm">
          <h2 className="text-[15px] font-bold">
            Reviewed: {reviewed} requests <Info size={14} className="inline text-[#65676b]" />
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              ["Approved", approved],
              ["Declined", declined],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg bg-[#f0f2f5] p-4">
                <div className="text-[13px] text-[#65676b]">{label}</div>
                <div className="mt-1 text-[34px] font-bold leading-none text-[#1c1e21]">
                  {value?.toLocaleString?.() ?? value}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function EngagementView({ insights }) {
  const { posts, comments, reactions, activeMembers, topDays, peakHours } = insights;
  const [activeMetric, setActiveMetric] = useState("Posts");
  const metricButtons = ["Posts", "Comments", "Reactions", "All"];
  const metricValues = { Posts: posts, Comments: comments, Reactions: reactions, All: null };

  return (
    <main className="min-h-[calc(100vh-56px)] bg-[#f0f2f5] pt-14 lg:pl-[292px]">
      <div className="mx-auto max-w-[760px] space-y-3 px-4 py-4">
        <section className="rounded-lg border border-[#dddfe2] bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-[15px] font-bold">
                {posts.toLocaleString()} posts <Info size={14} className="inline text-[#65676b]" />
              </h2>
              <p className="text-[12px] text-[#65676b]">2 May 2026 - 29 May 2026</p>
            </div>
            <div className="flex gap-2">
              {metricButtons.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setActiveMetric(item)}
                  className={`h-8 cursor-pointer rounded-full px-3 text-[12px] font-semibold ${
                    activeMetric === item ? "bg-[#e7f3ff] text-[#0866ff]" : "bg-[#e4e6eb]"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <LineChart spike={false} />
        </section>

        <ChartCard
          title={`${activeMembers.toLocaleString()} active members`}
          subtitle="2 May 2026 - 29 May 2026"
        />

        <div className="grid gap-3 md:grid-cols-2">
          <section className="rounded-lg border border-[#dddfe2] bg-white p-4 shadow-sm">
            <h2 className="text-[15px] font-bold">
              Top activity days <Info size={14} className="inline text-[#65676b]" />
            </h2>
            {topDays.length > 0 ? (
              <div className="mt-4 space-y-2">
                {topDays.map((day) => (
                  <div
                    key={day.label}
                    className="flex items-center justify-between rounded-md bg-[#f0f2f5] p-3"
                  >
                    <span className="text-[13px] font-semibold">{day.label}</span>
                    <span className="text-[13px] font-bold">
                      {day.count?.toLocaleString?.() ?? day.count}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-[13px] font-semibold text-[#65676b]">No data to display</p>
            )}
          </section>
          <section className="rounded-lg border border-[#dddfe2] bg-white p-4 text-center shadow-sm">
            <h2 className="text-left text-[15px] font-bold">
              Peak hours <Info size={14} className="inline text-[#65676b]" />
            </h2>
            {peakHours.length > 0 ? (
              <div className="mt-4 space-y-2">
                {peakHours.map((hour) => (
                  <div
                    key={hour.label}
                    className="flex items-center justify-between rounded-md bg-[#f0f2f5] p-3"
                  >
                    <span className="text-[13px] font-semibold">{hour.label}</span>
                    <span className="text-[13px] font-bold">
                      {hour.count?.toLocaleString?.() ?? hour.count}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-16 text-[13px] font-semibold text-[#65676b]">No data to display</p>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

function PeopleMetricView({ type, insights }) {
  const isAdmins = type === "admins";
  const title = isAdmins ? "Admins & Moderators" : "Members";
  const rows = isAdmins
    ? insights.admins ?? []
    : [
        { label: "Total members", value: insights.totalMembers },
        { label: "Active members", value: insights.activeMembers },
        { label: "New members this week", value: insights.newMembersThisWeek ?? 0 },
      ];

  return (
    <main className="min-h-[calc(100vh-56px)] bg-[#f0f2f5] pt-14 lg:pl-[292px]">
      <div className="border-b border-[#d8dadf] bg-white">
        <div className="mx-auto max-w-[760px] px-4 py-4">
          <h1 className="text-[22px] font-bold">{title}</h1>
        </div>
      </div>
      <div className="mx-auto max-w-[560px] px-4 py-4">
        <section className="rounded-lg border border-[#dddfe2] bg-white p-4 shadow-sm">
          <div className="space-y-1">
            {rows.map((row) => (
              <div key={row.label} className="flex items-center gap-3 rounded-md p-3 hover:bg-[#f2f2f2]">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e4e6eb]">
                  {isAdmins ? <Shield size={17} /> : <Users size={17} />}
                </span>
                <span className="flex-1 text-[14px] font-bold">{row.label}</span>
                <span className="text-[15px] font-bold">
                  {row.value?.toLocaleString?.() ?? row.value ?? 0}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

export default function GroupAdminInsights({ view, groupId }) {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const { insights, loading, error, fetchInsights } = useGroupInsights(groupId, {
    fromDate,
    toDate,
  });

  const handleDateRangeChange = (newFrom, newTo) => {
    setFromDate(newFrom);
    setToDate(newTo);
  };

  const handleExport = () => {
    const csv = [
      ["Metric", "Value"],
      ["Total Members", insights.totalMembers],
      ["Requests", insights.requests],
      ["Reviewed", insights.reviewed],
      ["Approved", insights.approved],
      ["Declined", insights.declined],
      ["Posts", insights.posts],
      ["Comments", insights.comments],
      ["Reactions", insights.reactions],
      ["Active Members", insights.activeMembers],
    ]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `group-insights-${groupId}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <main className="min-h-[calc(100vh-56px)] bg-[#f0f2f5] pt-14 lg:pl-[292px]">
        <div className="flex items-center justify-center pt-20 text-[14px] text-[#65676b]">
          Loading insights...
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-[calc(100vh-56px)] bg-[#f0f2f5] pt-14 lg:pl-[292px]">
        <div className="mx-auto max-w-[760px] px-4 py-4">
          <p className="text-[14px] text-red-600">{error}</p>
          <button
            type="button"
            onClick={fetchInsights}
            className="mt-2 h-9 cursor-pointer rounded-md bg-[#0866ff] px-4 text-[13px] font-semibold text-white hover:bg-[#0056d4]"
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

  return (
    <>
      <TopBar
        fromDate={fromDate}
        toDate={toDate}
        onDateRangeChange={handleDateRangeChange}
        onExport={handleExport}
      />
      {view === "engagement" && <EngagementView insights={insights} />}
      {(view === "admins" || view === "members") && <PeopleMetricView type={view} insights={insights} />}
      {(view === "growth" || view === undefined) && <GrowthView insights={insights} />}
    </>
  );
}
