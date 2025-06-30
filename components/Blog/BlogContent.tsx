"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { Heart, Star, Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import Background from "@/components/Shared/Background";

export default function BlogContent({ posts, lang }: { posts: any[]; lang: string }) {
    const isSpanish = lang === "es";
    const { t } = useTranslation("common");
    const [query, setQuery] = useState("");

    const filteredPosts = posts.filter((post) =>
        post.title.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <Background>
            <section className="max-w-7xl mx-auto pt-30 pb-30 px-6">
                <div className="flex flex-col items-center justify-between gap-8 mb-24 sm:flex-row">
                   <h1 className="text-2xl font-bold tracking-tight">
                        {t("blog.title")}
                    </h1>
                    <div className="flex gap-3 w-full sm:w-auto">
                        <div className="relative w-full max-w-md">
                            <input
                                type="text"
                                placeholder={t("blog.searchPlaceholder")}
                                className="w-full bg-white/10 text-white placeholder-gray-400 px-4 py-2 pl-10 rounded-lg border border-white/20 backdrop-blur-sm"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60" size={18} />
                        </div>
                        <button className="px-4 py-2 bg-white/10 rounded-lg border border-white/20 text-white backdrop-blur-sm hover:bg-white/20 transition-colors flex items-center gap-2">
                            <SlidersHorizontal size={16} />
                            {t("blog.filters")}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                    {filteredPosts.map((post, index) => (
                        <Link
                            key={post.slug}
                            href={`/${lang}/blog/${post.slug}`}
                            className="group relative rounded-2xl overflow-hidden border border-white/10 bg-white/10 backdrop-blur-2xl shadow-xl hover:scale-[1.02] transition-transform duration-300 cursor-pointer"
                        >
                            <div className="relative w-full h-52">
                                <Image
                                    src={post.thumbnail || "/images/fallback.png"}
                                    alt={post.title}
                                    fill
                                    className="object-cover rounded-t-2xl"
                                />
                                <div className="absolute top-3 right-3 flex gap-2 z-10">
                                    <button className="bg-black/40 hover:bg-pink-500 transition-colors p-2 rounded-full text-white">
                                        <Heart size={18} />
                                    </button>
                                    <button className="bg-black/40 hover:bg-yellow-400 transition-colors p-2 rounded-full text-white">
                                        <Star size={18} />
                                    </button>
                                </div>
                            </div>
                            <div className="p-4">
                                <h2 className="text-lg font-semibold mb-1 group-hover:text-pink-400 transition-colors">
                                    {post.title}
                                </h2>
                                <p className="text-gray-300 text-sm mb-3 line-clamp-2">{post.description}</p>
                                <p className="text-xs text-gray-400">
                                    {new Date(post.createdAt).toLocaleDateString(
                                        isSpanish ? "es-ES" : "en-US",
                                        { year: "numeric", month: "long", day: "numeric" }
                                    )}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </Background>
    );
}
