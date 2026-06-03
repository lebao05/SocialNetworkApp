import { useState, useCallback } from "react";
import { getPossibleTagsApi } from "../apis/postApi";
import { getGroupMembersApi } from "../apis/groupApi";

/**
 * Hook for tag suggestions.
 * - If groupId is provided: searches within group members.
 * - Otherwise: searches friends/users via the tags search API.
 */
export function useTag({ groupId = null } = {}) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchTags = useCallback(
    async (query = "") => {
      setLoading(true);
      try {
        if (groupId) {
          const data = await getGroupMembersApi(groupId, {
            page: 1,
            pageSize: 20,
            searchTerm: query || null,
          });
          const raw = Array.isArray(data) ? data : data?.items || data?.Items || [];
          setSuggestions(
            raw.map((m) => ({
              id: m.userId || m.UserId,
              name: m.fullName || m.FullName || "Member",
              status: "Group member",
              avatar: m.avatarUrl || m.AvatarUrl || null,
            }))
          );
        } else {
          const data = await getPossibleTagsApi(query || null, null, 1, 20);
          const raw = Array.isArray(data) ? data : data?.items || data?.Items || [];
          setSuggestions(
            raw.map((u) => {
              const uId = u.userId || u.UserId || u.id || u.Id;
              const fName = u.firstName || u.FirstName || "";
              const lName = u.lastName || u.LastName || "";
              const fullName = u.fullName || u.FullName || `${fName} ${lName}`.trim() || "User";
              return {
                id: uId,
                name: fullName,
                status: "Friends",
                avatar: u.avatarUrl || u.AvatarUrl || null,
              };
            })
          );
        }
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    },
    [groupId]
  );

  return { suggestions, loading, searchTags };
}
