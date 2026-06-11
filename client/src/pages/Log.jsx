import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

const today = new Date().toISOString().slice(0, 10);

export default function Log() {
    const [date, setDate] = useState(today);
    const [sleepTime, setSleepTime] = useState("23:00");
    const [wakeTime, setWakeTime] = useState("07:00");
    const [quality, setQuality] = useState(3);
    const [notes, setNotes] = useState("");
    const [error, setError] = useState("");
    const [hoverStar, setHoverStar] = useState(0);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const [sh, sm] = sleepTime.split(":").map(Number);
            const [wh, wm] = wakeTime.split(":").map(Number);
            const sleepDate = new Date(`${date}T${sleepTime}:00`);
            let wakeDate = new Date(`${date}T${wakeTime}:00`);

            if (wh < sh || (wh === sh && wm <= sm)) {
                wakeDate.setDate(wakeDate.getDate() + 1);
            }

            await api.post("/entries/", {
                date: new Date(date).toISOString(),
                sleep_time: sleepDate.toISOString(),
                wake_time: wakeDate.toISOString(),
                quality,
                notes,
            });

            navigate("/dashboard");
        } catch (err) {
            if (err.response && err.response.status === 409) {
                setError(
                    <>
                        <span className="text-[#F4A5A5]">
                            You already logged sleep for{" "}
                            {new Date(date).toLocaleDateString("en-US", {
                                weekday: "short",
                                day: "numeric",
                                month: "short",
                            })}
                            .
                        </span>{" "}
                        <span className="text-[#F1F5F9]">Edit your logged sleep on your</span>{" "}
                        <Link
                            to="/dashboard"
                            className="text-[#7B8CDE] underline hover:no-underline"
                        >
                        Dashboard
                        </Link>
                    </>
                );
            } else {
                setError("Failed to save. Check times and login status.");
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#0B0E14] flex items-center justify-center p-4">
            <form
                onSubmit={handleSubmit}
                className="relative w-full max-w-md bg-[#151B23]/95 backdrop-blur-2xl border border-[#FFFFFF10] rounded-3xl p-8 shadow-2xl shadow-black/30"
            >
                <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-[#94A3B8] hover:bg-white/10 hover:text-[#F1F5F9] transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <h2 className="text-3xl font-light tracking-tight text-[#F1F5F9] mb-6">Log Sleep</h2>

                {error && <div className="text-sm mb-4">{error}</div>}

                <div className="space-y-5">
                    <div>
                        <label className="block text-sm text-[#94A3B8] mb-1">Date</label>
                        <input
                            type="date"
                            max={today}
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full p-3 bg-[#0B0E14] rounded-xl border border-[#FFFFFF0D] text-[#F1F5F9] focus:outline-none focus:border-[#7B8CDE] transition-colors"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-[#94A3B8] mb-1">Bedtime</label>
                            <input
                                type="time"
                                value={sleepTime}
                                onChange={(e) => setSleepTime(e.target.value)}
                                className="w-full p-3 bg-[#0B0E14] rounded-xl border border-[#FFFFFF0D] text-[#F1F5F9] focus:outline-none focus:border-[#7B8CDE] transition-colors"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-[#94A3B8] mb-1">Wake time</label>
                            <input
                                type="time"
                                value={wakeTime}
                                onChange={(e) => setWakeTime(e.target.value)}
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
                                    onClick={() => setQuality(star)}
                                    onMouseEnter={() => setHoverStar(star)}
                                    onMouseLeave={() => setHoverStar(0)}
                                    className="text-2xl transition-colors"
                                >
                                    <span
                                        className={
                                            star <= (hoverStar || quality)
                                                ? "text-yellow-300"
                                                : "text-[#FFFFFF30]"
                                        }
                                    >
                                        ★
                                    </span>
                                </button>
                            ))}
                            <span className="text-sm text-[#94A3B8] ml-2 self-center">
                                {quality}/5
                            </span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-[#94A3B8] mb-1">Notes</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows="3"
                            className="w-full p-3 bg-[#0B0E14] rounded-xl border border-[#FFFFFF0D] text-[#F1F5F9] focus:outline-none focus:border-[#7B8CDE] transition-colors"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full mt-6 py-3.5 bg-[#7B8CDE] text-[#0B0E14] rounded-full font-semibold hover:shadow-[0_0_30px_rgba(123,140,222,0.4)] hover:scale-[1.02] active:scale-95 transition-all duration-300"
                >
                    Save Entry
                </button>
            </form>
        </div>
    );
}