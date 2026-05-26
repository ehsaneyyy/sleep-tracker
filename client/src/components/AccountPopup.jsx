import { useState, useEffect, useRef } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function AccountPopup({ onClose }) {
    const [profile, setProfile] = useState(null);
    const [name, setName] = useState("");
    const [editing, setEditing] = useState(false);
    const popupRef = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        api.get("/auth/me").then((res) => {
            setProfile(res.data);
            setName(res.data.name || "");
        });
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (popupRef.current && !popupRef.current.contains(e.target)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    const saveName = async () => {
        try {
            const res = await api.put("/auth/me", { name });
            setProfile(res.data);
            setEditing(false);
        } catch (err) {
            console.warn("Could not save name");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    if (!profile) return null;

    return (
        <div
            ref={popupRef}
            className="absolute right-0 top-12 w-72 bg-[#151B23] border border-[#FFFFFF0D] rounded-2xl p-5 shadow-2xl backdrop-blur-xl z-50"
        >
            <button
                onClick={onClose}
                className="absolute top-4 right-4 w-6 h-6 flex items-center justify-center rounded-full text-[#94A3B8] hover:bg-white/10 hover:text-[#F1F5F9] transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#7B8CDE] text-[#0B0E14] flex items-center justify-center font-semibold text-sm uppercase">
                    {profile.name ? profile.name[0] : profile.email[0]}
                </div>
                <div>
                    <div className="text-[#F1F5F9] font-medium text-sm">{profile.email}</div>
                    <div className="text-[#94A3B8] text-xs">{profile.name || "Add your name"}</div>
                </div>
            </div>

            {editing ? (
                <div className="flex items-center gap-2 mb-4">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="flex-1 p-2 bg-[#0B0E14] border border-[#FFFFFF0D] rounded-lg text-[#F1F5F9] text-sm focus:outline-none focus:border-[#7B8CDE]"
                        placeholder="Your name"
                        autoFocus
                    />
                    <button
                        onClick={saveName}
                        className="px-3 py-1 bg-[#7B8CDE] text-[#0B0E14] rounded-lg text-xs font-semibold hover:shadow-[0_0_10px_rgba(123,140,222,0.3)] transition-all"
                    >
                        Save
                    </button>
                </div>
            ) : (
                <button
                    onClick={() => setEditing(true)}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-[#94A3B8] hover:bg-[#FFFFFF0D] hover:text-[#F1F5F9] transition-colors mb-4"
                >
                    Edit name
                </button>
            )}

            <div className="border-t border-[#FFFFFF0D] pt-3">
                <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-[#F4A5A5] hover:bg-[#FFFFFF0D] transition-colors"
                >
                    Sign Out
                </button>
            </div>
        </div>
    );
}