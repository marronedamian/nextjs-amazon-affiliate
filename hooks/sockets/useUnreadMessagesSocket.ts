import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useConversation } from "@/context/ConversationContext";

export default function useUnreadMessagesSocket(
  userId: string,
  currentPath: string,
  activeConversationId?: string
) {
  const [unreadCount, setUnreadCount] = useState(0);
  const socketRef = useRef<any>(null);
  const { unreadMap, setUnreadMap } = useConversation();
  const unreadMapRef = useRef(unreadMap);

  useEffect(() => {
    unreadMapRef.current = unreadMap;
  }, [unreadMap]);

  useEffect(() => {
    if (!userId) return;

    const fetchInitial = async () => {
      const res = await fetch("/api/messages/unread");
      const data = await res.json();

      const map: Record<string, number> = {};
      let total = 0;

      if (Array.isArray(data.messages)) {
        for (const item of data.messages) {
          map[item.conversationId] = item.count;
          total += item.count;
        }
      }

      setUnreadMap(map);
      setUnreadCount(total);
      unreadMapRef.current = map;
    };

    fetchInitial();

    const socket = io({ path: "/api/socket" });
    socketRef.current = socket;

    socket.emit("join-global", userId);

    socket.on("new-message", (msg: any) => {
      const isOnMessagesPage = currentPath.includes("/messages");
      const isInConversation = msg.conversationId === activeConversationId;

      const shouldCount =
        msg.receiverId === userId && (!isOnMessagesPage || !isInConversation);

      if (shouldCount) {
        setUnreadCount((prev) => prev + 1);

        const currentMap = { ...unreadMapRef.current };
        currentMap[msg.conversationId] =
          (currentMap[msg.conversationId] || 0) + 1;

        setUnreadMap(currentMap);
        unreadMapRef.current = currentMap;
      }
    });

    socket.on(
      "messages-read",
      ({ conversationId }: { conversationId: string }) => {
        if (conversationId === activeConversationId) {
          const currentMap = { ...unreadMapRef.current };
          const count = currentMap[conversationId] || 0;

          if (count > 0) {
            currentMap[conversationId] = 0;
            setUnreadCount((prevTotal) => Math.max(prevTotal - count, 0));
            setUnreadMap(currentMap);
            unreadMapRef.current = currentMap;
          }
        }
      }
    );

    return () => {
      socket.disconnect();
    };
  }, [userId, activeConversationId, currentPath, setUnreadMap]);

  return unreadCount;
}
