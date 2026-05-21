import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import WeeklyChart from "../components/WeeklyChart";

export default function Dashboard() {
    const [entries, setEntries] = useState([]);
    const [insight, setInsight] = useState("");
    const [loadingInsight, setLoadingInsight] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        api.get("/entries/")
            .then((res) => setEntries(res.data))
            .catch(() => navigate("/login"));
    }, [navigate]);

    const getInsight = async () => {
        setLoadingInsight(true);
        try {
            const res = await api.get("/insight/");
            setInsight(res.data.insight);
        } catch {
            setInsight("Could not get insight.");
        } finally {
            setLoadingInsight(false);
        }
    };

    const totalHours = entries.reduce((sum, e) => sum + e.duration_hours, 0);
    const avgQuality = entries.length
        ? (entries.reduce((sum, e) => sum + e.quality, 0) / entries.length).toFixed(1)
        : 0;

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
                                    <div
                                        className={`text-sm font-medium px-3 py-1 rounded-full ${e.quality >= 4
                                                ? "bg-[#A7F3D0]/10 text-[#A7F3D0]"
                                                : "bg-[#FDE68A]/10 text-[#FDE68A]"
                                            }`}
                                    >
                                        {e.quality}/5
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-4">
                    <button
                        onClick={getInsight}
                        disabled={loadingInsight}
                        className="px-8 py-3 rounded-full bg-[#7B8CDE] text-[#0B0E14] font-semibold transition-all duration-300 hover:shadow-[0_0_30px_rgba(123,140,222,0.4)] hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {loadingInsight ? "Thinking..." : "✨ Get AI Sleep Insight"}
                    </button>
                    {insight && (
                        <div className="w-full bg-[#151B23] rounded-2xl p-6 border border-[#7B8CDE]/20">
                            <p className="text-lg text-[#F1F5F9] leading-relaxed">{insight}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}