import { useContext } from "react";
import AuthContext from "./authContextObject";

/**
 * Hook for components to read the auth state from AuthProvider. The hook
 * lives in its own module (rather than alongside the provider component)
 * so fast-refresh keeps working — exporting a hook and a component from
 * the same file trips `react-refresh/only-export-components`.
 */
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
}
