"use client";

import { useState, useRef } from "react";
import { useSession } from "next-auth/react";

export default function ChatInput({
    conversationId,
    receiverId,
    sendMessage,
    sendTyping,
}: {
    conversationId: string;
    receiverId: string;
    sendMessage: (msg: {
        conversationId: string;
        content: string;
        senderId: string;
        receiverId: string;
    }) => Promise<void>;
    sendTyping: (typing: boolean) => void;
}) {
    const { data: session } = useSession();
    const currentUserId = session?.user?.id;

    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const typingTimeout = useRef<NodeJS.Timeout | null>(null);
    const typingSent = useRef(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const resetTextareaHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.overflowY = "hidden";
        }
    };

    const handleSend = async () => {
        const trimmed = input.trim();
        if (!trimmed || !currentUserId) return;

        setLoading(true);
        try {
            await sendMessage({
                conversationId,
                content: trimmed,
                senderId: currentUserId,
                receiverId,
            });
            setInput("");
            sendTyping(false);
            typingSent.current = false;
            resetTextareaHeight();
        } catch (err) {
            console.error("❌ Error enviando mensaje:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setInput(value);

        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = `${textarea.scrollHeight}px`;

            if (textarea.scrollHeight > 88) {
                textarea.style.overflowY = "scroll";
                textarea.style.height = "88px";
            } else {
                textarea.style.overflowY = "hidden";
            }
        }

        if (!typingSent.current) {
            sendTyping(true);
            typingSent.current = true;
        }

        if (typingTimeout.current) clearTimeout(typingTimeout.current);
        typingTimeout.current = setTimeout(() => {
            sendTyping(false);
            typingSent.current = false;
        }, 1500);
    };

    return (
        <div className="px-4 py-3 md:px-6 border-t border-white/10 bg-white/5">
            <div className="flex items-end gap-3">
                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={handleChange}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                    placeholder="Type a message..."
                    rows={1}
                    className="flex-1 resize-none bg-white/10 rounded-2xl px-4 py-2 text-sm text-white outline-none backdrop-blur-md border border-white/10 placeholder-white/50 max-h-[88px]"
                    style={{ overflowY: "hidden" }}
                />
                <button
                    onClick={handleSend}
                    disabled={loading}
                    className="bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 text-white text-sm px-4 py-2 rounded-full hover:opacity-90 transition disabled:opacity-50"
                >
                    {loading ? "Sending..." : "Send"}
                </button>
            </div>
        </div>
    );
}
