import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function LoginPrompt() {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const dismissed = sessionStorage.getItem("loginPromptDismissed");
        if (!token && !dismissed) {
            setShow(true);
        }
    }, []);

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShow(false)} />
            <div className="relative w-full max-w-sm bg-[#0B0E14]/90 backdrop-blur-2xl border border-[#7B8CDE]/30 rounded-2xl p-6 shadow-[0_0_40px_rgba(123,140,222,0.2)] text-center">
                <button
                    onClick={() => {
                        setShow(false);
                        sessionStorage.setItem("loginPromptDismissed", "true");
                    }}
                    className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full bg-white/5 text-[#94A3B8] hover:bg-white/15 hover:text-[#F1F5F9] transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="text-4xl mb-4">🌙</div>
                <h3 className="text-lg font-semibold text-[#F1F5F9] mb-2">Welcome to SleepTracker</h3>
                <p className="text-sm text-[#94A3B8] mb-6">
                    Log in or create an account to start tracking your sleep and get personalised insights.
                </p>

                <div className="flex gap-3">
                    <Link
                        to="/login"
                        onClick={() => setShow(false)}
                        className="flex-1 py-2.5 bg-[#7B8CDE] text-[#0B0E14] rounded-full font-semibold hover:shadow-[0_0_20px_rgba(123,140,222,0.4)] transition-all duration-300"
                    >
                        Log In
                    </Link>
                    <Link
                        to="/signup"
                        onClick={() => setShow(false)}
                        className="flex-1 py-2.5 border border-[#7B8CDE]/40 text-[#F1F5F9] rounded-full font-semibold hover:bg-[#7B8CDE]/10 transition-all duration-300"
                    >
                        Sign Up
                    </Link>
                </div>
            </div>
        </div>
    );
}