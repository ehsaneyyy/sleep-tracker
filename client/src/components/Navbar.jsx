import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    if (!token) return null;

    const isDashboard = location.pathname === "/dashboard";

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0B0E14]/70 backdrop-blur-2xl">
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#7B8CDE]/30 to-transparent" />
            <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2.5 group select-none">
                    <span className="w-2 h-2 rounded-full bg-[#7B8CDE] group-hover:shadow-[0_0_12px_#7B8CDE] transition-shadow duration-500" />
                    <span className="text-lg font-medium tracking-[0.02em] text-[#F1F5F9]">
                        SleepTracker
                    </span>
                </Link>

                <div className="flex items-center gap-8">
                    {isDashboard ? (
                        <Link
                            to="/"
                            className="relative text-sm font-medium text-[#94A3B8] hover:text-[#F1F5F9] transition-colors duration-300 py-1"
                        >
                            Home
                            <span className="absolute bottom-0 left-0 right-0 h-px bg-[#7B8CDE] scale-x-0 hover:scale-x-100 transition-transform duration-300 origin-left" />
                        </Link>
                    ) : (
                        <Link
                            to="/dashboard"
                            className="relative text-sm font-medium text-[#94A3B8] hover:text-[#F1F5F9] transition-colors duration-300 py-1"
                        >
                            Dashboard
                            <span className="absolute bottom-0 left-0 right-0 h-px bg-[#7B8CDE] scale-x-0 hover:scale-x-100 transition-transform duration-300 origin-left" />
                        </Link>
                    )}

                    <Link
                        to="/log"
                        className="relative text-sm font-medium text-[#94A3B8] hover:text-[#F1F5F9] transition-colors duration-300 py-1"
                    >
                        Log Sleep
                        <span className="absolute bottom-0 left-0 right-0 h-px bg-[#7B8CDE] scale-x-0 hover:scale-x-100 transition-transform duration-300 origin-left" />
                    </Link>

                    <span className="w-px h-4 bg-[#FFFFFF0D]" />

                    <button
                        onClick={handleLogout}
                        className="text-sm font-medium text-[#94A3B8] hover:text-[#F4A5A5] transition-colors duration-300"
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        </nav>
    );
}