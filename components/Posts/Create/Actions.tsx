"use client";

import { motion } from "framer-motion";
import { Smile, ImagePlus, Gift, AtSign, SendHorizontal } from "lucide-react";
import { Button } from "@/components/Shared/Button";
import LoadingSpinner from "@/components/Shared/LoadingSpinner";

export function PostActions({
    t,
    fileInputRef,
    content,
    onPost,
    isPosting,
    setShowEmojiPicker,
    setShowGifPicker,
    handleMentionToggle,
    selectedImages,
    selectedGifs,
    handleImageUpload,
}: any) {
    return (
        <div className="relative flex gap-2 mt-3 flex-wrap items-center">
            <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowEmojiPicker((prev: boolean) => !prev)}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition cursor-pointer"
            >
                <Smile size={18} />
            </motion.button>

            <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => fileInputRef.current?.click()}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition cursor-pointer"
            >
                <ImagePlus size={18} />
            </motion.button>
            <input
                ref={fileInputRef}
                type="file"
                hidden
                accept="image/*"
                multiple
                onChange={handleImageUpload}
            />

            <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowGifPicker(true)}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition cursor-pointer"
            >
                <Gift size={18} />
            </motion.button>

            {/*
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleMentionToggle}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition cursor-pointer"
                >
                    <AtSign size={18} />
                </motion.button>
            */}

            <div className="ml-auto">
                <Button
                    onClick={onPost}
                    disabled={
                        isPosting || (!content.trim() && selectedImages.length === 0 && selectedGifs.length === 0)
                    }
                >
                    {isPosting ? (
                        <>
                            <LoadingSpinner />
                            {t("posts.create.publishing")}
                        </>
                    ) : (
                        <>
                            <SendHorizontal size={16} />
                            {t("posts.create.publish")}
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
