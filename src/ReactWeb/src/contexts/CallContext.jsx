import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import * as signalR from "@microsoft/signalr";
import { useAuth } from "./authContext";

const CallContext = createContext(null);

export function CallProvider({ children }) {
    const { token } = useAuth();

    const [callState, setCallState] = useState("idle");
    const [isMuted, setIsMuted] = useState(false);
    const [callDuration, setCallDuration] = useState(0);
    const [callStartTime, setCallStartTime] = useState(null);

    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [incomingCall, setIncomingCall] = useState(null);
    const [callTarget, setCallTarget] = useState(null);

    // Keep refs in sync with state so SignalR handlers always see fresh values
    const callStateRef = useRef(callState);
    const callTargetRef = useRef(callTarget);
    const incomingCallRef = useRef(incomingCall);

    useEffect(() => { callStateRef.current = callState; }, [callState]);
    useEffect(() => { callTargetRef.current = callTarget; }, [callTarget]);
    useEffect(() => { incomingCallRef.current = incomingCall; }, [incomingCall]);

    const connectionRef = useRef(null);
    const peerConnectionRef = useRef(null);
    const localStreamRef = useRef(null);
    const durationTimerRef = useRef(null);
    const pendingOfferRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);

    const ICE_SERVERS = [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
    ];

    const getAudioTrack = () => localStreamRef.current?.getAudioTracks()[0];

    const stopDurationTimer = () => {
        if (durationTimerRef.current) {
            clearInterval(durationTimerRef.current);
            durationTimerRef.current = null;
        }
    };

    const startDurationTimer = () => {
        setCallStartTime(Date.now());
        setCallDuration(0);
        durationTimerRef.current = setInterval(() => {
            setCallDuration((d) => d + 1);
        }, 1000);
    };

    // ─── Create peer connection ─────────────────────────────────────────────
    const createPeerConnection = useCallback((targetUserId) => {
        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
            peerConnectionRef.current = null;
        }

        const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });

        if (localStreamRef.current) {
            localStreamRef.current.getAudioTracks().forEach((track) => {
                pc.addTrack(track, localStreamRef.current);
            });
        }

        pc.ontrack = (event) => {
            const [remote] = event.streams;
            setRemoteStream(remote);
        };

        pc.onicecandidate = (event) => {
            if (event.candidate && connectionRef.current) {
                connectionRef.current.invoke("SendSignal", targetUserId, "ice", JSON.stringify(event.candidate));
            }
        };

        pc.onconnectionstatechange = () => {
            if (pc.connectionState === "disconnected" || pc.connectionState === "failed") {
                cleanupCall();
                setCallState("idle");
            }
        };

        peerConnectionRef.current = pc;
        return pc;
    }, []);

    // ─── Process offer: set remote desc, create + send answer ───────────────
    // Reads from refs — never needs callTarget/incomingCall in deps, so stays stable
    const processOffer = useCallback(async (offerData) => {
        const pc = peerConnectionRef.current;
        if (!pc) {
            pendingOfferRef.current = offerData;
            return;
        }

        try {
            await pc.setRemoteDescription(new RTCSessionDescription(offerData));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            const calleeId = incomingCallRef.current?.callerId || callTargetRef.current?.id;
            if (calleeId && connectionRef.current) {
                await connectionRef.current.invoke("SendSignal", calleeId, "answer", JSON.stringify(answer));
            }
        } catch (err) {
            console.error("Failed to process offer:", err);
        }
    }, []);

    // ─── Process answer: set remote desc, start call ────────────────────────
    const processAnswer = useCallback(async (answerData) => {
        const pc = peerConnectionRef.current;
        if (!pc) return;
        try {
            await pc.setRemoteDescription(new RTCSessionDescription(answerData));
            setCallState("active");
            startDurationTimer();
        } catch (err) {
            console.error("Failed to process answer:", err);
        }
    }, []);

    // ─── Flush pending offer if any ─────────────────────────────────────────
    const flushPendingOffer = useCallback(async () => {
        if (pendingOfferRef.current) {
            const offer = pendingOfferRef.current;
            pendingOfferRef.current = null;
            await processOffer(offer);
        }
    }, [processOffer]);

    // ─── Start local media ─────────────────────────────────────────────────
    const startLocalMedia = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
            localStreamRef.current = stream;
            setLocalStream(stream);
            return stream;
        } catch (err) {
            console.error("Failed to get user media:", err);
            return null;
        }
    };

    const stopLocalMedia = () => {
        if (localStreamRef.current) {
            localStreamRef.current.getAudioTracks().forEach((t) => t.stop());
            localStreamRef.current = null;
            setLocalStream(null);
        }
    };

    const cleanupCall = () => {
        stopLocalMedia();
        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
            peerConnectionRef.current = null;
        }
        setRemoteStream(null);
        pendingOfferRef.current = null;
    };

    // ─── SignalR connection setup ────────────────────────────────────────────
    useEffect(() => {
        if (!token) return;

        const HUB_URL = import.meta.env.VITE_API_HUB_BASE_URL;
        const connection = new signalR.HubConnectionBuilder()
            .withUrl(`${HUB_URL}/hubs/call`, {
                accessTokenFactory: () => token
            })
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Warning)
            .build();

        connectionRef.current = connection;

        connection.onreconnecting(() => setIsConnected(false));
        connection.onreconnected(() => setIsConnected(true));
        connection.onclose(() => setIsConnected(false));

        // Read from refs so closures always see the latest values
        connection.on("IncomingCall", ({ callerId, callerName, callerAvatar }) => {
            if (callStateRef.current !== "idle") return;
            pendingOfferRef.current = null;
            setIncomingCall({ callerId, callerName, callerAvatar });
            setCallState("ringing");
        });

        connection.on("CallAccepted", async () => {
            if (callStateRef.current !== "calling") return;
            const pc = peerConnectionRef.current;
            const target = callTargetRef.current;
            if (!pc || !target?.id) return;
            try {
                const offer = await pc.createOffer();
                await pc.setLocalDescription(offer);
                await connection.invoke("SendSignal", target.id, "offer", JSON.stringify(offer));
            } catch (err) {
                console.error("Failed to send offer:", err);
            }
        });

        connection.on("CallRejected", () => {
            cleanupCall();
            setCallState("idle");
            setCallTarget(null);
        });

        connection.on("ReceiveSignal", async ({ senderId, signalType, signalData }) => {
            const data = JSON.parse(signalData);
            if (signalType === "offer") {
                await processOffer(data);
            } else if (signalType === "answer") {
                await processAnswer(data);
            } else if (signalType === "ice") {
                const pc = peerConnectionRef.current;
                if (pc) {
                    try {
                        await pc.addIceCandidate(new RTCIceCandidate(data));
                    } catch (_) {}
                }
            } else if (signalType === "hangup") {
                cleanupCall();
                setCallState("idle");
                setIncomingCall(null);
                setCallTarget(null);
            }
        });

        connection.on("CallEnded", () => {
            cleanupCall();
            setCallState("idle");
            setIncomingCall(null);
            setCallTarget(null);
        });

        connection.start()
            .then(() => setIsConnected(true))
            .catch((err) => console.error("CallHub connection failed:", err));

        return () => {
            cleanupCall();
            stopDurationTimer();
            connection.stop().catch(() => {});
            connectionRef.current = null;
        };
    }, [token, processOffer, processAnswer]);

    // Re-flush pending offer when processOffer updates
    useEffect(() => {
        flushPendingOffer();
    }, [processOffer, flushPendingOffer]);

    // ─── Initiate outgoing call ────────────────────────────────────────────
    const initiateCall = async (targetUserId, targetName, targetAvatar) => {
        stopLocalMedia();
        cleanupCall();
        setCallTarget({ id: targetUserId, name: targetName, avatar: targetAvatar });
        setCallState("calling");
        pendingOfferRef.current = null;

        const stream = await startLocalMedia();
        if (!stream) {
            setCallState("idle");
            return;
        }

        if (connectionRef.current) {
            try {
                await connectionRef.current.invoke("StartCall", targetUserId);
            } catch (err) {
                console.error("StartCall failed:", err);
                setCallState("idle");
                cleanupCall();
                return;
            }
        }

        createPeerConnection(targetUserId);
    };

    // ─── Accept incoming call ──────────────────────────────────────────────
    const answerCall = async () => {
        if (!incomingCallRef.current || callStateRef.current !== "ringing") return;
        const callerId = incomingCallRef.current.callerId;
        const callerName = incomingCallRef.current.callerName;
        const callerAvatar = incomingCallRef.current.callerAvatar;

        cleanupCall();
        setIncomingCall(null);
        setCallTarget({ id: callerId, name: callerName, avatar: callerAvatar });

        const stream = await startLocalMedia();
        if (!stream) {
            setCallState("idle");
            setCallTarget(null);
            return;
        }

        createPeerConnection(callerId);

        if (connectionRef.current) {
            try {
                await connectionRef.current.invoke("AcceptCall", callerId);
            } catch (err) {
                console.error("AcceptCall failed:", err);
            }
        }

        setTimeout(flushPendingOffer, 100);
    };

    // ─── Reject incoming call ────────────────────────────────────────────
    const rejectCall = () => {
        const callerId = incomingCallRef.current?.callerId;
        setIncomingCall(null);
        setCallState("idle");
        stopLocalMedia();
        if (callerId && connectionRef.current) {
            connectionRef.current.invoke("RejectCall", callerId).catch(() => {});
        }
    };

    // ─── End call (local) ────────────────────────────────────────────────
    const endCall = async () => {
        const targetId = callTargetRef.current?.id;
        cleanupCall();
        setCallState("idle");
        setCallTarget(null);
        stopDurationTimer();
        if (targetId && connectionRef.current) {
            connectionRef.current.invoke("SendSignal", targetId, "hangup", "").catch(() => {});
        }
    };

    // ─── Mute / unmute ────────────────────────────────────────────────────
    const toggleMute = () => {
        const track = getAudioTrack();
        if (!track) return;
        track.enabled = !track.enabled;
        setIsMuted(!track.enabled);
    };

    // ─── Format duration ──────────────────────────────────────────────────
    const formatDuration = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
        return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    };

    return (
        <CallContext.Provider value={{
            callState,
            isMuted,
            callDuration,
            callStartTime,
            localStream,
            remoteStream,
            incomingCall,
            callTarget,
            initiateCall,
            answerCall,
            rejectCall,
            endCall,
            toggleMute,
            formatDuration,
        }}>
            {children}
        </CallContext.Provider>
    );
}

export function useCall() {
    const ctx = useContext(CallContext);
    if (!ctx) throw new Error("useCall must be used inside CallProvider");
    return ctx;
}
