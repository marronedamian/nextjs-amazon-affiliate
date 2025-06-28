import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { headers } from "next/headers";
import { mockFavorites } from "@/mocks/favorites.mock";
import Background from "@/components/Shared/Background";
import FavoriteCard from "@/components/Favorites/FavoriteCard";

export default async function FavoritesPage() {
    const session = await getServerSession(authOptions);
    if (!session) {
        const h = headers();
        const referer = h.get("referer") || "";
        const lang = referer.match(/\/(es|en)(\/|$)/)?.[1] || "en";
        redirect(`/${lang}/auth/login`);
    }

    return (
        <Background>
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
        </Background>
    );
}
