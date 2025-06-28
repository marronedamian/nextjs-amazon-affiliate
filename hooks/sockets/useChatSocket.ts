import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

interface Message {
  conversationId: string;
  content: string;
  senderId: string;
  receiverId: string;
}

export default function useChatSocket(
  conversationId: string,
  userId: string,
  onMessage: (msg: any) => void,
  onTyping?: (isTyping: boolean) => void,
  onRead?: (conversationId: string) => void
): {
  sendMessage: (msg: Message) => Promise<void>;
  sendTyping: (isTyping: boolean) => void;
  markAsRead: () => void;
} {
  const socketRef = useRef<Socket | null>(null);
  const typingRef = useRef(onTyping);
  const readRef = useRef(onRead);

  useEffect(() => {
    typingRef.current = onTyping;
    readRef.current = onRead;
  }, [onTyping, onRead]);

  useEffect(() => {
    const socket = io({ path: "/api/socket" });
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("join-room", conversationId);
      socket.emit("join-global", userId);
    });

    socket.on("receive-message", (msg) => {
      onMessage(msg);

      if (msg.conversationId === conversationId && msg.receiverId === userId) {
        socket.emit("mark-as-read", {
          conversationId,
          userId,
        });
      }
    });

    socket.on("typing", ({ isTyping, conversationId: cid }) => {
      if (cid === conversationId && typingRef.current) {
        typingRef.current(isTyping);
      }
    });

    socket.on("messages-read", ({ conversationId: cid }) => {
      if (cid === conversationId && readRef.current) {
        readRef.current(cid);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [conversationId, userId, onMessage]);

  const sendMessage = async (msg: Message): Promise<void> => {
    try {
      const res = await fetch("/api/messages/send", {
        method: "POST",
        body: JSON.stringify(msg),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (!data.message) {
        console.warn("❌ No se pudo guardar el mensaje");
      }

      socketRef.current?.emit("send-message", msg);
    } catch (error) {
      console.error("❌ Error al enviar el mensaje:", error);
    }
  };

  const sendTyping = (isTyping: boolean): void => {
    socketRef.current?.emit("typing", {
      isTyping,
      conversationId,
    });
  };

  const markAsRead = () => {
    socketRef.current?.emit("mark-as-read", {
      conversationId,
      userId,
    });
  };

  return { sendMessage, sendTyping, markAsRead };
}
