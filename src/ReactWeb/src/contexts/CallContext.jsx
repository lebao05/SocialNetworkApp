import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import * as signalR from "@microsoft/signalr";
import { useAuth } from "./authContext";

const CallContext = createContext(null);

export function CallProvider({ children }) {
    const { token } = useAuth();

    const [callState, setCallState] = useState("idle");
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [callDuration, setCallDuration] = useState(0);
    const [callStartTime, setCallStartTime] = useState(null);

    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [incomingCall, setIncomingCall] = useState(null);
    const [callTarget, setCallTarget] = useState(null);

    const [isVideoCall, setIsVideoCall] = useState(false);

    const callStateRef = useRef(callState);
    const callTargetRef = useRef(callTarget);
    const incomingCallRef = useRef(incomingCall);
    const isVideoCallRef = useRef(isVideoCall);

    useEffect(() => { callStateRef.current = callState; }, [callState]);
    useEffect(() => { callTargetRef.current = callTarget; }, [callTarget]);
    useEffect(() => { incomingCallRef.current = incomingCall; }, [incomingCall]);
    useEffect(() => { isVideoCallRef.current = isVideoCall; }, [isVideoCall]);

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
    const getVideoTrack = () => localStreamRef.current?.getVideoTracks()[0];

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
            localStreamRef.current.getVideoTracks().forEach((track) => {
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

    // ─── Process offer ──────────────────────────────────────────────────────
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
            setCallState("active");
            startDurationTimer();
            const calleeId = callTargetRef.current?.id;
            if (calleeId && connectionRef.current) {
                await connectionRef.current.invoke("SendSignal", calleeId, "answer", JSON.stringify(answer));
            }
        } catch (err) {
            console.error("Failed to process offer:", err);
        }
    }, []);

    // ─── Process answer ──────────────────────────────────────────────────────
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

    // ─── Flush pending offer ─────────────────────────────────────────────────
    const flushPendingOffer = useCallback(async () => {
        if (pendingOfferRef.current) {
            const offer = pendingOfferRef.current;
            pendingOfferRef.current = null;
            await processOffer(offer);
        }
    }, [processOffer]);

    // ─── Start local media ─────────────────────────────────────────────────
    const startLocalMedia = async (isVideo) => {
        const tryConstraints = (constraints) => navigator.mediaDevices.getUserMedia(constraints);

        if (isVideo) {
            try {
                const stream = await tryConstraints({ audio: true, video: { facingMode: "user", width: 640, height: 480 } });
                localStreamRef.current = stream;
                setLocalStream(stream);
                setIsVideoOff(false);
                return stream;
            } catch (err) {
                if (err.name === "NotReadableError" || err.name === "NotAllowedError") {
                    try {
                        const stream = await tryConstraints({ audio: true, video: false });
                        localStreamRef.current = stream;
                        setLocalStream(stream);
                        setIsVideoOff(true);
                        return stream;
                    } catch (_) {}
                }
                console.error("Failed to get user media:", err);
                return null;
            }
        }

        try {
            const stream = await tryConstraints({ audio: true, video: false });
            localStreamRef.current = stream;
            setLocalStream(stream);
            setIsVideoOff(false);
            return stream;
        } catch (err) {
            console.error("Failed to get user media:", err);
            return null;
        }
    };

    const stopLocalMedia = () => {
        if (localStreamRef.current) {
            localStreamRef.current.getAudioTracks().forEach((t) => t.stop());
            localStreamRef.current.getVideoTracks().forEach((t) => t.stop());
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
        setIsVideoCall(false);
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

        connection.on("IncomingCall", ({ callerId, callerName, callerAvatar, isVideo }) => {
            console.log("IncomingCall", { callerId, callerName, callerAvatar, isVideo });
            if (callStateRef.current !== "idle") return;
            pendingOfferRef.current = null;
            setIncomingCall({ callerId, callerName, callerAvatar, isVideo: isVideo ?? false });
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
            try {
                if (signalType === "offer") {
                    await processOffer(JSON.parse(signalData));
                } else if (signalType === "answer") {
                    await processAnswer(JSON.parse(signalData));
                } else if (signalType === "ice") {
                    const pc = peerConnectionRef.current;
                    if (pc) {
                        await pc.addIceCandidate(new RTCIceCandidate(JSON.parse(signalData)));
                    }
                } else if (signalType === "hangup") {
                    cleanupCall();
                    setCallState("idle");
                    setIncomingCall(null);
                    setCallTarget(null);
                }
            } catch (err) {
                console.error("ReceiveSignal error:", err);
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
    const initiateCall = async (targetUserId, targetName, targetAvatar, isVideo = false) => {
        stopLocalMedia();
        cleanupCall();
        setCallTarget({ id: targetUserId, name: targetName, avatar: targetAvatar });
        setCallState("calling");
        setIsVideoCall(isVideo);
        pendingOfferRef.current = null;

        const stream = await startLocalMedia(isVideo);
        if (!stream) {
            setCallState("idle");
            setIsVideoCall(false);
            return;
        }

        if (connectionRef.current) {
            try {
                await connectionRef.current.invoke("StartCall", targetUserId, isVideo);
            } catch (err) {
                console.error("StartCall failed:", err);
                setCallState("idle");
                setIsVideoCall(false);
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
        const isVideo = incomingCallRef.current.isVideo ?? false;

        cleanupCall();
        setIncomingCall(null);
        setCallTarget({ id: callerId, name: callerName, avatar: callerAvatar });
        setCallState("calling");
        setIsVideoCall(isVideo);

        const stream = await startLocalMedia(isVideo);
        if (!stream) {
            setCallState("idle");
            setCallTarget(null);
            setIsVideoCall(false);
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
            connectionRef.current.invoke("SendSignal", targetId, "hangup", "{}").catch(() => {});
        }
    };

    // ─── Mute / unmute ────────────────────────────────────────────────────
    const toggleMute = () => {
        const track = getAudioTrack();
        if (!track) return;
        track.enabled = !track.enabled;
        setIsMuted(!track.enabled);
    };

    // ─── Toggle video on/off ──────────────────────────────────────────────
    const toggleVideo = useCallback(() => {
        const track = getVideoTrack();
        if (!track) return;
        track.enabled = !track.enabled;
        setIsVideoOff(!track.enabled);
    }, []);

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
            isVideoOff,
            isVideoCall,
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
            toggleVideo,
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
