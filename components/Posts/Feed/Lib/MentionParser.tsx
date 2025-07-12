"use client";

import Link from "next/link";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useEffect, useState } from "react";

function isUrl(text: string) {
    return /^https?:\/\/[\w.-]+\.[a-z]{2,}(\/\S*)?$/i.test(text);
}

function getYouTubeVideoId(url: string): string | null {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/);
    return match ? match[1] : null;
}

function getVimeoVideoId(url: string): string | null {
    const match = url.match(/vimeo\.com\/(\d+)/);
    return match ? match[1] : null;
}

function isTikTokUrl(url: string) {
    return url.includes("tiktok.com");
}

async function fetchLinkPreview(url: string) {
    try {
        const res = await fetch(`/api/link-preview?url=${encodeURIComponent(url)}`);
        return await res.json();
    } catch {
        return null;
    }
}

export default function MentionParser({ t, text }: { t: any, text: string }) {
    const [previews, setPreviews] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState<Record<string, boolean>>({});
    const [played, setPlayed] = useState<Set<string>>(new Set());

    const regex = /(@\w+)|(https?:\/\/[\w.-]+\.[a-z]{2,}(\/\S*)?)/gi;

    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
        if (match.index > lastIndex) {
            parts.push({ type: "text", value: text.slice(lastIndex, match.index) });
        }
        if (match[1]) {
            parts.push({ type: "mention", value: match[1] });
        } else if (match[2]) {
            parts.push({ type: "url", value: match[2] });
        }
        lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
        parts.push({ type: "text", value: text.slice(lastIndex) });
    }

    const urls = parts.filter(p => p.type === "url").map(p => p.value);

    useEffect(() => {
        urls.forEach(async (url) => {
            if (!previews[url] && !loading[url]) {
                setLoading(prev => ({ ...prev, [url]: true }));
                const data = await fetchLinkPreview(url);
                setPreviews(prev => ({ ...prev, [url]: data }));
                setLoading(prev => ({ ...prev, [url]: false }));
            }
        });
    }, [text]);

    return (
        <div className="flex flex-col gap-4">
            <div className="text-white whitespace-pre-wrap break-words">
                {parts.map((part, idx) => {
                    if (part.type === "mention") {
                        const username = part.value.slice(1);
                        return (
                            <Tooltip.Provider key={idx}>
                                <Tooltip.Root>
                                    <Tooltip.Trigger asChild>
                                        <Link
                                            href={`/${username}`}
                                            className="text-[#f6339a] underline hover:text-pink-400 transition cursor-pointer"
                                        >
                                            {part.value}
                                        </Link>
                                    </Tooltip.Trigger>
                                    <Tooltip.Content
                                        side="top"
                                        className="bg-black text-white px-2 py-1 rounded text-xs shadow-lg z-[9999]"
                                        sideOffset={5}
                                    >
                                        {username}
                                    </Tooltip.Content>
                                </Tooltip.Root>
                            </Tooltip.Provider>
                        );
                    }

                    if (part.type === "text") {
                        return part.value.split(/(\n)/).map((sub, i) => {
                            if (sub === "\n") {
                                // return <br key={`${idx}-${i}`} />;
                            }

                            if (!sub.trim()) return null; // evita spans vacíos de espacios

                            return <>{sub}</>; // texto limpio, sin span extra
                        });
                    }

                    return null;
                })}
            </div>

            {urls.map((url) => {
                const ytId = getYouTubeVideoId(url);
                const vimeoId = getVimeoVideoId(url);
                const isTikTok = isTikTokUrl(url);
                const hasPlayed = played.has(url);
                const data = previews[url];

                return (
                    <div
                        key={url}
                        className="relative rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-4 w-full"
                    >
                        {loading[url] && (
                            <div className="text-white/70 text-sm animate-pulse">{t("posts.create.loadingLink")}</div>
                        )}

                        {!loading[url] && ytId && (
                            hasPlayed ? (
                                <iframe
                                    src={`https://www.youtube.com/embed/${ytId}?autoplay=1`}
                                    className="w-full aspect-video rounded-lg"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            ) : (
                                <div
                                    className="relative cursor-pointer"
                                    onClick={() => setPlayed(prev => new Set(prev).add(url))}
                                >
                                    <img
                                        src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`}
                                        alt="YouTube thumbnail"
                                        className="w-full aspect-video object-cover rounded-lg"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                        <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    </div>
                                </div>
                            )
                        )}

                        {!loading[url] && vimeoId && (
                            hasPlayed ? (
                                <iframe
                                    src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1`}
                                    className="w-full aspect-video rounded-lg"
                                    allow="autoplay; fullscreen"
                                    allowFullScreen
                                />
                            ) : (
                                <div
                                    className="relative cursor-pointer"
                                    onClick={() => setPlayed(prev => new Set(prev).add(url))}
                                >
                                    <img
                                        src={`https://vumbnail.com/${vimeoId}.jpg`}
                                        alt="Vimeo thumbnail"
                                        className="w-full aspect-video object-cover rounded-lg"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                        <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    </div>
                                </div>
                            )
                        )}

                        {!loading[url] && isTikTok && (
                            <Link href={url} target="_blank" className="block">
                                <div className="w-full aspect-[9/16] rounded-lg bg-black/20 flex items-center justify-center text-white text-sm">
                                    {t("posts.feed.tiktokVideo")}
                                </div>
                            </Link>
                        )}

                        {!loading[url] && !ytId && !vimeoId && !isTikTok && data && (
                            <Link
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full"
                            >
                                {data.image && (
                                    <img
                                        src={data.image}
                                        alt={data.title || "Preview"}
                                        className="w-full h-48 object-cover rounded-lg mb-3"
                                    />
                                )}
                                {data.title && (
                                    <div className="text-white font-semibold text-sm mb-1">{data.title}</div>
                                )}
                                {data.description && (
                                    <div className="text-white/70 text-xs">{data.description}</div>
                                )}
                            </Link>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
