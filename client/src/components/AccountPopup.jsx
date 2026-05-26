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
            className="absolute right-0 top-14 w-80 md:w-96 bg-[#0B0E14]/95 backdrop-blur-2xl border border-[#FFFFFF10] rounded-3xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.5)] z-50 animate-fade-in"
        >
            <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-[#FFFFFF08] text-[#94A3B8] hover:bg-[#FFFFFF15] hover:text-[#F1F5F9] transition-all"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            <div className="flex flex-col items-center text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#7B8CDE] to-[#A78BFA] text-[#0B0E14] flex items-center justify-center font-bold text-2xl uppercase shadow-[0_0_20px_rgba(123,140,222,0.4)] mb-4">
                    {profile.name ? profile.name[0] : profile.email[0]}
                </div>
                <div className="text-[#F1F5F9] font-semibold text-base break-all">
                    {profile.email}
                </div>
                <div className="text-[#94A3B8] text-sm mt-1">
                    {profile.name || "Add your name"}
                </div>
            </div>

            {editing ? (
                <div className="flex items-center gap-2 mb-5">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="flex-1 p-3 bg-[#0B0E14] border border-[#FFFFFF0D] rounded-xl text-[#F1F5F9] text-sm focus:outline-none focus:border-[#7B8CDE] transition-colors"
                        placeholder="Your name"
                        autoFocus
                    />
                    <button
                        onClick={saveName}
                        className="px-4 py-3 bg-[#7B8CDE] text-[#0B0E14] rounded-xl text-sm font-semibold hover:shadow-[0_0_15px_rgba(123,140,222,0.4)] transition-all"
                    >
                        Save
                    </button>
                </div>
            ) : (
                <button
                    onClick={() => setEditing(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#FFFFFF08] text-[#94A3B8] hover:bg-[#FFFFFF12] hover:text-[#F1F5F9] transition-all text-sm mb-5"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                    Edit name
                </button>
            )}

            <div className="border-t border-[#FFFFFF0D] pt-4">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#F4A5A5]/10 text-[#F4A5A5] hover:bg-[#F4A5A5]/20 transition-all text-sm font-medium"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                    </svg>
                    Sign Out
                </button>
            </div>
        </div>
    );
}