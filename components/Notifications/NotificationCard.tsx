"use client";

import Image from "next/image";
import Link from "next/link";
import {
    UserPlus,
    Bell,
    Heart,
    Repeat,
    MessageCircle,
    MessageSquare,
    AtSign,
    Minus,
    CornerDownRight,
} from "lucide-react";
import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { NotificationData } from "@/types/notifications.types";
import { formatTimeAgo } from "@/utils/dateUtils";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useRouter } from "next/navigation";

interface CardProps {
    t: any;
    type: "notification";
    data: NotificationData;
    isHighlighted?: boolean;
    isFirstCard?: boolean;
    onRead?: () => void;
}

function getIcon(type: string) {
    const size = 14;
    const props = {
        size,
        strokeWidth: 2,
        className: "fill-white text-white",
    };
    const props_1 = {
        size,
        strokeWidth: 2,
        className: "text-white",
    };

    switch (type) {
        case "follow":
            return <UserPlus {...props} />;
        case "like":
        case "comment_like":
            return <Heart {...props} />;
        case "repost":
            return <Repeat {...props_1} />;
        case "comment":
        case "comment_reply":
        case "post_comment":
            return <MessageCircle {...props} />;
        case "story_comment":
            return <MessageSquare {...props} />;
        case "reply":
            return <CornerDownRight {...props_1} />;
        case "mention":
            return <AtSign {...props_1} />;
        case "line":
            return <Minus {...props} />;
        default:
            return <Bell {...props} />;
    }
}

function getIconBackground(type: string): string {
    switch (type) {
        case "follow":
            return "rgba(139, 92, 246, 0.4)";
        case "like":
        case "comment_like":
            return "rgba(244, 63, 94, 0.4)";
        case "repost":
            return "rgba(16, 185, 129, 0.4)";
        case "comment":
        case "comment_reply":
        case "post_comment":
            return "rgba(59, 130, 246, 0.4)";
        case "story_comment":
            return "rgba(56, 189, 248, 0.4)";
        case "reply":
            return "rgba(99, 102, 241, 0.4)";
        case "mention":
            return "rgba(250, 204, 21, 0.4)";
        case "line":
            return "rgba(107, 114, 128, 0.4)";
        default:
            return "rgba(75, 85, 99, 0.4)";
    }
}

export default function NotificationCard({
    t,
    data: notification,
    isHighlighted = false,
    isFirstCard = false,
    onRead,
}: CardProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const isRead = notification.isRead;

    const userImage = notification.fromUser.image || "/placeholder.png";
    const userName = notification.fromUser.username;
    const name = notification.fromUser.name || userName || "Usuario Anónimo";
    const timeAgo = formatTimeAgo(notification.createdAt, t("global.now"));
    const fullDate = new Date(notification.createdAt).toLocaleString("es-AR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

    const handleMarkAsRead = useCallback(async () => {
        if (!isRead && !isLoading) {
            try {
                setIsLoading(true);
                await fetch(`/api/notifications/${notification.id}/read`, {
                    method: "PATCH",
                });
                onRead?.();
            } catch (error) {
                console.error("Error al marcar como leída:", error);
            } finally {
                setIsLoading(false);
            }
        }
    }, [isRead, isLoading, notification.id, onRead]);

    const handleCardClick = async () => {
        await handleMarkAsRead();
        console.log("Card clicked:", notification);
        if (notification.post) {
            router.push(`/post/${notification.post.id}`);
        }
    };

    return (
        <motion.div
            onClick={handleCardClick}
            initial={{ opacity: 0, x: 0 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={`cursor-pointer flex gap-4 p-4 rounded-2xl border transition-colors duration-300 group ${!isRead ? "bg-white/10 border-white/20" : "bg-white/5 border-white/10"
                } hover:bg-white/10 ${isFirstCard ? "border-t-0 border-l-0 border-r-0 rounded-t-none" : ""
                }`}
        >
            <Link href={`/${userName}`} className="shrink-0" onClick={(e) => e.stopPropagation()}>
                <div className="relative">
                    <Image
                        src={userImage}
                        alt={userName}
                        width={48}
                        height={48}
                        className="rounded-full object-cover w-12 h-12 transition duration-200 group-hover:ring-2 group-hover:ring-white/30 group-hover:scale-105"
                    />
                    <div
                        className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center border border-white shadow backdrop-blur-md transition-transform duration-200 group-hover:scale-110"
                        style={{ backgroundColor: getIconBackground(notification.type.name) }}
                    >
                        <div className="text-white fill-white w-[14px] h-[14px]">{getIcon(notification.type.name)}</div>
                    </div>
                </div>
            </Link>

            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                    <Link
                        href={`/${userName}`}
                        className="text-sm font-semibold hover:underline truncate"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {name}
                    </Link>

                    <Tooltip.Provider delayDuration={200}>
                        <Tooltip.Root>
                            <Tooltip.Trigger asChild>
                                <span className="text-xs text-white/30 whitespace-nowrap mt-1.5">{timeAgo}</span>
                            </Tooltip.Trigger>
                            <Tooltip.Portal>
                                <Tooltip.Content
                                    side="top"
                                    sideOffset={6}
                                    className="z-50 px-2 py-1 text-xs text-white bg-black rounded shadow-sm animate-fade-in"
                                >
                                    {fullDate}
                                    <Tooltip.Arrow className="fill-black" />
                                </Tooltip.Content>
                            </Tooltip.Portal>
                        </Tooltip.Root>
                    </Tooltip.Provider>
                </div>

                <p className="text-xs text-white/60 truncate">{notification.type.label}</p>

                {notification.comment && (
                    <p className="text-xs text-white/40 mt-1 truncate max-w-full">{notification.comment}</p>
                )}

                {notification.story?.previewUrl && (
                    <div className="mt-2">
                        <Image
                            src={notification.story.previewUrl}
                            alt="preview"
                            width={64}
                            height={64}
                            className="rounded-md object-cover w-16 h-16 border border-white/10 transition duration-300 hover:scale-105"
                        />
                    </div>
                )}

                {notification.post?.content && notification.comment === null && (
                    <p className="text-xs text-white/40 mt-1 truncate max-w-full">{notification.post.content}</p>
                )}

                {notification.post?.previewUrl && (
                    <div className="mt-2">
                        <Image
                            src={notification.post.previewUrl}
                            alt="Post preview"
                            width={64}
                            height={64}
                            className="rounded-md object-cover w-16 h-16 border border-white/10 transition duration-300 hover:scale-105"
                            unoptimized
                        />
                    </div>
                )}
            </div>

            <button
                onClick={(e) => {
                    e.stopPropagation();
                    handleMarkAsRead();
                }}
                className="self-start mt-1 w-5 h-5 flex items-center justify-center cursor-pointer"
            >
                {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                    <Bell className={`w-5 h-5 ${!isRead ? "text-[#f6339a] animate-pulse" : "text-white/40"}`} />
                )}
            </button>
        </motion.div>
    );
}
