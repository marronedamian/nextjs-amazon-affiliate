"use client";

import { useState, useEffect, useRef } from "react";
import Background from "@/components/Shared/Background";
import Sidebar from "@/components/Messages/Sidebar";
import ChatView from "@/components/Messages/ChatView";
import { useChatStore } from "@/lib/stores/chatStore";
import { useConversation } from "@/context/ConversationContext";
import { getIO } from "@/lib/socket";
import { useTranslation } from "next-i18next";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

export default function MessagesPage() {
    const { t } = useTranslation("common");
    const pathname = usePathname();
    const currentLang = pathname?.split("/")[1] || "en";

    const { selectedConversationId, participant, clearConversation } = useChatStore();
    const { setActiveConversationId } = useConversation();

    const [chats, setChats] = useState<any[]>([]);
    const [mobileView, setMobileView] = useState(false);
    const [activeUser, setActiveUser] = useState<any | null>(participant);
    const [selectedId, setSelectedId] = useState<string | null>(selectedConversationId);

    useEffect(() => {
        if (selectedId) setActiveConversationId(selectedId);
        else setActiveConversationId(undefined);
    }, [selectedId]);

    useEffect(() => {
        const loadChats = async () => {
            const res = await fetch("/api/messages/list");
            const data = await res.json();
            setChats(data);

            if (selectedConversationId && participant) {
                setActiveUser(participant);
                setSelectedId(selectedConversationId);
                setMobileView(true);
                clearConversation();
            }
        };

        loadChats();
    }, []);

    const handleSelect = (conversationId: string, userId: number) => {
        const user = chats.find((c) => c.participant?.id === userId)?.participant;
        if (user) {
            setActiveUser(user);
            setMobileView(true);
            setSelectedId(conversationId);
        }
    };

    const handleBack = () => {
        if (selectedId) {
            const io = getIO();
            if (io) {
                io.emit("read-messages", { conversationId: selectedId });
            }
        }
        setMobileView(false);
        setSelectedId(null);
        setActiveConversationId(undefined);
    };

    return (
        <Background>
            <div className="relative flex items-center justify-center min-h-screen px-4">
                <div className="relative w-full md:max-w-4xl h-[75vh] flex flex-col md:flex-row rounded-3xl overflow-hidden border border-white/10 backdrop-blur-xl">
                    {/* Sidebar */}
                    <aside
                        className={`w-full md:w-1/3 h-full flex flex-col ${mobileView ? "hidden md:flex" : "flex"
                            }`}
                    >
                        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 md:hidden">
                            <h2 className="text-lg font-bold">{t("messages.title")}</h2>
                        </div>
                        <Sidebar
                            t={t}
                            activeUserId={activeUser?.id}
                            chats={chats}
                            onSelect={handleSelect}
                        />
                        <div className="md:hidden px-4 py-3 bg-white/10 border-t border-white/10">
                            <h4 className="text-xs font-semibold text-white/70 mb-2">
                                {t("messages.activeUsers")}
                            </h4>
                            <div className="flex space-x-3 overflow-x-auto">
                                {chats.map((user) => (
                                    <Link
                                        key={user.participant?.id}
                                        href={`/${user.participant?.username}`}
                                        className="group"
                                    >
                                        <motion.div
                                            className="relative"
                                            transition={{ type: "spring", stiffness: 300 }}
                                        >
                                            <img
                                                src={user.participant?.image}
                                                alt={user.participant?.name}
                                                className="rounded-full w-10 h-10 border-2 border-white/20 object-cover transition-opacity duration-200 group-hover:opacity-90"
                                            />
                                        </motion.div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Main Chat */}
                    <section
                        className={`w-full md:flex-1 h-full flex flex-col bg-white/5 transition-all duration-300 ease-in-out ${mobileView
                            ? "fixed inset-0 z-50 md:static md:flex"
                            : "hidden md:flex"
                            }`}
                    >
                        {selectedId && activeUser ? (
                            <ChatView
                                t={t}
                                conversationId={selectedId}
                                participant={activeUser}
                                onBack={handleBack}
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full w-full text-white/50">
                                <p>{t("messages.selectConversation")}</p>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </Background>
    );
}
