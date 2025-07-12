"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import FeedPost from "@/components/Feed/FeedPost";
import Background from "@/components/Shared/Background";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "next-i18next";

export default function PostDetailPage() {
    const { t } = useTranslation("common");
    const params = useParams() as Record<string, string | string[]>;
    const postId = params?.postId;
    const [post, setPost] = useState<any>(null);

    useEffect(() => {
        if (!postId) return;

        const fetchPost = async () => {
            try {
                const res = await fetch(`/api/posts/${postId}`);
                if (res.ok) {
                    const data = await res.json();
                    setPost(data);
                } else {
                    console.error("Error fetching post:", res.status);
                }
            } catch (error) {
                console.error("Fetch failed:", error);
            }
        };

        fetchPost();
    }, [postId]);

    return (
        <Background>
            <div className="flex flex-col items-center pt-[15vh] px-4 pb-25">
                <div className="w-full max-w-3xl">
                    <AnimatePresence>
                        {post && (
                            <motion.div
                                key={post.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.3 }}
                            >
                                <FeedPost t={t} post={post} showComments />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </Background>
    );
}
