import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    if (!token) return null;

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0B0E14]/80 backdrop-blur-xl border-b border-[#7B8CDE]/20">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-10">
                    <Link to="/" className="flex items-center gap-3 group">
                        <span className="text-2xl">🌙</span>
                        <span className="text-xl font-semibold tracking-wide text-[#F1F5F9] group-hover:text-[#A78BFA] transition-colors duration-300">
                            SleepTracker
                        </span>
                    </Link>

                    <div className="flex items-center gap-1">
                        <Link
                            to="/dashboard"
                            className="px-5 py-2 rounded-full text-sm font-medium text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#7B8CDE]/20 transition-all duration-300"
                        >
                            Dashboard
                        </Link>
                        <Link
                            to="/log"
                            className="px-5 py-2 rounded-full text-sm font-medium text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#7B8CDE]/20 transition-all duration-300"
                        >
                            Log Sleep
                        </Link>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="px-5 py-2 rounded-full text-sm font-medium text-[#94A3B8] hover:text-[#F4A5A5] hover:bg-[#F4A5A5]/20 transition-all duration-300"
                >
                    Sign Out
                </button>
            </div>
        </nav>
    );
}