import axios from "./axios";

/**
 * Fetches the current logged-in user's profile information.
 * Maps to GET /api/users/profile in the C# UserController.
 * Since it uses the [Authorize] attribute, the Axios interceptor 
 * must attach the Bearer token to this request.
 */
export async function getUserProfileApi() {
    const response = await axios.get("/users/profile");
    // Returns UserProfileResponse: { id, email, firstName, lastName, dateOfBirth, avatarUrl, gender }
    return response.data;
}

/**
 * Fetches detailed personal info for a user.
 * Maps to GET /api/users/{id}/personal-info in the C# UserController.
 */
export async function getPersonalInfoApi(userId) {
    const response = await axios.get(`/users/${userId}/personal-info`);
    return response.data;
}

/**
 * Updates user personal info.
 * Maps to PUT /api/users/info in the C# UserController.
 */
export async function updateUserInfoApi(data) {
    const response = await axios.put("/users/info", data);
    return response.data;
}
