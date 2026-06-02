import { useEffect, useState } from "react";
import Hero from "../components/Hero";
import PersonalizedSection from "../components/PersonalizedSection";
import SleepCharacter from "../components/SleepCharacter";
import WeeklyChart from "../components/WeeklyChart";
import api from "../services/api";

export default function Home() {
    const [realEntries, setRealEntries] = useState(null);
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) return;
        let cancelled = false;
        api.get("/entries/")
            .then((res) => {
                if (!cancelled) setRealEntries(res.data);
            })
            .catch(() => {
                if (!cancelled) setRealEntries([]);
            });
        return () => { cancelled = true; };
    }, [token]);

    return (
        <div className="bg-[#0B0E14]">
            <Hero />
            <PersonalizedSection />
            <SleepCharacter />
            {token && realEntries && (
                <div className="max-w-4xl mx-auto px-4 py-16">
                    <WeeklyChart entries={realEntries} />
                </div>
            )}
        </div>
    );
}