"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { 
    getConversationsApi, 
    getConversationDetailApi, 
    getConversationByUserIdApi, 
    searchConversationsApi,
    createConversationApi
} from "../apis/conversationApi";

const ConversationContext = createContext(null);

export function ConversationProvider({ children }) {
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    /**
     * Fetch the list of conversations for the sidebar
     */
    const fetchConversations = async (pageNumber = 1, pageSize = 20) => {
        setLoading(true);
        try {
            const data = await getConversationsApi(pageNumber, pageSize);
            setConversations(data);
        } catch (err) {
            console.error("Failed to fetch conversations:", err);
        } finally {
            setLoading(true); // Wait, should be false? 
            setLoading(false);
        }
    };

    /**
     * Select a conversation and load its full details
     * Handles both existing IDs and TargetUserIds
     */
    const selectConversation = async (id, isByUserId = false) => {
        setLoading(true);
        try {
            let detail;
            if (isByUserId) {
                // This call handles the "IsNotInAConversation" logic from the backend
                detail = await getConversationByUserIdApi(id);
            } else {
                detail = await getConversationDetailApi(id);
            }
            setSelectedConversation(detail);
        } catch (err) {
            console.error("Failed to select conversation:", err);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Perform global search (conversations + friends)
     */
    const performSearch = async (term) => {
        if (!term?.trim()) {
            setSearchResults([]);
            return;
        }
        setIsSearching(true);
        try {
            const data = await searchConversationsApi(term);
            setSearchResults(data.results || []);
        } catch (err) {
            console.error("Search failed:", err);
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <ConversationContext.Provider
            value={{
                conversations,
                selectedConversation,
                searchResults,
                loading,
                isSearching,
                fetchConversations,
                selectConversation,
                performSearch,
                setSelectedConversation
            }}
        >
            {children}
        </ConversationContext.Provider>
    );
}

export function useConversations() {
    const context = useContext(ConversationContext);
    if (!context) {
        throw new Error("useConversations must be used within a ConversationProvider");
    }
    return context;
}
