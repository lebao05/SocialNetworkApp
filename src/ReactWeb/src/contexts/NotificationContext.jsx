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

// Server-side events emitted by NotificationHubNotifier. The payload from each
// event is intentionally ignored here — we refetch the first page so the new
// notification arrives with full DTO data (sender, target entity, etc.) instead
// of a synthetic shell.
const REALTIME_EVENTS = [
  "FriendRequestReceived",
  "GroupJoinRequestAccepted",
  "PostTagged",
  "CommentCreated",
  "CommentReply",
];

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

        if (!append) {
          setNotifications(items);
          totalLoadedRef.current = items.length;
        } else {
          setNotifications((prev) => {
            const existingIds = new Set(prev.map((n) => n.id));
            const newItems = items.filter((n) => !existingIds.has(n.id));
            totalLoadedRef.current += newItems.length;
            return [...prev, ...newItems];
          });
        }

        setPage(p);
        setHasMore(totalLoadedRef.current < totalCount);
        setUnseenCount(items.filter((n) => !n.isSeen).length);
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

  // SignalR connection — only when authenticated. Listens for the events
  // emitted by NotificationHub and triggers a first-page refresh so the new
  // notification appears in correct order with full data.
  useEffect(() => {
    if (!user) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    const baseUrl =
      import.meta.env.VITE_API_BASE_URL ||
      import.meta.env.VITE_API_URL ||
      "";

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${baseUrl}/hubs/notifications`, {
        accessTokenFactory: () => token,
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    const refreshFirstPage = () => {
      loadPage(1);
    };

    REALTIME_EVENTS.forEach((evt) => connection.on(evt, refreshFirstPage));

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
      REALTIME_EVENTS.forEach((evt) => connection.off(evt, refreshFirstPage));
      if (connectionRef.current) {
        connectionRef.current.stop().catch(() => {});
        connectionRef.current = null;
      }
    };
  }, [user, loadPage]);

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