import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import api from "../services/api";

export default function PersonalizedSection() {
    const { mode, profile } = useTheme();
    const [timeToNext, setTimeToNext] = useState("");
    const [progress, setProgress] = useState(0);
    const [userName, setUserName] = useState("");

    useEffect(() => {
        api.get("/auth/me")
            .then((res) => setUserName(res.data.name || ""))
            .catch(() => setUserName(""));
    }, []);

    useEffect(() => {
        if (!profile) return;

        const update = () => {
            const now = new Date();
            const [bedH, bedM] = profile.bed_time.split(":").map(Number);
            const [wakeH, wakeM] = profile.wake_time.split(":").map(Number);

            let target;
            if (mode === "awake") {
                target = new Date(now);
                target.setHours(bedH, bedM, 0, 0);
                if (target.getTime() <= now.getTime()) target.setDate(target.getDate() + 1);
            } else {
                target = new Date(now);
                target.setHours(wakeH, wakeM, 0, 0);
                if (target.getTime() <= now.getTime()) target.setDate(target.getDate() + 1);
            }

            const start = new Date(target);
            start.setHours(start.getHours() - (mode === "awake" ? 16 : 8));
            const total = target.getTime() - start.getTime();
            const elapsed = now.getTime() - start.getTime();
            const pct = Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)));

            const diff = target.getTime() - now.getTime();
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            setTimeToNext(`${hours}h ${minutes}m`);
            setProgress(pct);
        };

        update();
        const interval = setInterval(update, 30000);
        return () => clearInterval(interval);
    }, [mode, profile]);

    // hide section for fresh users (no real sleep profile yet)
    if (!profile || profile.is_default) return null;

    const mood = mode === "awake" ? "⚡ Time to shine" : "🌙 Wind‑down mode";
    const displayName = userName || "friend";
    const nextLabel = mode === "awake" ? "until bedtime" : "until wake up";
    const gradient =
        mode === "sleep"
            ? "from-[#0a0f1a]/90 to-[#151B23]/90"
            : "from-[#0B0E14]/90 to-[#151B23]/90";
    const ringColor = mode === "sleep" ? "#b8a9d4" : "#7B8CDE";

    return (
        <div className="flex justify-center mt-16 sm:mt-20 relative z-20 px-4 mb-8">
            <div
                className={`w-full max-w-md backdrop-blur-2xl rounded-[2rem] border border-white/10 p-8 bg-gradient-to-b ${gradient} shadow-2xl shadow-black/20 transition-all duration-700 animate-fade-in`}
            >
                <div className="text-center space-y-6">
                    <div className="relative inline-flex items-center justify-center">
                        <svg className="w-24 h-24 sm:w-28 sm:h-28 transform -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="4" className="text-white/10" />
                            <circle
                                cx="50"
                                cy="50"
                                r="44"
                                fill="none"
                                stroke={ringColor}
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeDasharray={`${2 * Math.PI * 44}`}
                                strokeDashoffset={`${2 * Math.PI * 44 * (1 - progress / 100)}`}
                                className="transition-all duration-1000 ease-out"
                            />
                        </svg>
                        <span
                            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl sm:text-5xl select-none ${mode === "awake" ? "animate-spin-slow" : "animate-pulse-soft"
                                }`}
                        >
                            {mode === "sleep" ? "🌙" : "☀️"}
                        </span>
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-[#F1F5F9]">
                            {mood}, {displayName}
                        </h2>
                        <div className="flex items-center justify-center gap-2 text-base sm:text-lg text-[#94A3B8]">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>
                                <strong className="text-[#F1F5F9] font-semibold">{timeToNext}</strong> {nextLabel}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}