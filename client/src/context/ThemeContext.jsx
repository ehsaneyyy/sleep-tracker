import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [profile, setProfile] = useState(null);
    const [mode, setMode] = useState("awake"); // awake | sleep

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        api.get("/auth/me/sleep-profile").then((res) => {
            setProfile(res.data);
        });
    }, []);

    useEffect(() => {
        if (!profile) return;
        const checkMode = () => {
            const now = new Date();
            const [bedH, bedM] = profile.bed_time.split(":").map(Number);
            const [wakeH, wakeM] = profile.wake_time.split(":").map(Number);
            const nowMinutes = now.getHours() * 60 + now.getMinutes();
            const bedMinutes = bedH * 60 + bedM;
            const wakeMinutes = wakeH * 60 + wakeM;

            if (bedMinutes < wakeMinutes) {
                
                const isSleep = nowMinutes >= bedMinutes || nowMinutes < wakeMinutes;
                setMode(isSleep ? "sleep" : "awake");
            } else {
            
                const isSleep = nowMinutes >= bedMinutes || nowMinutes < wakeMinutes;
                setMode(isSleep ? "sleep" : "awake");
            }
        };
        checkMode();
        const interval = setInterval(checkMode, 60000);
        return () => clearInterval(interval);
    }, [profile]);

    useEffect(() => {
        const root = document.documentElement;
        if (mode === "sleep") {
            root.style.setProperty("--bg-color", "#0a0f1a");
            root.style.setProperty("--accent-color", "#b8a9d4");
            root.style.setProperty("--text-soft", "#e0d7f5");
        } else {
            root.style.setProperty("--bg-color", "#0B0E14");
            root.style.setProperty("--accent-color", "#7B8CDE");
            root.style.setProperty("--text-soft", "#F1F5F9");
        }
    }, [mode]);

    return (
        <ThemeContext.Provider value={{ mode, profile }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);