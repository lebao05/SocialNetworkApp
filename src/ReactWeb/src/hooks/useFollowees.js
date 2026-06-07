import { useState, useEffect, useCallback } from "react";
import { getFolloweesApi } from "../apis/friendApi";

export function useFollowees(userId = null) {
    const [followees, setFollowees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchFollowees = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getFolloweesApi(userId);
            setFollowees(Array.isArray(data) ? data : data?.items ?? []);
            setError(null);
        } catch (err) {
            setError(err?.response?.data?.message || err?.message || "Failed to load followees");
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchFollowees();
    }, [fetchFollowees]);

    return { followees, loading, error, fetchFollowees };
}
