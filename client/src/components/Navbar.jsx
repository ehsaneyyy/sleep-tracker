import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import AccountPopup from "./AccountPopup";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem("token");
    const [iconMode, setIconMode] = useState("day");
    const [showAccount, setShowAccount] = useState(false);
    const { user } = useAuth();

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

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0B0E14]/80 backdrop-blur-2xl border-b border-[#FFFFFF0A]">
            <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-3 group">
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

                <div className="flex items-center gap-8">
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

                    <div className="relative">
                        <button
                            onClick={() => setShowAccount(!showAccount)}
                            className="w-8 h-8 rounded-full bg-[#7B8CDE] text-[#0B0E14] flex items-center justify-center font-semibold text-sm uppercase hover:shadow-[0_0_12px_rgba(123,140,222,0.6)] transition-all duration-300"
                        >
                            {user?.email?.charAt(0) || "U"}
                        </button>

                        {showAccount && <AccountPopup onClose={() => setShowAccount(false)} />}
                    </div>
                </div>
            </div>
        </nav>
    );
}