import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useIdle } from "../context/IdleContext";
import AccountPopup from "./AccountPopup";

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem("token");
    const [iconMode, setIconMode] = useState("day");
    const [showAccount, setShowAccount] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const { mode } = useTheme();
    const { idleState } = useIdle();

    if (!token) return null;

    const isDashboard = location.pathname === "/dashboard";

    useEffect(() => {
        const updateIcon = () => {
            const hour = new Date().getHours();
            setIconMode(hour >= 6 && hour < 18 ? "day" : "night");
        };
        updateIcon();
        const interval = setInterval(updateIcon, 60000);
        return () => clearInterval(interval);
    }, []);

    const faceType =
        idleState === "sleeping"
            ? "sleeping"
            : mode === "sleep"
                ? "tired"
                : "energetic";

    const closeMobile = () => setMenuOpen(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0B0E14]/80 backdrop-blur-2xl border-b border-[#FFFFFF0A]">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-3 group shrink-0">
                    <span className="relative w-5 h-5">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className={`absolute inset-0 w-full h-full text-[#7B8CDE] transition-all duration-1000 ease-out ${iconMode === "night"
                                    ? "opacity-100 scale-100 rotate-0"
                                    : "opacity-0 scale-50 rotate-45"
                                } ${iconMode === "night" ? "animate-pulse-soft" : ""}`}
                        >
                            <path d="M12 3C12 7.97056 16.0294 12 21 12C16.0294 12 12 16.0294 12 21C12 16.0294 7.97056 12 3 12C7.97056 12 12 7.97056 12 3Z" />
                        </svg>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className={`absolute inset-0 w-full h-full text-[#F1F5F9] transition-all duration-1000 ease-out ${iconMode === "day"
                                    ? "opacity-100 scale-100 rotate-0"
                                    : "opacity-0 scale-50 -rotate-45"
                                } ${iconMode === "day" ? "animate-float" : ""}`}
                        >
                            <path d="M3 13.6493C3 16.6044 5.41766 19 8.4 19L16.5 19C18.9853 19 21 16.9839 21 14.4969C21 12.6503 19.8893 10.9449 18.3 10.25C18.1317 7.32251 15.684 5 12.6893 5C10.3514 5 8.34694 6.48637 7.5 8.5C4.8 8.9375 3 11.2001 3 13.6493Z" />
                        </svg>
                    </span>
                    <span className="text-lg font-medium tracking-tight text-[#F1F5F9] group-hover:text-white transition-colors">
                        SleepTracker
                    </span>
                </Link>

                {/* Desktop links */}
                <div className="hidden sm:flex items-center gap-8">
                    {isDashboard ? (
                        <Link to="/" className="relative text-sm font-medium text-[#94A3B8] hover:text-[#F1F5F9] transition-colors py-1">
                            Home
                            <span className="absolute bottom-0 left-0 right-0 h-px bg-[#7B8CDE] scale-x-0 hover:scale-x-100 transition-transform duration-300 origin-left" />
                        </Link>
                    ) : (
                        <Link to="/dashboard" className="relative text-sm font-medium text-[#94A3B8] hover:text-[#F1F5F9] transition-colors py-1">
                            Dashboard
                            <span className="absolute bottom-0 left-0 right-0 h-px bg-[#7B8CDE] scale-x-0 hover:scale-x-100 transition-transform duration-300 origin-left" />
                        </Link>
                    )}
                    <Link to="/log" className="relative text-sm font-medium text-[#94A3B8] hover:text-[#F1F5F9] transition-colors py-1">
                        Log Sleep
                        <span className="absolute bottom-0 left-0 right-0 h-px bg-[#7B8CDE] scale-x-0 hover:scale-x-100 transition-transform duration-300 origin-left" />
                    </Link>
                    <span className="w-px h-4 bg-[#FFFFFF0D]" />
                </div>

                {/* Right side: avatar + hamburger */}
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <button
                            onClick={() => setShowAccount(!showAccount)}
                            className="w-9 h-9 rounded-full bg-gradient-to-br from-[#7B8CDE] to-[#A78BFA] text-[#0B0E14] flex items-center justify-center hover:shadow-[0_0_16px_rgba(123,140,222,0.7)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer overflow-hidden"
                        >
                            {faceType === "energetic" && (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" fill="none" className="w-6 h-6">
                                    <g className="animate-blink" style={{ transformOrigin: "10px 15px" }}>
                                        <circle cx="10" cy="14" r="5" fill="#0B0E14" />
                                        <circle cx="10" cy="14" r="2.2" fill="white" />
                                        <circle cx="11" cy="13" r="0.9" fill="white" />
                                    </g>
                                    <g className="animate-blink" style={{ transformOrigin: "26px 15px" }}>
                                        <circle cx="26" cy="14" r="5" fill="#0B0E14" />
                                        <circle cx="26" cy="14" r="2.2" fill="white" />
                                        <circle cx="27" cy="13" r="0.9" fill="white" />
                                    </g>
                                    <path d="M13 21 Q18 26, 23 21" stroke="#0B0E14" strokeWidth="1.8" strokeLinecap="round" fill="none" />
                                    <circle cx="8" cy="18" r="1.8" fill="#F4A5A5" opacity="0.6" />
                                    <circle cx="28" cy="18" r="1.8" fill="#F4A5A5" opacity="0.6" />
                                </svg>
                            )}
                            {faceType === "tired" && (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" fill="none" className="w-6 h-6">
                                    <g className="animate-blink" style={{ transformOrigin: "10px 15px" }}>
                                        <circle cx="10" cy="15" r="5" fill="#0B0E14" />
                                        <circle cx="10" cy="15" r="1.6" fill="white" opacity="0.7" />
                                        <path d="M5 13 Q10 11, 15 13" stroke="#0B0E14" strokeWidth="1.5" fill="none" />
                                    </g>
                                    <g className="animate-blink" style={{ transformOrigin: "26px 15px" }}>
                                        <circle cx="26" cy="15" r="5" fill="#0B0E14" />
                                        <circle cx="26" cy="15" r="1.6" fill="white" opacity="0.7" />
                                        <path d="M21 13 Q26 11, 31 13" stroke="#0B0E14" strokeWidth="1.5" fill="none" />
                                    </g>
                                    <path d="M15 22 Q18 21, 21 22" stroke="#0B0E14" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                                </svg>
                            )}
                            {faceType === "sleeping" && (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" fill="none" className="w-6 h-6 relative">
                                    <g>
                                        <path d="M6 15 Q10 13, 14 15" stroke="#0B0E14" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                                        <path d="M22 15 Q26 13, 30 15" stroke="#0B0E14" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                                    </g>
                                    <path d="M16 22 Q18 21, 20 22" stroke="#0B0E14" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                                    <text
                                        x="21"
                                        y="9"
                                        fill="#F1F5F9"
                                        fontSize="4.5"
                                        fontWeight="bold"
                                        className="animate-float"
                                        style={{ textShadow: "0 0 5px #7B8CDE" }}
                                    >
                                        zzz
                                    </text>
                                </svg>
                            )}
                        </button>
                        {showAccount && <AccountPopup onClose={() => setShowAccount(false)} />}
                    </div>

                    {/* Hamburger button (mobile) */}
                    <button
                        className="sm:hidden w-9 h-9 flex items-center justify-center rounded-full bg-[#FFFFFF0D] text-[#94A3B8] hover:text-[#F1F5F9] transition-colors"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Menu"
                    >
                        {menuOpen ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            <div
                className={`sm:hidden absolute top-full left-0 right-0 bg-[#0B0E14]/95 backdrop-blur-2xl border-b border-[#FFFFFF0A] transition-all duration-300 overflow-hidden ${menuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
                    }`}
            >
                <div className="px-6 py-4 space-y-3">
                    {isDashboard ? (
                        <Link to="/" onClick={closeMobile} className="block text-base font-medium text-[#94A3B8] hover:text-[#F1F5F9] transition-colors py-2">
                            Home
                        </Link>
                    ) : (
                        <Link to="/dashboard" onClick={closeMobile} className="block text-base font-medium text-[#94A3B8] hover:text-[#F1F5F9] transition-colors py-2">
                            Dashboard
                        </Link>
                    )}
                    <Link to="/log" onClick={closeMobile} className="block text-base font-medium text-[#94A3B8] hover:text-[#F1F5F9] transition-colors py-2">
                        Log Sleep
                    </Link>
                </div>
            </div>
        </nav>
    );
}