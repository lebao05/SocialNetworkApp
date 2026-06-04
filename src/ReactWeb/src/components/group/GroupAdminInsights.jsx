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

function DailyChart({ data = [], metric = "Posts" }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-[230px] items-center justify-center text-[13px] text-[#65676b]">
        No data to display
      </div>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.posts + d.comments + d.reactions), 1);

  const width = 560;
  const height = 230;
  const padding = { top: 10, right: 20, bottom: 36, left: 10 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const xScale = (i) => padding.left + (i / (data.length - 1 || 1)) * chartWidth;
  const yScale = (v) => padding.top + chartHeight - (v / maxValue) * chartHeight;

  const postsPoints = data.map((d, i) => `${xScale(i)},${yScale(d.posts)}`).join(" ");
  const commentsPoints = data.map((d, i) => `${xScale(i)},${yScale(d.comments)}`).join(" ");
  const reactionsPoints = data.map((d, i) => `${xScale(i)},${yScale(d.reactions)}`).join(" ");
  const allPoints = data.map((d, i) => `${xScale(i)},${yScale(d.posts + d.comments + d.reactions)}`).join(" ");

  const metricConfig = {
    Posts:     { key: "posts",     color: "#0866ff", label: "Posts" },
    Comments:  { key: "comments",  color: "#42b72a", label: "Comments" },
    Reactions: { key: "reactions", color: "#f33e58", label: "Reactions" },
    All:       { key: "all",       color: "#0866ff", label: "All" },
  };
  const cfg = metricConfig[metric] || metricConfig.Posts;

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("vi-VN", { day: "numeric", month: "short" });
  };

  return (
    <div className="relative mt-4">
      {/* Legend */}
      <div className="mb-2 flex items-center gap-4 text-[11px]">
        {["Posts", "Comments", "Reactions"].map((m) => (
          <span key={m} className="flex items-center gap-1">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: metricConfig[m].color }}
            />
            {m}
          </span>
        ))}
      </div>

      <svg className="w-full" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((t) => {
          const y = padding.top + chartHeight * (1 - t);
          return (
            <line
              key={t}
              x1={padding.left}
              x2={width - padding.right}
              y1={y}
              y2={y}
              stroke="#e4e6eb"
              strokeWidth="1"
            />
          );
        })}

        {/* Lines */}
        {metric === "All" ? (
          <>
            <polyline points={postsPoints} fill="none" stroke="#0866ff" strokeWidth="2" />
            <polyline points={commentsPoints} fill="none" stroke="#42b72a" strokeWidth="2" />
            <polyline points={reactionsPoints} fill="none" stroke="#f33e58" strokeWidth="2" />
          </>
        ) : (
          <polyline
            points={cfg.key === "all" ? allPoints : data.map((d, i) => `${xScale(i)},${yScale(d[cfg.key])}`).join(" ")}
            fill="none"
            stroke={cfg.color}
            strokeWidth="2.5"
          />
        )}
      </svg>

      {/* X-axis labels */}
      <div className="mt-1 flex justify-between px-1 text-[11px] text-[#65676b]">
        {data
          .filter((_, i) => {
            if (data.length <= 4) return true;
            return i === 0 || i === data.length - 1 || i === Math.floor(data.length / 2);
          })
          .map((d) => {
            const origIndex = data.findIndex((x) => x === d);
            return (
              <span key={origIndex} className={origIndex === 0 ? "text-left" : origIndex === data.length - 1 ? "text-right" : "text-center"}>
                {formatDate(d.date)}
              </span>
            );
          })}
      </div>
    </div>
  );
}

function ChartCard({ title, subtitle, chartData = [], activeMetric = "Posts", children }) {
  return (
    <section className="rounded-lg border border-[#dddfe2] bg-white p-4 shadow-sm">
      <h2 className="text-[15px] font-bold">
        {title} <Info size={14} className="inline text-[#65676b]" fill="currentColor" />
      </h2>
      {subtitle && <p className="text-[12px] text-[#65676b]">{subtitle}</p>}
      <DailyChart data={chartData} metric={activeMetric} />
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
          subtitle="Members in the selected period"
        />
        <ChartCard
          title={`${pending} pending membership requests`}
          subtitle="Requests awaiting review"
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
  const { posts, comments, reactions, activeMembers, topDays, peakHours, engagementChart } = insights;
  const [activeMetric, setActiveMetric] = useState("Posts");
  const metricButtons = ["Posts", "Comments", "Reactions", "All"];

  return (
    <main className="min-h-[calc(100vh-56px)] bg-[#f0f2f5] pt-14 lg:pl-[292px]">
      <div className="mx-auto max-w-[760px] space-y-3 px-4 py-4">
        <section className="rounded-lg border border-[#dddfe2] bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-[15px] font-bold">
                {posts.toLocaleString()} posts &middot; {comments.toLocaleString()} comments &middot; {reactions.toLocaleString()} reactions <Info size={14} className="inline text-[#65676b]" />
              </h2>
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
          <DailyChart data={engagementChart} metric={activeMetric} />
        </section>

        <ChartCard
          title={`${activeMembers.toLocaleString()} active members`}
          subtitle="Members who interacted in the selected period"
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
