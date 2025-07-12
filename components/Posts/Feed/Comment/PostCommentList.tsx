"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import CommentItem from "./CommentItem";
import { motion } from "framer-motion";

export default function PostCommentList({
    t,
    post,
    comments,
    depth = 0,
    showComments,
}: {
    t: any;
    post: any;
    comments: any[];
    depth?: number;
    showComments?: boolean;
}) {
    const [showAll, setShowAll] = useState(false);

    const limit = 2;
    const isRoot = depth === 0;
    const shouldCollapse = comments.length > limit;
    const visibleComments = showAll || !shouldCollapse ? comments : comments.slice(0, limit);

    if (!comments.length) return null;

    return (
        <div className={isRoot ? "relative px-4 pb-0" : "relative"}>
            <div className="flex flex-col gap-0">
                {visibleComments.map((comment, idx) => (
                    <CommentItem
                        t={t}
                        key={comment.id}
                        post={post}
                        comment={comment}
                        depth={depth}
                        parentId={depth > 0 ? "yes" : undefined}
                        isLast={idx === comments.length - 1}
                    />
                ))}
            </div>

            {shouldCollapse && (
                <motion.button
                    whileTap={{ scale: 0.97 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setShowAll((prev) => !prev)}
                    className="flex justify-center items-center mx-auto my-0 gap-2 px-4 py-1 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white/70 hover:text-white font-medium rounded-full text-xs transition-all duration-300 w-max shadow-sm cursor-pointer"
                >
                    {showAll ? (
                        <>
                            <ChevronUp className="w-4 h-4" />
                            {t("posts.comments.showLess")}
                        </>
                    ) : (
                        <>
                            <ChevronDown className="w-4 h-4" />
                            {t("posts.comments.showMore")}
                        </>
                    )}
                </motion.button>
            )}
        </div>
    );
}
