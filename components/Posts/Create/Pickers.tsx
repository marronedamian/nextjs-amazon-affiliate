"use client";

import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import EmojiPicker, { Theme } from "emoji-picker-react";

const GifPicker = dynamic(() => import("@/components/Posts/Create/GifPicker"));
const MentionSearch = dynamic(
    () => import("@/components/Posts/Create/MentionSearch")
);

export function Pickers({
    showEmojiPicker,
    showGifPicker,
    showMentionSearch,
    emojiRef,
    gifRef,
    mentionRef,
    onEmojiClick,
    onGifSelect,
    onMentionSelect,
    onCloseGif,
}: any) {
    return (
        <>
            <AnimatePresence>
                {showEmojiPicker && (
                    <motion.div
                        ref={emojiRef}
                        className="absolute top-full left-0 z-[9999] mt-2"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        style={{ transformOrigin: "top left" }}
                    >
                        <EmojiPicker
                            theme={Theme.DARK}
                            onEmojiClick={onEmojiClick}
                            height={300}
                            width={300}
                            lazyLoadEmojis
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showGifPicker && (
                    <motion.div
                        ref={gifRef}
                        className="absolute top-full left-0 z-[9999] mt-2"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                    >
                        <GifPicker onSelect={onGifSelect} onClose={onCloseGif} />
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showMentionSearch && (
                    <motion.div
                        ref={mentionRef}
                        className="absolute top-full left-0 z-[9999] mt-2"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                    >
                        <MentionSearch onSelect={onMentionSelect} />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
