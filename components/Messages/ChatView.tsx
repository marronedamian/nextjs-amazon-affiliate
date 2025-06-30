"use client";

import ChatHeader from "@/components/Messages/ChatHeader";
import ChatMessages from "@/components/Messages/ChatMessages";
import ChatInput from "@/components/Messages/ChatInput";
import useChatSocket from "@/hooks/sockets/useChatSocket";
import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getIO } from "@/lib/socket";
import { useConversation } from "@/context/ConversationContext";

export default function ChatView({
    conversationId,
    participant,
    onBack,
}: {
    conversationId: string;
    participant: { id: number; name: string; image: string; username: string };
    onBack: () => void;
}) {
    const { data: session } = useSession();
    const { setUnreadMap, unreadMap } = useConversation();

    const [isTyping, setIsTyping] = useState(false);
    const [socketMessages, setSocketMessages] = useState<any[]>([]);

    useEffect(() => {
        const markAsRead = async () => {
            await fetch(`/api/messages/read`, {
                method: "POST",
                body: JSON.stringify({ conversationId }),
                headers: { "Content-Type": "application/json" },
            });

            setUnreadMap({
                ...unreadMap,
                [conversationId]: 0,
            });
        };

        markAsRead();
    }, [conversationId]);

    const handleNewMessage = useCallback((msg: any) => {
        setSocketMessages((prev) => [...prev, msg]);
    }, []);

    const handleTyping = useCallback(() => {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 3000);
    }, []);

    const { sendMessage, sendTyping } = useChatSocket(
        conversationId,
        session?.user?.id ?? "",
        handleNewMessage,
        handleTyping
    );

    const handleClose = () => {
        const io = getIO();
        if (io) {
            io.emit("read-messages", { conversationId });
        }

        setUnreadMap({
            ...unreadMap,
            [conversationId]: 0,
        });

        onBack();
    };

    return (
        <>
            <ChatHeader
                name={participant.name}
                avatar={participant.image}
                username={participant.username}
                isTyping={isTyping}
                onClose={handleClose}
            />
            <div className="flex-1 overflow-hidden">
                <ChatMessages
                    conversationId={conversationId}
                    socketMessages={socketMessages}
                />
            </div>
            <ChatInput
                conversationId={conversationId}
                receiverId={String(participant.id)}
                sendMessage={sendMessage}
                sendTyping={sendTyping}
            />
        </>
    );
}
