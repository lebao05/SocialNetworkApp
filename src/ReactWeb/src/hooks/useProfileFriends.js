import { useState, useEffect, useCallback } from "react";
import { getFriendsApi } from "../apis/friendApi";

export function useProfileFriends(userId, searchTerm = "") {
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchFriends = useCallback(async () => {
        if (!userId) return;

        try {
            setLoading(true);
            const data = await getFriendsApi(1, searchTerm || null);
            setFriends(Array.isArray(data) ? data : data?.items ?? []);
            setError(null);
        } catch (err) {
            setError(err?.response?.data?.message || err?.message || "Failed to load friends");
        } finally {
            setLoading(false);
        }
    }, [userId, searchTerm]);

    useEffect(() => {
        fetchFriends();
    }, [fetchFriends]);

    return { friends, loading, error, fetchFriends };
}
