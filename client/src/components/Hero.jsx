import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";

const images = [
    "/images/sleep-hero-1.png",
    "/images/sleep-hero-2.png",
    "/images/sleep-hero-3.png",
    "/images/sleep-hero-4.png",
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
        <div className="relative h-screen w-full overflow-hidden bg-[#0B0E14]">
            {images.map((img, index) => (
                <div
                    key={img}
                    className="absolute inset-0 bg-cover bg-center will-change-transform"
                    style={{
                        backgroundImage: `url(${img})`,
                        opacity: index === current ? 1 : 0,
                        transition:
                            "opacity 2s cubic-bezier(0.25, 0.1, 0.25, 1), transform 2s cubic-bezier(0.25, 0.1, 0.25, 1)",
                        transform: `scale(${index === current ? 1 : 1.05})`,
                    }}
                />
            ))}

            <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
            <div
                className="absolute inset-0"
                style={{
                    background:
                        "linear-gradient(to top, #0B0E14 0%, rgba(11,14,20,0.9) 15%, rgba(11,14,20,0.4) 40%, transparent 70%)",
                }}
            />

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6 z-10">
                
                <h1
                    className="font-['Playfair_Display'] text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-normal tracking-wide leading-[1.2] mb-6 animate-gentle-glow"
                    style={{ color: "#FDFBF7" }}
                >
                    Track Your Sleep. <br className="hidden sm:block" />
                    Unleash Your Energy.
                </h1>

                <p className="text-base sm:text-lg md:text-xl font-light tracking-wide text-[#B8A9D4] mb-8 sm:mb-10 max-w-xl sm:max-w-2xl">
                    Your personal sleep companion – log, visualize, and improve your rest
                    with AI‑powered insights.
                </p>

                {localStorage.getItem("token") ? (
                    <Link
                        to="/dashboard"
                        className="group relative inline-flex items-center justify-center px-10 py-3 sm:px-12 sm:py-4 text-base sm:text-lg font-semibold text-[#1c3f85] bg-[#7B8CDE] rounded-full transition-all duration-300 hover:shadow-[0_0_40px_rgba(123,140,222,0.4)] hover:scale-105"
                    >
                        <span>View Your Dashboard</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                    </Link>
                ) : (
                    <Link
                        to="/signup"
                        className="group relative inline-flex items-center justify-center px-10 py-3 sm:px-12 sm:py-4 text-base sm:text-lg font-semibold text-[#0B0E14] bg-[#7B8CDE] rounded-full transition-all duration-300 hover:shadow-[0_0_40px_rgba(123,140,222,0.4)] hover:scale-105"
                    >
                        <span>Start Sleeping Better</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                    </Link>
                )}
            </div>

            <div
                className="absolute bottom-8 sm:bottom-10 md:bottom-12 left-0 right-0 flex items-center justify-center gap-3 sm:gap-4 z-20 px-4"
                onMouseEnter={() => setIsHoveringDots(true)}
                onMouseLeave={() => setIsHoveringDots(false)}
            >
                <button
                    onClick={prev}
                    className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/10 text-[#F1F5F9] backdrop-blur-sm transition-all duration-300 hover:bg-white/20 ${isHoveringDots
                            ? "opacity-100 translate-x-0"
                            : "opacity-0 -translate-x-1 sm:-translate-x-2"
                        }`}
                    aria-label="Previous image"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-4 h-4 sm:w-5 sm:h-5"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 19.5L8.25 12l7.5-7.5"
                        />
                    </svg>
                </button>

                <div className="flex gap-2 sm:gap-3">
                    {images.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => goTo(i)}
                            className={`w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-2.5 md:h-2.5 rounded-full transition-all duration-500 ${i === current
                                    ? "bg-[#7B8CDE] scale-125 w-4 sm:w-5 md:w-6"
                                    : "bg-white/40 hover:bg-white/70"
                                }`}
                            aria-label={`Go to slide ${i + 1}`}
                        />
                    ))}
                </div>

                <button
                    onClick={next}
                    className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/10 text-[#F1F5F9] backdrop-blur-sm transition-all duration-300 hover:bg-white/20 ${isHoveringDots
                            ? "opacity-100 translate-x-0"
                            : "opacity-0 translate-x-1 sm:translate-x-2"
                        }`}
                    aria-label="Next image"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-4 h-4 sm:w-5 sm:h-5"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.25 4.5l7.5 7.5-7.5 7.5"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
}