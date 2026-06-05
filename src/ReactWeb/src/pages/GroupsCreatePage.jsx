import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  Circle,
  Globe2,
  LockKeyhole,
  Monitor,
  Smartphone,
  UserCircle,
  Users,
  X,
} from "lucide-react";
import Navbar from "../components/Navbar/Navbar";
import { useAuth } from "../contexts/authContext";
import { useGroup } from "../hooks/useGroup";

const DEFAULT_AVATAR = import.meta.env.VITE_DEFAULT_AVATAR;

const privacyOptions = [
  {
    value: "public",
    label: "Cong khai",
    icon: Globe2,
    description: "Bat ky ai cung co the nhin thay moi nguoi trong nhom va nhung gi ho dang.",
  },
  {
    value: "private",
    label: "Rieng tu",
    icon: LockKeyhole,
    description: "Chi thanh vien moi nhin thay moi nguoi trong nhom va nhung gi ho dang.",
  },
];

function PreviewTab({ children, active = false }) {
  return (
    <button
      type="button"
      className={`h-11 px-4 text-[13px] font-semibold ${active ? "border-b-2 border-[#0866ff] text-[#0866ff]" : "text-[#65676b]"}`}
    >
      {children}
    </button>
  );
}

export default function GroupsCreatePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createGroup, loading, error } = useGroup(null, { autoFetch: false });
  const [groupName, setGroupName] = useState("");
  const [privacy, setPrivacy] = useState("public");
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  const displayUser = useMemo(
    () => ({
      name: user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Le Bao" : "Le Bao",
      avatar: user?.avatarUrl || DEFAULT_AVATAR,
    }),
    [user]
  );
  const selectedPrivacy = privacyOptions.find((option) => option.value === privacy) || privacyOptions[0];
  const SelectedPrivacyIcon = selectedPrivacy.icon;
  const previewName = groupName.trim() || "Ten nhom";

  const handleCreate = async () => {
    const name = groupName.trim();
    if (!name || loading) return;

    const data = await createGroup({
      name,
      isPrivate: privacy === "private",
    });
    const createdGroupId = data?.id ?? data?.Id ?? data;

    navigate(createdGroupId ? `/groups/${createdGroupId}` : "/groups");
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] text-[#050505]">
      <Navbar />

      <aside className="fixed bottom-0 left-0 top-14 z-30 flex w-full flex-col border-r border-[#dddfe2] bg-white shadow-sm sm:w-[360px]">
        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          <p className="text-[12px] text-[#65676b]">Nhom / Tao nhom</p>
          <div className="mt-1 flex items-center justify-between gap-3">
            <h1 className="text-[24px] font-bold">Tao nhom</h1>
            <Link to="/groups" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e4e6eb] hover:bg-[#d8dadf]">
              <X size={20} />
            </Link>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <img src={displayUser.avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
            <div>
              <div className="text-[14px] font-semibold">{displayUser.name}</div>
              <div className="text-[12px] text-[#65676b]">Quan tri vien</div>
            </div>
          </div>

          <label className="mt-6 block">
            <span className="sr-only">Ten nhom</span>
            <input
              value={groupName}
              onChange={(event) => setGroupName(event.target.value)}
              placeholder="Ten nhom"
              className="h-14 w-full rounded-lg border border-[#ccd0d5] px-4 text-[15px] outline-none focus:border-[#0866ff] focus:ring-2 focus:ring-[#0866ff]/25"
            />
          </label>

          <div className="relative mt-3">
            <button
              type="button"
              onClick={() => setIsPrivacyOpen((value) => !value)}
              className="flex h-16 w-full items-center gap-3 rounded-lg border border-[#ccd0d5] px-4 text-left outline-none focus:border-[#0866ff] focus:ring-2 focus:ring-[#0866ff]/25"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e4e6eb]">
                <SelectedPrivacyIcon size={18} fill="currentColor" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[12px] font-semibold text-[#0866ff]">Chon quyen rieng tu</span>
                <span className="block text-[15px] font-semibold">{selectedPrivacy.label}</span>
              </span>
              <ChevronDown size={18} />
            </button>

            {isPrivacyOpen && (
              <div className="absolute left-0 right-0 top-[70px] z-10 rounded-lg bg-white p-2 shadow-xl ring-1 ring-black/10">
                {privacyOptions.map((option) => {
                  const Icon = option.icon;
                  const active = option.value === privacy;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setPrivacy(option.value);
                        setIsPrivacyOpen(false);
                      }}
                      className="flex w-full gap-3 rounded-lg p-3 text-left hover:bg-[#f2f2f2]"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e4e6eb]">
                        <Icon size={18} fill="currentColor" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[15px] font-semibold">{option.label}</span>
                        <span className="block text-[13px] leading-snug text-[#65676b]">{option.description}</span>
                      </span>
                      <span className={`mt-2 flex h-5 w-5 items-center justify-center rounded-full border ${active ? "border-[#0866ff]" : "border-[#8a8d91]"}`}>
                        {active ? <span className="h-3 w-3 rounded-full bg-[#0866ff]" /> : null}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <p className="mt-3 text-[13px] leading-snug text-[#65676b]">
            Bat ky ai cung co the nhin thay moi nguoi trong nhom va nhung gi ho dang. Ban co the thay doi nhom thanh rieng tu sau. Tim hieu them ve{" "}
            <button type="button" className="font-semibold text-[#0866ff] hover:underline">
              quyen rieng tu cua nhom
            </button>
            .
          </p>

          {error && <p className="mt-3 text-[13px] font-semibold text-red-600">{error}</p>}
        </div>

        <div className="border-t border-[#dddfe2] p-4">
          <button
            type="button"
            onClick={handleCreate}
            disabled={!groupName.trim() || loading}
            className="h-10 w-full rounded-md bg-[#0866ff] text-[14px] font-semibold text-white hover:bg-[#075ce5] disabled:cursor-not-allowed disabled:bg-[#e4e6eb] disabled:text-[#bcc0c4]"
          >
            {loading ? "Dang tao..." : "Tao"}
          </button>
        </div>
      </aside>

      <main className="hidden min-h-screen pt-14 sm:block sm:pl-[360px]">
        <div className="flex min-h-[calc(100vh-56px)] items-start justify-center p-8">
          <section className="w-full max-w-[900px] rounded-lg bg-white p-4 shadow-md ring-1 ring-black/10">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[14px] font-bold">Xem truoc tren may tinh</h2>
              <div className="flex items-center gap-2 text-[#65676b]">
                <button type="button" className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e7f3ff] text-[#0866ff]">
                  <Monitor size={18} />
                </button>
                <button type="button" className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[#f2f2f2]">
                  <Smartphone size={18} />
                </button>
              </div>
            </div>

            <div className="overflow-hidden rounded-md border border-[#ccd0d5] bg-[#f0f2f5]">
              <div className="h-[250px] bg-[#d8dadf]">
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#d7d9dd] via-[#f0f2f5] to-[#c8ccd2] text-[#8a8d91]">
                  <Users size={96} strokeWidth={1.2} />
                </div>
              </div>

              <div className="bg-white px-5 py-5">
                <h1 className="text-[28px] font-bold leading-tight">{previewName}</h1>
                <div className="mt-1 flex items-center gap-1 text-[14px] text-[#65676b]">
                  <SelectedPrivacyIcon size={14} fill="currentColor" />
                  <span>Nhom {selectedPrivacy.label}</span>
                  <span>-</span>
                  <span>1 thanh vien</span>
                </div>

                <div className="mt-5 border-t border-[#ced0d4]">
                  <nav className="flex items-center gap-2">
                    <PreviewTab active>Gioi thieu</PreviewTab>
                    <PreviewTab>Bai viet</PreviewTab>
                    <PreviewTab>Thanh vien</PreviewTab>
                    <PreviewTab>Su kien</PreviewTab>
                  </nav>
                </div>
              </div>

              <div className="grid gap-4 bg-[#f0f2f5] p-5 lg:grid-cols-[minmax(0,1fr)_360px]">
                <div className="rounded-lg border border-[#dddfe2] bg-white p-4 opacity-60">
                  <div className="flex items-center gap-3">
                    <UserCircle size={36} className="text-[#bcc0c4]" />
                    <div className="h-10 flex-1 rounded-full bg-[#f0f2f5] px-4 py-3 text-[14px] text-[#8a8d91]">Ban dang nghi gi?</div>
                  </div>
                  <div className="mt-4 grid grid-cols-3 border-t border-[#f0f2f5] pt-3 text-center text-[13px] font-semibold text-[#8a8d91]">
                    <span>Anh/video</span>
                    <span>Gan the nguoi khac</span>
                    <span>Cam xuc/Hoat dong</span>
                  </div>
                </div>

                <aside className="rounded-lg border border-[#dddfe2] bg-white p-4">
                  <h2 className="mb-3 text-[17px] font-bold">Gioi thieu</h2>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <SelectedPrivacyIcon size={18} fill="currentColor" />
                      <div>
                        <div className="text-[14px] font-bold">{selectedPrivacy.label}</div>
                        <div className="text-[13px] leading-snug text-[#65676b]">{selectedPrivacy.description}</div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Circle size={18} fill="currentColor" />
                      <div>
                        <div className="text-[14px] font-bold">Hien thi</div>
                        <div className="text-[13px] leading-snug text-[#65676b]">Ai cung co the tim thay nhom nay.</div>
                      </div>
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
