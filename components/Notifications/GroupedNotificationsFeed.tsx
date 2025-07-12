"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NotificationData } from "@/types/notifications.types";
import NotificationCard from "./NotificationCard";

interface Props {
    t: any;
    items: NotificationData[];
    totalCount: number;
    onNotificationRead?: (id: string) => void;
}

export default function GroupedNotificationsFeed({
    t,
    items,
    totalCount,
    onNotificationRead,
}: Props) {
    const [openGroups, setOpenGroups] = useState<Set<string>>(new Set());
    const [notifications, setNotifications] = useState<NotificationData[]>([]);

    useEffect(() => {
        setNotifications(items);
    }, [items]);

    const grouped = notifications.reduce((acc, notif) => {
        const key = notif.fromUser.username;
        if (!acc[key]) acc[key] = [];
        acc[key].push(notif);
        return acc;
    }, {} as Record<string, NotificationData[]>);

    const sortedGroups = Object.entries(grouped).sort(
        (a, b) =>
            new Date(b[1][0].createdAt).getTime() -
            new Date(a[1][0].createdAt).getTime()
    );

    const toggleGroup = (username: string) => {
        setOpenGroups((prev) => {
            const copy = new Set(prev);
            copy.has(username) ? copy.delete(username) : copy.add(username);
            return copy;
        });
    };

    const markAsRead = (id: string) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        );
        onNotificationRead?.(id);
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            <div className="flex flex-col gap-4">
                {sortedGroups.map(([username, allNotifs]) => {
                    const isOpen = openGroups.has(username);
                    const sorted = [...allNotifs].sort(
                        (a, b) =>
                            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    );
                    const [latest, ...rest] = sorted;
                    const internalUnreadCount = rest.filter((n) => !n.isRead).length;

                    return (
                        <div
                            key={
                                username + allNotifs.map((n) => n.isRead).join("-")
                            }
                            className="border border-white/10 rounded-2xl overflow-hidden transition-shadow hover:shadow-md"
                        >
                            <div className="cursor-pointer">
                                <NotificationCard
                                    t={t}
                                    type="notification"
                                    data={latest}
                                    isHighlighted={!latest.isRead}
                                    isFirstCard={true}
                                    onRead={() => markAsRead(latest.id)}
                                />
                            </div>

                            {allNotifs.length > 1 && (
                                <div className="px-4 pb-4">
                                    <div className="flex justify-between items-center mt-4">
                                        <button
                                            onClick={() => toggleGroup(username)}
                                            className="text-xs text-white/60 hover:text-white hover:underline transition-all cursor-pointer"
                                        >
                                            {isOpen
                                                ? `${t("global.disguise")} ${t("notifications.plural")}`
                                                : `${t("global.see")}  ${t("notifications.plural")}`}
                                        </button>

                                        {internalUnreadCount > 0 && !isOpen && (
                                            <div className="bg-[#f6339a] text-white text-[10px] px-2 py-0.5 rounded-full font-semibold shadow-sm animate-pulse">
                                                {internalUnreadCount}
                                            </div>
                                        )}
                                    </div>

                                    <AnimatePresence initial={false}>
                                        {isOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{
                                                    duration: 0.3,
                                                    ease: "easeInOut",
                                                }}
                                                className="overflow-hidden"
                                            >
                                                <div className="mt-4 flex flex-col gap-2">
                                                    {rest.map((n, idx) => (
                                                        <div
                                                            key={n.id}
                                                            className={`cursor-pointer transition hover:bg-white/5 rounded-2xl`}
                                                        >
                                                            <NotificationCard
                                                                t={t}
                                                                type="notification"
                                                                data={n}
                                                                isHighlighted={!n.isRead}
                                                                onRead={() => markAsRead(n.id)}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </motion.div>
    );
}
