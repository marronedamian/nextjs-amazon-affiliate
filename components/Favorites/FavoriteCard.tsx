import Image from "next/image";
import { Heart } from "lucide-react";

interface FavoriteCardProps {
    post: {
        id: string;
        title: string;
        description: string;
        image: string;
        price: string;
        location: string;
        daysAgo: string;
    };
    isHighlighted?: boolean;
}

export default function FavoriteCard({ post, isHighlighted }: FavoriteCardProps) {
    return (
        <div
            className={`flex items-center justify-between p-4 rounded-2xl border ${isHighlighted ? "bg-white/10 border-white/20" : "bg-white/5 border-white/10"
                } transition`}
        >
            <div className="flex items-center gap-4">
                <Image
                    src={post.image}
                    alt={post.title}
                    width={50}
                    height={50}
                    className="rounded-xl object-cover w-[50px] h-[50px]"
                />
                <div className="flex flex-col">
                    <h2 className="text-sm font-semibold">{post.title}</h2>
                    <p className="text-xs text-white/60">{post.description}</p>
                    <span className="text-xs text-white/40">{post.price} • {post.location}</span>
                </div>
            </div>

            <div className="flex flex-col items-end justify-between h-full gap-2">
                <Heart className="w-5 h-5" color={isHighlighted ? "#f6339a" : "white"} />
                <span className="text-xs text-white/40">{post.daysAgo}</span>
            </div>
        </div>
    );
}
