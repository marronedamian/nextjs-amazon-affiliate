"use client";

import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useSession } from "next-auth/react";
import Background from "@/components/Shared/Background";
import NotificationsFeed from "@/components/Favorites/NotificationsFeed";
import { CheckCheck } from "lucide-react";

export default function NotificationsPage() {
    const { data: session } = useSession();
    const userId = session?.user?.id;
    const socketRef = useRef<any>(null);

    useEffect(() => {
        if (!userId) return;

        const socket = io({ path: "/api/socket" });
        socketRef.current = socket;

        socket.emit("join-global", userId);

        socket.on("notification:new", () => {
            window.dispatchEvent(new CustomEvent("notifications:refresh"));
        });

        return () => {
            socket.disconnect();
        };
    }, [userId]);

    const markAllAsRead = async () => {
        try {
            const res = await fetch("/api/notifications/read-all", {
                method: "PATCH",
            });
            if (!res.ok) throw new Error("Error al marcar como leídas");

            window.dispatchEvent(new CustomEvent("notifications:refresh"));
        } catch (err) {
            console.error("Error al marcar todas como leídas:", err);
        }
    };

    return (
        <Background>
            <div className="max-w-2xl mx-auto space-y-6 pt-30 pb-30 px-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Notificaciones</h1>
                        <p className="text-sm text-white/50">Tus interacciones recientes</p>
                    </div>

                    <button
                        onClick={markAllAsRead}
                        className="backdrop-blur-sm bg-white/5 hover:bg-white/10 text-white/70 hover:text-white px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition cursor-pointer"
                    >
                        <CheckCheck className="w-4 h-4" />
                        Marcar como leídas
                    </button>
                </div>

                <NotificationsFeed />
            </div>
        </Background>
    );
}
