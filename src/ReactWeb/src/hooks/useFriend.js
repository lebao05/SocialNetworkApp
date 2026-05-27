import { useState, useEffect } from "react";
import {
    getFriendsApi,
    getIncomingFriendRequestsApi,
    getFriendRecommendationsApi,
    sendFriendRequestApi,
    acceptFriendRequestApi,
    getMutualFriendsApi,
    getShortestPathApi,
    syncAllFriendsApi,
} from "../apis/friendApi";

export function useFriend() {
    const [friends, setFriends] = useState([]);
    const [incomingRequests, setIncomingRequests] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchFriends();
        fetchIncomingFriendRequests();
    }, []);

    const fetchFriends = async (page = 1) => {
        try {
            setLoading(true);
            const data = await getFriendsApi(page);
            setFriends(data);
            setError(null);
        } catch (err) {
            setError(err?.message || "Unable to fetch friends");
        } finally {
            setLoading(false);
        }
    };

    const fetchIncomingFriendRequests = async (page = 1) => {
        try {
            setLoading(true);
            const data = await getIncomingFriendRequestsApi(page);
            setIncomingRequests(data);
            setError(null);
        } catch (err) {
            setError(err?.message || "Unable to fetch incoming friend requests");
        } finally {
            setLoading(false);
        }
    };

    const fetchFriendRecommendations = async (limit = 10) => {
        try {
            setLoading(true);
            const data = await getFriendRecommendationsApi(limit);
            setRecommendations(data);
            setError(null);
        } catch (err) {
            setError(err?.message || "Unable to fetch friend recommendations");
        } finally {
            setLoading(false);
        }
    };

    const sendFriendRequest = async (receiverId) => {
        try {
            setLoading(true);
            const data = await sendFriendRequestApi(receiverId);
            setError(null);
            return data;
        } catch (err) {
            setError(err?.message || "Unable to send friend request");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const acceptFriendRequest = async (requestId) => {
        try {
            setLoading(true);
            const data = await acceptFriendRequestApi(requestId);
            setError(null);
            return data;
        } catch (err) {
            setError(err?.message || "Unable to accept friend request");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getMutualFriends = async (otherUserId) => {
        try {
            setLoading(true);
            const data = await getMutualFriendsApi(otherUserId);
            setError(null);
            return data;
        } catch (err) {
            setError(err?.message || "Unable to fetch mutual friends");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getShortestPath = async (otherUserId) => {
        try {
            setLoading(true);
            const data = await getShortestPathApi(otherUserId);
            setError(null);
            return data;
        } catch (err) {
            setError(err?.message || "Unable to fetch shortest friend path");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const syncAllFriends = async () => {
        try {
            setLoading(true);
            const data = await syncAllFriendsApi();
            setError(null);
            return data;
        } catch (err) {
            setError(err?.message || "Unable to sync friends");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        friends,
        incomingRequests,
        recommendations,
        loading,
        error,
        fetchFriends,
        fetchIncomingFriendRequests,
        fetchFriendRecommendations,
        sendFriendRequest,
        acceptFriendRequest,
        getMutualFriends,
        getShortestPath,
        syncAllFriends,
        setFriends,
        setIncomingRequests,
        setRecommendations,
    };
}
