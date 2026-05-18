import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";

export default function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/sign-in" replace />;
    }

    return children;
}
