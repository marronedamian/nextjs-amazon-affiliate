"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import GroupedNotificationsFeed from "./GroupedNotificationsFeed";
import { useThrottle } from "@react-hook/throttle";
import { usePathname } from "next/navigation";
import { useIntersectionObserver } from "@react-hookz/web";
import { NotificationData } from "@/types/notifications.types";

const TABS = [
    { key: "all", label: "All" },
    { key: "follow", label: "Follows", color: "rgba(139, 92, 246, 0.4)" },
    { key: "like", label: "Likes", color: "rgba(244, 63, 94, 0.4)" },
    { key: "comment", label: "Comments", color: "rgba(59, 130, 246, 0.4)" },
    { key: "repost", label: "Reposts", color: "rgba(16, 185, 129, 0.4)" },
    { key: "mention", label: "Mentions", color: "rgba(250, 204, 21, 0.4)" },
];

const NotificationsFeed = ({ t }: { t: any }) => {
    const pathname = usePathname();
    const lang = pathname?.split("/")[1] || "es";

    const [items, setItems] = useState<NotificationData[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totalCount, setTotalCount] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState("all");

    const pageRef = useRef(1);
    const isFetchingRef = useRef(false);
    const sentinelRef = useRef<HTMLDivElement | null>(null);
    const [throttledLoading, setThrottledLoading] = useThrottle(false, 500);

    const filterByTab = useCallback(
        (type: string) => {
            switch (activeTab) {
                case "like":
                    return ["like", "comment_like"].includes(type);
                case "comment":
                    return ["reply", "comment", "comment_reply", "post_comment", "story_comment"].includes(type);
                case "follow":
                    return type === "follow";
                case "repost":
                    return type === "repost";
                case "mention":
                    return type === "mention";
                default:
                    return true;
            }
        },
        [activeTab]
    );

    const fetchNotifications = useCallback(async () => {
        if (isFetchingRef.current || !hasMore) return;

        isFetchingRef.current = true;
        setIsLoading(true);
        setThrottledLoading(true);
        setError(null);

        try {
            const res = await fetch(`/api/notifications?page=${pageRef.current}`, {
                headers: { "x-lang": lang },
            });
            if (!res.ok) throw new Error("Error al cargar notificaciones");

            const data = await res.json();
            const newItems: NotificationData[] = data.notifications || [];
            const total = data.pagination?.total ?? null;

            setItems((prev) => {
                const existingIds = new Set(prev.map((n) => n.id));
                const filtered = newItems.filter((n) => !existingIds.has(n.id));
                return [...prev, ...filtered];
            });

            if (total !== null) setTotalCount(total);
            setHasMore(data.pagination?.hasNextPage ?? false);
            if (data.pagination?.hasNextPage) pageRef.current += 1;
        } catch (err: any) {
            console.error("Notifications load error:", err);
            setError(err.message || "Error al cargar notificaciones");
        } finally {
            isFetchingRef.current = false;
            setIsLoading(false);
            setThrottledLoading(false);
        }
    }, [hasMore, lang]);

    const entry = useIntersectionObserver(sentinelRef, {
        threshold: [0.1],
        rootMargin: "0px 0px 400px 0px",
    });

    const handleReadNotification = useCallback((id: string) => {
        setItems((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    }, []);

    useEffect(() => {
        if (entry?.isIntersecting && hasMore && !isFetchingRef.current) {
            fetchNotifications();
        }
    }, [entry, hasMore, fetchNotifications]);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    useEffect(() => {
        const handler = async () => {
            pageRef.current = 1;
            setItems([]);
            setHasMore(true);
            await fetchNotifications();
        };

        window.addEventListener("notifications:refresh", handler);
        return () => {
            window.removeEventListener("notifications:refresh", handler);
        };
    }, [fetchNotifications]);

    const filteredItems = items.filter((n) => filterByTab(n.type.name));

    return (
        <div className="flex flex-col gap-4 px-0 pb-24">
            <div className="w-full px-4 overflow-x-auto scrollbar-none">
                <div className="flex gap-2 sm:gap-3 w-max min-w-full scroll-smooth">
                    {TABS.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 cursor-pointer
                ${activeTab === tab.key
                                    ? "bg-white/10 text-white shadow-inner backdrop-blur border border-white/10"
                                    : "text-white/40 hover:text-white hover:bg-white/5"
                                }`}
                            style={{ backgroundColor: activeTab === tab.key ? tab.color : undefined }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {filteredItems.length > 0 ? (
                <GroupedNotificationsFeed
                    t={t}
                    items={filteredItems}
                    totalCount={totalCount ?? filteredItems.length}
                    onNotificationRead={handleReadNotification}
                />
            ) : !isLoading && !error ? (
                <div className="flex flex-col items-center justify-center text-center text-white/40 text-sm pt-20 animate-fade-in">
                    <p>{t("notifications.empty")}</p>
                    <p className="text-white/20 text-xs mt-1">{t("notifications.comeBackLater")}</p>
                </div>
            ) : null}

            <div ref={sentinelRef} className="h-px w-full" />

            <div className="w-full py-6 flex items-center justify-center transition-all">
                {error ? (
                    <div className="text-center animate-fade-in">
                        <p className="text-red-400 mb-2 text-sm">{error}</p>
                        <button
                            onClick={fetchNotifications}
                            className="px-4 py-2 text-sm bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 active:scale-95 transition-all"
                        >
                            {t("global.retry")}
                        </button>
                    </div>
                ) : isLoading || throttledLoading ? (
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 border-t-2 border-blue-500 rounded-full animate-spin"></div>
                        <span className="text-sm text-white/50">{t("global.loading")}</span>
                    </div>
                ) : !hasMore && filteredItems.length > 0 ? (
                    <span className="text-sm text-white/30 animate-fade-in">
                        {t("notifications.end")}
                    </span>
                ) : null}
            </div>
        </div>
    );
};

export default NotificationsFeed;
