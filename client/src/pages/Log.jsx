import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Log() {
    const [date, setDate] = useState("");
    const [sleepTime, setSleepTime] = useState("");
    const [wakeTime, setWakeTime] = useState("");
    const [quality, setQuality] = useState(3);
    const [notes, setNotes] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post("/entries/", {
                date: new Date(date).toISOString(),
                sleep_time: new Date(sleepTime).toISOString(),
                wake_time: new Date(wakeTime).toISOString(),
                quality: parseInt(quality),
                notes,
            });
            navigate("/dashboard");
        } catch (err) {
            setError("Failed to save. Check times and login status.");
        }
    };

    return (
        <div className="min-h-screen bg-[#0B0E14] text-[#F1F5F9] p-8 flex justify-center">
            <form onSubmit={handleSubmit} className="bg-[#151B23] p-8 rounded-xl w-full max-w-md space-y-5 border border-[#FFFFFF0D]">
                <h2 className="text-3xl font-bold text-[#F1F5F9]">Log Sleep</h2>
                {error && <p className="text-[#F4A5A5]">{error}</p>}
                <div>
                    <label className="block text-sm text-[#94A3B8] mb-1">Date</label>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full p-3 bg-[#0B0E14] rounded border border-[#FFFFFF0D] text-[#F1F5F9] focus:outline-none focus:border-[#7B8CDE]" required />
                </div>
                <div>
                    <label className="block text-sm text-[#94A3B8] mb-1">Bedtime</label>
                    <input type="datetime-local" value={sleepTime} onChange={(e) => setSleepTime(e.target.value)} className="w-full p-3 bg-[#0B0E14] rounded border border-[#FFFFFF0D] text-[#F1F5F9] focus:outline-none focus:border-[#7B8CDE]" required />
                </div>
                <div>
                    <label className="block text-sm text-[#94A3B8] mb-1">Wake time</label>
                    <input type="datetime-local" value={wakeTime} onChange={(e) => setWakeTime(e.target.value)} className="w-full p-3 bg-[#0B0E14] rounded border border-[#FFFFFF0D] text-[#F1F5F9] focus:outline-none focus:border-[#7B8CDE]" required />
                </div>
                <div>
                    <label className="block text-sm text-[#94A3B8] mb-1">Quality (1-5)</label>
                    <input type="number" min="1" max="5" value={quality} onChange={(e) => setQuality(e.target.value)} className="w-full p-3 bg-[#0B0E14] rounded border border-[#FFFFFF0D] text-[#F1F5F9] focus:outline-none focus:border-[#7B8CDE]" />
                </div>
                <div>
                    <label className="block text-sm text-[#94A3B8] mb-1">Notes</label>
                    <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows="3" className="w-full p-3 bg-[#0B0E14] rounded border border-[#FFFFFF0D] text-[#F1F5F9] focus:outline-none focus:border-[#7B8CDE]" />
                </div>
                <button type="submit" className="w-full py-3 bg-[#7B8CDE] hover:bg-[#A78BFA] text-[#0B0E14] rounded-full font-semibold transition-all duration-300 hover:scale-105">
                    Save Entry
                </button>
            </form>
        </div>
    );
}