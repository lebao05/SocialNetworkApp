import { ChevronDown, Edit3 } from "lucide-react";
import { settingsSections } from "../../data/groupMockData";

function RowAction({ action }) {
  if (action === "expand") return <ChevronDown size={18} className="text-[#65676b]" />;
  if (action === "toggle") {
    return (
      <span className="flex h-8 w-14 items-center gap-1 rounded-md bg-[#e4e6eb] px-1">
        <span className="h-5 w-5 rounded-full bg-[#31a24c]" />
        <span className="h-5 w-5 rounded-full border border-[#bcc0c4] bg-[#f0f2f5]" />
      </span>
    );
  }

  return <Edit3 size={18} className="text-[#65676b]" fill="currentColor" />;
}

function SettingsCard({ section }) {
  return (
    <section className="rounded-lg border border-[#dddfe2] bg-white p-4 shadow-sm">
      <h2 className="mb-2 text-[18px] font-bold">{section.title}</h2>
      <div className="divide-y divide-[#ced0d4]">
        {section.rows.map((row) => (
          <button key={row.label} type="button" className="grid w-full grid-cols-[1fr_auto] items-center gap-4 py-3 text-left">
            <span>
              <span className="block text-[13px] font-bold">{row.label}</span>
              {row.value && <span className="block text-[12px] text-[#65676b]">{row.value}</span>}
            </span>
            <RowAction action={row.action} />
          </button>
        ))}
      </div>
    </section>
  );
}

function FeaturesView() {
  return (
    <main className="min-h-[calc(100vh-56px)] bg-[#f0f2f5] pt-14 lg:pl-[292px]">
      <div className="mx-auto max-w-[520px] px-4 py-6">
        <section className="rounded-lg border border-[#dddfe2] bg-white p-4 shadow-sm">
          <h1 className="text-[20px] font-bold">Them tinh nang</h1>
          <p className="mt-1 text-[13px] text-[#65676b]">Chon dinh dang bai viet, huy hieu va cac tinh nang khac cho nhom.</p>
          <div className="mt-4 space-y-2">
            {["Tham gia an danh", "Huy hieu", "Huong dan thanh vien moi", "Chu de bai viet"].map((feature) => (
              <button key={feature} type="button" className="flex h-11 w-full items-center justify-between rounded-md bg-[#f0f2f5] px-3 text-[13px] font-semibold hover:bg-[#e4e6eb]">
                {feature}
                <span className="text-[#0866ff]">Them</span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

export default function GroupAdminSettings({ view }) {
  if (view === "features") return <FeaturesView />;

  return (
    <main className="min-h-[calc(100vh-56px)] bg-[#f0f2f5] pt-14 lg:pl-[292px]">
      <div className="mx-auto max-w-[520px] space-y-3 px-4 py-4">
        {settingsSections.map((section) => (
          <SettingsCard key={section.title} section={section} />
        ))}
      </div>
    </main>
  );
}
