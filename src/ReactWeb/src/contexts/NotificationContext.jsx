import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import * as signalR from "@microsoft/signalr";
import {
  getNotificationsApi,
  markNotificationAsSeenApi,
} from "../apis/notificationApi";
import { useAuth } from "./authContext";

const NotificationContext = createContext(null);

const DEFAULT_PAGE_SIZE = 20;

const normalizeResponse = (data) => {
  if (!data) return { items: [], totalCount: 0 };
  if (Array.isArray(data)) return { items: data, totalCount: data.length };
  if (data.items) {
    return {
      items: data.items,
      totalCount: data.totalCount ?? data.items.length,
    };
  }
  return { items: [], totalCount: 0 };
};

// "ReceiveNotification" carries the full NotificationDto so we can inject it
// directly into local state without an extra API call. The backend always
// emits this single event for every notification, so we no longer need to
// listen for typed fan-out events (e.g. "CommentCreated", "FriendRequestReceived").
const REALTIME_DTO_EVENT = "ReceiveNotification";

export function NotificationProvider({ children }) {
  const { user } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unseenCount, setUnseenCount] = useState(0);

  const totalLoadedRef = useRef(0);
  const connectionRef = useRef(null);

    const loadPage = useCallback(
      async (p = 1, append = false) => {
        if (!user) return;
        setLoading(true);
        try {
          const data = await getNotificationsApi(p, DEFAULT_PAGE_SIZE);
          const { items, totalCount } = normalizeResponse(data);

          // API responses can occasionally contain the same notification id
          // twice (e.g. when a SQL JOIN in the repository pulls in a row per
          // related entity). Collapse by id before merging into state so the
          // dropdown/page never shows the same notification twice.
          const uniqueItems = Array.from(
            new Map(items.map((n) => [n.id, n])).values(),
          );

          if (!append) {
            setNotifications(uniqueItems);
            totalLoadedRef.current = uniqueItems.length;
          } else {
            setNotifications((prev) => {
              const existingIds = new Set(prev.map((n) => n.id));
              const newItems = uniqueItems.filter((n) => !existingIds.has(n.id));
              totalLoadedRef.current += newItems.length;
              return [...prev, ...newItems];
            });
          }

          setPage(p);
          setHasMore(totalLoadedRef.current < totalCount);
          setUnseenCount(uniqueItems.filter((n) => !n.isSeen).length);
          setError(null);
        } catch (err) {
          console.error("Failed to load notifications:", err);
          setError("Unable to load notifications.");
        } finally {
          setLoading(false);
        }
      },
      [user],
    );

  // Initial load + reload whenever the authenticated user changes.
  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setPage(1);
      setHasMore(true);
      setUnseenCount(0);
      totalLoadedRef.current = 0;
      return;
    }
    loadPage(1);
  }, [user, loadPage]);

  const loadMore = () => {
    if (!hasMore || loading) return;
    loadPage(page + 1, true);
  };

  const markAsSeen = useCallback(async (notificationId) => {
    try {
      await markNotificationAsSeenApi(notificationId);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, isSeen: true } : n,
        ),
      );
      setUnseenCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to mark notification as seen:", err);
    }
  }, []);

  const markAllAsSeen = useCallback(async () => {
    setNotifications((prev) => {
      prev
        .filter((n) => !n.isSeen)
        .forEach((n) => {
          markNotificationAsSeenApi(n.id).catch((err) =>
            console.error("Failed to mark notification as seen:", err),
          );
        });
      return prev.map((n) => ({ ...n, isSeen: true }));
    });
    setUnseenCount(0);
  }, []);

  // SignalR connection — only when authenticated. The backend emits a single
  // "ReceiveNotification" event with the full NotificationDto for every new
  // notification, so we inject it directly into local state without any extra
  // round-trip to the API.
  useEffect(() => {
    if (!user) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    // Use the hub base URL (no /api suffix) so we connect to /hubs/notifications.
    // VITE_API_BASE_URL points at the REST API and ends in /api; using it would
    // produce a 405 because ASP.NET only maps /hubs/notifications, not
    // /api/hubs/notifications. The other hubs (chat, call) already follow
    // this pattern — see ChatContext / CallContext.
    const baseUrl = import.meta.env.VITE_API_HUB_BASE_URL || "";

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${baseUrl}/hubs/notifications`, {
        accessTokenFactory: () => token,
        // Do NOT skip negotiate. With skipNegotiation=true the client never
        // POSTs /hubs/notifications/negotiate, so the server never mints a
        // connection token and the subsequent WebSocket upgrade is rejected
        // with "the connection ID is not present on the server". Letting
        // SignalR negotiate first matches what ChatContext/CallContext do
        // and is the canonical setup for ASP.NET SignalR.
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    const onReceiveNotification = (notification) => {
      if (!notification?.id) return;
      setNotifications((prev) => {
        const exists = prev.some((n) => n.id === notification.id);
        if (exists) return prev;
        return [notification, ...prev];
      });

      if (!notification.isSeen) {
        setUnseenCount((prev) => prev + 1);
      }
    };

    connection.on(REALTIME_DTO_EVENT, onReceiveNotification);

    connection
      .start()
      .then(() => {
        console.info("Notification hub connected");
      })
      .catch((err) => {
        console.error("Notification hub connection failed:", err);
      });

    connectionRef.current = connection;

    return () => {
      connection.off(REALTIME_DTO_EVENT, onReceiveNotification);
      if (connectionRef.current) {
        connectionRef.current.stop().catch(() => {});
        connectionRef.current = null;
      }
    };
  }, [user]);

  const value = {
    notifications,
    loading,
    error,
    hasMore,
    page,
    unseenCount,
    loadMore,
    markAsSeen,
    markAllAsSeen,
    refresh: () => loadPage(1),
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationContext() {
  const ctx = useContext(NotificationContext);
  if (!ctx)
    throw new Error(
      "useNotificationContext must be used inside NotificationProvider",
    );
  return ctx;
}

// Backwards-compatible alias for code that still imports the old hook name.
export function useNotifications(options = {}) {
  const ctx = useNotificationContext();
  // The hook used to accept { pageSize }, which is now an internal constant.
  // The parameter is intentionally ignored.
  void options;
  return ctx;
}