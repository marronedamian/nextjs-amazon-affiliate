"use client";

import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Picker, { EmojiClickData, Theme } from "emoji-picker-react";
import { SendHorizonal } from "lucide-react";

interface Props {
    comment: string;
    onChange: (value: string) => void;
    onFocus: () => void;
    onBlur: () => void;
    onToggleEmoji: () => void;
    showEmojiPicker: boolean;
    onEmojiClick: (emojiData: EmojiClickData) => void;
    onSend: () => void;
    loading?: boolean;
    placeholder?: string;
    randomEmoji: string;
}

export default function PostComment({
    comment,
    onChange,
    onFocus,
    onBlur,
    onToggleEmoji,
    showEmojiPicker,
    onEmojiClick,
    onSend,
    loading = false,
    placeholder,
    randomEmoji,
}: Props) {
    const emojiPickerRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                emojiPickerRef.current &&
                !emojiPickerRef.current.contains(event.target as Node)
            ) {
                onToggleEmoji();
            }
        };
        if (showEmojiPicker) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showEmojiPicker]);

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e.target.value);
        const el = e.target;
        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;

        if (el.scrollHeight > 88) {
            el.style.overflowY = "scroll";
            el.style.height = "88px";
        } else {
            el.style.overflowY = "hidden";
        }
    };

    return (
        <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
        >
            <div className="px-4 pb-3 mt-1">
                <div className="flex items-end gap-2 min-h-[48px]">
                    <textarea
                        ref={textareaRef}
                        value={comment}
                        onChange={handleInput}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                onSend();
                            }
                        }}
                        placeholder={placeholder}
                        rows={1}
                        className="flex-1 resize-none bg-white/10 rounded-2xl px-4 py-2 text-[16px] text-white outline-none backdrop-blur-md border border-white/10 placeholder-white/50 min-h-[40px] max-h-[88px] leading-[1.4] truncate overflow-hidden whitespace-nowrap"
                        style={{ overflowY: "hidden", height: "24px" }}
                    />

                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        whileHover={{ scale: 1.1 }}
                        onClick={onToggleEmoji}
                        className="text-lg w-9 h-9 flex items-center justify-center rounded-full text-white/80 hover:bg-white/10 transition cursor-pointer"
                    >
                        {randomEmoji}
                    </motion.button>

                    <motion.button
                        whileTap={{ scale: 0.98 }}
                        whileHover={{ scale: 1.03 }}
                        onClick={onSend}
                        disabled={loading}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2 bg-white/10 backdrop-blur-2xl border border-pink-500 hover:bg-pink-600/30 text-pink-300 hover:text-white font-semibold rounded-full transition-all duration-300 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {loading ? (
                            <svg className="w-4 h-4 animate-spin text-pink-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                            </svg>
                        ) : (
                            <SendHorizonal size={18} />
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
                            className="absolute bottom-20 right-4 z-50"
                        >
                            <Picker onEmojiClick={onEmojiClick} theme={Theme.DARK} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
