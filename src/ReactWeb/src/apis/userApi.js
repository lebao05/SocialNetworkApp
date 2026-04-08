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
