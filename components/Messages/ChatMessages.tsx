"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import type { Message } from "@/types/messages.types";
import MessageBubble from "./MessageBubble";
import { format, isSameDay, isToday } from "date-fns";
import { es } from "date-fns/locale";
import * as Tooltip from "@radix-ui/react-tooltip";

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
        const scrollContainer = document.getElementById("chat-scroll");
        if (scrollContainer) {
            scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
    }, [groupedMessages]);

    const renderDateDivider = (dateString: string) => {
        const tooltipFullDate = format(new Date(dateString), "PPPPpp", { locale: es }); // Ej: viernes, 4 de julio de 2025, 05:36 p. m.
        const shortDate = format(new Date(dateString), "dd/MM/yy, p", { locale: es });

        return (
            <Tooltip.Root>
                <Tooltip.Trigger asChild>
                    <div className="relative flex items-center justify-center my-6 select-none">
                        <div className="flex-grow border-t border-white/10" />
                        <span className="mx-4 text-xs text-white/70 bg-white/5 backdrop-blur-md px-3 py-0.5 rounded-full shadow-sm">
                            📅 {shortDate}
                        </span>
                        <div className="flex-grow border-t border-white/10" />
                    </div>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                    <Tooltip.Content
                        side="top"
                        align="center"
                        className="text-sm text-white bg-black/80 backdrop-blur-md px-3 py-1 rounded-md shadow-md border border-white/10"
                    >
                        {tooltipFullDate}
                    </Tooltip.Content>
                </Tooltip.Portal>
            </Tooltip.Root>
        );
    };

    return (
        <Tooltip.Provider delayDuration={100}>
            <div
                id="chat-scroll"
                className="h-full overflow-y-auto scroll-smooth px-4 py-3 md:px-6 space-y-4"
            >
                {groupedMessages.map((group, index) => {
                    const isLastGroup = index === groupedMessages.length - 1;
                    const currentLastMsg = group.messages[group.messages.length - 1];
                    const nextFirstMsg = groupedMessages[index + 1]?.messages?.[0];
                    const changedDay = nextFirstMsg
                        ? !isSameDay(new Date(currentLastMsg.createdAt), new Date(nextFirstMsg.createdAt))
                        : !isToday(new Date(currentLastMsg.createdAt));

                    return (
                        <div key={index} className="space-y-2">
                            <MessageBubble
                                messages={group.messages}
                                isOwn={group.isOwn}
                                avatarUrl={group.avatarUrl}
                            />
                            {changedDay && renderDateDivider(currentLastMsg.createdAt)}
                        </div>
                    );
                })}
                <div ref={endRef} />
            </div>
        </Tooltip.Provider>
    );
}
