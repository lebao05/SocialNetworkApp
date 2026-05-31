import { Download, Info, Shield, Users } from "lucide-react";
import { insightSummary } from "../../data/groupMockData";

function TopBar() {
  return (
    <div className="border-b border-[#d8dadf] bg-white">
      <div className="mx-auto flex max-w-[760px] items-center justify-between px-4 py-4">
        <button type="button" className="flex h-9 items-center gap-2 rounded-md bg-[#e4e6eb] px-3 text-[13px] font-semibold hover:bg-[#d8dadf]">
          28 ngay qua
          <span className="text-[10px]">▼</span>
        </button>
        <button type="button" className="flex h-9 items-center gap-2 rounded-md bg-[#e4e6eb] px-3 text-[13px] font-semibold hover:bg-[#d8dadf]">
          <Download size={15} />
          Tai xuong
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

function GrowthView() {
  return (
    <main className="min-h-[calc(100vh-56px)] bg-[#f0f2f5] pt-14 lg:pl-[292px]">
      <TopBar />
      <div className="mx-auto max-w-[760px] space-y-3 px-4 py-4">
        <ChartCard title={`Tong so thanh vien: ${insightSummary.growth.totalMembers}`} subtitle="29 Thang 5, 2026" />
        <ChartCard title={`${insightSummary.growth.requests} yeu cau lam thanh vien`} subtitle="2 Thang 5, 2026 - 29 Thang 5, 2026" spike={false}>
          <button type="button" className="mt-3 h-9 w-full rounded-md bg-[#e4e6eb] text-[13px] font-semibold hover:bg-[#d8dadf]">
            Xem tat ca yeu cau lam thanh vien
          </button>
        </ChartCard>
        <section className="rounded-lg border border-[#dddfe2] bg-white p-4 shadow-sm">
          <h2 className="text-[15px] font-bold">Da xem xet 0 yeu cau <Info size={14} className="inline text-[#65676b]" /></h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {[
              ["Da phe duyet", insightSummary.growth.approved],
              ["Bi tu choi", insightSummary.growth.declined],
              ["Da chan", insightSummary.growth.blocked],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg bg-[#f0f2f5] p-4">
                <div className="text-[18px] font-bold">{label}</div>
                <div className="mt-2 text-[34px] leading-none text-[#65676b]">{value}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function EngagementView() {
  return (
    <main className="min-h-[calc(100vh-56px)] bg-[#f0f2f5] pt-14 lg:pl-[292px]">
      <TopBar />
      <div className="mx-auto max-w-[760px] space-y-3 px-4 py-4">
        <section className="rounded-lg border border-[#dddfe2] bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-[15px] font-bold">0 bai viet <Info size={14} className="inline text-[#65676b]" /></h2>
              <p className="text-[12px] text-[#65676b]">2 Thang 5, 2026 - 29 Thang 5, 2026</p>
            </div>
            <div className="flex gap-2">
              {["Bai viet", "Binh luan", "Cam xuc", "Tat ca"].map((item, index) => (
                <button key={item} type="button" className={`h-8 rounded-full px-3 text-[12px] font-semibold ${index === 0 ? "bg-[#e7f3ff] text-[#0866ff]" : "bg-[#e4e6eb]"}`}>
                  {item}
                </button>
              ))}
            </div>
          </div>
          <LineChart spike={false} />
        </section>
        <ChartCard title="0 thanh vien dang hoat dong" subtitle="2 Thang 5, 2026 - 29 Thang 5, 2026" />
        <div className="grid gap-3 md:grid-cols-2">
          <section className="rounded-lg border border-[#dddfe2] bg-white p-4 shadow-sm">
            <h2 className="text-[15px] font-bold">Ngay cao diem <Info size={14} className="inline text-[#65676b]" /></h2>
            <div className="mt-24 border-t border-[#ced0d4] pt-2 text-[12px] text-[#65676b]">T2 T3 T4 T5 T6 T7 CN</div>
          </section>
          <section className="rounded-lg border border-[#dddfe2] bg-white p-4 text-center shadow-sm">
            <h2 className="text-left text-[15px] font-bold">Gio cao diem <Info size={14} className="inline text-[#65676b]" /></h2>
            <div className="mt-4 flex justify-center gap-2">
              {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day, index) => (
                <span key={day} className={`rounded-full px-3 py-2 text-[12px] font-semibold ${index === 0 ? "bg-[#e7f3ff] text-[#0866ff]" : "bg-[#e4e6eb]"}`}>{day}</span>
              ))}
            </div>
            <p className="mt-24 text-[13px] font-semibold text-[#65676b]">Khong co du lieu de hien thi</p>
          </section>
        </div>
      </div>
    </main>
  );
}

function PeopleMetricView({ type }) {
  const isAdmins = type === "admins";
  const title = isAdmins ? "Quan tri vien va nguoi kiem duyet" : "Thanh vien";
  const rows = isAdmins ? insightSummary.admins : [
    { label: "Tong thanh vien", value: insightSummary.members.total },
    { label: "Thanh vien hoat dong", value: insightSummary.members.active },
    { label: "Thanh vien moi tuan nay", value: insightSummary.members.newThisWeek },
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
                <span className="text-[15px] font-bold">{row.value}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

export default function GroupAdminInsights({ view }) {
  if (view === "engagement") return <EngagementView />;
  if (view === "admins" || view === "members") return <PeopleMetricView type={view} />;
  return <GrowthView />;
}
