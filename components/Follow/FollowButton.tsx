"use client";

import { useFollow } from "@/hooks/follows/useFollow";
import LiquidGlassWrapper from "../Shared/LiquidGlassWrapper";

interface FollowButtonProps {
    userId: string;
    onToggle?: () => void;
}

export function FollowButton({ userId, onToggle }: FollowButtonProps) {
    const { isFollowing, toggleFollow, isLoading } = useFollow(userId, onToggle);

    return (
        <LiquidGlassWrapper
            onClick={!isLoading ? toggleFollow : undefined}
            className={`rounded-full cursor-pointer px-4 py-2 border border-white/10 backdrop-blur-md hover:scale-105 transition ${isFollowing ? "bg-green-500/10" : "bg-pink-500/10"
                } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
            <div
                className={`flex items-center gap-2 text-sm font-semibold ${isFollowing ? "text-green-300" : "text-pink-300"
                    }`}
            >
                {isLoading ? (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                    </svg>
                ) : (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        {isFollowing ? (
                            <path d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 6.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" />
                        ) : (
                            <path d="M10 12a5 5 0 100-10 5 5 0 000 10zM10 14c-5.33 0-8 2.667-8 4v2h16v-2c0-1.333-2.67-4-8-4z" />
                        )}
                    </svg>
                )}
                {isLoading ? "Cargando..." : isFollowing ? "Unfollow" : "Follow"}
            </div>
        </LiquidGlassWrapper>
    );
}
