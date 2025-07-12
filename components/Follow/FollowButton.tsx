"use client";

import { useFollow } from "@/hooks/follows/useFollow";
import { useTranslation } from "next-i18next";

interface FollowButtonProps {
    userId: string;
    onToggle?: () => void;
}

export function FollowButton({ userId, onToggle }: FollowButtonProps) {
    const { t } = useTranslation("common");
    const { isFollowing, toggleFollow, isLoading } = useFollow(userId, onToggle);

    const baseStyles = `inline-flex items-center gap-2 px-6 py-2.5 backdrop-blur-2xl border font-semibold rounded-full transition-all duration-300 transform shadow-xl text-sm`;
    const followingStyles = `border-pink-500 text-pink-300 hover:bg-pink-600/30`;
    const notFollowingStyles = `border-green-500 text-green-300 hover:bg-green-600/30`;

    return (
        <button
            onClick={!isLoading ? toggleFollow : undefined}
            disabled={isLoading}
            className={`${baseStyles} ${isFollowing ? followingStyles : notFollowingStyles
                } ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:scale-105 cursor-pointer"} bg-white/10`}
        >
            {isLoading ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                </svg>
            ) : isFollowing ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 6.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" />
                </svg>
            ) : (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a5 5 0 100-10 5 5 0 000 10zM10 14c-5.33 0-8 2.667-8 4v2h16v-2c0-1.333-2.67-4-8-4z" />
                </svg>
            )}
            <span>
                {isLoading
                    ? t("global.loading")
                    : isFollowing
                        ? t("profile.unfollow")
                        : t("profile.follow")}
            </span>
        </button>
    );
}
