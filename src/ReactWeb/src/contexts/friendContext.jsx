import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./authContext";
import {
    getFriendsApi,
    getIncomingFriendRequestsApi,
    getFriendRecommendationsApi,
    sendFriendRequestApi,
    acceptFriendRequestApi,
    rejectFriendRequestApi,
    cancelFriendRequestApi,
    unfriendApi,
    followUserApi,
    unfollowUserApi,
} from "../apis/friendApi";

const FriendContext = createContext(null);

export function FriendProvider({ children }) {
    const { user } = useAuth();
    const [friends, setFriends] = useState([]);
    const [incomingRequests, setIncomingRequests] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [friendsPage, setFriendsPage] = useState(1);
    const [friendRequestsPage, setFriendRequestsPage] = useState(1);
    const [recommendationsPage, setRecommendationsPage] = useState(1);
    const [hasMoreFriends, setHasMoreFriends] = useState(true);
    const [hasMoreIncomingRequests, setHasMoreIncomingRequests] = useState(true);
    const [hasMoreRecommendations, setHasMoreRecommendations] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    console.log(friends);
    useEffect(() => {
        if (!user) return;
        fetchFriends(1, false);
        fetchIncomingFriendRequests(1, false);
        fetchFriendRecommendations(1, false);
    }, [user]);

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

    const fetchFriends = async (page = 1, append = false, userId = null) => {
        try {
            setLoading(true);
            const data = await getFriendsApi(page, null, userId);
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

    const fetchFriendRecommendations = async (page = 1, append = false) => {
        try {
            setLoading(true);
            const limit = 10;
            const data = await getFriendRecommendationsApi(page, limit);
            setRecommendations((prev) => (append ? [...prev, ...data] : data));
            setRecommendationsPage(page);
            setHasMoreRecommendations(data.length === limit);
            setError(null);
            return data;
        } catch (err) {
            handleApiError(err, "Unable to fetch friend recommendations");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const loadMoreRecommendations = async () => {
        if (!hasMoreRecommendations || loading) return;
        const nextPage = recommendationsPage + 1;
        return fetchFriendRecommendations(nextPage, true);
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
            console.log(`Error accepting friend request ${requestId}:`, err);
            handleApiError(err, "Unable to accept friend request");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const rejectFriendRequest = async (requestId) => {
        try {
            setLoading(true);
            const data = await rejectFriendRequestApi(requestId);
            setError(null);
            return data;
        } catch (err) {
            console.log(`Error rejecting friend request ${requestId}:`, err);
            handleApiError(err, "Unable to reject friend request");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const unfriend = async (friendUserId) => {
        try {
            setLoading(true);
            const data = await unfriendApi(friendUserId);
            // Do NOT remove from the list. Just flip isFriend to false so the
            // UI updates the button to "Send Friend Request" on that card.
            setFriends((prev) =>
                prev.map((f) =>
                    f.id === friendUserId || f.userId === friendUserId
                        ? { ...f, isFriend: false, isSendingFriendRequest: false }
                        : f
                )
            );
            setError(null);
            return data;
        } catch (err) {
            console.log(`Error unfriending user ${friendUserId}:`, err);
            handleApiError(err, "Unable to unfriend");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const cancelFriendRequest = async (receiverId) => {
        try {
            setLoading(true);
            const data = await cancelFriendRequestApi(receiverId);
            setError(null);
            return data;
        } catch (err) {
            handleApiError(err, "Unable to cancel friend request");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const followUser = async (userId) => {
        try {
            setLoading(true);
            const data = await followUserApi(userId);
            setError(null);
            return data;
        } catch (err) {
            handleApiError(err, "Unable to follow user");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const unfollowUser = async (userId) => {
        try {
            setLoading(true);
            const data = await unfollowUserApi(userId);
            setError(null);
            return data;
        } catch (err) {
            handleApiError(err, "Unable to unfollow user");
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
                recommendationsPage,
                hasMoreFriends,
                hasMoreIncomingRequests,
                hasMoreRecommendations,
                fetchFriends,
                fetchIncomingFriendRequests,
                loadMoreFriends,
                loadMoreIncomingFriendRequests,
                fetchFriendRecommendations,
                loadMoreRecommendations,
                sendFriendRequest,
                acceptFriendRequest,
                rejectFriendRequest,
                unfriend,
                cancelFriendRequest,
                followUser,
                unfollowUser,
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
