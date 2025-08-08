"use client";

import FeedPost from "./FeedPost";
import { useSearchParams } from "next/navigation";
import { usePosts } from "@/hooks/posts/usePosts";
import CreatePost from "../Posts/CreatePost";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";

export default function Feed({ t }: { t: any }) {
    const searchParams = useSearchParams();
    const category = searchParams?.get("category") || undefined;

    const { posts, newCount, showNewPosts } = usePosts(category);
    const { status } = useSession();

    const text = t("posts.newPosts", { count: newCount });

    return (
        <div className="max-w-7xl mx-auto mt-0 px-8 xl:px-0">
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-3 gap-4 space-y-4">
                {status === "authenticated" && (
                    <div className="break-inside-avoid relative z-10">
                        <CreatePost t={t} />
                    </div>
                )}
                {newCount > 0 && (
                    <div className="break-inside-avoid w-full flex justify-center col-span-full my-2 pb-2 cursor-pointer">
                        <motion.button
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={showNewPosts}
                            className="relative inline-flex items-center gap-2 px-6 py-2.5 bg-white/10 backdrop-blur-2xl border border-purple-500 hover:bg-purple-600/30 text-purple-300 hover:text-white font-semibold rounded-full transition-all duration-200 transform hover:scale-104 shadow-xl cursor-pointer animate-pulse-slow-new-post"
                        >
                            <span className="absolute -inset-0.5 rounded-full bg-purple-500 opacity-10 blur-md animate-ping z-0 [animation-duration:3s]" />
                            <span className="relative z-10 flex items-center gap-2">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M4 5h12a1 1 0 011 1v7H5.414L3 15.414V6a1 1 0 011-1z" />
                                </svg>
                                {text}
                            </span>
                        </motion.button>
                    </div>
                )}

                <AnimatePresence>
                    {posts.map((post) => (
                        <motion.div
                            key={post.id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.3 }}
                            className="break-inside-avoid"
                        >
                            <FeedPost t={t} post={post} />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
