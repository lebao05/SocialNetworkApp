import { useState, useEffect } from "react";
import { Edit3, Globe, Lock, ShieldAlert, Users, X, Info } from "lucide-react";
import { useGroup } from "../../hooks/useGroup";

export default function GroupAdminSettings({ view, groupId }) {
  const { groupDetail, loading, error, updateGroup } = useGroup(groupId);
  const [activeModal, setActiveModal] = useState(null); // 'name-desc' | 'privacy' | 'join-approval' | 'post-approval' | 'anonymous-post' | null
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isPrivate: false,
    isGroupJoinApprovalRequired: false,
    isPostApprovalRequired: false,
    allowAnonymousPost: false,
  });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  // Initialize form data when groupDetail changes
  useEffect(() => {
    if (groupDetail) {
      const isPrivate = groupDetail.privacyType === 1 || groupDetail.PrivacyType === 1 || groupDetail.isPrivate === true;
      setFormData({
        name: groupDetail.name || groupDetail.Name || "",
        description: groupDetail.description || groupDetail.Description || "",
        isPrivate: isPrivate,
        isGroupJoinApprovalRequired: groupDetail.isGroupJoinApprovalRequired ?? groupDetail.IsGroupJoinApprovalRequired ?? false,
        isPostApprovalRequired: groupDetail.isPostApprovalRequired ?? groupDetail.IsPostApprovalRequired ?? false,
        allowAnonymousPost: groupDetail.allowAnonymousPost ?? groupDetail.AllowAnonymousPost ?? false,
      });
    }
  }, [groupDetail]);

  if (loading && !groupDetail) {
    return (
      <main className="min-h-[calc(100vh-56px)] bg-[#f0f2f5] pt-14 lg:pl-[292px] flex items-center justify-center">
        <div className="text-[15px] text-[#65676b] font-medium">Loading group settings...</div>
      </main>
    );
  }

  if (error && !groupDetail) {
    return (
      <main className="min-h-[calc(100vh-56px)] bg-[#f0f2f5] pt-14 lg:pl-[292px] flex items-center justify-center">
        <div className="max-w-[400px] text-center p-6 bg-white border border-[#dddfe2] rounded-lg shadow-sm">
          <ShieldAlert className="mx-auto text-red-500 mb-3" size={36} />
          <h2 className="text-[17px] font-bold text-[#050505]">Failed to load settings</h2>
          <p className="mt-1 text-[13px] text-[#65676b]">{error}</p>
        </div>
      </main>
    );
  }

  const handleSave = async (updatedFields) => {
    setSaving(true);
    setSaveError(null);
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        isPrivate: formData.isPrivate,
        isGroupJoinApprovalRequired: formData.isGroupJoinApprovalRequired,
        isPostApprovalRequired: formData.isPostApprovalRequired,
        allowAnonymousPost: formData.allowAnonymousPost,
        ...updatedFields,
      };

      await updateGroup(payload);
      setFormData(prev => ({ ...prev, ...updatedFields }));
      setActiveModal(null);
    } catch (err) {
      setSaveError(err?.response?.data?.message || err?.message || "Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  const openModal = (type) => {
    setSaveError(null);
    setActiveModal(type);
  };

  return (
    <main className="min-h-[calc(100vh-56px)] bg-[#f0f2f5] pt-14 lg:pl-[292px]">
      <div className="mx-auto max-w-[580px] space-y-4 px-4 py-6">
        
        {/* Section: Group Info */}
        <section className="rounded-lg border border-[#dddfe2] bg-white p-4 shadow-sm">
          <h2 className="mb-1 text-[17px] font-bold text-[#050505]">Group Info</h2>
          <p className="mb-3 text-[12px] text-[#65676b]">Basic information and privacy configuration for your group.</p>
          <div className="divide-y divide-[#e4e6eb]">
            
            {/* Name & Description */}
            <div
              className="grid w-full grid-cols-[1fr_auto] items-center gap-4 py-3 text-left px-2"
            >
              <span>
                <span className="block text-[13px] font-bold text-[#050505]">Name and description</span>
                <span className="block text-[12px] text-[#65676b] font-semibold mt-0.5">
                  {formData.name}
                </span>
                {formData.description && (
                  <span className="block text-[12px] text-[#65676b] line-clamp-2 mt-0.5">
                    {formData.description}
                  </span>
                )}
              </span>
              <button
                type="button"
                onClick={() => openModal("name-desc")}
                className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-[#e4e6eb] text-[#65676b] hover:text-[#050505] transition-colors cursor-pointer"
                title="Edit name and description"
              >
                <Edit3 size={16} />
              </button>
            </div>

            {/* Privacy */}
            <div
              className="grid w-full grid-cols-[1fr_auto] items-center gap-4 py-3 text-left px-2"
            >
              <span>
                <span className="block text-[13px] font-bold text-[#050505]">Privacy</span>
                <span className="flex items-center gap-1.5 text-[12px] text-[#65676b] mt-0.5">
                  {formData.isPrivate ? (
                    <>
                      <Lock size={13} />
                      <span className="font-semibold text-[#050505]">Private</span>
                      <span>• Only members can see who's in the group and what they post.</span>
                    </>
                  ) : (
                    <>
                      <Globe size={13} />
                      <span className="font-semibold text-[#050505]">Public</span>
                      <span>• Anyone can see who's in the group and what they post.</span>
                    </>
                  )}
                </span>
              </span>
              <button
                type="button"
                onClick={() => openModal("privacy")}
                className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-[#e4e6eb] text-[#65676b] hover:text-[#050505] transition-colors cursor-pointer"
                title="Edit privacy"
              >
                <Edit3 size={16} />
              </button>
            </div>
          </div>
        </section>

        {/* Section: Member Management */}
        <section className="rounded-lg border border-[#dddfe2] bg-white p-4 shadow-sm">
          <h2 className="mb-1 text-[17px] font-bold text-[#050505]">Member Management</h2>
          <p className="mb-3 text-[12px] text-[#65676b]">Control how people join your group.</p>
          <div className="divide-y divide-[#e4e6eb]">
            
            {/* Join Approval */}
            <div
              className="grid w-full grid-cols-[1fr_auto] items-center gap-4 py-3 text-left px-2"
            >
              <span>
                <span className="block text-[13px] font-bold text-[#050505]">Require Join Approval</span>
                <span className="block text-[12px] text-[#65676b] mt-0.5">
                  {formData.isGroupJoinApprovalRequired ? (
                    <span className="text-green-600 font-semibold">Enabled • Admin or Moderator approval required to join</span>
                  ) : (
                    <span>Disabled • Anyone can join directly</span>
                  )}
                </span>
              </span>
              <button
                type="button"
                onClick={() => openModal("join-approval")}
                className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-[#e4e6eb] text-[#65676b] hover:text-[#050505] transition-colors cursor-pointer"
                title="Edit join approval"
              >
                <Edit3 size={16} />
              </button>
            </div>
          </div>
        </section>

        {/* Section: Discussion Settings */}
        <section className="rounded-lg border border-[#dddfe2] bg-white p-4 shadow-sm">
          <h2 className="mb-1 text-[17px] font-bold text-[#050505]">Discussion Settings</h2>
          <p className="mb-3 text-[12px] text-[#65676b]">Manage post approvals and posting options in the group.</p>
          <div className="divide-y divide-[#e4e6eb]">
            
            {/* Post Approval */}
            <div
              className="grid w-full grid-cols-[1fr_auto] items-center gap-4 py-3 text-left px-2"
            >
              <span>
                <span className="block text-[13px] font-bold text-[#050505]">Require Post Approval</span>
                <span className="block text-[12px] text-[#65676b] mt-0.5">
                  {formData.isPostApprovalRequired ? (
                    <span className="text-green-600 font-semibold">Enabled • Posts must be approved by admin or moderator</span>
                  ) : (
                    <span>Disabled • Posts publish instantly</span>
                  )}
                </span>
              </span>
              <button
                type="button"
                onClick={() => openModal("post-approval")}
                className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-[#e4e6eb] text-[#65676b] hover:text-[#050505] transition-colors cursor-pointer"
                title="Edit post approval"
              >
                <Edit3 size={16} />
              </button>
            </div>

            {/* Anonymous Post */}
            <div
              className="grid w-full grid-cols-[1fr_auto] items-center gap-4 py-3 text-left px-2"
            >
              <span>
                <span className="block text-[13px] font-bold text-[#050505]">Allow Anonymous Posting</span>
                <span className="block text-[12px] text-[#65676b] mt-0.5">
                  {formData.allowAnonymousPost ? (
                    <span className="text-green-600 font-semibold">Allowed • Members can write anonymous posts</span>
                  ) : (
                    <span>Not Allowed • Members must post with their identity</span>
                  )}
                </span>
              </span>
              <button
                type="button"
                onClick={() => openModal("anonymous-post")}
                className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-[#e4e6eb] text-[#65676b] hover:text-[#050505] transition-colors cursor-pointer"
                title="Edit anonymous posting"
              >
                <Edit3 size={16} />
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Edit Settings Modal */}
      {activeModal && (
        <EditSettingModal
          type={activeModal}
          formData={formData}
          onClose={() => setActiveModal(null)}
          onSave={handleSave}
          saving={saving}
          error={saveError}
        />
      )}
    </main>
  );
}

function EditSettingModal({ type, formData, onClose, onSave, saving, error }) {
  const [localVal, setLocalVal] = useState({});

  useEffect(() => {
    if (type === "name-desc") {
      setLocalVal({ name: formData.name, description: formData.description });
    } else if (type === "privacy") {
      setLocalVal({ isPrivate: formData.isPrivate });
    } else if (type === "join-approval") {
      setLocalVal({ isGroupJoinApprovalRequired: formData.isGroupJoinApprovalRequired });
    } else if (type === "post-approval") {
      setLocalVal({ isPostApprovalRequired: formData.isPostApprovalRequired });
    } else if (type === "anonymous-post") {
      setLocalVal({ allowAnonymousPost: formData.allowAnonymousPost });
    }
  }, [type, formData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (type === "name-desc" && !localVal.name?.trim()) return;
    onSave(localVal);
  };

  const getTitle = () => {
    switch (type) {
      case "name-desc": return "Edit Name and Description";
      case "privacy": return "Edit Privacy Setting";
      case "join-approval": return "Edit Join Approval";
      case "post-approval": return "Edit Post Approval Settings";
      case "anonymous-post": return "Edit Anonymous Posting";
      default: return "Edit Setting";
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[480px] rounded-lg bg-white shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#dddfe2] px-4 py-3">
          <h3 className="text-[16px] font-bold text-[#050505]">{getTitle()}</h3>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e4e6eb] hover:bg-[#d8dadf] transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
          {error && (
            <div className="flex gap-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-[13px] font-medium">
              <Info size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Type: Name and Description */}
          {type === "name-desc" && (
            <div className="space-y-4">
              <div>
                <label className="block text-[13px] font-semibold text-[#65676b] mb-1">
                  Group Name
                </label>
                <input
                  type="text"
                  required
                  value={localVal.name || ""}
                  onChange={(e) => setLocalVal(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full h-10 border border-[#ccd0d5] rounded-md px-3 text-[14px] outline-none focus:border-[#0866ff] focus:ring-2 focus:ring-[#0866ff]/20"
                  placeholder="Enter group name"
                />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-[#65676b] mb-1">
                  Description
                </label>
                <textarea
                  value={localVal.description || ""}
                  onChange={(e) => setLocalVal(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full min-h-[120px] border border-[#ccd0d5] rounded-md p-3 text-[14px] outline-none resize-none focus:border-[#0866ff] focus:ring-2 focus:ring-[#0866ff]/20"
                  placeholder="Describe your community..."
                />
              </div>
            </div>
          )}

          {/* Type: Privacy */}
          {type === "privacy" && (
            <div className="space-y-3">
              <label
                className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  localVal.isPrivate === false
                    ? "border-[#0866ff] bg-[#e7f3ff]/20"
                    : "border-[#ccd0d5] hover:bg-[#f2f2f2]"
                }`}
              >
                <input
                  type="radio"
                  name="privacy"
                  checked={localVal.isPrivate === false}
                  onChange={() => setLocalVal({ isPrivate: false })}
                  className="mt-1"
                />
                <div>
                  <span className="block text-[13px] font-bold text-[#050505] flex items-center gap-1.5">
                    <Globe size={14} /> Public
                  </span>
                  <span className="block text-[12px] text-[#65676b] mt-0.5">
                    Anyone can see who's in the group and what they post.
                  </span>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  localVal.isPrivate === true
                    ? "border-[#0866ff] bg-[#e7f3ff]/20"
                    : "border-[#ccd0d5] hover:bg-[#f2f2f2]"
                }`}
              >
                <input
                  type="radio"
                  name="privacy"
                  checked={localVal.isPrivate === true}
                  onChange={() => setLocalVal({ isPrivate: true })}
                  className="mt-1"
                />
                <div>
                  <span className="block text-[13px] font-bold text-[#050505] flex items-center gap-1.5">
                    <Lock size={14} /> Private
                  </span>
                  <span className="block text-[12px] text-[#65676b] mt-0.5">
                    Only members can see who's in the group and what they post.
                  </span>
                </div>
              </label>
            </div>
          )}

          {/* Type: Join Approval */}
          {type === "join-approval" && (
            <div className="space-y-3">
              <label
                className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  localVal.isGroupJoinApprovalRequired === false
                    ? "border-[#0866ff] bg-[#e7f3ff]/20"
                    : "border-[#ccd0d5] hover:bg-[#f2f2f2]"
                }`}
              >
                <input
                  type="radio"
                  name="join-approval"
                  checked={localVal.isGroupJoinApprovalRequired === false}
                  onChange={() => setLocalVal({ isGroupJoinApprovalRequired: false })}
                  className="mt-1"
                />
                <div>
                  <span className="block text-[13px] font-bold text-[#050505]">Anyone can join directly</span>
                  <span className="block text-[12px] text-[#65676b] mt-0.5">
                    People who request to join become members immediately without admin approval.
                  </span>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  localVal.isGroupJoinApprovalRequired === true
                    ? "border-[#0866ff] bg-[#e7f3ff]/20"
                    : "border-[#ccd0d5] hover:bg-[#f2f2f2]"
                }`}
              >
                <input
                  type="radio"
                  name="join-approval"
                  checked={localVal.isGroupJoinApprovalRequired === true}
                  onChange={() => setLocalVal({ isGroupJoinApprovalRequired: true })}
                  className="mt-1"
                />
                <div>
                  <span className="block text-[13px] font-bold text-[#050505]">Require Admin / Moderator approval</span>
                  <span className="block text-[12px] text-[#65676b] mt-0.5">
                    All new join requests must be approved by a group admin or moderator.
                  </span>
                </div>
              </label>
            </div>
          )}

          {/* Type: Post Approval */}
          {type === "post-approval" && (
            <div className="space-y-3">
              <label
                className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  localVal.isPostApprovalRequired === false
                    ? "border-[#0866ff] bg-[#e7f3ff]/20"
                    : "border-[#ccd0d5] hover:bg-[#f2f2f2]"
                }`}
              >
                <input
                  type="radio"
                  name="post-approval"
                  checked={localVal.isPostApprovalRequired === false}
                  onChange={() => setLocalVal({ isPostApprovalRequired: false })}
                  className="mt-1"
                />
                <div>
                  <span className="block text-[13px] font-bold text-[#050505]">Publish posts immediately</span>
                  <span className="block text-[12px] text-[#65676b] mt-0.5">
                    Members can post directly to the group discussion without any review.
                  </span>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  localVal.isPostApprovalRequired === true
                    ? "border-[#0866ff] bg-[#e7f3ff]/20"
                    : "border-[#ccd0d5] hover:bg-[#f2f2f2]"
                }`}
              >
                <input
                  type="radio"
                  name="post-approval"
                  checked={localVal.isPostApprovalRequired === true}
                  onChange={() => setLocalVal({ isPostApprovalRequired: true })}
                  className="mt-1"
                />
                <div>
                  <span className="block text-[13px] font-bold text-[#050505]">Require Admin / Moderator review</span>
                  <span className="block text-[12px] text-[#65676b] mt-0.5">
                    All posts submitted by members must be approved by an administrator before appearing.
                  </span>
                </div>
              </label>
            </div>
          )}

          {/* Type: Anonymous Post */}
          {type === "anonymous-post" && (
            <div className="space-y-3">
              <label
                className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  localVal.allowAnonymousPost === true
                    ? "border-[#0866ff] bg-[#e7f3ff]/20"
                    : "border-[#ccd0d5] hover:bg-[#f2f2f2]"
                }`}
              >
                <input
                  type="radio"
                  name="anonymous-post"
                  checked={localVal.allowAnonymousPost === true}
                  onChange={() => setLocalVal({ allowAnonymousPost: true })}
                  className="mt-1"
                />
                <div>
                  <span className="block text-[13px] font-bold text-[#050505]">Allow anonymous posting</span>
                  <span className="block text-[12px] text-[#65676b] mt-0.5">
                    Members can write posts anonymously. Admins/moderators can still view the authors' identities.
                  </span>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  localVal.allowAnonymousPost === false
                    ? "border-[#0866ff] bg-[#e7f3ff]/20"
                    : "border-[#ccd0d5] hover:bg-[#f2f2f2]"
                }`}
              >
                <input
                  type="radio"
                  name="anonymous-post"
                  checked={localVal.allowAnonymousPost === false}
                  onChange={() => setLocalVal({ allowAnonymousPost: false })}
                  className="mt-1"
                />
                <div>
                  <span className="block text-[13px] font-bold text-[#050505]">Do not allow anonymous posting</span>
                  <span className="block text-[12px] text-[#65676b] mt-0.5">
                    All posts must show the author's name and profile photo.
                  </span>
                </div>
              </label>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t border-[#dddfe2] px-4 py-3 bg-[#f0f2f5]/40">
          <button
            type="button"
            disabled={saving}
            onClick={onClose}
            className="h-9 rounded-md bg-[#e4e6eb] px-4 text-[13px] font-semibold text-[#050505] hover:bg-[#d8dadf] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || (type === "name-desc" && !localVal.name?.trim())}
            className="h-9 rounded-md bg-[#0866ff] px-4 text-[13px] font-semibold text-white hover:bg-[#075ce5] transition-colors disabled:bg-[#e4e6eb] disabled:text-[#bcc0c4] disabled:cursor-not-allowed flex items-center justify-center"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
