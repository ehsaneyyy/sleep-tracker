import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import WeeklyChart from "../components/WeeklyChart";

const today = new Date().toISOString().slice(0, 10);

export default function Dashboard() {
    const [entries, setEntries] = useState([]);
    const navigate = useNavigate();
    const [editingEntry, setEditingEntry] = useState(null);
    const [editDate, setEditDate] = useState("");
    const [editSleepTime, setEditSleepTime] = useState("");
    const [editWakeTime, setEditWakeTime] = useState("");
    const [editQuality, setEditQuality] = useState(3);
    const [editNotes, setEditNotes] = useState("");
    const [editHoverStar, setEditHoverStar] = useState(0);
    const [deletingEntry, setDeletingEntry] = useState(null);
    const [editError, setEditError] = useState("");

    const fetchEntries = () => {
        api.get("/entries/")
            .then((res) => setEntries(res.data))
            .catch(() => navigate("/login"));
    };

    useEffect(() => {
        fetchEntries();
    }, [navigate]);

    const totalHours = entries.reduce((sum, e) => sum + e.duration_hours, 0);
    const avgQuality = entries.length
        ? (entries.reduce((sum, e) => sum + e.quality, 0) / entries.length).toFixed(1)
        : 0;

    const openEdit = (entry) => {
        setEditingEntry(entry);
        setEditDate(new Date(entry.date).toISOString().slice(0, 10));
        const st = new Date(entry.sleep_time);
        const wt = new Date(entry.wake_time);
        setEditSleepTime(
            `${String(st.getHours()).padStart(2, "0")}:${String(st.getMinutes()).padStart(2, "0")}`
        );
        setEditWakeTime(
            `${String(wt.getHours()).padStart(2, "0")}:${String(wt.getMinutes()).padStart(2, "0")}`
        );
        setEditQuality(entry.quality);
        setEditNotes(entry.notes || "");
        setEditError("");
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const [sh, sm] = editSleepTime.split(":").map(Number);
            const [wh, wm] = editWakeTime.split(":").map(Number);
            const sleepDate = new Date(`${editDate}T${editSleepTime}:00`);
            let wakeDate = new Date(`${editDate}T${editWakeTime}:00`);
            if (wh < sh || (wh === sh && wm <= sm)) {
                wakeDate.setDate(wakeDate.getDate() + 1);
            }
            await api.put(`/entries/${editingEntry.id}`, {
                date: new Date(editDate).toISOString(),
                sleep_time: sleepDate.toISOString(),
                wake_time: wakeDate.toISOString(),
                quality: editQuality,
                notes: editNotes,
            });
            setEditingEntry(null);
            fetchEntries();
        } catch (err) {
            setEditError("Failed to save changes.");
        }
    };

    const handleDelete = async () => {
        if (!deletingEntry) return;
        try {
            await api.delete(`/entries/${deletingEntry.id}`);
            setDeletingEntry(null);
            fetchEntries();
        } catch (err) {
            setDeletingEntry(null);
        }
    };

    return (
        <div className="min-h-screen bg-[#0B0E14] pt-24 pb-16 px-6 md:px-10">
            <div className="max-w-5xl mx-auto space-y-10">
                <div>
                    <h1 className="text-3xl md:text-4xl font-light tracking-tight text-[#F1F5F9]">
                        Your Sleep Dashboard
                    </h1>
                    {entries.length > 0 && (
                        <div className="flex gap-8 mt-4">
                            <div className="text-sm text-[#94A3B8]">
                                <span className="text-[#F1F5F9] font-medium">{totalHours.toFixed(1)}h</span> total
                            </div>
                            <div className="text-sm text-[#94A3B8]">
                                <span className="text-[#F1F5F9] font-medium">{avgQuality}</span> avg quality
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-[#151B23] rounded-2xl p-6 border border-[#FFFFFF0D]">
                    <WeeklyChart entries={entries} />
                </div>

                <div className="bg-[#151B23] rounded-2xl p-6 border border-[#FFFFFF0D]">
                    <h2 className="text-xl font-medium mb-5 text-[#F1F5F9]">Recent Nights</h2>
                    {entries.length === 0 ? (
                        <div className="text-[#94A3B8] py-8 text-center space-y-2">
                            <p>No sleep entries yet.</p>
                            <p>Log your first night to unlock insights.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {entries.map((e) => (
                                <div
                                    key={e.id}
                                    className="flex items-center justify-between p-4 rounded-xl bg-[#0B0E14] border border-[#FFFFFF0D] hover:border-[#7B8CDE]/30 transition-all duration-300"
                                >
                                    <div className="flex items-center gap-6">
                                        <div className="text-sm font-medium text-[#F1F5F9] w-32">
                                            {new Date(e.date).toLocaleDateString("en-US", {
                                                weekday: "short",
                                                day: "numeric",
                                                month: "short",
                                            })}
                                        </div>
                                        <div className="text-sm text-[#94A3B8]">
                                            {e.duration_hours} hrs
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div
                                            className={`text-sm font-medium px-3 py-1 rounded-full ${e.quality >= 4
                                                    ? "bg-[#A7F3D0]/10 text-[#A7F3D0]"
                                                    : "bg-[#FDE68A]/10 text-[#FDE68A]"
                                                }`}
                                        >
                                            {e.quality}/5
                                        </div>
                                        <button
                                            onClick={() => openEdit(e)}
                                            className="w-7 h-7 flex items-center justify-center rounded-full text-[#94A3B8] hover:bg-white/10 hover:text-[#7B8CDE] transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => setDeletingEntry(e)}
                                            className="w-7 h-7 flex items-center justify-center rounded-full text-[#94A3B8] hover:bg-white/10 hover:text-[#F4A5A5] transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Edit modal */}
            {editingEntry && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setEditingEntry(null)} />
                    <div className="relative w-full max-w-md bg-[#151B23]/90 backdrop-blur-2xl border border-[#FFFFFF10] rounded-3xl p-6 shadow-2xl shadow-black/30">
                        <button
                            onClick={() => setEditingEntry(null)}
                            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-[#94A3B8] hover:bg-white/10 hover:text-[#F1F5F9] transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <h2 className="text-2xl font-light tracking-tight text-[#F1F5F9] mb-5">Edit Sleep Entry</h2>

                        {editError && <p className="text-[#F4A5A5] text-sm mb-4">{editError}</p>}

                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm text-[#94A3B8] mb-1">Date</label>
                                <input
                                    type="date"
                                    max={today}
                                    value={editDate}
                                    onChange={(e) => setEditDate(e.target.value)}
                                    className="w-full p-3 bg-[#0B0E14] rounded-xl border border-[#FFFFFF0D] text-[#F1F5F9] focus:outline-none focus:border-[#7B8CDE] transition-colors"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-[#94A3B8] mb-1">Bedtime</label>
                                    <input
                                        type="time"
                                        value={editSleepTime}
                                        onChange={(e) => setEditSleepTime(e.target.value)}
                                        className="w-full p-3 bg-[#0B0E14] rounded-xl border border-[#FFFFFF0D] text-[#F1F5F9] focus:outline-none focus:border-[#7B8CDE] transition-colors"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-[#94A3B8] mb-1">Wake time</label>
                                    <input
                                        type="time"
                                        value={editWakeTime}
                                        onChange={(e) => setEditWakeTime(e.target.value)}
                                        className="w-full p-3 bg-[#0B0E14] rounded-xl border border-[#FFFFFF0D] text-[#F1F5F9] focus:outline-none focus:border-[#7B8CDE] transition-colors"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-[#94A3B8] mb-2">Quality</label>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setEditQuality(star)}
                                            onMouseEnter={() => setEditHoverStar(star)}
                                            onMouseLeave={() => setEditHoverStar(0)}
                                            className="text-2xl transition-colors"
                                        >
                                            <span
                                                className={
                                                    star <= (editHoverStar || editQuality)
                                                        ? "text-yellow-300"
                                                        : "text-[#FFFFFF30]"
                                                }
                                            >
                                                ★
                                            </span>
                                        </button>
                                    ))}
                                    <span className="text-sm text-[#94A3B8] ml-2 self-center">{editQuality}/5</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-[#94A3B8] mb-1">Notes</label>
                                <textarea
                                    value={editNotes}
                                    onChange={(e) => setEditNotes(e.target.value)}
                                    rows="3"
                                    className="w-full p-3 bg-[#0B0E14] rounded-xl border border-[#FFFFFF0D] text-[#F1F5F9] focus:outline-none focus:border-[#7B8CDE] transition-colors"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-3.5 bg-[#7B8CDE] text-[#0B0E14] rounded-full font-semibold hover:shadow-[0_0_30px_rgba(123,140,222,0.4)] hover:scale-[1.02] active:scale-95 transition-all duration-300"
                            >
                                Save Changes
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete confirmation modal */}
            {deletingEntry && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeletingEntry(null)} />
                    <div className="relative w-full max-w-sm bg-[#151B23]/90 backdrop-blur-2xl border border-[#F4A5A5]/30 rounded-3xl p-6 shadow-2xl shadow-black/30 text-center">
                        <div className="text-4xl mb-4">🗑️</div>
                        <h3 className="text-lg font-semibold text-[#F1F5F9] mb-2">Delete this entry?</h3>
                        <p className="text-sm text-[#94A3B8] mb-6">
                            This will remove the sleep record from{" "}
                            {new Date(deletingEntry.date).toLocaleDateString("en-US", {
                                weekday: "short",
                                day: "numeric",
                                month: "short",
                            })}
                            . This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeletingEntry(null)}
                                className="flex-1 py-2.5 border border-[#FFFFFF0D] text-[#F1F5F9] rounded-full font-semibold hover:bg-white/5 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex-1 py-2.5 bg-[#F4A5A5] text-[#0B0E14] rounded-full font-semibold hover:shadow-[0_0_20px_rgba(244,165,165,0.4)] transition-all"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}