"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import MessageBubble from "./MessageBubble";

interface Message {
    id: string;
    content: string;
    senderId: string;
    createdAt: string;
    senderImage?: string;
}

export default function ChatMessages({
    conversationId,
    socketMessages = [],
}: {
    conversationId: string;
    socketMessages?: Message[];
}) {
    const { data: session } = useSession();
    const currentUserId = session?.user?.id;

    const [initialMessages, setInitialMessages] = useState<Message[]>([]);
    const endRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loadInitialMessages = async () => {
            try {
                const res = await fetch(`/api/messages/history/${conversationId}`);
                const data = await res.json();
                setInitialMessages(data.messages);
            } catch (err) {
                console.error("Error cargando historial de mensajes", err);
            }
        };

        loadInitialMessages();
    }, [conversationId]);

    const allMessages = useMemo(() => {
        const existingIds = new Set(initialMessages.map((m) => m.id));
        const newOnes = socketMessages.filter((m) => !existingIds.has(m.id));
        return [...initialMessages, ...newOnes];
    }, [initialMessages, socketMessages]);

    const groupedMessages = useMemo(() => {
        const groups: {
            senderId: string;
            avatarUrl?: string;
            isOwn: boolean;
            messages: Message[];
        }[] = [];

        let currentGroup: typeof groups[0] | null = null;

        for (const msg of allMessages) {
            const isOwn = msg.senderId === currentUserId;
            const avatarUrl = msg.senderImage;

            if (!currentGroup || currentGroup.senderId !== msg.senderId) {
                currentGroup = {
                    senderId: msg.senderId,
                    avatarUrl: !isOwn ? avatarUrl : undefined,
                    isOwn,
                    messages: [msg],
                };
                groups.push(currentGroup);
            } else {
                currentGroup.messages.push(msg);
            }
        }

        return groups;
    }, [allMessages, currentUserId]);

    useEffect(() => {
        const scrollContainer = document.getElementById('chat-scroll');
        if (scrollContainer) {
            scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
    }, [groupedMessages]);

    return (
        <div
            id="chat-scroll"
            className="h-full overflow-y-auto scroll-smooth px-4 py-3 md:px-6 space-y-4"
        >
            {groupedMessages.map((group, index) => (
                <MessageBubble
                    key={index}
                    messages={group.messages}
                    isOwn={group.isOwn}
                    avatarUrl={group.avatarUrl}
                />
            ))}
            <div ref={endRef} />
        </div>
    );
}
