import { useEffect, useRef, useState } from "react";
import { useContacts } from "../../hooks/useContacts";
import { ads, birthdays } from "../../data/mockData";

const DEFAULT_AVATAR =
  import.meta.env.VITE_DEFAULT_AVATAR ||
  "https://i.pinimg.com/originals/63/53/d9/6353d9fff14cc31af369dd0254fd8c97.jpg";

export default function RightSidebar() {
  const {
    contacts,
    loading,
    loadingMore,
    error,
    hasMore,
    isSearchMode,
    searchTerm,
    loadMore,
    setSearch,
  } = useContacts();

  const [searchOpen, setSearchOpen] = useState(false);
  const [inputValue, setInputValue] = useState(searchTerm);

  // Scroll sentinel ref for IntersectionObserver.
  const sentinelRef = useRef(null);

  // ── IntersectionObserver: fire loadMore when sentinel enters viewport ───────
  useEffect(() => {
    if (!sentinelRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !isSearchMode) {
          loadMore();
        }
      },
      { rootMargin: "100px" } // pre-fetch before the sentinel is fully visible
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, isSearchMode, loadMore]);

  // ── Sync input value with searchTerm when hook resets it ───────────────────
  useEffect(() => {
    setInputValue(searchTerm);
  }, [searchTerm]);

  const handleSearchIconClick = () => {
    setSearchOpen((prev) => !prev);
    if (!searchOpen) {
      // Opening: focus the input on next tick
      setTimeout(() => document.getElementById("contacts-search-input")?.focus(), 50);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    setSearch(trimmed);
    setSearchOpen(false);
  };

  const handleSearchClear = () => {
    setInputValue("");
    setSearch("");
    setSearchOpen(false);
  };

  return (
    <aside className="hidden xl:flex fixed top-14 right-0 w-[280px] h-[calc(100vh-56px)] overflow-y-auto p-4 bg-white z-10 flex-col">
      {/* Birthday */}
      {/* {birthdays.length > 0 && (
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-fb-hover cursor-pointer mb-3">
          <span className="text-2xl">🎂</span>
          <p className="text-sm text-fb-text">
            <span className="font-semibold">{birthdays[0].name}</span> has a birthday today.
          </p>
        </div>
      )} */}

      {/* Sponsored */}
      <p className="text-fb-subtext font-semibold text-sm mb-2">Sponsored</p>
      {ads.map((ad) => (
        <div
          key={ad.id}
          className="flex gap-3 cursor-pointer hover:bg-fb-hover p-2 rounded-lg mb-2"
        >
          <img
            src={ad.image}
            className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
            alt={ad.brand}
          />
          <div>
            <p className="text-sm text-fb-text leading-snug">{ad.description}</p>
            <p className="text-xs text-fb-subtext mt-1">{ad.url}</p>
          </div>
        </div>
      ))}

      <hr className="border-fb-sidebar my-3" />

      {/* Contacts header */}
      <div className="flex items-center justify-between mb-2">
        <p className="text-fb-subtext font-semibold text-sm">Contacts</p>
        <div className="flex gap-1">
          <button
            className="w-8 h-8 rounded-full hover:bg-fb-hover flex items-center justify-center text-fb-subtext"
            onClick={handleSearchIconClick}
            title="Search contacts"
          >
            {searchOpen ? (
              /* X close icon */
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              /* Search icon */
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Search box */}
      {searchOpen && (
        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center gap-1 mb-2 px-1"
        >
          <input
            id="contacts-search-input"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search contacts…"
            className="flex-1 px-3 py-1.5 text-sm rounded-full bg-fb-gray text-fb-text placeholder-fb-subtext focus:outline-none focus:ring-2 focus:ring-fb-blue"
          />
          {inputValue && (
            <button
              type="button"
              onClick={handleSearchClear}
              className="w-7 h-7 rounded-full hover:bg-fb-hover flex items-center justify-center text-fb-subtext"
              title="Clear search"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <button
            type="submit"
            className="px-3 py-1.5 text-sm rounded-full bg-fb-blue text-white font-medium hover:bg-fb-blue/90"
          >
            Search
          </button>
        </form>
      )}

      {/* Meta AI */}
      <div className="flex items-center gap-3 px-2 py-2 rounded-lg cursor-pointer hover:bg-fb-hover mb-1">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-400 flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">M</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[15px] font-medium text-fb-text">Meta AI</span>
          <svg className="w-4 h-4 text-fb-blue" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
        </div>
      </div>

      {/* Contact list */}
      {loading && contacts.length === 0 && (
        <p className="text-sm text-fb-subtext px-2 py-2">Loading contacts…</p>
      )}
      {error && (
        <p className="text-sm text-red-500 px-2 py-2">{error}</p>
      )}
      {contacts.map((c) => (
        <div
          key={c.id}
          onClick={() => window.open(`/messenger/t/${c.id}`, "_blank", "noopener,noreferrer")}
          className="flex items-center gap-3 px-2 py-2 rounded-lg cursor-pointer hover:bg-fb-hover"
        >
          <div className="relative flex-shrink-0">
            {c.avatar ? (
              <img
                src={c.avatar}
                alt={c.name}
                className="w-9 h-9 rounded-full object-cover"
              />
            ) : (
              <img
                src={DEFAULT_AVATAR}
                alt={c.name}
                className="w-9 h-9 rounded-full object-cover"
              />
            )}
            {c.online ? (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
            ) : (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-fb-gray rounded-full border-2 border-white" />
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[15px] font-medium text-fb-text truncate">{c.name}</span>
            <span className={`text-xs ${c.online ? "text-green-600" : "text-fb-subtext"}`}>
              {c.online ? "Online" : "Offline"}
            </span>
          </div>
        </div>
      ))}

      {/* Empty state */}
      {!loading && !error && contacts.length === 0 && (
        <p className="text-sm text-fb-subtext px-2 py-2">
          {isSearchMode ? "No contacts match your search." : "No contacts found."}
        </p>
      )}

      {/* Load-more sentinel: triggers IntersectionObserver when visible */}
      {!isSearchMode && (
        <div ref={sentinelRef} className="h-1 w-full">
          {loadingMore && (
            <p className="text-xs text-fb-subtext text-center py-1">Loading more…</p>
          )}
          {!hasMore && contacts.length > 0 && (
            <p className="text-xs text-fb-subtext text-center py-1">All contacts loaded.</p>
          )}
        </div>
      )}
    </aside>
  );
}
