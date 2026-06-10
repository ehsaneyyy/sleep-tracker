import { useEffect, useState, useRef } from "react";
import { useTheme } from "../context/ThemeContext";

export default function GreetingToast() {
    const { mode, profile } = useTheme();
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState("");
    const [subMessage, setSubMessage] = useState("");
    const prevMode = useRef(mode);

    useEffect(() => {
        if (!profile || !profile.bed_time) return;

        const now = new Date();
        const [bedH, bedM] = profile.bed_time.split(":").map(Number);
        const [wakeH, wakeM] = profile.wake_time.split(":").map(Number);

        const bedTime = new Date(now);
        bedTime.setHours(bedH, bedM, 0, 0);
        const wakeTime = new Date(now);
        wakeTime.setHours(wakeH, wakeM, 0, 0);

        const TWO_HOURS = 60000 * 60 * 2;

        if (mode === "sleep") {
            const timeToBed = bedTime.getTime() - now.getTime();
            if (timeToBed > 0 && timeToBed < TWO_HOURS && mode !== prevMode.current) {
                setMessage("🌙 Wind Down");
                setSubMessage(`Your typical bedtime is around ${profile.bed_time}. Time to relax.`);
                setVisible(true);
                prevMode.current = mode;
                const timeout = setTimeout(() => setVisible(false), 10000);
                return () => clearTimeout(timeout);
            }
        } else if (mode === "awake") {
            const timeToWake = wakeTime.getTime() - now.getTime();
            if (timeToWake > 0 && timeToWake < TWO_HOURS && mode !== prevMode.current) {
                setMessage("☀️ Rise & Shine");
                setSubMessage(`Your day starts around ${profile.wake_time}. Let’s make it great.`);
                setVisible(true);
                prevMode.current = mode;
                const timeout = setTimeout(() => setVisible(false), 10000);
                return () => clearTimeout(timeout);
            }
        }
    }, [mode, profile]);

    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setVisible(false)} />
            <div
                className={`relative w-full max-w-md p-6 rounded-2xl shadow-2xl border backdrop-blur-xl transition-all duration-500 animate-scale-up ${mode === "sleep"
                        ? "bg-[#0a0f1a]/90 border-[#b8a9d4]/30"
                        : "bg-[#0B0E14]/90 border-[#7B8CDE]/30"
                    }`}
            >
                <button
                    onClick={() => setVisible(false)}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-[#94A3B8] hover:bg-white/10 hover:text-[#F1F5F9] transition-colors"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="text-center space-y-3">
                    <span className="text-4xl block">
                        {mode === "sleep" ? "🌙" : "☀️"}
                    </span>
                    <h2 className="text-xl font-semibold text-[#F1F5F9]">{message}</h2>
                    <p className="text-sm text-[#94A3B8] leading-relaxed">{subMessage}</p>
                </div>
            </div>
        </div>
    );
}