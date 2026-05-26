import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { Link } from "react-router-dom";

export default function PersonalizedSection() {
    const { mode, profile } = useTheme();
    const [timeToNext, setTimeToNext] = useState("");

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

            const diff = target.getTime() - now.getTime();
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            setTimeToNext(`${hours}h ${minutes}m`);
        };

        update();
        const interval = setInterval(update, 30000);
        return () => clearInterval(interval);
    }, [mode, profile]);

    if (!profile) return null;

    const greeting =
        mode === "awake"
            ? "☀️ Good morning"
            : new Date().getHours() < 12
                ? "🌤️ Good morning"
                : new Date().getHours() < 18
                    ? "🌞 Good afternoon"
                    : "🌆 Good evening";

    const nextLabel = mode === "awake" ? "until bedtime" : "until wake up";
    const statusColor = mode === "sleep" ? "text-[#b8a9d4]" : "text-[#7B8CDE]";
    const borderColor = mode === "sleep" ? "border-[#b8a9d4]/20" : "border-[#7B8CDE]/20";
    const glowColor = mode === "sleep" ? "shadow-[#b8a9d4]/10" : "shadow-[#7B8CDE]/10";
    const gradient = mode === "sleep"
        ? "from-[#0a0f1a]/80 to-[#151B23]/80"
        : "from-[#0B0E14]/80 to-[#151B23]/80";

    return (
        <div className="flex justify-center mt-20 relative z-20 px-4 mb-8">
            <div
                className={`w-full max-w-xl backdrop-blur-2xl rounded-3xl border ${borderColor} p-8 md:p-10 
        bg-gradient-to-b ${gradient} shadow-2xl ${glowColor} transition-all duration-700 animate-fade-in`}
            >
                <div className="text-center space-y-6">
                    <div className="space-y-3">
                        <span className="text-5xl inline-block">
                            {mode === "sleep" ? "🌙" : "☀️"}
                        </span>
                        <h2 className="text-3xl md:text-4xl font-light tracking-tight text-[#F1F5F9]">
                            {greeting}
                        </h2>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-center gap-2 text-lg text-[#94A3B8]">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>
                                <strong className="text-[#F1F5F9] font-semibold">{timeToNext}</strong> {nextLabel}
                            </span>
                        </div>
                        <p className={`text-sm font-medium ${statusColor} transition-colors duration-500`}>
                            {mode === "sleep" ? "🌙 Wind‑down mode" : "⚡ Time to shine"}
                        </p>
                    </div>

                    <div className="pt-4">
                        <Link
                            to="/dashboard"
                            className="group inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[#7B8CDE] text-[#0B0E14] font-semibold hover:shadow-[0_0_25px_rgba(123,140,222,0.5)] hover:scale-105 transition-all duration-300"
                        >
                            <span>View Dashboard</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 group-hover:translate-x-1 transition-transform">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}