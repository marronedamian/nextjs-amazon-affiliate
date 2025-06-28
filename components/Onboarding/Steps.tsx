"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { categories as allCategories } from "@/utils/amazon/categories";
import LiquidGlassWrapper from "@/components/Shared/LiquidGlassWrapper";
import ReactSlider from "react-slider";
import Background from "../Shared/Background";

export default function Steps({ session }: { session: any }) {
    const pathname = usePathname();
    const locale = pathname?.split("/")[1] || "en";
    const [step, setStep] = useState(1);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
    const router = useRouter();

    const toggleCategory = (category: string) => {
        setSelectedCategories((prev) =>
            prev.includes(category)
                ? prev.filter((c) => c !== category)
                : [...prev, category]
        );
    };

    const selectedQueries = selectedCategories.map(
        (label) => allCategories.find((c) => c.label === label)?.query
    ).filter(Boolean);

    const handleSubmit = async () => {
        await fetch("/api/preferences", {
            method: "POST",
            body: JSON.stringify({
                categories: selectedQueries,
                priceRangeMin: priceRange[0],
                priceRangeMax: priceRange[1],
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });
        const locale = pathname?.split("/")[1] || "en";
        router.push(`/${locale}/blog`);
    };

    return (
        <Background>
            <div className="relative flex items-center justify-center min-h-screen px-4">
                <LiquidGlassWrapper className="relative max-w-xl w-full px-6 py-10 border border-white/10 rounded-3xl shadow-xl text-center overflow-visible">
                    {step === 1 && (
                        <>
                            <h1 className="text-2xl font-bold mb-4">¿Qué te interesa?</h1>
                            <div className="flex flex-wrap gap-2 justify-center">
                                {allCategories.map((c) => (
                                    <button
                                        key={c.label}
                                        onClick={() => toggleCategory(c.label)}
                                        className={`cursor-pointer px-4 py-2 text-sm rounded-full border transition-all ${selectedCategories.includes(c.label)
                                            ? "bg-pink-500/20 text-pink-300 border-pink-400"
                                            : "bg-white/5 text-white/80 border-white/10 hover:bg-white/10"
                                            }`}
                                    >
                                        {c.emoji} {c.label}
                                    </button>
                                ))}
                            </div>
                            <div className="mt-6 flex justify-center gap-4">
                                <button
                                    onClick={() => {
                                        if (selectedCategories.length === 0) return;
                                        setStep(2);
                                    }}
                                    disabled={selectedCategories.length === 0}
                                    className={`px-6 py-2 rounded-full transition ${selectedCategories.length === 0
                                        ? "bg-white/10 text-white/30 cursor-not-allowed"
                                        : "bg-pink-500/20 text-pink-300 hover:bg-pink-500/30 cursor-pointer"
                                        }`}
                                >
                                    Siguiente
                                </button>
                            </div>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <h1 className="text-2xl font-bold mb-6 text-center">¿Qué rango de precios prefieres?</h1>
                            <div className="flex flex-col items-center gap-6">
                                <div className="text-3xl font-semibold text-white">
                                    ${priceRange[0]} - ${priceRange[1]}
                                </div>

                                <ReactSlider
                                    className="w-full py-6 h-10 flex items-center"
                                    thumbClassName="w-5 h-5 rounded-full bg-pink-400 border-2 border-white/40 cursor-pointer"
                                    renderTrack={(props, state) => {
                                        const baseClass = "h-2 rounded-full top-1/2 transform -translate-y-1/2";
                                        const trackIndex = state.index; // 0 = antes, 1 = entre, 2 = después

                                        const bgColor =
                                            trackIndex === 1
                                                ? "bg-pink-300/30" // solo el rango entre los thumbs
                                                : "bg-white/10";

                                        return <div {...props} className={`${bgColor} ${baseClass}`} />;
                                    }}
                                    min={0}
                                    max={10000}
                                    step={50}
                                    value={priceRange}
                                    onChange={(values: number[]) => setPriceRange(values as [number, number])}
                                    pearling
                                    minDistance={50}
                                />

                                <div className="flex flex-wrap justify-center gap-3 mt-2">
                                    {[250, 500, 1000, 5000, 10000].map((p) => (
                                        <button
                                            key={p}
                                            onClick={() => setPriceRange([0, p])}
                                            className="cursor-pointer px-4 py-2 text-sm rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition"
                                        >
                                            ${p.toLocaleString()}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-8 flex justify-center gap-4">
                                <button
                                    onClick={() => setStep(1)}
                                    className="cursor-pointer px-6 py-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition"
                                >
                                    Atrás
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className="cursor-pointer px-6 py-2 bg-pink-500/20 text-pink-300 rounded-full hover:bg-pink-500/30 transition"
                                >
                                    Finalizar
                                </button>
                            </div>
                        </>
                    )}
                </LiquidGlassWrapper>
            </div>
        </Background>
    );
}