"use client";

import Image from "next/image";
import { useConversation } from "@/context/ConversationContext";

type ChatItem = {
    conversationId: string;
    participant: {
        id: number;
        name: string;
        image: string;
    } | null;
    lastMessage: {
        content: string;
        createdAt: string;
    } | null;
};

type Props = {
    activeUserId: number;
    onSelect: (conversationId: string, userId: number) => void;
    chats: ChatItem[];
};

export default function Sidebar({ activeUserId, onSelect, chats }: Props) {
    const { activeConversationId, unreadMap } = useConversation();

    return (
        <div className="h-full max-h-screen overflow-y-auto">
            {chats.map((chat) => {
                const isActive = chat.participant?.id === activeUserId;
                const unread = unreadMap[chat.conversationId] > 0;
                const showDot = unread && chat.conversationId !== activeConversationId;

                return (
                    <button
                        key={chat.conversationId}
                        onClick={() =>
                            chat.participant &&
                            onSelect(chat.conversationId, chat.participant.id)
                        }
                        className={`w-full px-4 py-3 text-left flex items-center space-x-3 cursor-pointer hover:bg-white/10 transition ${isActive ? "bg-white/10" : ""
                            }`}
                    >
                        <Image
                            src={chat.participant?.image ?? "/default-avatar.png"}
                            alt={chat.participant?.name ?? "Unknown"}
                            width={40}
                            height={40}
                            className="rounded-full flex-shrink-0"
                        />
                        <div className="flex flex-col flex-1 min-w-0">
                            <div className="text-sm font-semibold truncate">
                                {chat.participant?.name}
                            </div>
                            <div className="text-xs text-white/60 truncate">
                                {chat.lastMessage?.content ?? "No messages yet"}
                            </div>
                        </div>
                        <div className="flex items-center space-x-1">
                            <div className="text-xs text-white/40 whitespace-nowrap">
                                {chat.lastMessage?.createdAt
                                    ? new Date(chat.lastMessage.createdAt).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })
                                    : ""}
                            </div>
                            {showDot && (
                                <span className="ml-1 w-2.5 h-2.5 rounded-full bg-pink-500" />
                            )}
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
