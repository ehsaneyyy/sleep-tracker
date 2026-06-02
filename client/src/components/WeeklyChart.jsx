import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function WeeklyChart({ entries }) {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const data = days.map((day, i) => {
        const match = entries.find(
            (e) => new Date(e.date).getDay() === (i === 6 ? 0 : i + 1)
        );
        return {
            day,
            hours: match ? match.duration_hours : 0,
            quality: match ? match.quality : 0,
        };
    });

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const { hours, quality } = payload[0].payload;
            if (hours === 0 && quality === 0) {
                return (
                    <div className="bg-[#0B0E14]/90 border border-[#FFFFFF0D] rounded-2xl px-4 py-3 backdrop-blur-2xl shadow-xl">
                        <p className="text-[#F1F5F9] text-xs font-medium mb-1">{label}</p>
                        <p className="text-sm text-[#94A3B8]">No data</p>
                    </div>
                );
            }
            return (
                <div className="bg-[#0B0E14]/90 border border-[#FFFFFF0D] rounded-2xl px-4 py-3 backdrop-blur-2xl shadow-xl">
                    <p className="text-[#F1F5F9] text-xs font-medium mb-1">{label}</p>
                    <p className="text-xl font-light text-[#F1F5F9]">{hours.toFixed(1)}h</p>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">quality {quality}/5</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-[#151B23] p-5 sm:p-6 rounded-2xl w-full border border-[#FFFFFF0D]">
            <h2 className="text-xl sm:text-2xl font-light tracking-tight text-[#F1F5F9] mb-6">
                Sleep This Week
            </h2>
            <ResponsiveContainer width="100%" height={200} className="sm:h-[240px]">
                <BarChart data={data} barCategoryGap="35%">
                    <XAxis
                        dataKey="day"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: "#94A3B8" }}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: "#94A3B8" }}
                        domain={[0, 12]}
                        tickCount={5}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
                    <Bar dataKey="hours" fill="#7B8CDE" radius={[8, 8, 0, 0]} maxBarSize={36} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}