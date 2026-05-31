import axios from "./axios";

/**
 * Creates a group.
 * Maps to POST /api/groups.
 */
export async function createGroupApi({ name, isPrivate = false }) {
  const response = await axios.post("/groups", { name, isPrivate });
  return response.data;
}

/**
 * Updates group profile and settings.
 * Maps to PUT /api/groups/{groupId}.
 */
export async function updateGroupApi(groupId, {
  name,
  description = null,
  isPrivate = false,
  isHidden = false,
  isPostApprovalRequired = false,
  isGroupJoinApprovalRequired = false,
  allowAnonymousPost = false,
}) {
  const response = await axios.put(`/groups/${groupId}`, {
    name,
    description,
    isPrivate,
    isHidden,
    isPostApprovalRequired,
    isGroupJoinApprovalRequired,
    allowAnonymousPost,
  });
  return response.data;
}

/**
 * Gets paginated group members with optional search and role filtering.
 * Maps to GET /api/groups/{groupId}/members?page=&pageSize=&searchTerm=&role=
 */
export async function getGroupMembersApi(
  groupId,
  { page = 1, pageSize = 20, searchTerm = null, role = null } = {}
) {
  const response = await axios.get(`/groups/${groupId}/members`, {
    params: { page, pageSize, searchTerm, role },
  });
  return response.data;
}

/**
 * Gets paginated pending group join requests with optional requester name search.
 * Maps to GET /api/groups/{groupId}/join-requests?page=&pageSize=&searchTerm=
 */
export async function getGroupJoinRequestsApi(
  groupId,
  { page = 1, pageSize = 20, searchTerm = null } = {}
) {
  const response = await axios.get(`/groups/${groupId}/join-requests`, {
    params: { page, pageSize, searchTerm },
  });
  return response.data;
}

/**
 * Joins a group or creates a pending join request when approval is required.
 * Maps to POST /api/groups/{groupId}/join.
 */
export async function joinGroupApi(groupId) {
  const response = await axios.post(`/groups/${groupId}/join`);
  return response.data;
}

/**
 * Assigns a role to a group member.
 * Maps to PUT /api/groups/{groupId}/members/{userId}/role.
 */
export async function assignGroupRoleApi(groupId, userId, role) {
  const response = await axios.put(`/groups/${groupId}/members/${userId}/role`, { role });
  return response.data;
}

/**
 * Approves or rejects a pending group post.
 * Maps to POST /api/groups/{groupId}/posts/{postId}/review.
 */
export async function reviewGroupPostApi(groupId, postId, approve) {
  const response = await axios.post(`/groups/${groupId}/posts/${postId}/review`, { approve });
  return response.data;
}

/**
 * Reports a group post.
 * Maps to POST /api/groups/{groupId}/posts/{postId}/reports.
 */
export async function reportGroupPostApi(groupId, postId, { reason, additionalDetail = null }) {
  const response = await axios.post(`/groups/${groupId}/posts/${postId}/reports`, {
    reason,
    additionalDetail,
  });
  return response.data;
}

/**
 * Gets paginated reported contents for a group.
 * Maps to GET /api/groups/{groupId}/reports?page=&pageSize=&status=
 */
export async function getReportedContentsApi(
  groupId,
  { page = 1, pageSize = 20, status = null } = {}
) {
  const response = await axios.get(`/groups/${groupId}/reports`, {
    params: { page, pageSize, status },
  });
  return response.data;
}

/**
 * Executes a pending group content report.
 * Maps to POST /api/groups/{groupId}/reports/{reportId}/execute.
 */
export async function executeReportedContentApi(groupId, reportId, { hidePost = true, reviewNote = null } = {}) {
  const response = await axios.post(`/groups/${groupId}/reports/${reportId}/execute`, {
    hidePost,
    reviewNote,
  });
  return response.data;
}

/**
 * Leaves a group.
 * Maps to DELETE /api/groups/{groupId}/leave.
 */
export async function leaveGroupApi(groupId) {
  const response = await axios.delete(`/groups/${groupId}/leave`);
  return response.data;
}
