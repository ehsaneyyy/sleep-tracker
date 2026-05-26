import { useEffect, useRef } from "react";
import api from "../services/api";
import { useIdle } from "../context/IdleContext";

const IDLE_THRESHOLD_MINUTES = 30;
const AWAKEN_THRESHOLD_MINUTES = 3;

export default function IdleTracker() {
    const lastActive = useRef(Date.now());
    const state = useRef("active");
    const { setIdleState } = useIdle();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        const sendEvent = async (eventType) => {
            try {
                await api.post("/auto/event", {
                    event_type: eventType,
                    timestamp: new Date().toISOString(),
                });
            } catch (e) {
                console.warn("Auto sleep event failed", e);
            }
        };

        const onActivity = () => {
            lastActive.current = Date.now();
            if (state.current === "idle" || state.current === "sleeping") {
                state.current = "active";
                setIdleState("active");
                sendEvent("active");
            }
        };

        const checkIdle = setInterval(() => {
            const idleMs = Date.now() - lastActive.current;
            const idleMinutes = idleMs / 60000;

            if (state.current === "active" && idleMinutes >= IDLE_THRESHOLD_MINUTES) {
                state.current = "idle";
                setIdleState("idle");
                sendEvent("idle");
            }
            if (state.current === "idle" && idleMinutes >= 180) {
                state.current = "sleeping";
                setIdleState("sleeping");
            }
            if (state.current === "sleeping" && idleMinutes < AWAKEN_THRESHOLD_MINUTES) {
                state.current = "active";
                setIdleState("active");
                sendEvent("active");
            }
        }, 30000);

        window.addEventListener("mousemove", onActivity);
        window.addEventListener("keydown", onActivity);
        window.addEventListener("scroll", onActivity);

        return () => {
            clearInterval(checkIdle);
            window.removeEventListener("mousemove", onActivity);
            window.removeEventListener("keydown", onActivity);
            window.removeEventListener("scroll", onActivity);
        };
    }, [setIdleState]);

    return null;
}