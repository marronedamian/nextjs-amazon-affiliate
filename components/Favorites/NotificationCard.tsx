"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Bell } from "lucide-react";

interface FavoriteData {
    id: string;
    title: string;
    description: string;
    image: string;
    price: string;
    location: string;
    daysAgo: string;
}

interface NotificationData {
    id: string;
    type: "follow" | "like" | string;
    message: string;
    createdAt: string;
    metadata?: {
        fromUserImage?: string;
        fromUserName?: string;
    };
    isRead: boolean;
}

type CardProps =
    | { type: "favorite"; data: FavoriteData; isHighlighted?: boolean }
    | { type: "notification"; data: NotificationData; isHighlighted?: boolean };

export default function NotificationOrFavoriteCard(props: CardProps) {
    const { isHighlighted = false } = props;

    if (props.type === "favorite") {
        const post = props.data;
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
                        <span className="text-xs text-white/40">
                            {post.price} • {post.location}
                        </span>
                    </div>
                </div>

                <div className="flex flex-col items-end justify-between h-full gap-2">
                    <Heart
                        className="w-5 h-5"
                        color={isHighlighted ? "#f6339a" : "white"}
                    />
                    <span className="text-xs text-white/40">{post.daysAgo}</span>
                </div>
            </div>
        );
    }

    const { data: notification } = props;
    const [isRead, setIsRead] = useState(notification.isRead);

    useEffect(() => {
        setIsRead(notification.isRead);
    }, [notification.isRead]);
console.log("Notification data:", notification);
    const userImage = notification.metadata?.fromUserImage || "/placeholder.png";
    const userName = notification.metadata?.fromUserName || "user";
    const timeAgo = formatTimeAgo(notification.createdAt);

    const handleClick = async () => {
        if (!isRead) {
            try {
                await fetch(`/api/notifications/${notification.id}/read`, {
                    method: "PATCH",
                });
                setIsRead(true);
            } catch (error) {
                console.error("Error al marcar como leída:", error);
            }
        }
    };

    return (
        <div
            onClick={handleClick}
            className={`cursor-pointer flex items-center justify-between p-4 rounded-2xl border ${!isRead ? "bg-white/10 border-white/20" : "bg-white/5 border-white/10"
                } transition`}
        >
            <div className="flex items-center gap-4">
                <Link href={`/${userName}`}>
                    <Image
                        src={userImage}
                        alt="user"
                        width={50}
                        height={50}
                        className="rounded-full object-cover w-[50px] h-[50px] hover:scale-105 transition"
                    />
                </Link>
                <div className="flex flex-col">
                    <Link
                        href={`/${userName}`}
                        className="text-sm font-semibold hover:underline"
                    >
                        {notification.metadata?.fromUserName || "Alguien"}
                    </Link>
                    <p className="text-xs text-white/60">{notification.message}</p>
                    <span className="text-xs text-white/40">{timeAgo}</span>
                </div>
            </div>

            <div className="flex items-center justify-center h-full">
                <Bell className="w-5 h-5" color={isRead ? "white" : "#f6339a"} />
            </div>
        </div>
    );
}

function formatTimeAgo(date: string) {
    const now = new Date();
    const created = new Date(date);
    const diffMs = now.getTime() - created.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHrs = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHrs / 24);

    if (diffMin < 1) return "ahora";
    if (diffMin < 60) return `${diffMin} min`;
    if (diffHrs < 24) return `${diffHrs} h`;
    return `${diffDays} d`;
}
