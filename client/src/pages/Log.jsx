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
        <div className="min-h-screen bg-gray-950 text-white p-8 flex justify-center">
            <form onSubmit={handleSubmit} className="bg-gray-900 p-8 rounded-xl w-full max-w-md space-y-5">
                <h2 className="text-3xl font-bold">Log Sleep</h2>
                {error && <p className="text-red-400">{error}</p>}
                <div>
                    <label className="block text-sm text-gray-400 mb-1">Date</label>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full p-3 bg-gray-800 rounded border border-gray-700" required />
                </div>
                <div>
                    <label className="block text-sm text-gray-400 mb-1">Bedtime</label>
                    <input type="datetime-local" value={sleepTime} onChange={(e) => setSleepTime(e.target.value)} className="w-full p-3 bg-gray-800 rounded border border-gray-700" required />
                </div>
                <div>
                    <label className="block text-sm text-gray-400 mb-1">Wake time</label>
                    <input type="datetime-local" value={wakeTime} onChange={(e) => setWakeTime(e.target.value)} className="w-full p-3 bg-gray-800 rounded border border-gray-700" required />
                </div>
                <div>
                    <label className="block text-sm text-gray-400 mb-1">Quality (1-5)</label>
                    <input type="number" min="1" max="5" value={quality} onChange={(e) => setQuality(e.target.value)} className="w-full p-3 bg-gray-800 rounded border border-gray-700" />
                </div>
                <div>
                    <label className="block text-sm text-gray-400 mb-1">Notes</label>
                    <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows="3" className="w-full p-3 bg-gray-800 rounded border border-gray-700" />
                </div>
                <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded font-semibold transition">
                    Save Entry
                </button>
            </form>
        </div>
    );
}