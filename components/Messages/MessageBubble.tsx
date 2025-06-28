"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Message {
    id: string;
    content: string;
    createdAt: string;
}

export default function MessageBubble({
    messages,
    isOwn,
    avatarUrl,
}: {
    messages: Message[];
    isOwn: boolean;
    avatarUrl?: string;
}) {
    const formattedTime = format(
        new Date(messages[messages.length - 1].createdAt),
        "HH:mm",
        { locale: es }
    );

    const getBubbleClasses = (index: number, length: number): string => {
        const base =
            isOwn
                ? "bg-gradient-to-br from-blue-500 to-indigo-500 text-white self-end"
                : "bg-white/10 text-white self-start";

        const roundBase = "rounded-2xl";

        if (length === 1) {
            return `${base} ${roundBase} ${isOwn ? "rounded-tr-none" : "rounded-tl-none"}`;
        }

        if (index === 0) {
            return `${base} ${roundBase} ${isOwn ? "rounded-br-none" : "rounded-bl-none"
                }`;
        }

        if (index > 0 && index < length - 1) {
            return `${base} ${roundBase} ${isOwn ? "rounded-tr-none rounded-br-none" : "rounded-tl-none rounded-bl-none"
                }`;
        }

        return `${base} ${roundBase} ${isOwn ? "rounded-tr-none" : "rounded-tl-none"}`;
    };

    return (
        <div className={`flex items-start gap-2 ${isOwn ? "justify-end" : "justify-start"}`}>
            {/* ✅ Avatar SOLO para el primer mensaje si NO es propio */}
            {!isOwn && avatarUrl && (
                <Image
                    src={avatarUrl}
                    alt="avatar"
                    width={28}
                    height={28}
                    className="rounded-full object-cover mt-1"
                />
            )}

            <div className="flex flex-col gap-1">
                {messages.map((msg, index) => (
                    <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`
              w-fit px-4 py-2 text-sm leading-snug break-words whitespace-pre-wrap
              ${getBubbleClasses(index, messages.length)}
            `}
                    >
                        {msg.content}
                        {index === messages.length - 1 && (
                            <span className="block text-[10px] text-white/50 text-right mt-1">
                                {formattedTime}
                            </span>
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
