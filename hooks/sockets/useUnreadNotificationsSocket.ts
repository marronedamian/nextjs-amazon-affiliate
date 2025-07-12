"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { io } from "socket.io-client";

export default function useUnreadNotificationsSocket(userId: string) {
  const [unreadCount, setUnreadCount] = useState(0);
  const socketRef = useRef<any>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!userId) return;

    const fetchUnread = async () => {
      try {
        const res = await fetch("/api/notifications/unread");
        const data = await res.json();
        setUnreadCount(data.count);
      } catch (error) {
        console.error("Error fetching unread notifications:", error);
      }
    };

    fetchUnread();

    const socket = io({ path: "/api/socket" });
    socketRef.current = socket;

    socket.emit("join-global", userId);

    socket.on("notification:new", () => {
      if (!pathname?.includes("/notifications")) {
        setUnreadCount((prev) => prev + 1);
      }
    });

    socket.on("notification:removed", () => {
      setUnreadCount((prev) => Math.max(prev - 1, 0));
    });

    return () => {
      socket.off("notification:new");
      socket.off("notification:removed");
      socket.disconnect();
    };
  }, [userId, pathname]);

  useEffect(() => {
    if (pathname?.includes("/notifications")) {
      setUnreadCount(0);
    }
  }, [pathname]);

  return unreadCount;
}
