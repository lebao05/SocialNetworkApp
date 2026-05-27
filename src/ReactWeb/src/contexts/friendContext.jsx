import { createContext, useContext, useEffect, useState } from "react";
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

const FriendContext = createContext(null);

export function FriendProvider({ children }) {
    const [friends, setFriends] = useState([]);
    const [incomingRequests, setIncomingRequests] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [friendsPage, setFriendsPage] = useState(1);
    const [friendRequestsPage, setFriendRequestsPage] = useState(1);
    const [hasMoreFriends, setHasMoreFriends] = useState(true);
    const [hasMoreIncomingRequests, setHasMoreIncomingRequests] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchFriends(1, false);
        fetchIncomingFriendRequests(1, false);
    }, []);

    const handleApiError = (err, fallbackMessage) => {
        const message = err?.message || fallbackMessage;
        setError(message);
        return message;
    };

    const normalizePagedResponse = (response) => {
        const items = Array.isArray(response)
            ? response
            : response?.items ?? [];

        return {
            items,
            pageNumber: response?.pageNumber ?? 1,
            pageSize: response?.pageSize ?? items.length,
            totalCount: response?.totalCount ?? items.length,
        };
    };

    const fetchFriends = async (page = 1, append = false) => {
        try {
            setLoading(true);
            const data = await getFriendsApi(page);
            const { items, pageNumber, pageSize, totalCount } = normalizePagedResponse(data);
            setFriends((prev) => (append ? [...prev, ...items] : items));
            setFriendsPage(pageNumber);
            setHasMoreFriends(pageNumber * pageSize < totalCount);
            setError(null);
            return items;
        } catch (err) {
            handleApiError(err, "Unable to fetch friends");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const fetchIncomingFriendRequests = async (page = 1, append = false) => {
        try {
            setLoading(true);
            const data = await getIncomingFriendRequestsApi(page);
            const { items, pageNumber, pageSize, totalCount } = normalizePagedResponse(data);
            setIncomingRequests((prev) => (append ? [...prev, ...items] : items));
            setFriendRequestsPage(pageNumber);
            setHasMoreIncomingRequests(pageNumber * pageSize < totalCount);
            setError(null);
            return items;
        } catch (err) {
            handleApiError(err, "Unable to fetch incoming friend requests");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const loadMoreFriends = async () => {
        if (!hasMoreFriends || loading) return;
        const nextPage = friendsPage + 1;
        return fetchFriends(nextPage, true);
    };

    const loadMoreIncomingFriendRequests = async () => {
        if (!hasMoreIncomingRequests || loading) return;
        const nextPage = friendRequestsPage + 1;
        return fetchIncomingFriendRequests(nextPage, true);
    };

    const fetchFriendRecommendations = async (limit = 10) => {
        try {
            setLoading(true);
            const data = await getFriendRecommendationsApi(limit);
            setRecommendations(data);
            setError(null);
            return data;
        } catch (err) {
            handleApiError(err, "Unable to fetch friend recommendations");
            throw err;
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
            handleApiError(err, "Unable to send friend request");
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
            handleApiError(err, "Unable to accept friend request");
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
            handleApiError(err, "Unable to fetch mutual friends");
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
            handleApiError(err, "Unable to fetch shortest friend path");
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
            handleApiError(err, "Unable to sync friends");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const clearFriendError = () => setError(null);

    return (
        <FriendContext.Provider
            value={{
                friends,
                incomingRequests,
                recommendations,
                loading,
                error,
                friendsPage,
                friendRequestsPage,
                hasMoreFriends,
                hasMoreIncomingRequests,
                fetchFriends,
                fetchIncomingFriendRequests,
                loadMoreFriends,
                loadMoreIncomingFriendRequests,
                fetchFriendRecommendations,
                sendFriendRequest,
                acceptFriendRequest,
                getMutualFriends,
                getShortestPath,
                syncAllFriends,
                setFriends,
                setIncomingRequests,
                setRecommendations,
                clearFriendError,
            }}
        >
            {children}
        </FriendContext.Provider>
    );
}

export function useFriendContext() {
    const context = useContext(FriendContext);
    if (!context) {
        throw new Error("useFriendContext must be used inside a FriendProvider");
    }
    return context;
}
