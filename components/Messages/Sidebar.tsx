"use client";

import * as Tooltip from "@radix-ui/react-tooltip";
import { motion } from "framer-motion";
import Image from "next/image";
import { useConversation } from "@/context/ConversationContext";
import { ChatItem } from "@/types/messages.types";

type Props = {
    t: any;
    activeUserId: number;
    onSelect: (conversationId: string, userId: number) => void;
    chats: ChatItem[];
};

export default function Sidebar({ t, activeUserId, onSelect, chats }: Props) {
    const { activeConversationId, unreadMap } = useConversation();

    return (
        <div className="h-full max-h-screen overflow-y-auto">
            {chats.map((chat) => {
                const isActive = chat.conversationId === activeConversationId;
                const unread = unreadMap[chat.conversationId] > 0;
                const showDot = unread && !isActive;

                const shortTime = chat.lastMessage?.createdAt
                    ? new Date(chat.lastMessage.createdAt).toLocaleTimeString("es-AR", {
                        hour: "2-digit",
                        minute: "2-digit",
                    })
                    : "";

                const fullTime = chat.lastMessage?.createdAt
                    ? new Date(chat.lastMessage.createdAt).toLocaleString("es-AR", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                    })
                    : "";

                return (
                    <motion.button
                        key={chat.conversationId}
                        onClick={() =>
                            chat.participant &&
                            onSelect(chat.conversationId, chat.participant.id)
                        }
                        className={`w-full px-4 py-3 text-left flex items-center space-x-3 transition-all duration-200 cursor-pointer ${isActive
                            ? "bg-white/10 border-l-4 border-pink-500"
                            : "hover:bg-white/5"
                            }`}
                    >
                        <div className="relative rounded-full flex-shrink-0">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="rounded-full overflow-hidden"
                            >
                                <Image
                                    src={chat.participant?.image ?? "/default-avatar.png"}
                                    alt={chat.participant?.name ?? "Unknown"}
                                    width={40}
                                    height={40}
                                    className="rounded-full object-cover"
                                />
                            </motion.div>

                            {showDot && (
                                <>
                                    <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-[#f6339a] ring ring-white" />
                                    <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-[#f6339a] animate-ping" />
                                </>
                            )}
                        </div>

                        <div className="flex flex-col flex-1 min-w-0">
                            <div className="text-sm font-semibold truncate text-white">
                                {chat.participant?.name}
                            </div>
                            <div className="text-xs text-white/60 truncate">
                                {chat.lastMessage?.content ?? t("messages.empty")}
                            </div>
                        </div>

                        <div className="flex items-center space-x-1">
                            <Tooltip.Provider delayDuration={100}>
                                <Tooltip.Root>
                                    <Tooltip.Trigger asChild>
                                        <span className="text-xs text-white/40 whitespace-nowrap mt-1.5 cursor-default">
                                            {shortTime}
                                        </span>
                                    </Tooltip.Trigger>
                                    <Tooltip.Portal>
                                        <Tooltip.Content
                                            side="top"
                                            sideOffset={6}
                                            className="z-50 px-2 py-1 text-xs text-white bg-black rounded shadow-sm animate-fade-in"
                                        >
                                            {fullTime}
                                            <Tooltip.Arrow className="fill-black" />
                                        </Tooltip.Content>
                                    </Tooltip.Portal>
                                </Tooltip.Root>
                            </Tooltip.Provider>
                        </div>
                    </motion.button>
                );
            })}
        </div>
    );
}
