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
        <div className="bg-[#151B23] p-6 rounded-xl w-full">
            <h2 className="text-2xl mb-4 text-[#F1F5F9]">Sleep This Week</h2>
            <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data}>
                    <XAxis dataKey="day" stroke="#94A3B8" />
                    <YAxis stroke="#94A3B8" />
                    <Tooltip
                        contentStyle={{ backgroundColor: "#151B23", border: "1px solid #FFFFFF0D", borderRadius: "8px" }}
                        labelStyle={{ color: "#F1F5F9" }}
                    />
                    <Bar dataKey="hours" fill="#7B8CDE" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}