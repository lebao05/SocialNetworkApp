import {
  Badge,
  ChevronDown,
  FileText,
  Filter,
  MoreHorizontal,
  Search,
  Settings,
  Shield,
  UserPlus,
  Users,
} from "lucide-react";
import { adminActivityLog, groupRules } from "../../data/groupMockData";

function AdminShell({ title, filters, children, actions }) {
  return (
    <main className="min-h-[calc(100vh-56px)] bg-[#f0f2f5] pt-14 lg:pl-[292px]">
      <div className="border-b border-[#d8dadf] bg-white">
        <div className="mx-auto max-w-[760px] px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-[22px] font-bold">{title}</h1>
            {actions}
          </div>
          {filters && <div className="mt-3 flex flex-wrap items-center gap-2">{filters}</div>}
        </div>
      </div>
      <div className="mx-auto max-w-[760px] px-4 py-4">{children}</div>
    </main>
  );
}

function FilterButton({ children, disabled = false }) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={`flex h-9 items-center gap-1 rounded-md px-3 text-[13px] font-semibold ${
        disabled ? "bg-[#e4e6eb] text-[#bcc0c4]" : "bg-[#e4e6eb] text-[#050505] hover:bg-[#d8dadf]"
      }`}
    >
      {children}
      {!disabled && <ChevronDown size={14} />}
    </button>
  );
}

function EmptyState({ icon = "people", title, description, buttonLabel }) {
  const Icon = icon === "people" ? Users : FileText;

  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
      <Icon size={72} className="mb-4 text-[#8a8d91]" fill="currentColor" strokeWidth={1.5} />
      <h2 className="text-[18px] font-bold text-[#65676b]">{title}</h2>
      {description && <p className="mt-1 max-w-[420px] text-[13px] leading-snug text-[#65676b]">{description}</p>}
      {buttonLabel && (
        <button type="button" className="mt-4 h-9 rounded-md bg-[#0866ff] px-4 text-[13px] font-semibold text-white hover:bg-[#075ce5]">
          {buttonLabel}
        </button>
      )}
    </div>
  );
}

function SearchFilters() {
  return (
    <>
      <div className="flex h-9 min-w-[280px] flex-1 items-center gap-2 rounded-full bg-[#f0f2f5] px-3 text-[#65676b]">
        <Search size={16} />
        <span className="text-[13px]">Tim kiem theo ten</span>
      </div>
      <FilterButton>Moi nhat truoc</FilterButton>
      <FilterButton disabled>Xoa bo loc</FilterButton>
      <FilterButton>Thoi gian yeu cau</FilterButton>
      <FilterButton>Ngay tham gia Facebook</FilterButton>
      <FilterButton>Gioi tinh</FilterButton>
      <FilterButton>Anh dai dien</FilterButton>
      <FilterButton>Bo loc khac</FilterButton>
    </>
  );
}

function OverviewView() {
  const reviewItems = [
    ["Noi dung bi thanh vien bao cao", 0],
    ["Thong bao kiem duyet", 0],
    ["Bai viet dang cho", 0],
    ["Yeu cau lam thanh vien", 0],
    ["Trang thai nhom", 0],
  ];

  return (
    <AdminShell title="Tong quan">
      <section className="rounded-lg border border-[#dddfe2] bg-white p-4 shadow-sm">
        <h2 className="text-[17px] font-bold">Can xem xet</h2>
        <p className="text-[13px] text-[#65676b]">0 thong tin moi can xem xet</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {reviewItems.map(([label, count]) => (
            <button key={label} type="button" className="flex items-center justify-between rounded-md p-2 text-left hover:bg-[#f2f2f2]">
              <span className="text-[13px] font-semibold">{label}</span>
              <span className="text-[18px] font-bold">{count}</span>
            </button>
          ))}
        </div>
      </section>
    </AdminShell>
  );
}

function MemberRequestsView() {
  return (
    <AdminShell
      title="Yeu cau lam thanh vien"
      actions={
        <button type="button" className="flex h-9 items-center gap-2 rounded-md bg-[#e4e6eb] px-3 hover:bg-[#d8dadf]">
          <Filter size={16} />
          <ChevronDown size={14} />
        </button>
      }
      filters={<SearchFilters />}
    >
      <EmptyState icon="people" title="Khong co thanh vien dang cho nao" />
    </AdminShell>
  );
}

function PendingPostsView({ type }) {
  const copy = {
    "pending-posts": {
      title: "Bai viet dang cho",
      empty: "Chua co bai viet nao de xem xet",
      description: "Bai viet khong can duoc quan tri vien phe duyet truoc khi dang. Ban co the thay doi lua chon nay trong phan cai dat nhom.",
      button: "Di den phan cai dat",
    },
    spam: {
      title: "Co the la spam",
      empty: "Khong co bai viet nao co the la spam",
    },
    "reported-content": {
      title: "Noi dung bi thanh vien bao cao",
      empty: "Khong co noi dung nao bi thanh vien bao cao",
      description: "Ban co the xem xet noi dung ma thanh vien bao cao cho quan tri vien nhom tai day.",
    },
    "moderation-alerts": {
      title: "Thong bao kiem duyet",
      empty: "Khong co thong bao kiem duyet nao",
    },
  }[type];

  return (
    <AdminShell title={copy.title} filters={<><FilterButton>Moi nhat dau tien</FilterButton><FilterButton>Tat ca</FilterButton></>}>
      <EmptyState icon="file" title={copy.empty} description={copy.description} buttonLabel={copy.button} />
    </AdminShell>
  );
}

function ActivityLogView() {
  const days = [...new Set(adminActivityLog.map((item) => item.day))];

  return (
    <AdminShell
      title="Nhat ky hoat dong"
      filters={
        <>
          <FilterButton disabled>Xoa bo loc</FilterButton>
          <FilterButton>Chon ngay</FilterButton>
          <FilterButton>Quan tri vien va nguoi kiem duyet</FilterButton>
          <FilterButton>Thanh vien</FilterButton>
          <FilterButton>Thanh vien cu</FilterButton>
          <FilterButton>Bo loc khac</FilterButton>
        </>
      }
    >
      <div className="space-y-3">
        {days.map((day) => (
          <section key={day} className="rounded-lg border border-[#dddfe2] bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-[14px] font-bold">{day}</h2>
            <div className="space-y-3">
              {adminActivityLog
                .filter((item) => item.day === day)
                .map((item, index) => (
                  <div key={item.id} className="grid grid-cols-[40px_1fr_auto] items-center gap-3">
                    <img src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${item.seed}`} alt="" className="h-10 w-10 rounded-full bg-[#e4e6eb]" />
                    <div>
                      <div className="text-[13px]">
                        <span className="font-bold">{item.actor}</span> {item.action}
                      </div>
                      <div className="text-[12px] text-[#65676b]">{item.time}</div>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" className="h-9 rounded-md bg-[#e4e6eb] px-4 text-[13px] font-semibold hover:bg-[#d8dadf]">Them ghi chu</button>
                      {index !== 1 && <button type="button" className="h-9 rounded-md bg-[#e4e6eb] px-4 text-[13px] font-semibold hover:bg-[#d8dadf]">Hoan tac</button>}
                    </div>
                  </div>
                ))}
            </div>
          </section>
        ))}
      </div>
    </AdminShell>
  );
}

function RulesView() {
  return (
    <AdminShell title="Quy tac nhom">
      <div className="space-y-3">
        <section className="flex items-center justify-between rounded-lg border border-[#dddfe2] bg-white p-4 shadow-sm">
          <h2 className="text-[16px] font-bold">Quy tac nhom</h2>
          <button type="button" className="text-[13px] font-semibold text-[#0866ff]">Tao</button>
        </section>
        <section className="rounded-lg border border-[#dddfe2] bg-white p-4 shadow-sm">
          {groupRules.slice(0, 1).map((rule, index) => (
            <div key={rule.title} className="grid grid-cols-[24px_24px_1fr_32px] items-start gap-3">
              <span className="text-[#8a8d91]">::</span>
              <span className="text-[13px] font-semibold">{index + 1}</span>
              <div>
                <h3 className="text-[14px] font-bold">{rule.title.replace("Hay tu te va lich su", "Hanh su")}</h3>
                <p className="mt-1 text-[12px] text-[#65676b]">Ton trong nguoi khac</p>
              </div>
              <MoreHorizontal size={18} className="text-[#65676b]" />
            </div>
          ))}
        </section>
      </div>
    </AdminShell>
  );
}

function RolesView() {
  return (
    <AdminShell title="Vai tro trong cong dong">
      <section className="mx-auto max-w-[560px] rounded-lg border border-[#dddfe2] bg-white p-4 shadow-sm">
        <h2 className="text-[18px] font-bold">Vai tro tieu chuan</h2>
        <p className="text-[13px] text-[#65676b]">Co cac trach nhiem da xac dinh san, khong tuy chinh duoc.</p>
        <div className="mt-4 divide-y divide-[#dddfe2]">
          {[
            ["Quan tri vien", "1 thanh vien", Shield],
            ["Nguoi kiem duyet", "0 thanh vien", Badge],
          ].map(([label, value, Icon]) => (
            <button key={label} type="button" className="flex w-full items-center gap-3 py-3 text-left">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e4e6eb]">
                <Icon size={17} />
              </span>
              <span className="flex-1">
                <span className="block text-[14px] font-bold">{label}</span>
                <span className="block text-[12px] text-[#65676b]">{value}</span>
              </span>
              <ChevronDown size={18} className="-rotate-90 text-[#65676b]" />
            </button>
          ))}
        </div>
      </section>
    </AdminShell>
  );
}

function GenericManageView({ title }) {
  return (
    <AdminShell title={title}>
      <EmptyState icon="file" title={`Chua co noi dung trong ${title.toLowerCase()}`} />
    </AdminShell>
  );
}

export default function GroupAdminManage({ view }) {
  if (view === "overview") return <OverviewView />;
  if (view === "member-requests") return <MemberRequestsView />;
  if (["pending-posts", "spam", "reported-content", "moderation-alerts"].includes(view)) return <PendingPostsView type={view} />;
  if (view === "activity-log") return <ActivityLogView />;
  if (view === "group-rules") return <RulesView />;
  if (view === "community-roles") return <RolesView />;

  const titles = {
    "admin-support": "Ho tro quan tri",
    "badge-requests": "Yeu cau huy hieu",
    "member-questions": "Cau hoi chon thanh vien",
    "scheduled-posts": "Bai viet da len lich",
    "group-status": "Trang thai nhom",
    help: "Trung tam tro giup",
  };

  return <GenericManageView title={titles[view] || "Quan ly"} />;
}
