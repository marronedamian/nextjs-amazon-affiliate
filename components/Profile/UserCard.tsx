"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import Image from "next/image";
import LiquidGlassWrapper from "@/components/Shared/LiquidGlassWrapper";
import Background from "../Shared/Background";
import { useChatStore } from "@/lib/stores/chatStore";
import { useFollow } from "@/hooks/follows/useFollow";
import { FollowButton } from "@/components/Follow/FollowButton";

interface UserCardProps {
    session: any;
    isOwner?: boolean;
    profileUser: {
        id: string;
        name: string | null;
        email: string | null;
        image: string | null;
    };
}

export default function UserCard({ session, isOwner = false, profileUser }: UserCardProps) {
    const router = useRouter();
    const pathname = usePathname();
    const locale = pathname?.split("/")[1] || "en";
    const { setConversation } = useChatStore();

    const [stats, setStats] = useState<{ followers: number; following: number }>({
        followers: 0,
        following: 0,
    });

    const fetchStats = async () => {
        try {
            const res = await fetch(`/api/users/${profileUser.id}/stats`);
            const data = await res.json();
            setStats(data);
        } catch (err) {
            console.error("Error fetching user stats", err);
        }
    };

    useEffect(() => {
        fetchStats();
    }, [profileUser.id]);

    const { isFollowing, toggleFollow } = useFollow(profileUser.id, fetchStats);

    const handleStartConversation = async () => {
        const res = await fetch("/api/messages/create", {
            method: "POST",
            body: JSON.stringify({ targetUserId: profileUser.id }),
            headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();
        if (data.conversationId) {
            setConversation(data.conversationId, {
                id: profileUser.id,
                name: profileUser.name,
                image: profileUser.image,
            });
            router.push(`/${locale}/messages`);
        }
    };

    return (
        <Background>
            <div className="relative flex items-center justify-center min-h-screen px-4">
                <LiquidGlassWrapper
                    className="relative max-w-xl w-full px-6 pt-[80px] pb-10 border border-white/10 rounded-3xl shadow-xl text-center overflow-visible"
                    rounded
                >
                    <div className="absolute -top-[150px] left-1/2 transform -translate-x-1/2">
                        <div className="relative w-[120px] h-[120px] rounded-full p-[3px] bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 shadow-lg">
                            <div className="w-full h-full rounded-full overflow-hidden bg-black">
                                <Image
                                    src={profileUser.image ?? "/default-avatar.png"}
                                    alt="Avatar"
                                    width={120}
                                    height={120}
                                    className="object-cover w-full h-full"
                                />
                            </div>
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold mt-2">{profileUser.name}</h1>
                    <p className="text-sm text-gray-300 mb-4">{profileUser.email}</p>
                    <p className="text-sm text-gray-400">
                        Amazon Affiliate User
                        <br />
                        Connected with Google
                    </p>

                    <div className="flex justify-center gap-10 mt-6 text-sm text-gray-100">
                        <div>
                            <div className="text-xl font-bold">{stats.followers}</div>
                            <div>Seguidores</div>
                        </div>
                        <div>
                            <div className="text-xl font-bold">{stats.following}</div>
                            <div>Siguiendo</div>
                        </div>
                    </div>

                    <div className="mt-10 flex flex-col md:flex-row justify-center gap-4">
                        {!isOwner && (
                            <>
                                <FollowButton userId={profileUser.id} onToggle={fetchStats} />

                                <LiquidGlassWrapper className="rounded-full cursor-pointer px-4 py-2 border border-white/10 bg-purple-500/10 backdrop-blur-md hover:scale-105 transition">
                                    <div
                                        onClick={handleStartConversation}
                                        className="flex items-center gap-2 text-sm text-purple-300 font-semibold"
                                    >
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H6l-4 4V5z" />
                                        </svg>
                                        Message
                                    </div>
                                </LiquidGlassWrapper>
                            </>
                        )}

                        {isOwner && (
                            <LiquidGlassWrapper className="mt-5 inline-flex items-center rounded-full border border-white/10 bg-red-500/10 backdrop-blur-md hover:scale-105 transition">
                                <div
                                    onClick={() => signOut({ callbackUrl: "/" })}
                                    className="text-sm text-red-300 font-semibold px-5 py-2 cursor-pointer"
                                >
                                    Cerrar sesión
                                </div>
                            </LiquidGlassWrapper>
                        )}
                    </div>
                </LiquidGlassWrapper>
            </div>
        </Background>
    );
}
