import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import WeeklyChart from "../components/WeeklyChart";

export default function Dashboard() {
    const [entries, setEntries] = useState([]);
    const [insight, setInsight] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        api.get("/entries/")
            .then((res) => setEntries(res.data))
            .catch(() => navigate("/login"));
    }, [navigate]);

    const getInsight = () => {
        api.get("/insight/")
            .then((res) => setInsight(res.data.insight))
            .catch(() => setInsight("Could not get insight."));
    };

    return (
        <div className="min-h-screen bg-gray-950 text-white p-8">
            <h1 className="text-4xl font-bold mb-8">Your Sleep Dashboard</h1>
            <WeeklyChart entries={entries} />

            <div className="grid gap-8 max-w-4xl">
                <div className="bg-gray-900 p-6 rounded-xl">
                    <h2 className="text-2xl mb-4">This Week</h2>
                    {entries.length === 0 ? (
                        <p className="text-gray-400">No sleep entries yet. Log your first night!</p>
                    ) : (
                        <ul className="space-y-2">
                            {entries.map((e) => (
                                <li key={e.id} className="bg-gray-800 p-3 rounded flex justify-between">
                                    <span>{new Date(e.date).toLocaleDateString()}</span>
                                    <span>{e.duration_hours} hrs</span>
                                    <span>Quality: {e.quality}/5</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <button
                    onClick={getInsight}
                    className="bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded font-semibold w-fit transition"
                >
                    Get AI Sleep Insight
                </button>
                {insight && (
                    <div className="bg-gray-900 p-6 rounded-xl">
                        <p className="text-lg">{insight}</p>
                    </div>
                )}
            </div>
        </div>
    );
}