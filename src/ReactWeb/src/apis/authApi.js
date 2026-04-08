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