import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { useAuth } from "./authContext";

const CallContext = createContext(null);

export function CallProvider({ children, connection }) {
    const { user } = useAuth();

    // callState: "idle" | "calling" | "ringing" | "active" | "ended"
    const [callState, setCallState] = useState("idle");
    const [isMuted, setIsMuted] = useState(false);
    const [callDuration, setCallDuration] = useState(0);
    const [callStartTime, setCallStartTime] = useState(null);

    // Call participants
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [incomingCall, setIncomingCall] = useState(null); // { callerId, callerName }
    const [callTarget, setCallTarget] = useState(null);     // { id, name }

    // WebRTC
    const peerConnectionRef = useRef(null);
    const localStreamRef = useRef(null);
    const durationTimerRef = useRef(null);
    // Pending offer received before peer conn was ready
    const pendingOfferRef = useRef(null);

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
            if (event.candidate && connection) {
                connection.invoke("SendSignal", targetUserId, "ice", JSON.stringify(event.candidate));
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
    }, [connection]); // eslint-disable-line react-hooks/exhaustive-deps

    // ─── Process offer: set remote desc, create + send answer ───────────────
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
            const calleeId = incomingCall?.callerId || callTarget?.id;
            if (calleeId && connection) {
                await connection.invoke("SendSignal", calleeId, "answer", JSON.stringify(answer));
            }
        } catch (err) {
            console.error("Failed to process offer:", err);
        }
    }, [connection, incomingCall, callTarget]); // eslint-disable-line react-hooks/exhaustive-deps

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

        // Notify hub: "I'm calling this user" — hub sends IncomingCall to callee
        if (connection) {
            try {
                await connection.invoke("StartCall", targetUserId);
            } catch (err) {
                console.error("StartCall failed:", err);
                setCallState("idle");
                cleanupCall();
                return;
            }
        }

        // Create peer connection and wait for answer
        createPeerConnection(targetUserId);
    };

    // ─── SignalR event handlers ────────────────────────────────────────────
    useEffect(() => {
        if (!connection) return;

        const handleIncomingCall = ({ callerId, callerName, callerAvatar }) => {
            if (callState !== "idle") return; // ignore if already in a call
            pendingOfferRef.current = null;
            setIncomingCall({ callerId, callerName, callerAvatar });
            setCallState("ringing");
        };

        // Caller-side: callee accepted, now send the offer
        const handleCallAccepted = async () => {
            if (callState !== "calling") return;
            const pc = peerConnectionRef.current;
            if (!pc || !callTarget?.id) return;
            try {
                const offer = await pc.createOffer();
                await pc.setLocalDescription(offer);
                await connection.invoke("SendSignal", callTarget.id, "offer", JSON.stringify(offer));
            } catch (err) {
                console.error("Failed to send offer:", err);
            }
        };

        const handleReceiveSignal = async ({ senderId, signalType, signalData }) => {
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
        };

        const handleCallEnded = () => {
            cleanupCall();
            setCallState("idle");
            setIncomingCall(null);
            setCallTarget(null);
        };

        const handleCallRejected = () => {
            // Caller-side: callee rejected the call
            cleanupCall();
            setCallState("idle");
            setCallTarget(null);
        };

        connection.on("IncomingCall", handleIncomingCall);
        connection.on("CallAccepted", handleCallAccepted);
        connection.on("CallRejected", handleCallRejected);
        connection.on("ReceiveSignal", handleReceiveSignal);
        connection.on("CallEnded", handleCallEnded);

        return () => {
            connection.off("IncomingCall", handleIncomingCall);
            connection.off("CallAccepted", handleCallAccepted);
            connection.off("CallRejected", handleCallRejected);
            connection.off("ReceiveSignal", handleReceiveSignal);
            connection.off("CallEnded", handleCallEnded);
        };
    }, [connection, callState, callTarget, processOffer, processAnswer]); // eslint-disable-line react-hooks/exhaustive-deps

    // ─── Accept incoming call ──────────────────────────────────────────────
    const answerCall = async () => {
        if (!incomingCall || callState !== "ringing") return;
        const callerId = incomingCall.callerId;
        const callerName = incomingCall.callerName;
        const callerAvatar = incomingCall.callerAvatar;

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

        // Tell hub to notify the caller that we accepted — caller will then send the offer
        if (connection) {
            try {
                await connection.invoke("AcceptCall", callerId);
            } catch (err) {
                console.error("AcceptCall failed:", err);
            }
        }

        // The offer will arrive via ReceiveSignal — flush pending if already there
        setTimeout(flushPendingOffer, 100);
    };

    // ─── Reject incoming call ────────────────────────────────────────────
    const rejectCall = () => {
        const callerId = incomingCall?.callerId;
        setIncomingCall(null);
        setCallState("idle");
        stopLocalMedia();
        if (callerId && connection) {
            connection.invoke("RejectCall", callerId).catch(() => {});
        }
    };

    // ─── End call (local) ────────────────────────────────────────────────
    const endCall = async () => {
        const targetId = callTarget?.id;
        cleanupCall();
        setCallState("idle");
        setCallTarget(null);
        stopDurationTimer();
        if (targetId && connection) {
            connection.invoke("SendSignal", targetId, "hangup", "").catch(() => {});
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

    // ─── Cleanup on unmount ────────────────────────────────────────────────
    useEffect(() => {
        return () => {
            cleanupCall();
            stopDurationTimer();
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
