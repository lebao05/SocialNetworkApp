import { useCallback, useEffect, useRef, useState } from "react";
import { getFriendsApi, getPeopleOnlineStateApi } from "../apis/friendApi";

const PAGE_SIZE = 10; // mirrors backend PageSize in GetFriendsQueryHandler
const REFRESH_INTERVAL_MS = 3 * 60 * 1000; // 3 minutes
const STATE_BATCH_SIZE = 200; // backend cap per /online-state request

/**
 * Fetches paginated friends and hydrates each page's online state.
 *
 * - On mount / search change: replaces contacts with page 1.
 * - loadMore() while not in search mode: appends page N+1 (infinite scroll).
 * - Every REFRESH_INTERVAL_MS: fetches online states only (no friend data) for
 *   contacts currently in memory.
 *
 * Returns { contacts, loading, error, hasMore, isSearchMode, searchTerm,
 *          loadMore, setSearch, refresh }
 */
export function useContacts(initialSearch = "") {
  const [contacts, setContacts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0); // 0 = not loaded yet
  const [searchTerm, setSearchTermState] = useState(initialSearch);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  // Guards against concurrent fetches (React StrictMode / race conditions).
  const fetchLockRef = useRef(false);

  // ── fetch online states in batches of up to 200 per request ────────────────
  const fetchOnlineStates = async (userIds) => {
    if (!userIds.length) return {};
    const result = {};
    for (let i = 0; i < userIds.length; i += STATE_BATCH_SIZE) {
      const batch = userIds.slice(i, i + STATE_BATCH_SIZE);
      try {
        const states = await getPeopleOnlineStateApi(batch);
        Object.assign(result, states);
      } catch (err) {
        console.error("[useContacts] online-state batch failed:", err);
        // Keep going; missing ids default to offline.
      }
    }
    return result;
  };

  // ── core: fetch & enrich a single page of friends ─────────────────────────
  const fetchAndEnrichPage = async (page, search) => {
    const data = await getFriendsApi(page, search || null);
    const items = data?.items ?? [];

    const states = await fetchOnlineStates(items.map((f) => f.id));

    return items.map((f) => ({
      id: f.id,
      name: f.fullName,
      avatar: f.avatarUrl ?? null,
      online: states[f.id] ?? false,
      mutualFriendsCount: f.mutualFriendsCount ?? 0,
    }));
  };

  // ── load page 1 (used on mount and whenever searchTerm changes) ────────────
  const loadFirstPage = useCallback(async (search) => {
    if (fetchLockRef.current) return;
    fetchLockRef.current = true;

    setLoading(true);
    setError(null);
    try {
      const enriched = await fetchAndEnrichPage(1, search);
      setContacts(enriched);
      setCurrentPage(1);
      setHasMore(enriched.length >= PAGE_SIZE); // heuristic: if full page, likely more
    } catch (err) {
      console.error("[useContacts] loadFirstPage failed:", err);
      setError("Unable to load contacts.");
    } finally {
      setLoading(false);
      fetchLockRef.current = false;
    }
  }, []);

  // ── append next page (used for infinite scroll, NOT during search) ──────────
  const loadMore = useCallback(async () => {
    if (fetchLockRef.current || loadingMore || !hasMore || searchTerm) return;

    fetchLockRef.current = true;
    setLoadingMore(true);
    setError(null);
    try {
      const nextPage = currentPage + 1;
      const enriched = await fetchAndEnrichPage(nextPage, "");
      if (enriched.length === 0) {
        setHasMore(false);
        return;
      }
      setContacts((prev) => [...prev, ...enriched]);
      setCurrentPage(nextPage);
      setHasMore(enriched.length >= PAGE_SIZE);
    } catch (err) {
      console.error("[useContacts] loadMore failed:", err);
    } finally {
      setLoadingMore(false);
      fetchLockRef.current = false;
    }
  }, [currentPage, hasMore, loadingMore, searchTerm]);

  // ── periodic refresh: update online states for contacts already in memory ────
  const refreshAllFetchedPages = useCallback(async () => {
    if (fetchLockRef.current) return;
    fetchLockRef.current = true;

    try {
      // snapshot the ids currently in memory
      const userIds = contacts.map((c) => c.id);
      if (!userIds.length) return;

      const states = await fetchOnlineStates(userIds);
      setContacts((prev) =>
        prev.map((c) => ({ ...c, online: states[c.id] ?? c.online }))
      );
    } catch (err) {
      console.error("[useContacts] refreshAllFetchedPages failed:", err);
    } finally {
      fetchLockRef.current = false;
    }
  }, [contacts]); // depends on contacts so it captures the latest snapshot

  // ── initial load & search ──────────────────────────────────────────────────
  useEffect(() => {
    setContacts([]);
    setCurrentPage(0);
    setHasMore(true);
    loadFirstPage(searchTerm);
  }, [searchTerm]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── periodic refresh timer ─────────────────────────────────────────────────
  useEffect(() => {
    const id = setInterval(refreshAllFetchedPages, REFRESH_INTERVAL_MS);
    return () => clearInterval(id);
  }, [refreshAllFetchedPages]);

  // ── public helpers ────────────────────────────────────────────────────────
  const setSearch = (term) => {
    setSearchTermState(term);
  };

  const refresh = () => {
    setContacts([]);
    setCurrentPage(0);
    setHasMore(true);
    loadFirstPage(searchTerm);
  };

  return {
    contacts,
    loading,
    loadingMore,
    error,
    hasMore,
    isSearchMode: Boolean(searchTerm),
    searchTerm,
    loadMore,
    setSearch,
    refresh,
  };
}
