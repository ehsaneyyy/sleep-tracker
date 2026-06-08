import { useEffect, useRef } from "react";
import api from "../services/api";
import { useIdle } from "../context/IdleContext";

const IDLE_THRESHOLD_MINUTES = 30;
const AWAKEN_THRESHOLD_MINUTES = 3;
const STORAGE_KEY = "lastActivityTime";

export default function IdleTracker() {
    const lastActive = useRef(Date.now());
    const state = useRef("active");
    const { setIdleState } = useIdle();

    // ----- Offline gap detection on mount -----
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        const lastSaved = localStorage.getItem(STORAGE_KEY);
        if (lastSaved) {
            const lastTime = parseInt(lastSaved, 10);
            const now = Date.now();
            const gapHours = (now - lastTime) / (1000 * 60 * 60);

            if (gapHours >= 3) {
                // Potential sleep window – send to backend
                api.post("/auto/detect", {
                    sleep_time: new Date(lastTime).toISOString(),
                    wake_time: new Date(now).toISOString(),
                }).catch(() => { });
            }
        }
        // Update last activity time to now so we don’t re‑trigger on next mount
        localStorage.setItem(STORAGE_KEY, Date.now().toString());
    }, []);

    // ----- Live idle detection (original) -----
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
            const now = Date.now();
            lastActive.current = now;
            // Save to localStorage every time you're active
            localStorage.setItem(STORAGE_KEY, now.toString());

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

        // Standard desktop events
        window.addEventListener("mousemove", onActivity);
        window.addEventListener("keydown", onActivity);
        window.addEventListener("scroll", onActivity);
        // Mobile events
        window.addEventListener("touchstart", onActivity);
        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                // Save timestamp when user switches away / device sleeps
                localStorage.setItem(STORAGE_KEY, Date.now().toString());
            }
        });

        return () => {
            clearInterval(checkIdle);
            window.removeEventListener("mousemove", onActivity);
            window.removeEventListener("keydown", onActivity);
            window.removeEventListener("scroll", onActivity);
            window.removeEventListener("touchstart", onActivity);
            document.removeEventListener("visibilitychange", onActivity);
        };
    }, [setIdleState]);

    return null;
}