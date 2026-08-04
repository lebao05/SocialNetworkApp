"use client";
import { useEffect, useState } from "react";
import { signinApi, signupApi } from "../apis/authApi";
import { getUserProfileApi } from "../apis/userApi";
import AuthContext from "./authContextObject";
// We re-export `useAuth` here for backwards compatibility with the ~30
// components that already `import { useAuth } from "../contexts/authContext"`.
// The hook itself lives in ./useAuth.js so fast-refresh keeps working for
// AuthProvider; re-exporting it from this file is the path of least change
// for the rest of the app.
/* eslint-disable react-refresh/only-export-components */
export { useAuth } from "./useAuth";

/**
 * Walks the axios error response looking for the ProblemDetails-style
 * "type" field used by every Result.Failure in the C# API. Returns
 * `true` only when the type matches the lock middleware's contract.
 */
function isLockedError(err) {
    const data = err?.response?.data;
    if (!data || typeof data !== "object") return false;
    // The middleware serialises the ProblemDetails "type" field with
    // camelCase PropertyNamingPolicy, but we accept the PascalCase variant
    // too in case the host ever changes the serializer.
    return data.type === "User.Locked" || data.Type === "User.Locked";
}

/**
 * Strip any token we may have written before discovering the user is
 * locked, and reset auth state. After this returns the user has no
 * session, so ProtectedRoute will bounce them to /sign-in. We do NOT
 * keep the token around because (a) the user explicitly failed the
 * lock check and (b) retrying any call would keep returning 403.
 */
function clearLockedSession({ setUser, setToken }) {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    /* ===========================
       INITIAL AUTH CHECK
       =========================== */
    useEffect(() => {
        const bootstrapAuth = async () => {
            const savedToken = localStorage.getItem("token");

            if (!savedToken) {
                setLoading(false);
                return;
            }

            setToken(savedToken);

            try {
                const profile = await getUserProfileApi();
                setUser(profile);
            } catch (err) {
                if (isLockedError(err)) {
                    // Lock middleware rejected the account — wipe the
                    // session and let the user land on /sign-in via
                    // ProtectedRoute's normal redirect.
                    console.warn("Stored session belongs to a locked account; clearing token.");
                    clearLockedSession({ setUser, setToken });
                } else {
                    console.error("Auth bootstrap failed:", err);
                    clearLockedSession({ setUser, setToken });
                }
            } finally {
                setLoading(false);
            }
        };

        bootstrapAuth();
    }, []);


    /* ===========================
       LOGIN
       =========================== */
    const signin = async (email, password) => {
        setLoading(true);
        try {
            const jwt = await signinApi(email, password);

            if (!jwt || typeof jwt !== "string") {
                throw new Error("Invalid token received from server");
            }

            localStorage.setItem("token", jwt);
            setToken(jwt);

            try {
                const profile = await getUserProfileApi();
                setUser(profile);
                return { success: true };
            } catch (err) {
                // The token was issued but the account is locked. Tear down
                // the partial session so the user lands back on /sign-in
                // without ever seeing the protected app.
                if (isLockedError(err)) {
                    clearLockedSession({ setUser, setToken });
                    return { success: false, locked: true };
                }
                throw err;
            }
        } catch (err) {
            console.error("Login logic failed:", err);

            if (isLockedError(err)) {
                clearLockedSession({ setUser, setToken });
                return { success: false, locked: true };
            }

            let errorMessage = "Login failed";
            if (err.response?.data) {
                const data = err.response.data;
                if (typeof data === "string") {
                    errorMessage = data;
                } else if (data.detail) {
                    errorMessage = data.detail;
                } else if (data.Detail) {
                    errorMessage = data.Detail;
                } else if (data.errors) {
                    errorMessage = Object.values(data.errors).flat().join(". ");
                } else if (data.message) {
                    errorMessage = data.message;
                } else {
                    errorMessage = JSON.stringify(data);
                }
            } else {
                errorMessage = err.message || "An unknown error occurred";
            }

            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    /* ===========================
       REGISTER
       =========================== */
    const signup = async (payload) => {
        setLoading(true);
        try {
            const jwt = await signupApi(payload);

            if (!jwt || typeof jwt !== "string") {
                throw new Error("Registration succeeded but token was not received.");
            }

            localStorage.setItem("token", jwt);
            setToken(jwt);

            try {
                const profile = await getUserProfileApi();
                setUser(profile);
                return { success: true };
            } catch (err) {
                if (isLockedError(err)) {
                    clearLockedSession({ setUser, setToken });
                    return { success: false, locked: true };
                }
                throw err;
            }
        } catch (err) {
            console.error("Signup logic failed:", err);

            if (isLockedError(err)) {
                clearLockedSession({ setUser, setToken });
                return { success: false, locked: true };
            }

            let errorMessage = "Registration failed";
            if (err.response?.data) {
                const data = err.response.data;
                if (typeof data === "string") {
                    errorMessage = data;
                } else if (data.detail) {
                    errorMessage = data.detail;
                } else if (data.Detail) {
                    errorMessage = data.Detail;
                } else if (data.errors) {
                    errorMessage = Object.values(data.errors).flat().join(". ");
                } else if (data.message) {
                    errorMessage = data.message;
                } else {
                    errorMessage = JSON.stringify(data);
                }
            } else {
                errorMessage = err.message || "An unknown error occurred";
            }

            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };


    /* ===========================
       LOGOUT
       =========================== */
    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
        setToken(null);
    };



    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                signin,
                signup,
                logout,
                setUser
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
