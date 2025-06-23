"use client";

import { mockFavorites } from "@/mocks/favorites.mock";
import FavoriteCard from "@/components/Favorites/FavoriteCard";

export default function FavoritesPage() {
    return (
        <main className="relative min-h-screen bg-gradient-radial from-[#1a1a1d] via-[#111114] to-[#0a0a0a] text-white font-sans overflow-hidden">
            {/* Blobs de fondo */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute top-1/3 left-[-10%] w-[400px] h-[400px] bg-pink-500 opacity-20 rounded-full blur-[200px] animate-pulse-slow" />
                <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-purple-500 opacity-20 rounded-full blur-[180px] animate-pulse-slow delay-700" />
                <div className="absolute bottom-[-5%] left-[35%] w-[600px] h-[600px] bg-blue-500 opacity-10 rounded-full blur-[240px] animate-pulse-slow delay-1000" />
            </div>

            {/* Contenido */}
            <div className="max-w-2xl mx-auto space-y-6  pt-30 pb-30 px-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Favoritos</h1>
                        <p className="text-sm text-white/50">{mockFavorites.length} productos guardados</p>
                    </div>
                    <button className="bg-white/10 px-3 py-1.5 rounded-full text-sm hover:bg-white/20 transition">
                        Filtrar
                    </button>
                </div>

                <div className="flex gap-2">
                    <button className="px-4 py-1.5 rounded-full bg-white/20 text-sm text-white font-medium">
                        Más relevante
                    </button>
                    <button className="px-4 py-1.5 rounded-full bg-white/5 text-sm text-white/60 font-medium">
                        Más reciente
                    </button>
                </div>

                <div className="space-y-4">
                    {mockFavorites.map((item, index) => (
                        <FavoriteCard key={item.id} post={item} isHighlighted={index === 2} />
                    ))}
                </div>
            </div>
        </main>
    );
}
