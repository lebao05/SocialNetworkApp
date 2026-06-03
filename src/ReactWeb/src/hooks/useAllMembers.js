import { useCallback, useEffect, useState } from "react";
import { getGroupMembersApi } from "../apis/groupApi";

/**
 * Maps pill/display role strings to backend GroupMemberRole enum values.
 * Backend: 0 = Member, 1 = Admin, 2 = Moderator
 */
const ROLE_MAP = {
  "": null,
  all: null,
  admin: 1,
  moderator: 2,
  member: 0,
};

/**
 * Normalises a GroupMemberRole value (number or string) to a human label.
 */
const ROLE_LABELS = {
  0: "Member",
  1: "Admin",
  2: "Moderator",
};

const normalizeMember = (m) => ({
  id: m.id ?? m.Id,
  groupId: m.groupId ?? m.GroupId,
  userId: m.userId ?? m.UserId,
  fullName: m.fullName ?? m.FullName ?? "",
  avatarUrl: m.avatarUrl ?? m.AvatarUrl ?? null,
  email: m.email ?? m.Email ?? null,
  role: m.role ?? m.Role,
  roleLabel: ROLE_LABELS[m.role ?? m.Role] ?? String(m.role ?? m.Role),
  joinedAt: m.joinedAt ?? m.JoinedAt,
});

const normalizePaged = (data, pageSize) => {
  if (!data) return { items: [], hasNextPage: false, totalCount: 0, pageNumber: 1 };

  if (Array.isArray(data)) {
    return {
      items: data,
      hasNextPage: false,
      totalCount: data.length,
      pageNumber: 1,
    };
  }

  const items = data.items || data.Items || [];
  const totalCount = data.totalCount ?? data.TotalCount ?? items.length;
  const pageNumber = data.pageNumber ?? data.PageNumber ?? 1;
  const pageSizeVal = data.pageSize ?? data.PageSize ?? pageSize;
  const hasNextPage =
    data.hasNextPage ?? data.HasNextPage ?? pageNumber * pageSizeVal < totalCount;

  return { items, hasNextPage, totalCount, pageNumber };
};

/**
 * Loads all group members with pagination, search, and role filtering.
 * Does NOT use useGroup — fully independent.
 *
 * @param {number} groupId
 * @param {{ pageSize?: number, searchTerm?: string, role?: string, autoFetch?: boolean }} options
 */
export function useAllMembers(
  groupId,
  { pageSize = 20, searchTerm = "", role = "", autoFetch = true } = {}
) {
  const [members, setMembers] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const loadPage = useCallback(
    async (p = 1, currentSearch = searchTerm, currentRole = role) => {
      if (!groupId) return;

      setIsLoading(true);
      setError(null);

      try {
        const data = await getGroupMembersApi(groupId, {
          page: p,
          pageSize,
          searchTerm: currentSearch || null,
          role: ROLE_MAP[currentRole] !== undefined && ROLE_MAP[currentRole] !== null
            ? String(ROLE_MAP[currentRole])
            : null,
        });

        const { items, hasNextPage: next, totalCount: total } = normalizePaged(data, pageSize);
        const normalized = items.map(normalizeMember);

        setMembers((prev) => (p === 1 ? normalized : [...prev, ...normalized]));
        setHasNextPage(next);
        setTotalCount(total);
        setPage(p);
      } catch (err) {
        console.error("Failed to load members:", err);
        setError(
          err?.response?.data?.message ||
            err?.response?.data ||
            err?.message ||
            "Failed to load members"
        );
        if (p === 1) {
          setMembers([]);
          setHasNextPage(false);
          setTotalCount(0);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [groupId, pageSize]
  );

  useEffect(() => {
    if (!autoFetch || !groupId) return;
    setMembers([]);
    setPage(1);
    setHasNextPage(true);
    loadPage(1, searchTerm, role);
  }, [groupId, searchTerm, role, autoFetch]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadMore = () => {
    if (!hasNextPage || isLoading) return;
    loadPage(page + 1, searchTerm, role);
  };

  const refresh = async () => {
    setIsRefreshing(true);
    try {
      await loadPage(1, searchTerm, role);
    } finally {
      setIsRefreshing(false);
    }
  };

  return {
    members,
    isLoading,
    isRefreshing,
    hasNextPage,
    totalCount,
    page,
    error,
    loadMore,
    refresh,
  };
}
