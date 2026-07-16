import axios from "./axios";

const DEFAULT_PAGE_SIZE = 20;

/**
 * Search for posts: GET /api/posts/search?q=&page=&pageSize=
 */
export async function searchPostsApi({ q = null, page = 1, pageSize = DEFAULT_PAGE_SIZE } = {}) {
  const response = await axios.get("/posts/search", {
    params: { q, page, pageSize },
  });
  return response.data; // PagedList<PostDto>
}

/**
 * Search for users: GET /api/users/search?q=&page=&pageSize=
 */
export async function searchUsersApi({ q = null, page = 1, pageSize = DEFAULT_PAGE_SIZE } = {}) {
  const response = await axios.get("/users/search", {
    params: { q, page, pageSize },
  });
  return response.data; // PagedList<SearchUserDto>
}

/**
 * Search for groups: GET /api/groups?isJoining=false&searchTerm=&page=&pageSize=
 */
export async function searchGroupsApi({ q = null, page = 1, pageSize = DEFAULT_PAGE_SIZE } = {}) {
  const response = await axios.get("/groups", {
    params: { isJoining: false, searchTerm: q, page, pageSize },
  });
  return response.data; // PagedList<GroupCardDto>
}

/**
 * Search for reels: GET /api/reels/search?q=&page=&pageSize=
 */
export async function searchReelsApi({ q = null, page = 1, pageSize = DEFAULT_PAGE_SIZE } = {}) {
  const response = await axios.get("/reels/search", {
    params: { q, page, pageSize },
  });
  return response.data; // PagedList<SearchReelDto>
}
