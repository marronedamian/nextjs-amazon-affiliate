"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import Picker, { EmojiClickData, Theme } from "emoji-picker-react";
import { SendHorizonal } from "lucide-react";

export default function ChatInput({
    t,
    conversationId,
    receiverId,
    sendMessage,
    sendTyping,
}: {
    t: any;
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
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const emojiPickerRef = useRef<HTMLDivElement>(null);

    const randomEmoji = useRef(
        ["😀", "😅", "😂", "🤣", "😊", "😍", "🥳", "😎", "🤩", "😇"][
        Math.floor(Math.random() * 10)
        ]
    ).current;

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
            resetTextareaHeight();
            sendTyping(false);
            typingSent.current = false;
            setShowEmojiPicker(false);
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

    const addEmoji = (emojiData: EmojiClickData) => {
        setInput((prev) => prev + emojiData.emoji);
    };

    const toggleEmojiPicker = () => {
        setShowEmojiPicker((prev) => !prev);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                emojiPickerRef.current &&
                !emojiPickerRef.current.contains(event.target as Node)
            ) {
                setShowEmojiPicker(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="px-4 py-3 md:px-6 border-t border-white/10 bg-white/5 relative">
            <div className="flex items-end gap-2">
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
                    placeholder={t("messages.placeholder")}
                    rows={1}
                    className="flex-1 resize-none bg-white/10 rounded-2xl px-4 py-2 text-[16px] text-white outline-none backdrop-blur-md border border-white/10 placeholder-white/50 max-h-[88px]"
                    style={{ overflowY: "hidden" }}
                />

                {/* Emoji button */}
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 1.1 }}
                    onClick={toggleEmojiPicker}
                    className="text-lg w-9 h-9 flex items-center justify-center rounded-full text-white/80 hover:bg-white/10 transition cursor-pointer"
                >
                    {randomEmoji}
                </motion.button>

                {/* Send button */}
                <motion.button
                    whileTap={{ scale: 0.98 }}
                    whileHover={{ scale: 1.03 }}
                    onClick={handleSend}
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-white/10 backdrop-blur-2xl border border-green-500 hover:bg-green-600/30 text-green-300 hover:text-white font-semibold rounded-full transition-all duration-300 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                    {loading ? (
                        <>
                            <svg
                                className="w-4 h-4 animate-spin text-green-300"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                ></path>
                            </svg>
                            {t("messages.sending")}
                        </>
                    ) : (
                        <>
                            <SendHorizonal size={18} />
                            {t("messages.send")}
                        </>
                    )}
                </motion.button>
            </div>

            <AnimatePresence>
                {showEmojiPicker && (
                    <motion.div
                        ref={emojiPickerRef}
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute bottom-16 right-4 z-50"
                    >
                        <Picker onEmojiClick={addEmoji} theme={Theme.DARK} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
