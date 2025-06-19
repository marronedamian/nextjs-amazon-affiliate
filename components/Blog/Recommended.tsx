"use client";

import { getRecommendedProducts } from "@/lib/amazon/recommender";
import { Heart, ShoppingCart } from "lucide-react";

export default function Recommended({
    topic,
    lang,
}: {
    topic: string;
    lang: "es" | "en";
}) {
    const products = getRecommendedProducts(topic, lang);

    if (products.length === 0) return null;

    return (
        <section className="mt-24 px-0">
            <h2 className="text-2xl font-bold text-white mb-10 text-center tracking-wide">
                {lang === "es" ? "También te puede interesar" : "You may also like"}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product, i) => (
                    <a
                        key={i}
                        href={product.affiliateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative group overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 flex flex-col justify-between"
                    >
                        <div className="relative w-full h-52 rounded-xl overflow-hidden mb-4">
                            <img
                                src={product.imageUrl}
                                alt={product.title}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute top-2 right-2 flex gap-2">
                                <button className="p-2 bg-black/40 hover:bg-pink-600 rounded-full text-white backdrop-blur-sm transition">
                                    <Heart size={16} />
                                </button>
                                <button className="p-2 bg-black/40 hover:bg-green-500 rounded-full text-white backdrop-blur-sm transition">
                                    <ShoppingCart size={16} />
                                </button>
                            </div>
                        </div>

                        <p className="text-white text-sm font-medium leading-snug mb-2">
                            {product.title}
                        </p>

                        <span className="text-xs text-gray-400">
                            {lang === "es" ? "Ver en Amazon" : "View on Amazon"}
                        </span>
                    </a>
                ))}
            </div>
        </section>
    );
}
