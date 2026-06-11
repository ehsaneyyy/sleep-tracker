import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export default function LoginPrompt() {
    const [show, setShow] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const dismissed = sessionStorage.getItem("loginPromptDismissed");
        const authPages = location.pathname === "/login" || location.pathname === "/signup";

        if (!token && !dismissed && !authPages) {
            const timer = setTimeout(() => setShow(true), 500);
            return () => clearTimeout(timer);
        }
    }, [location]);

    const handleDismiss = () => {
        setShow(false);
        sessionStorage.setItem("loginPromptDismissed", "true");
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-md" onClick={handleDismiss} />
            <div className="relative w-full max-w-lg bg-[#0B0E14]/95 backdrop-blur-2xl border border-[#7B8CDE]/20 rounded-3xl p-8 shadow-[0_25px_60px_rgba(0,0,0,0.5)] text-center animate-scale-up">
                <button
                    onClick={handleDismiss}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-[#94A3B8] hover:bg-white/15 hover:text-[#F1F5F9] transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="text-5xl mb-5">🌙</div>
                <h2 className="text-2xl font-light tracking-tight text-[#F1F5F9] mb-3">Welcome to SleepTracker</h2>
                <p className="text-base text-[#94A3B8] mb-8 max-w-sm mx-auto leading-relaxed">
                    Your personal sleep companion. Log your nights, see patterns, and get AI‑powered insights to sleep better.
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                        to="/login"
                        onClick={handleDismiss}
                        className="flex-1 py-3 bg-[#7B8CDE] text-[#0B0E14] rounded-full font-semibold hover:shadow-[0_0_25px_rgba(123,140,222,0.5)] transition-all duration-300"
                    >
                        Log In
                    </Link>
                    <Link
                        to="/signup"
                        onClick={handleDismiss}
                        className="flex-1 py-3 border border-[#7B8CDE]/40 text-[#F1F5F9] rounded-full font-semibold hover:bg-[#7B8CDE]/10 transition-all duration-300"
                    >
                        Sign Up
                    </Link>
                </div>

                <p className="text-xs text-[#94A3B8] mt-6">
                    By continuing, you agree to our imaginary terms and privacy policy.
                </p>
            </div>
        </div>
    );
}