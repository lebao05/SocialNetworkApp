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
 * Gets group detail, including the current user's role in the group.
 * Maps to GET /api/groups/{groupId}.
 */
export async function getGroupDetailApi(groupId) {
  const response = await axios.get(`/groups/${groupId}`);
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
  isPostApprovalRequired = false,
  isGroupJoinApprovalRequired = false,
  allowAnonymousPost = false,
}) {
  const response = await axios.put(`/groups/${groupId}`, {
    name,
    description,
    isPrivate,
    isPostApprovalRequired,
    isGroupJoinApprovalRequired,
    allowAnonymousPost,
  });
  return response.data;
}

/**
 * Uploads or replaces a group's cover photo.
 * Maps to POST /api/groups/{groupId}/cover-photo.
 */
export async function uploadGroupCoverPhotoApi(groupId, file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post(`/groups/${groupId}/cover-photo`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
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
 * Gets paginated pending group join requests with optional filters.
 * Maps to GET /api/groups/{groupId}/join-requests?page=&pageSize=&searchTerm=&fromDate=&haveAvatar=
 */
export async function getGroupJoinRequestsApi(
  groupId,
  { page = 1, pageSize = 20, searchTerm = null, fromDate = null, haveAvatar = null } = {}
) {
  const response = await axios.get(`/groups/${groupId}/join-requests`, {
    params: { page, pageSize, searchTerm, fromDate, haveAvatar },
  });
  return response.data;
}

/**
 * Approves or rejects a pending group join request.
 * Maps to POST /api/groups/{groupId}/join-requests/{requestId}/review.
 */
export async function reviewGroupJoinRequestApi(groupId, requestId, approve) {
  const response = await axios.post(`/groups/${groupId}/join-requests/${requestId}/review`, {
    approve,
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
 * Gets all rules for a group.
 * Maps to GET /api/groups/{groupId}/rules.
 */
export async function getGroupRulesApi(groupId) {
  const response = await axios.get(`/groups/${groupId}/rules`);
  return response.data;
}

/**
 * Creates a group rule.
 * Maps to POST /api/groups/{groupId}/rules.
 */
export async function createGroupRuleApi(groupId, { title, description }) {
  const response = await axios.post(`/groups/${groupId}/rules`, {
    title,
    description,
  });
  return response.data;
}

/**
 * Updates a group rule.
 * Maps to PUT /api/groups/{groupId}/rules/{ruleId}.
 */
export async function updateGroupRuleApi(groupId, ruleId, { title, description }) {
  const response = await axios.put(`/groups/${groupId}/rules/${ruleId}`, {
    title,
    description,
  });
  return response.data;
}

/**
 * Deletes a group rule.
 * Maps to DELETE /api/groups/{groupId}/rules/{ruleId}.
 */
export async function deleteGroupRuleApi(groupId, ruleId) {
  const response = await axios.delete(`/groups/${groupId}/rules/${ruleId}`);
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

/**
 * Gets group insights (growth, engagement, member stats).
 * Maps to GET /api/groups/{groupId}/insights
 *
 * @param {number} groupId
 * @param {{ fromDate?: string, toDate?: string }} options
 * @returns {Promise<{
 *   totalMembers: number,
 *   requests: number,
 *   reviewed: number,
 *   approved: number,
 *   declined: number,
 *   posts: number,
 *   comments: number,
 *   reactions: number,
 *   activeMembers: number,
 *   topDays: Array<{ label: string, count: number }>,
 *   peakHours: Array<{ label: string, count: number }>,
 *   growthChart: Array<{ date: string, value: number }>,
 *   engagementChart: Array<{ date: string, value: number }>,
 * }>}
 */
export async function getGroupInsightsApi(groupId, { fromDate = null, toDate = null } = {}) {
  const response = await axios.get(`/groups/${groupId}/insights`, {
    params: { fromDate, toDate },
  });
  return response.data;
}

/**
 * Gets paginated groups filtered by the user's membership status.
 * Maps to GET /api/groups?isJoining=&page=&pageSize=&searchTerm=
 *
 * @param {{ isJoining: boolean, page?: number, pageSize?: number, searchTerm?: string }} options
 * @returns {Promise<{
 *   items: Array<{
 *     id: number,
 *     name: string,
 *     coverPhotoUrl: string|null,
 *     privacyType: string,
 *     memberCount: number,
 *     avgPostsLast30Days: number,
 *     friendPreview: Array<{ userId: string, fullName: string, avatarUrl: string|null }>,
 *     friendCount: number,
 *   }>,
 *   pageNumber: number,
 *   pageSize: number,
 *   totalCount: number,
 * }>}
 */
export async function getGroupsApi({ isJoining, page = 1, pageSize = 12, searchTerm = null } = {}) {
  const response = await axios.get("/groups", {
    params: { isJoining, page, pageSize, searchTerm },
  });
  return response.data;
}
