import axios from "./axios";

export async function getNotificationsApi(page = 1, pageSize = 20, isSeen = null) {
    const response = await axios.get("/notifications", {
        params: {
            page,
            pageSize,
            isSeen: isSeen ?? undefined,
        },
    });
    return response.data;
}

export async function markNotificationAsSeenApi(notificationId) {
    const response = await axios.patch(`/notifications/${notificationId}/seen`);
    return response.data;
}
