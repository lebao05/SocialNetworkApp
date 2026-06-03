import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  X,
} from "lucide-react";
import { useGroup } from "../../hooks/useGroup";
import { useAuth } from "../../contexts/authContext";

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
        disabled ? "cursor-not-allowed bg-[#e4e6eb] text-[#bcc0c4]" : "cursor-pointer bg-[#e4e6eb] text-[#050505] transition-colors hover:bg-[#d8dadf]"
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
        <button type="button" className="mt-4 h-9 cursor-pointer rounded-md bg-[#0866ff] px-4 text-[13px] font-semibold text-white transition-colors hover:bg-[#075ce5]">
          {buttonLabel}
        </button>
      )}
    </div>
  );
}

function SearchFilters({ 
  onSearchChange, 
  onFromDateChange, 
  onHaveAvatarChange, 
  onClearFilters, 
  searchTerm,
  fromDate,
  haveAvatar
}) {
  const getDateLabel = (date) => {
    if (!date) return null;
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 7) return "Last 7 days";
    if (diffDays <= 30) return "Last month";
    return "Last 3 months";
  };

  const dateLabel = getDateLabel(fromDate);
  const avatarLabel = haveAvatar === true ? "Has avatar" : haveAvatar === false ? "No avatar" : null;
  const hasActiveFilters = searchTerm || fromDate || haveAvatar !== null;

  return (
    <div className="space-y-3">
      <div className="flex h-9 min-w-[280px] flex-1 items-center gap-2 rounded-full bg-[#f0f2f5] px-3 text-[#65676b]">
        <Search size={16} />
        <input
          type="text"
          placeholder="Search by name"
          onChange={(e) => onSearchChange(e.target.value)}
          className="flex-1 bg-transparent text-[13px] outline-none placeholder-[#65676b]"
          value={searchTerm}
        />
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          {searchTerm && (
            <div className="flex items-center gap-2 bg-[#e7f3ff] border border-[#0866ff] rounded-full px-3 h-8 text-[13px]">
              <span className="text-[#0866ff] font-semibold">{searchTerm}</span>
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="text-[#0866ff] hover:text-[#075ce5] ml-1"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {dateLabel && (
            <div className="flex items-center gap-2 bg-[#e7f3ff] border border-[#0866ff] rounded-full px-3 h-8 text-[13px]">
              <span className="text-[#0866ff] font-semibold">{dateLabel}</span>
              <button
                type="button"
                onClick={() => onFromDateChange(null)}
                className="text-[#0866ff] hover:text-[#075ce5] ml-1"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {avatarLabel && (
            <div className="flex items-center gap-2 bg-[#e7f3ff] border border-[#0866ff] rounded-full px-3 h-8 text-[13px]">
              <span className="text-[#0866ff] font-semibold">{avatarLabel}</span>
              <button
                type="button"
                onClick={() => onHaveAvatarChange(null)}
                className="text-[#0866ff] hover:text-[#075ce5] ml-1"
              >
                <X size={14} />
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={onClearFilters}
            className="h-8 rounded-full px-3 text-[13px] font-semibold bg-[#0866ff] text-white transition-colors hover:bg-[#075ce5]"
          >
            Clear filters
          </button>
        </div>
      )}

      <div className="flex gap-2 flex-wrap">
        <div className="relative group">
          <FilterButton>Request time</FilterButton>
          <div className="absolute left-0 top-full mt-1 hidden bg-white border border-[#dddfe2] rounded-lg shadow-lg z-10 group-hover:block min-w-[200px]">
            <button
              type="button"
              onClick={() => {
                const d = new Date();
                d.setDate(d.getDate() - 7);
                onFromDateChange(d);
              }}
              className="w-full px-4 py-2 text-left text-[13px] hover:bg-[#f0f2f5]"
            >
              Last 7 days
            </button>
            <button
              type="button"
              onClick={() => {
                const d = new Date();
                d.setMonth(d.getMonth() - 1);
                onFromDateChange(d);
              }}
              className="w-full px-4 py-2 text-left text-[13px] hover:bg-[#f0f2f5]"
            >
              Last month
            </button>
            <button
              type="button"
              onClick={() => {
                const d = new Date();
                d.setMonth(d.getMonth() - 3);
                onFromDateChange(d);
              }}
              className="w-full px-4 py-2 text-left text-[13px] hover:bg-[#f0f2f5]"
            >
              Last 3 months
            </button>
            <button
              type="button"
              onClick={() => onFromDateChange(null)}
              className="w-full px-4 py-2 text-left text-[13px] hover:bg-[#f0f2f5] border-t border-[#dddfe2]"
            >
              Clear date filter
            </button>
          </div>
        </div>

        <div className="relative group">
          <FilterButton>Profile photo</FilterButton>
          <div className="absolute left-0 top-full mt-1 hidden bg-white border border-[#dddfe2] rounded-lg shadow-lg z-10 group-hover:block min-w-[180px]">
            <button
              type="button"
              onClick={() => onHaveAvatarChange(true)}
              className="w-full px-4 py-2 text-left text-[13px] hover:bg-[#f0f2f5]"
            >
              Has avatar
            </button>
            <button
              type="button"
              onClick={() => onHaveAvatarChange(false)}
              className="w-full px-4 py-2 text-left text-[13px] hover:bg-[#f0f2f5]"
            >
              No avatar
            </button>
            <button
              type="button"
              onClick={() => onHaveAvatarChange(null)}
              className="w-full px-4 py-2 text-left text-[13px] hover:bg-[#f0f2f5] border-t border-[#dddfe2]"
            >
              Clear filter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function OverviewView() {
  const reviewItems = [
    ["Reported content", 0],
    ["Moderation alerts", 0],
    ["Pending posts", 0],
    ["Member requests", 0],
    ["Group status", 0],
  ];

  return (
    <AdminShell title="Overview">
      <section className="rounded-lg border border-[#dddfe2] bg-white p-4 shadow-sm">
        <h2 className="text-[17px] font-bold">Needs review</h2>
        <p className="text-[13px] text-[#65676b]">0 new items to review</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {reviewItems.map(([label, count]) => (
            <button key={label} type="button" className="flex cursor-pointer items-center justify-between rounded-md p-2 text-left transition-colors hover:bg-[#f2f2f2]">
              <span className="text-[13px] font-semibold">{label}</span>
              <span className="text-[18px] font-bold">{count}</span>
            </button>
          ))}
        </div>
      </section>
    </AdminShell>
  );
}

function MemberRequestsView({ groupId }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [haveAvatar, setHaveAvatar] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [requestStatuses, setRequestStatuses] = useState({});
  const { joinRequests, loading, fetchJoinRequests, reviewJoinRequest } = useGroup(groupId);

  useEffect(() => {
    fetchJoinRequests({ page: currentPage, searchTerm, fromDate, haveAvatar });
  }, [currentPage, searchTerm, fromDate, haveAvatar, fetchJoinRequests]);

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setFromDate(null);
    setHaveAvatar(null);
    setCurrentPage(1);
  };

  const hasActiveFilters = searchTerm || fromDate || haveAvatar !== null;

  const handleReviewRequest = async (requestId, approve) => {
    try {
      await reviewJoinRequest(requestId, approve);
      setRequestStatuses(prev => ({
        ...prev,
        [requestId]: approve ? "accepted" : "rejected"
      }));
      
      // Show status badge for 2 seconds, then remove from list
      setTimeout(() => {
        fetchJoinRequests({ page: currentPage, searchTerm, fromDate, haveAvatar });
      }, 2000);
    } catch (error) {
      console.error("Error reviewing request:", error);
    }
  };

  const handleNavigateToProfile = (userId) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <AdminShell
      title="Member requests"
      filters={
        <SearchFilters
          searchTerm={searchTerm}
          fromDate={fromDate}
          haveAvatar={haveAvatar}
          onSearchChange={handleSearchChange}
          onFromDateChange={(date) => {
            setFromDate(date);
            setCurrentPage(1);
          }}
          onHaveAvatarChange={(value) => {
            setHaveAvatar(value);
            setCurrentPage(1);
          }}
          onClearFilters={handleClearFilters}
        />
      }
    >
      {loading && joinRequests.length === 0 ? (
        <p className="text-[13px] text-[#65676b]">Loading requests...</p>
      ) : joinRequests.length === 0 ? (
        <EmptyState icon="people" title="No pending members" />
      ) : (
        <div className="space-y-2">
          {joinRequests.map((request) => {
            const status = requestStatuses[request.id];
            return (
              <div key={request.id} className="flex items-center justify-between rounded-lg border border-[#dddfe2] bg-white p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  {request.avatarUrl ? (
                    <img src={request.avatarUrl} alt={request.fullName} className="h-12 w-12 rounded-full object-cover" />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-[#e4e6eb] flex items-center justify-center">
                      <Users size={20} className="text-[#65676b]" />
                    </div>
                  )}
                  <div>
                    <button
                      type="button"
                      onClick={() => handleNavigateToProfile(request.userId)}
                      className="text-[14px] font-semibold text-[#0866ff] cursor-pointer hover:underline"
                    >
                      {request.fullName}
                    </button>
                    <p className="text-[12px] text-[#65676b]">Requested {new Date(request.requestedAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {status === "accepted" ? (
                    <div className="h-9 rounded-md bg-[#d4edda] px-4 text-[13px] font-semibold text-[#155724] flex items-center justify-center">
                      ✓ Added
                    </div>
                  ) : status === "rejected" ? (
                    <div className="h-9 rounded-md bg-[#f8d7da] px-4 text-[13px] font-semibold text-[#721c24] flex items-center justify-center">
                      ✕ Rejected
                    </div>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => handleReviewRequest(request.id, true)}
                        className="h-9 cursor-pointer rounded-md bg-[#0866ff] px-4 text-[13px] font-semibold text-white transition-colors hover:bg-[#075ce5]"
                      >
                        Accept
                      </button>
                      <button
                        type="button"
                        onClick={() => handleReviewRequest(request.id, false)}
                        className="h-9 cursor-pointer rounded-md bg-[#e4e6eb] px-4 text-[13px] font-semibold transition-colors hover:bg-[#d8dadf]"
                      >
                        Decline
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AdminShell>
  );
}

function PendingPostsView({ type }) {
  const copy = {
    "pending-posts": {
      title: "Pending posts",
      empty: "No posts to review",
      description: "Posts do not need admin approval before publishing. You can change this in group settings.",
      button: "Go to settings",
    },
    spam: {
      title: "Possible spam",
      empty: "No possible spam",
    },
    "reported-content": {
      title: "Reported content",
      empty: "No reported content",
      description: "Review content that members reported to group admins.",
    },
  }[type];

  return (
    <AdminShell title={copy.title} filters={<><FilterButton>Newest first</FilterButton><FilterButton>All</FilterButton></>}>
      <EmptyState icon="file" title={copy.empty} description={copy.description} buttonLabel={copy.button} />
    </AdminShell>
  );
}

function getRuleId(rule) {
  return rule?.id ?? rule?.Id;
}

function getRuleTitle(rule) {
  return rule?.title ?? rule?.Title ?? "";
}

function getRuleDescription(rule) {
  return rule?.description ?? rule?.Description ?? "";
}

function RuleModal({ isOpen, loading, error, rule, onClose, onSubmit }) {
  const [title, setTitle] = useState(() => getRuleTitle(rule));
  const [description, setDescription] = useState(() => getRuleDescription(rule));
  const isEditing = Boolean(rule);

  if (!isOpen) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!title.trim() || !description.trim()) return;

    await onSubmit({
      title: title.trim(),
      description: description.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-[440px] rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-[#dddfe2] px-4 py-3">
          <h2 className="text-[18px] font-bold">{isEditing ? "Update Group Rule" : "Create Group Rule"}</h2>
          <button type="button" onClick={onClose} className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#e4e6eb] transition-colors hover:bg-[#d8dadf]">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3 p-4">
          <label className="block">
            <span className="mb-1 block text-[13px] font-semibold text-[#65676b]">Rule title</span>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="h-10 w-full rounded-md border border-[#ccd0d5] px-3 text-[14px] outline-none focus:border-[#0866ff] focus:ring-2 focus:ring-[#0866ff]/20"
              placeholder="Be kind and respectful"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-[13px] font-semibold text-[#65676b]">Description</span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="min-h-[110px] w-full resize-none rounded-md border border-[#ccd0d5] px-3 py-2 text-[14px] outline-none focus:border-[#0866ff] focus:ring-2 focus:ring-[#0866ff]/20"
              placeholder="Tell members what behavior is expected."
            />
          </label>

          {error && <p className="text-[13px] font-semibold text-red-600">{error}</p>}
        </div>

        <div className="flex justify-end gap-2 border-t border-[#dddfe2] px-4 py-3">
          <button type="button" onClick={onClose} className="h-9 cursor-pointer rounded-md bg-[#e4e6eb] px-4 text-[14px] font-semibold transition-colors hover:bg-[#d8dadf]">
            Cancel
          </button>
          <button
            type="submit"
            disabled={!title.trim() || !description.trim() || loading}
            className="h-9 cursor-pointer rounded-md bg-[#0866ff] px-4 text-[14px] font-semibold text-white transition-colors hover:bg-[#075ce5] disabled:cursor-not-allowed disabled:bg-[#e4e6eb] disabled:text-[#bcc0c4]"
          >
            {loading ? (isEditing ? "Saving..." : "Creating...") : (isEditing ? "Save" : "Create")}
          </button>
        </div>
      </form>
    </div>
  );
}

function RulesView({ groupId }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState(null);
  const { rules, loading, error, fetchRules, createRule, updateRule, deleteRule } = useGroup(groupId, { autoFetch: false });

  useEffect(() => {
    fetchRules();
  }, [fetchRules]);

  const handleCreateRule = async (payload) => {
    if (selectedRule) {
      await updateRule(getRuleId(selectedRule), payload);
    } else {
      await createRule(payload);
    }
    setIsModalOpen(false);
    setSelectedRule(null);
  };

  const openCreateModal = () => {
    setSelectedRule(null);
    setIsModalOpen(true);
  };

  const openUpdateModal = (rule) => {
    setSelectedRule(rule);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRule(null);
  };

  const handleDeleteRule = async (rule) => {
    const ruleTitle = getRuleTitle(rule) || "this rule";
    const confirmed = window.confirm(`Delete "${ruleTitle}"?`);
    if (!confirmed) return;

    await deleteRule(getRuleId(rule));
  };

  return (
    <AdminShell title="Group Rules">
      <div className="space-y-3">
        <section className="flex items-center justify-between rounded-lg border border-[#dddfe2] bg-white p-4 shadow-sm">
          <h2 className="text-[16px] font-bold">Group Rules</h2>
          <button type="button" onClick={openCreateModal} className="cursor-pointer rounded-md px-2 py-1 text-[13px] font-semibold text-[#0866ff] transition-colors hover:bg-[#e7f3ff]">
            Create
          </button>
        </section>
        <section className="rounded-lg border border-[#dddfe2] bg-white p-4 shadow-sm">
          {loading && rules.length === 0 ? (
            <p className="text-[13px] text-[#65676b]">Loading rules...</p>
          ) : rules.length === 0 ? (
            <div className="py-8 text-center">
              <h3 className="text-[15px] font-bold text-[#050505]">No rules yet</h3>
              <p className="mt-1 text-[13px] text-[#65676b]">Create rules to set expectations for members.</p>
            </div>
          ) : (
            <div className="divide-y divide-[#f0f2f5]">
              {rules.map((rule, index) => (
                <div key={getRuleId(rule) ?? `${getRuleTitle(rule)}-${index}`} className="grid grid-cols-[24px_1fr_auto] items-start gap-3 py-4 first:pt-0 last:pb-0">
                  <span className="text-[13px] font-semibold text-[#65676b]">{index + 1}</span>
                  <div>
                    <h3 className="text-[14px] font-bold">{getRuleTitle(rule)}</h3>
                    <p className="mt-1 text-[12px] text-[#65676b]">{getRuleDescription(rule)}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openUpdateModal(rule)}
                      className="h-8 cursor-pointer rounded-md px-3 text-[12px] font-semibold text-[#0866ff] transition-colors hover:bg-[#e7f3ff]"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteRule(rule)}
                      className="h-8 cursor-pointer rounded-md px-3 text-[12px] font-semibold text-red-600 transition-colors hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
      {isModalOpen && (
        <RuleModal
          key={selectedRule ? getRuleId(selectedRule) : "create"}
          isOpen={isModalOpen}
          loading={loading}
          error={error}
          rule={selectedRule}
          onClose={closeModal}
          onSubmit={handleCreateRule}
        />
      )}
    </AdminShell>
  );
}

function RoleModal({ isOpen, role, groupId, onClose }) {
  const { user: currentUser } = useAuth();
  const { members, admins, moderators, fetchMembers, assignRole, groupDetail } = useGroup(groupId);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [tab, setTab] = useState("members"); // "members" or "add"

  useEffect(() => {
    if (isOpen) {
      fetchMembers();
    }
  }, [isOpen, fetchMembers]);

  const roleMembers = role === "Admin" ? admins : role === "Moderator" ? moderators : members;
  const allMembers = role === "Admin" 
    ? [...members, ...moderators] 
    : role === "Moderator" 
      ? [...members, ...admins] 
      : [...admins, ...moderators];

  const displayMembers = tab === "members" 
    ? roleMembers.filter(m => !searchTerm || m.fullName?.toLowerCase().includes(searchTerm.toLowerCase()))
    : allMembers.filter(m => !searchTerm || m.fullName?.toLowerCase().includes(searchTerm.toLowerCase()));

  const isOwner = groupDetail?.ownerUserId === currentUser?.id;
  const isAdmin = admins.some(m => m.userId === currentUser?.id);
  const canManageRoles = isOwner || isAdmin;

  const handleRoleChange = async (userId, newRole) => {
    if (!canManageRoles) return;
    setLoading(true);
    try {
      await assignRole(userId, newRole);
      await fetchMembers();
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4">
      <div className="w-full max-w-[440px] rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-[#dddfe2] px-4 py-3">
          <h2 className="text-[18px] font-bold">{role}</h2>
          <button type="button" onClick={onClose} className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#e4e6eb] transition-colors hover:bg-[#d8dadf]">
            <X size={18} />
          </button>
        </div>

        {canManageRoles && (
          <div className="flex border-b border-[#dddfe2]">
            <button
              type="button"
              onClick={() => {
                setTab("members");
                setSearchTerm("");
              }}
              className={`flex-1 px-4 py-3 text-[13px] font-semibold transition-colors ${
                tab === "members"
                  ? "border-b-2 border-[#0866ff] text-[#0866ff]"
                  : "text-[#65676b] hover:bg-[#f2f2f2]"
              }`}
            >
              Members ({roleMembers.length})
            </button>
            <button
              type="button"
              onClick={() => {
                setTab("add");
                setSearchTerm("");
              }}
              className={`flex-1 px-4 py-3 text-[13px] font-semibold transition-colors ${
                tab === "add"
                  ? "border-b-2 border-[#0866ff] text-[#0866ff]"
                  : "text-[#65676b] hover:bg-[#f2f2f2]"
              }`}
            >
              Add
            </button>
          </div>
        )}

        <div className="space-y-3 p-4">
          <div className="flex h-9 items-center gap-2 rounded-full bg-[#f0f2f5] px-3 text-[#65676b]">
            <Search size={16} />
            <input
              type="text"
              placeholder={tab === "members" ? "Search members" : "Find people"}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent text-[13px] outline-none placeholder-[#65676b]"
              value={searchTerm}
            />
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {displayMembers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Users size={48} className="mb-3 text-[#8a8d91]" />
                <p className="text-[13px] text-[#65676b]">
                  {tab === "members" ? "No members with this role yet." : "All members already have roles or no other members available."}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {displayMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between rounded-lg border border-[#dddfe2] p-3">
                    <div className="flex items-center gap-2">
                      {member.avatarUrl ? (
                        <img src={member.avatarUrl} alt={member.fullName} className="h-10 w-10 rounded-full object-cover" />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-[#e4e6eb] flex items-center justify-center">
                          <Users size={16} className="text-[#65676b]" />
                        </div>
                      )}
                      <div>
                        <p className="text-[13px] font-semibold">{member.fullName}</p>
                        <p className="text-[12px] text-[#65676b]">{member.email}</p>
                      </div>
                    </div>
                    {canManageRoles && (
                      <button
                        type="button"
                        onClick={() => handleRoleChange(member.userId, tab === "members" ? "Member" : role)}
                        disabled={loading}
                        className="h-8 cursor-pointer rounded-md bg-[#0866ff] px-3 text-[12px] font-semibold text-white transition-colors hover:bg-[#075ce5] disabled:cursor-not-allowed disabled:bg-[#e4e6eb]"
                      >
                        {tab === "members" ? "Remove" : `Make ${role}`}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function RolesView({ groupId }) {
  const { user: currentUser } = useAuth();
  const { members, admins, moderators, fetchMembers, groupDetail } = useGroup(groupId);
  const [selectedRole, setSelectedRole] = useState(null);

  useEffect(() => {
    // Fetch all members so we can display them in the "Add" tab
    fetchMembers();
  }, [fetchMembers]);

  const adminCount = admins.length;
  const moderatorCount = moderators.length;

  return (
    <AdminShell title="Community Roles">
      <section className="mx-auto max-w-[560px] rounded-lg border border-[#dddfe2] bg-white p-4 shadow-sm">
        <h2 className="text-[18px] font-bold">Standard roles</h2>
        <p className="text-[13px] text-[#65676b]">These roles have predefined responsibilities and cannot be customized.</p>
        <div className="mt-4 divide-y divide-[#dddfe2]">
          {[
            { label: "Admin", count: adminCount, role: "Admin" },
            { label: "Moderator", count: moderatorCount, role: "Moderator" },
          ].map(({ label, count, role }) => {
            const RoleIcon = label === "Admin" ? Shield : Badge;
            return (
              <button
                key={label}
                type="button"
                onClick={() => setSelectedRole(role)}
                className="flex w-full cursor-pointer items-center gap-3 rounded-md py-3 text-left transition-colors hover:bg-[#f2f2f2]"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e4e6eb]">
                  <RoleIcon size={17} />
                </span>
                <span className="flex-1">
                  <span className="block text-[14px] font-bold">{label}</span>
                  <span className="block text-[12px] text-[#65676b]">{count} {count === 1 ? "member" : "members"}</span>
                </span>
                <ChevronDown size={18} className="-rotate-90 text-[#65676b]" />
              </button>
            );
          })}
        </div>
      </section>
      <RoleModal
        isOpen={!!selectedRole}
        role={selectedRole}
        groupId={groupId}
        onClose={() => setSelectedRole(null)}
      />
    </AdminShell>
  );
}

function GenericManageView({ title }) {
  return (
    <AdminShell title={title}>
      <EmptyState icon="file" title={`No content in ${title.toLowerCase()}`} />
    </AdminShell>
  );
}

export default function GroupAdminManage({ view, groupId }) {
  if (view === "overview") return <OverviewView />;
  if (view === "member-requests") return <MemberRequestsView groupId={groupId} />;
  if (["pending-posts", "spam", "reported-content"].includes(view)) return <PendingPostsView type={view} />;
  if (view === "group-rules") return <RulesView groupId={groupId} />;
  if (view === "community-roles") return <RolesView groupId={groupId} />;

  const titles = {
    "admin-support": "Admin support",
    "badge-requests": "Badge requests",
    "member-questions": "Member questions",
    "scheduled-posts": "Scheduled posts",
    "group-status": "Group status",
    help: "Help center",
  };

  return <GenericManageView title={titles[view] || "Manage"} />;
}
