import axios from "./axios";

/**
 * Signs in a user and returns a token (Result<string>)
 */
export async function signinApi(email, password) {
    const response = await axios.post("/auth/login", {
        email,
        password
    });
    return response.data;
}

/**
 * Registers a new user with the fields required by the C# RegisterRequest
 * Includes: FirstName, LastName, DateOfBirth, Gender, Email, Password
 */
export async function signupApi({
    firstName,
    lastName,
    dateOfBirth,
    gender,
    email,
    password
}) {
    const response = await axios.post("/auth/register", {
        firstName,
        lastName,
        dateOfBirth, // Ensure this is formatted as "YYYY-MM-DD" for DateOnly
        gender,      // Matches the Gender Enum (typically 0, 1, or string)
        email,
        password
    });
    return response.data;
}

/**
 * Starts the password-reset flow. The backend returns 200 with the
 * same payload whether or not the email exists, so callers don't have
 * to special-case "unknown address".
 */
export async function forgotPasswordApi(email) {
    const response = await axios.post("/auth/forgot-password", { email });
    return response.data;
}

/**
 * Consumes a password-reset token delivered to the user's inbox.
 * Returns the server's JSON payload on success; throws on a
 * ProblemDetails 4xx (token expired, new-password too weak, ...).
 */
export async function resetPasswordApi({ email, token, newPassword }) {
    const response = await axios.post("/auth/reset-password", {
        email,
        token,
        newPassword
    });
    return response.data;
}