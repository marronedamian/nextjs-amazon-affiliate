"use client";

import { useState, useEffect, useRef } from "react";
import { Loader2, Search } from "lucide-react";
import useClickOutside from "@/hooks/posts/useClickOutside";
import { useTranslation } from "next-i18next";

const TENOR_API_KEY = process.env.NEXT_PUBLIC_TENOR_API_KEY!;
const TENOR_LIMIT = 18;

interface GifPickerProps {
    onSelect: (url: string) => void;
    onClose?: () => void;
}

export default function GifPicker({ onSelect, onClose }: GifPickerProps) {
    const { t } = useTranslation("common");
    const [query, setQuery] = useState("");
    const [gifs, setGifs] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const containerRef = useRef(null);

    useClickOutside(containerRef, () => {
        onClose?.();
    });

    const fetchGifs = async (search: string) => {
        setLoading(true);
        try {
            const res = await fetch(
                `https://tenor.googleapis.com/v2/search?q=${encodeURIComponent(search || "funny")}&key=${TENOR_API_KEY}&limit=${TENOR_LIMIT}`
            );
            const data = await res.json();
            const urls = data.results.map((gif: any) => gif.media_formats.gif.url);
            setGifs(urls);
        } catch (err) {
            console.error("Error fetching GIFs:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeout = setTimeout(() => fetchGifs(query), 400);
        return () => clearTimeout(timeout);
    }, [query]);

    return (
        <div
            ref={containerRef}
            className="absolute top-full z-[9999] left-0 w-75 max-h-[420px] bg-[#222222]/100 border border-[#151616]/100 rounded-2xl shadow-lg backdrop-blur-xl p-4 overflow-hidden sm:w-[90vw] sm:max-w-sm"
        >
            <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 w-4 h-4 pointer-events-none" />
                <input
                    type="text"
                    placeholder={t("posts.create.searchGifs")}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-sm text-white bg-white/10 placeholder-white/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f6339a] hover:bg-white/20 transition"
                />
            </div>

            {loading ? (
                <div className="flex justify-center py-6">
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                </div>
            ) : gifs.length === 0 ? (
                <div className="text-white/50 text-sm text-center py-6">{t("posts.create.noGifsFound")}</div>
            ) : (
                <div className="grid grid-cols-3 gap-2 overflow-y-auto pr-1 max-h-[280px] scrollbar-thin scrollbar-thumb-white/10 scrollbar-thumb-rounded-full">
                    {gifs.map((gif, idx) => (
                        <img
                            key={idx}
                            src={gif}
                            alt={`gif-${idx}`}
                            className="rounded-lg cursor-pointer hover:scale-105 hover:brightness-110 transition-transform duration-150"
                            onClick={() => onSelect(gif)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
