import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import {
  searchPostsApi,
  searchUsersApi,
  searchGroupsApi,
  searchReelsApi,
} from "../apis/searchApi";

export const SEARCH_TABS = [
  { key: "posts",  label: "Posts",   icon: "FileText" },
  { key: "people", label: "People",  icon: "Users" },
  { key: "groups", label: "Groups",  icon: "UsersRound" },
  { key: "reels",  label: "Reels",   icon: "Clapperboard" },
];

const PAGE_SIZE = 20;
const DEFAULT_TAB = "posts";

function buildInitialState() {
  return {
    posts:   { results: [], loading: false, error: null, hasMore: false, page: 1 },
    people:  { results: [], loading: false, error: null, hasMore: false, page: 1 },
    groups:  { results: [], loading: false, error: null, hasMore: false, page: 1 },
    reels:   { results: [], loading: false, error: null, hasMore: false, page: 1 },
  };
}

function updateTabState(state, tab, patch) {
  return { ...state, [tab]: { ...state[tab], ...patch } };
}

const SearchEngineContext = createContext(null);

export function SearchEngineProvider({ children }) {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTabState] = useState(DEFAULT_TAB);
  const [tabStates, setTabStates] = useState(buildInitialState);

  const tabStatesRef = useRef(tabStates);
  tabStatesRef.current = tabStates;

  const activeTabRef = useRef(activeTab);
  activeTabRef.current = activeTab;

  const queryRef = useRef("");
  queryRef.current = query;

  const fetchTab = useCallback(async (tab, currentQuery, page, isRefresh) => {
    setTabStates((prev) => updateTabState(prev, tab, { loading: true, error: null }));

    try {
      let data;
      switch (tab) {
        case "posts":
          data = await searchPostsApi({ q: currentQuery, page, pageSize: PAGE_SIZE });
          break;
        case "people":
          data = await searchUsersApi({ q: currentQuery, page, pageSize: PAGE_SIZE });
          break;
        case "groups":
          data = await searchGroupsApi({ q: currentQuery || null, page, pageSize: PAGE_SIZE });
          break;
        case "reels":
          data = await searchReelsApi({ q: currentQuery, page, pageSize: PAGE_SIZE });
          break;
        default:
          data = null;
      }

      if (!data) return;

      const items = data.items ?? [];

      setTabStates((prev) =>
        updateTabState(prev, tab, {
          results: isRefresh || page === 1 ? items : [...prev[tab].results, ...items],
          hasMore: items.length >= PAGE_SIZE,
          page,
          loading: false,
        })
      );
    } catch (err) {
      setTabStates((prev) =>
        updateTabState(prev, tab, {
          loading: false,
          error: err?.response?.data ?? err.message ?? "Search failed",
        })
      );
    }
  }, []);

  /** Trigger a search. Idempotent — safe to call with the same query multiple times. */
  const search = useCallback(
    (searchQuery) => {
      const tab = activeTabRef.current;
      const isGroups = tab === "groups";

      if (!searchQuery && !isGroups) {
        setTabStates((prev) =>
          updateTabState(prev, tab, { results: [], hasMore: false, page: 1 })
        );
        return;
      }

      fetchTab(tab, searchQuery, 1, true);
      setQuery(searchQuery);
    },
    [fetchTab]
  );

  /** Load next page for a given tab. */
  const loadMore = useCallback(
    (tab) => {
      const state = tabStatesRef.current[tab];
      if (state.loading || !state.hasMore) return;
      fetchTab(tab, queryRef.current, state.page + 1, false);
    },
    [fetchTab]
  );

  /** Switch to a tab; lazy-loads if that tab has never been searched. */
  const switchTab = useCallback(
    (tab) => {
      activeTabRef.current = tab;
      setActiveTabState(tab);

      const state = tabStatesRef.current[tab];
      if (state.results.length === 0 && !state.loading && !state.error) {
        const q = queryRef.current;
        const isGroups = tab === "groups";
        if (q || isGroups) {
          fetchTab(tab, q, 1, true);
        }
      }
    },
    [fetchTab]
  );

  /** Reset all tab state — call when user explicitly clears the query. */
  const clearSearch = useCallback(() => {
    setQuery("");
    setTabStates(buildInitialState());
  }, []);

  return (
    <SearchEngineContext.Provider
      value={{
        // raw state
        query,
        activeTab,
        tabStates,

        // setters
        setQuery,
        setActiveTab: switchTab,

        // actions
        search,
        loadMore,
        switchTab,
        clearSearch,
      }}
    >
      {children}
    </SearchEngineContext.Provider>
  );
}

export function useSearchEngineContext() {
  const ctx = useContext(SearchEngineContext);
  if (!ctx) {
    throw new Error("useSearchEngineContext must be used inside <SearchEngineProvider>");
  }
  return ctx;
}
