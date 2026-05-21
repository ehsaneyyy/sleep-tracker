import Hero from "../components/Hero";
import SleepCharacter from "../components/SleepCharacter";
import WeeklyChart from "../components/WeeklyChart";

const sampleEntries = [
    { date: "2026-05-13T00:00:00", duration_hours: 7.5, quality: 4 },
    { date: "2026-05-14T00:00:00", duration_hours: 6.2, quality: 3 },
    { date: "2026-05-15T00:00:00", duration_hours: 8.1, quality: 5 },
    { date: "2026-05-16T00:00:00", duration_hours: 5.5, quality: 2 },
    { date: "2026-05-17T00:00:00", duration_hours: 7.0, quality: 4 },
    { date: "2026-05-18T00:00:00", duration_hours: 6.8, quality: 3 },
    { date: "2026-05-19T00:00:00", duration_hours: 7.3, quality: 4 },
];

export default function Home() {
    return (
        <div className="bg-gray-950">
            <Hero />
            <SleepCharacter />
            <div className="max-w-4xl mx-auto px-4 py-16">
                <WeeklyChart entries={sampleEntries} />
                <p className="text-gray-400 text-center mt-4 text-sm">
                    Example weekly view — sign up to see your own data.
                </p>
            </div>
        </div>
    );
}