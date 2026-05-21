import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function WeeklyChart({ entries }) {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const data = days.map((day, i) => {
        const match = entries.find((e) => new Date(e.date).getDay() === i);
        return {
            day,
            hours: match ? match.duration_hours : 0,
            quality: match ? match.quality : 0,
        };
    });

    return (
        <div className="bg-gray-900 p-6 rounded-xl w-full">
            <h2 className="text-2xl mb-4">Sleep This Week</h2>
            <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data}>
                    <XAxis dataKey="day" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip />
                    <Bar dataKey="hours" fill="#818cf8" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}