import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";

const images = [
    "/images/sleep-hero-1.jpg",
    "/images/sleep-hero-2.jpg",
    "/images/sleep-hero-3.jpg",
    "/images/sleep-hero-4.jpg",
];

export default function Hero() {
    const [current, setCurrent] = useState(0);
    const [isHoveringDots, setIsHoveringDots] = useState(false);

    const goTo = useCallback((index) => {
        setCurrent(index);
    }, []);

    const next = useCallback(() => {
        setCurrent((prev) => (prev + 1) % images.length);
    }, []);

    const prev = useCallback(() => {
        setCurrent((prev) => (prev - 1 + images.length) % images.length);
    }, []);

    useEffect(() => {
        if (isHoveringDots) return;
        const interval = setInterval(() => {
            next();
        }, 5000);
        return () => clearInterval(interval);
    }, [isHoveringDots, next]);

    return (
        <div className="relative h-[90vh] w-full overflow-hidden bg-[#0B0E14]">
            {images.map((img, index) => (
                <div
                    key={img}
                    className="absolute inset-0 bg-cover bg-center transition-all duration-[1600ms] ease-in-out"
                    style={{
                        backgroundImage: `url(${img})`,
                        opacity: index === current ? 1 : 0,
                        transform: `scale(${index === current ? 1 : 1.08})`,
                    }}
                />
            ))}

            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] via-transparent to-black/30" />

            <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-6 text-center z-10">
                <h1 className="text-5xl sm:text-6xl md:text-8xl font-light tracking-tighter leading-tight mb-6 text-[#F1F5F9]">
                    Track Your Sleep. <br className="hidden sm:block" />
                    Unleash Your Energy.
                </h1>

                <p className="text-lg sm:text-2xl font-light tracking-wide text-[#94A3B8] mb-10 max-w-2xl">
                    Your personal sleep companion – log, visualize, and improve your rest with AI‑powered insights.
                </p>

                {localStorage.getItem("token") ? (
                    <Link
                        to="/dashboard"
                        className="group relative inline-flex items-center justify-center px-10 py-4 text-lg font-semibold text-[#0B0E14] bg-[#7B8CDE] rounded-full transition-all duration-300 hover:shadow-[0_0_40px_rgba(123,140,222,0.4)] hover:scale-105"
                    >
                        <span className="relative z-10">View Your Dashboard</span>
                        <span className="absolute right-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 text-white">→</span>
                    </Link>
                ) : (
                    <Link
                        to="/signup"
                        className="group relative inline-flex items-center justify-center px-10 py-4 text-lg font-semibold text-[#0B0E14] bg-[#7B8CDE] rounded-full transition-all duration-300 hover:shadow-[0_0_40px_rgba(123,140,222,0.4)] hover:scale-105"
                    >
                        <span className="relative z-10">Start Sleeping Better</span>
                        <span className="absolute right-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 text-white">→</span>
                    </Link>
                )}
            </div>

            <div
                className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-4 z-20"
                onMouseEnter={() => setIsHoveringDots(true)}
                onMouseLeave={() => setIsHoveringDots(false)}
            >
                <button
                    onClick={prev}
                    className={`w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-[#F1F5F9] backdrop-blur-sm transition-all duration-300 hover:bg-white/20 ${isHoveringDots ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
                        }`}
                    aria-label="Previous image"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </button>

                <div className="flex gap-3">
                    {images.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => goTo(i)}
                            className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${i === current ? "bg-[#7B8CDE] scale-125 w-6" : "bg-white/40 hover:bg-white/70"
                                }`}
                            aria-label={`Go to slide ${i + 1}`}
                        />
                    ))}
                </div>

                <button
                    onClick={next}
                    className={`w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-[#F1F5F9] backdrop-blur-sm transition-all duration-300 hover:bg-white/20 ${isHoveringDots ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"
                        }`}
                    aria-label="Next image"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                </button>
            </div>
        </div>
    );
}