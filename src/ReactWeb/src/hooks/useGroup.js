import { useCallback, useEffect, useState } from "react";
import {
  assignGroupRoleApi,
  createGroupApi,
  createGroupRuleApi,
  deleteGroupRuleApi,
  executeReportedContentApi,
  getGroupDetailApi,
  getGroupJoinRequestsApi,
  getGroupMembersApi,
  getGroupRulesApi,
  getReportedContentsApi,
  joinGroupApi,
  leaveGroupApi,
  reportGroupPostApi,
  reviewGroupJoinRequestApi,
  reviewGroupPostApi,
  updateGroupApi,
  updateGroupRuleApi,
  uploadGroupCoverPhotoApi,
} from "../apis/groupApi";

const getErrorMessage = (err, fallback) =>
  err?.response?.data?.message || err?.response?.data || err?.message || fallback;

const normalizePagedItems = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  return data.items || data.Items || [];
};

export function useGroup(groupId = null, { pageSize = 20, autoFetch = true } = {}) {
  const [groupDetail, setGroupDetail] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [members, setMembers] = useState([]);
  const [moderators, setModerators] = useState([]);
  const [joinRequests, setJoinRequests] = useState([]);
  const [reports, setReports] = useState([]);
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const runAction = useCallback(async (action, fallbackMessage) => {
    try {
      setLoading(true);
      const data = await action();
      setError(null);
      return data;
    } catch (err) {
      setError(getErrorMessage(err, fallbackMessage));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMembers = useCallback(
    async ({ page = 1, searchTerm = null, role = null } = {}) => {
      if (!groupId) return [];

      return runAction(async () => {
        const data = await getGroupMembersApi(groupId, { page, pageSize, searchTerm, role });
        const items = normalizePagedItems(data);
        if (role === null || role === undefined) {
          setAdmins(items.filter((m) => m.role === 1));
          setMembers(items.filter((m) => m.role === 0));
          setModerators(items.filter((m) => m.role === 2));
        } else {
          const roleStr = String(role).toLowerCase();
          if (roleStr === "admin" || role === 1) {
            setAdmins(items);
          } else if (roleStr === "moderator" || role === 2) {
            setModerators(items);
          } else if (roleStr === "member" || role === 0) {
            setMembers(items);
          }
        }
        return data;
      }, "Unable to fetch group members");
    },
    [groupId, pageSize, runAction]
  );

  const fetchGroupDetail = useCallback(async () => {
    if (!groupId) return null;

    return runAction(async () => {
      const data = await getGroupDetailApi(groupId);
      setGroupDetail(data);
      return data;
    }, "Unable to fetch group detail");
  }, [groupId, runAction]);

  const fetchJoinRequests = useCallback(
    async ({ page = 1, searchTerm = null, fromDate = null, haveAvatar = null } = {}) => {
      if (!groupId) return [];

      return runAction(async () => {
        const data = await getGroupJoinRequestsApi(groupId, { page, pageSize, searchTerm, fromDate, haveAvatar });
        const items = normalizePagedItems(data);
        setJoinRequests(items);
        return data;
      }, "Unable to fetch group join requests");
    },
    [groupId, pageSize, runAction]
  );

  const fetchReports = useCallback(
    async ({ page = 1, status = null } = {}) => {
      if (!groupId) return [];

      return runAction(async () => {
        const data = await getReportedContentsApi(groupId, { page, pageSize, status });
        const items = normalizePagedItems(data);
        setReports(items);
        return data;
      }, "Unable to fetch group reports");
    },
    [groupId, pageSize, runAction]
  );

  const fetchRules = useCallback(async () => {
    if (!groupId) return [];

    return runAction(async () => {
      const data = await getGroupRulesApi(groupId);
      setRules(Array.isArray(data) ? data : []);
      return data;
    }, "Unable to fetch group rules");
  }, [groupId, runAction]);

  useEffect(() => {
    if (!autoFetch || !groupId) return;

    fetchGroupDetail();
  }, [autoFetch, groupId, fetchGroupDetail]);

  const createGroup = (payload) =>
    runAction(() => createGroupApi(payload), "Unable to create group");

  const updateGroup = async (payload) => {
    const data = await runAction(() => updateGroupApi(groupId, payload), "Unable to update group");
    await fetchGroupDetail();
    return data;
  };

  const uploadCoverPhoto = (file) =>
    runAction(() => uploadGroupCoverPhotoApi(groupId, file), "Unable to upload group cover photo");

  const joinGroup = (targetGroupId = groupId) =>
    runAction(() => joinGroupApi(targetGroupId), "Unable to join group");

  const leaveGroup = () =>
    runAction(() => leaveGroupApi(groupId), "Unable to leave group");

  const assignRole = async (userId, role) => {
    const data = await runAction(
      () => assignGroupRoleApi(groupId, userId, role),
      "Unable to assign group role"
    );
    await fetchMembers();
    return data;
  };

  const reviewJoinRequest = async (requestId, approve) => {
    const data = await runAction(
      () => reviewGroupJoinRequestApi(groupId, requestId, approve),
      "Unable to review group join request"
    );
    await fetchMembers();
    return data;
  };

  const reviewPost = (postId, approve) =>
    runAction(() => reviewGroupPostApi(groupId, postId, approve), "Unable to review group post");

  const reportPost = (postId, payload) =>
    runAction(() => reportGroupPostApi(groupId, postId, payload), "Unable to report group post");

  const executeReport = async (reportId, payload) => {
    const data = await runAction(
      () => executeReportedContentApi(groupId, reportId, payload),
      "Unable to execute group report"
    );
    await fetchReports();
    return data;
  };

  const createRule = async (payload) => {
    const data = await runAction(
      () => createGroupRuleApi(groupId, payload),
      "Unable to create group rule"
    );
    await fetchRules();
    return data;
  };

  const updateRule = async (ruleId, payload) => {
    const data = await runAction(
      () => updateGroupRuleApi(groupId, ruleId, payload),
      "Unable to update group rule"
    );
    await fetchRules();
    return data;
  };

  const deleteRule = async (ruleId) => {
    const data = await runAction(
      () => deleteGroupRuleApi(groupId, ruleId),
      "Unable to delete group rule"
    );
    await fetchRules();
    return data;
  };

  return {
    members,
    admins,
    moderators,
    groupDetail,
    joinRequests,
    reports,
    rules,
    loading,
    error,
    fetchGroupDetail,
    fetchMembers,
    fetchJoinRequests,
    fetchReports,
    fetchRules,
    createGroup,
    updateGroup,
    uploadCoverPhoto,
    joinGroup,
    leaveGroup,
    assignRole,
    reviewJoinRequest,
    reviewPost,
    reportPost,
    executeReport,
    createRule,
    updateRule,
    deleteRule,
    setMembers,
    setAdmins,
    setModerators,
    setGroupDetail,
    setJoinRequests,
    setReports,
    setRules,
  };
}
