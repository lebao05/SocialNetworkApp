"use client";
const HUB_URL = import.meta.env.VITE_API_HUB_BASE_URL;
import React, { createContext, useContext, useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { useAuth } from "./authContext";

const SignalRContext = createContext(null);

export function SignalRProvider({ children }) {
    const { token, user } = useAuth();
    const [connection, setConnection] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // Only attempt connection if we have a valid token
        if (!token) {
            if (connection) {
                connection.stop();
                setConnection(null);
                setIsConnected(false);
            }
            return;
        }

        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl(`${HUB_URL}/chatHub`, {
                accessTokenFactory: () => token
            })
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Information)
            .build();

        // Start connection logic
        const startConnection = async () => {
            try {
                await newConnection.start();
                console.log("SignalR Connected.");
                setIsConnected(true);
                setConnection(newConnection);
            } catch (err) {
                console.error("SignalR Connection Error: ", err);
                setTimeout(startConnection, 5000); // Retry after 5s
            }
        };

        startConnection();

        // Cleanup on logout or unmount
        return () => {
            newConnection.stop();
        };
    }, [token]);

    return (
        <SignalRContext.Provider value={{ connection, isConnected }}>
            {children}
        </SignalRContext.Provider>
    );
}

export const useSignalR = () => useContext(SignalRContext);