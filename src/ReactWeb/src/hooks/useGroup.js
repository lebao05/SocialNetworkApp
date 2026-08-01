import { useCallback, useEffect, useState } from "react";
import {
  assignGroupRoleApi,
  cancelJoinRequestApi,
  createGroupApi,
  createGroupRuleApi,
  deleteGroupApi,
  deleteGroupRuleApi,
  executeReportedContentApi,
  getGroupDetailApi,
  getGroupJoinRequestsApi,
  getGroupMembersApi,
  getGroupRulesApi,
  getReportedContentsApi,
  isHavingPendingRequestApi,
  isMemberOfGroupApi,
  joinGroupApi,
  leaveGroupApi,
  reportGroupPostApi,
  reviewGroupJoinRequestApi,
  reviewGroupPostApi,
  updateGroupApi,
  updateGroupRuleApi,
  uploadGroupCoverPhotoApi,
} from "../apis/groupApi";
import { reportGroupApi } from "../apis/reportApi";

const getErrorMessage = (err, fallback) =>
  err?.response?.data?.message || err?.response?.data || err?.message || fallback;

const detectInactiveFromError = (err) => {
  if (!err) return null;
  const data = err?.response?.data;
  if (!data) return null;
  const code = String(data.type || data.Type || data.code || data.Code || "").toLowerCase();
  if (code === "group.deleted" || code.includes("group_deleted")) {
    return {
      locked: false,
      deleted: true,
      reason: data.detail || data.Detail || "This group has been deleted and is no longer available.",
    };
  }
  if (code === "group.locked" || code.includes("group_locked")) {
    return {
      locked: true,
      deleted: false,
      reason: data.detail || data.Detail || "This group is currently locked. You can view but not interact with it until it is unlocked.",
    };
  }
  return null;
};

const isGroupInactive = (state) => {
  if (!state) return false;
  return Boolean(state.locked || state.deleted);
};

const getInactiveReason = (state) => state?.reason || null;

const normalizePagedItems = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  return data.items || data.Items || [];
};

export function useGroup(groupId = null, { pageSize = 20, autoFetch = true } = {}) {
  const [groupDetail, setGroupDetail] = useState(null);
  const [inactiveState, setInactiveState] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [members, setMembers] = useState([]);
  const [moderators, setModerators] = useState([]);
  const [joinRequests, setJoinRequests] = useState([]);
  const [reports, setReports] = useState([]);
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isMember, setIsMember] = useState(false);
  const [hasPendingRequest, setHasPendingRequest] = useState(false);
  const [membershipStatusLoading, setMembershipStatusLoading] = useState(false);

  const runAction = useCallback(async (action, fallbackMessage) => {
    try {
      setLoading(true);
      const data = await action();
      setError(null);
      return data;
    } catch (err) {
      const inactive = detectInactiveFromError(err);
      if (inactive) {
        setInactiveState(inactive);
      }
      if (inactive) {
        setError(inactive.reason);
      } else {
        setError(getErrorMessage(err, fallbackMessage));
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const guardInactive = useCallback((actionName) => {
    if (isGroupInactive(inactiveState)) {
      const reason = getInactiveReason(inactiveState);
      setError(reason);
      throw new Error(reason || `Cannot ${actionName}: group is locked or deleted.`);
    }
  }, [inactiveState]);

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
      const locked = data.isLocked ?? data.IsLocked ?? false;
      const deleted = data.isDeleted ?? data.IsDeleted ?? false;
      if (locked || deleted) {
        setInactiveState({
          locked,
          deleted,
          reason: deleted
            ? "This group has been deleted and is no longer available."
            : "This group is currently locked. You can view but not interact with it until it is unlocked.",
        });
      } else {
        setInactiveState(null);
      }
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

  const fetchMembershipStatus = useCallback(async () => {
    if (!groupId) return { isMember: false, hasPendingRequest: false };

    setMembershipStatusLoading(true);
    try {
      const [memberFlag, pendingFlag] = await Promise.all([
        isMemberOfGroupApi(groupId).catch(() => false),
        isHavingPendingRequestApi(groupId).catch(() => false),
      ]);
      setIsMember(Boolean(memberFlag));
      setHasPendingRequest(Boolean(pendingFlag));
      return { isMember: Boolean(memberFlag), hasPendingRequest: Boolean(pendingFlag) };
    } finally {
      setMembershipStatusLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    setInactiveState(null);
    setGroupDetail(null);
    setError(null);
    setIsMember(false);
    setHasPendingRequest(false);
  }, [groupId]);

  useEffect(() => {
    if (!autoFetch || !groupId) return;

    fetchGroupDetail();
    fetchMembershipStatus();
  }, [autoFetch, groupId, fetchGroupDetail, fetchMembershipStatus]);

  const createGroup = (payload) =>
    runAction(() => createGroupApi(payload), "Unable to create group");

  const updateGroup = async (payload) => {
    guardInactive("update group");
    const data = await runAction(() => updateGroupApi(groupId, payload), "Unable to update group");
    await fetchGroupDetail();
    return data;
  };

  const uploadCoverPhoto = async (file) => {
    guardInactive("upload cover photo");
    await runAction(() => uploadGroupCoverPhotoApi(groupId, file), "Unable to upload group cover photo");
    await fetchGroupDetail();
  };

  const joinGroup = async (targetGroupId = groupId) => {
    if (isGroupInactive(inactiveState)) {
      const reason = getInactiveReason(inactiveState);
      setError(reason);
      throw new Error(reason || "Cannot join a locked or deleted group.");
    }
    const data = await runAction(() => joinGroupApi(targetGroupId), "Unable to join group");
    await fetchMembershipStatus();
    if (typeof targetGroupId === "number" && targetGroupId !== groupId) {
      await fetchGroupDetail();
    } else {
      await fetchGroupDetail();
    }
    return data;
  };

  const leaveGroup = async () => {
    guardInactive("leave group");
    const data = await runAction(() => leaveGroupApi(groupId), "Unable to leave group");
    await fetchMembershipStatus();
    await fetchGroupDetail();
    return data;
  };

  const cancelJoinRequest = async () => {
    guardInactive("cancel join request");
    const data = await runAction(
      () => cancelJoinRequestApi(groupId),
      "Unable to cancel join request"
    );
    await fetchMembershipStatus();
    return data;
  };

  const assignRole = async (userId, role) => {
    guardInactive("assign role");
    const data = await runAction(
      () => assignGroupRoleApi(groupId, userId, role),
      "Unable to assign group role"
    );
    await fetchMembers();
    return data;
  };

  const reviewJoinRequest = async (requestId, approve) => {
    guardInactive("review join request");
    const data = await runAction(
      () => reviewGroupJoinRequestApi(groupId, requestId, approve),
      "Unable to review group join request"
    );
    await fetchMembers();
    return data;
  };

  const reviewPost = (postId, approve) => {
    guardInactive("review post");
    return runAction(() => reviewGroupPostApi(groupId, postId, approve), "Unable to review group post");
  };

  const reportPost = (postId, payload) => {
    guardInactive("report post");
    return runAction(() => reportGroupPostApi(groupId, postId, payload), "Unable to report group post");
  };

  const reportGroup = (payload) => {
    if (!payload || !payload.reason) {
      throw new Error("A report reason is required.");
    }
    const data = runAction(
      () => reportGroupApi({ groupId, ...payload }),
      "Unable to submit group report"
    );
    return data;
  };

  const executeReport = async (reportId, payload) => {
    guardInactive("execute report");
    const data = await runAction(
      () => executeReportedContentApi(groupId, reportId, payload),
      "Unable to execute group report"
    );
    await fetchReports();
    return data;
  };

  const createRule = async (payload) => {
    guardInactive("create rule");
    const data = await runAction(
      () => createGroupRuleApi(groupId, payload),
      "Unable to create group rule"
    );
    await fetchRules();
    return data;
  };

  const updateRule = async (ruleId, payload) => {
    guardInactive("update rule");
    const data = await runAction(
      () => updateGroupRuleApi(groupId, ruleId, payload),
      "Unable to update group rule"
    );
    await fetchRules();
    return data;
  };

  const deleteRule = async (ruleId) => {
    guardInactive("delete rule");
    const data = await runAction(
      () => deleteGroupRuleApi(groupId, ruleId),
      "Unable to delete group rule"
    );
    await fetchRules();
    return data;
  };

  const deleteGroup = async () => {
    const data = await runAction(
      () => deleteGroupApi(groupId),
      "Unable to delete group"
    );
    setInactiveState({
      locked: false,
      deleted: true,
      reason: "This group has been deleted and is no longer available.",
    });
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
      isMember,
      hasPendingRequest,
      membershipStatusLoading,
      isInactive: isGroupInactive(inactiveState),
      inactiveReason: getInactiveReason(inactiveState),
      inactiveState,
      fetchGroupDetail,
      fetchMembers,
      fetchJoinRequests,
      fetchReports,
      fetchRules,
      fetchMembershipStatus,
      createGroup,
      updateGroup,
      uploadCoverPhoto,
      joinGroup,
      leaveGroup,
      cancelJoinRequest,
      deleteGroup,
      reportGroup,
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
