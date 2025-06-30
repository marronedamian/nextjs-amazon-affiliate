"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import NotificationOrFavoriteCard from "./NotificationCard";
import { useThrottle } from "@react-hook/throttle";
import { useIntersectionObserver } from "@react-hookz/web";

export default function NotificationsFeed() {
    const [items, setItems] = useState<any[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const pageRef = useRef(1);
    const isFetchingRef = useRef(false);
    const sentinelRef = useRef<HTMLDivElement | null>(null);
    const [throttledLoading, setThrottledLoading] = useThrottle(false, 500);

    const fetchNotifications = useCallback(async () => {
        if (isFetchingRef.current || !hasMore) return;

        isFetchingRef.current = true;
        setIsLoading(true);
        setThrottledLoading(true);
        setError(null);

        try {
            const res = await fetch(`/api/notifications?page=${pageRef.current}`);
            if (!res.ok) throw new Error("Failed to fetch notifications");

            const data = await res.json();
            if (!data.notifications) throw new Error("Invalid response format");

            setItems((prev) => {
                const existingIds = new Set(prev.map((n) => n.id));
                const newItems = data.notifications.filter((n: any) => !existingIds.has(n.id));
                return [...prev, ...newItems];
            });

            setHasMore(data.hasNextPage);
            if (data.hasNextPage) {
                pageRef.current += 1;
            }
        } catch (err: any) {
            console.error("Notifications load error:", err);
            setError(err.message || "Failed to load notifications");
        } finally {
            isFetchingRef.current = false;
            setIsLoading(false);
            setThrottledLoading(false);
        }
    }, [hasMore]);

    const entry = useIntersectionObserver(sentinelRef, {
        threshold: [0.1],
        rootMargin: "0px 0px 400px 0px",
    });

    useEffect(() => {
        if (entry?.isIntersecting && hasMore && !isFetchingRef.current) {
            fetchNotifications();
        }
    }, [entry, hasMore, fetchNotifications]);

    // Primera carga
    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    // Insertar nueva notificación al inicio si no existe ya
    useEffect(() => {
        const handleNewNotification = async () => {
            try {
                const res = await fetch(`/api/notifications?page=1`);
                const data = await res.json();
                const newNotification = data.notifications?.[0];
                if (!newNotification) return;

                setItems((prev) => {
                    const exists = prev.some((n) => n.id === newNotification.id);
                    return exists ? prev : [newNotification, ...prev];
                });
            } catch (error) {
                console.error("Error al recibir nueva notificación:", error);
            }
        };

        window.addEventListener("notifications:refresh", handleNewNotification);
        return () => {
            window.removeEventListener("notifications:refresh", handleNewNotification);
        };
    }, []);

    useEffect(() => {
        const handler = () => {
            pageRef.current = 1;
            setItems([]);
            setHasMore(true);
            fetchNotifications();
        };

        window.addEventListener("notifications:refresh", handler);
        return () => {
            window.removeEventListener("notifications:refresh", handler);
        };
    }, [fetchNotifications]);

    return (
        <div className="flex flex-col gap-4 px-0 pb-20">
            {items.map((item) => (
                <NotificationOrFavoriteCard
                    key={item.id}
                    type="notification"
                    data={item}
                    isHighlighted={!item.isRead}
                />
            ))}

            <div ref={sentinelRef} className="h-px w-full" />

            <div className="w-full py-4 flex items-center justify-center">
                {error ? (
                    <div className="text-center">
                        <p className="text-red-400 mb-2">{error}</p>
                        <button
                            onClick={fetchNotifications}
                            className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition"
                        >
                            Reintentar
                        </button>
                    </div>
                ) : isLoading || throttledLoading ? (
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 border-t-2 border-blue-500 rounded-full animate-spin"></div>
                        <span className="text-sm text-white/50">Cargando...</span>
                    </div>
                ) : !hasMore && items.length > 0 ? (
                    <span className="text-sm text-white/30">
                        Has llegado al final de las notificaciones
                    </span>
                ) : null}
            </div>
        </div>
    );
}
