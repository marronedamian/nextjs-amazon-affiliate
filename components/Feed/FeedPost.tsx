"use client";

import Image from "next/image";
import { Bookmark, Heart, MoreVertical } from "lucide-react";

type Post = {
    id: number;
    user: {
        name: string;
        avatar: string;
        postedAt: string;
    };
    image: string;
    likes: number;
    likedBy: string[];
    description: string;
    username: string;
};

interface FeedPostProps {
    post: Post;
}

export default function FeedPost({ post }: FeedPostProps) {
    return (
        <div className="w-full max-w-md mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-lg space-y-2">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                    <Image
                        src="https://randomuser.me/api/portraits/men/11.jpg"
                        alt="User"
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                    />
                    <div>
                        <p className="text-white font-semibold text-sm">Jack robo</p>
                        <span className="text-xs text-white/50">15 min ago</span>
                    </div>
                </div>
                <MoreVertical className="text-white/70 w-4 h-4" />
            </div>

            {/* Image */}
            <div className="relative w-full h-64">
                <Image
                    src="https://images.unsplash.com/photo-1505761671935-60b3a7427bad"
                    alt="Post"
                    fill
                    className="object-cover"
                />
                <div className="absolute top-3 right-3 bg-white/10 backdrop-blur-md p-1 rounded-full">
                    <Bookmark className="w-4 h-4 text-white" />
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between px-4 py-2">
                <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                        <Image src="https://randomuser.me/api/portraits/men/32.jpg" alt="Like" width={24} height={24} className="rounded-full border-2 border-white" />
                        <Image src="https://randomuser.me/api/portraits/women/44.jpg" alt="Like" width={24} height={24} className="rounded-full border-2 border-white" />
                        <Image src="https://randomuser.me/api/portraits/men/25.jpg" alt="Like" width={24} height={24} className="rounded-full border-2 border-white" />
                    </div>
                    <span className="text-sm text-white/80">31 likes</span>
                </div>
                <Heart className="w-5 h-5 text-pink-500" />
            </div>

            {/* Description */}
            <div className="px-4 pb-4">
                <p className="text-sm text-white">
                    <span className="font-semibold text-white">retroholi</span>{" "}
                    if you’ve ever grabbed a pack of retrosupply brushes and wished you had a course...
                </p>
            </div>
        </div>
    );
}
