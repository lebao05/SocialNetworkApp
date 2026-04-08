"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { signinApi, signupApi } from "../apis/authApi";
import { getUserProfileApi } from "../apis/userApi";

const AuthContext = createContext(null);

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
                // Fetch profile using the saved token

            } catch (err) {
                console.error("Auth bootstrap failed:", err);
                logout();
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

            // Log it to see what you're actually getting
            console.log("JWT Received:", jwt);

            if (!jwt || typeof jwt !== "string") {
                throw new Error("Invalid token received from server");
            }

            localStorage.setItem("token", jwt);
            setToken(jwt);

            // IMPORTANT: Manually set the header for the next call 
            // if your axios config doesn't do it dynamically
            // axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;

            const profile = await getUserProfileApi();
            setUser(profile);

            return { success: true };
        } catch (err) {
            console.error("Login logic failed:", err);

            // Extract the error message properly
            const errorMessage = err.response?.data?.Detail || err.message || "Login failed";
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
            // Payload: { firstName, lastName, dateOfBirth, gender, email, password }
            const jwt = await signupApi(payload);

            if (!jwt || typeof jwt !== "string") {
                throw new Error("Registration succeeded but token was not received.");
            }

            localStorage.setItem("token", jwt);
            setToken(jwt);

            const profile = await getUserProfileApi();
            setUser(profile);

            return { success: true };
        } catch (err) {
            console.error("Signup logic failed:", err);
            const errorMessage = err.response?.data?.Detail || err.message || "Registration failed";
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
        setSellerRequest(null);
    };



    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                signin,
                signup,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

/* ===========================
   CUSTOM HOOK
   =========================== */
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
}