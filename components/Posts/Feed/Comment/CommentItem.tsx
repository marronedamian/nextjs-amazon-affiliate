"use client";

import { useState, useEffect, useTransition } from "react";
import { useSession } from "next-auth/react";
import {
    Heart,
    Reply,
    Loader2,
    ChevronDown,
    ChevronUp,
} from "lucide-react";
import clsx from "clsx";
import ReplyInput from "./ReplyInput";
import AvatarWithTooltip from "../Lib/AvatarWithTooltip";
import { formatDistanceToNowStrict, format } from "date-fns";
import { es } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";
import * as Tooltip from "@radix-ui/react-tooltip";
import Link from "next/link";

interface Props {
    t: any;
    comment: any;
    post: any;
    depth: number;
    parentId?: string;
    isLast?: boolean;
}

export default function CommentItem({
    t,
    comment,
    post,
    depth,
    parentId,
    isLast = false,
}: Props) {
    const { data: session } = useSession();
    const currentUserId = session?.user?.id;

    const [liked, setLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(comment.likes?.length || 0);
    const [replies, setReplies] = useState(comment.replies || []);
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [showAllReplies, setShowAllReplies] = useState(false);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        if (currentUserId) {
            setLiked(comment.likes?.some((like: any) => like.userId === currentUserId));
        }
    }, [comment.likes, currentUserId]);

    const handleLike = () => {
        startTransition(async () => {
            const method = liked ? "DELETE" : "POST";
            const res = await fetch(`/api/posts/${post.id}/comments/${comment.id}/like`, {
                method,
            });

            if (res.ok) {
                setLiked(!liked);
                setLikesCount((prev: any) => prev + (liked ? -1 : 1));

                // Sincronizar el array de likes
                const updatedLikes = liked
                    ? comment.likes.filter((like: any) => like.userId !== currentUserId)
                    : [...comment.likes, { userId: currentUserId, user: session?.user }];

                comment.likes = updatedLikes;
            }
        });
    };

    const handleReply = async (text: string) => {
        const replyToId = parentId || comment.id;
        const res = await fetch(`/api/posts/${post.id}/comments/${replyToId}/reply`, {
            method: "POST",
            body: JSON.stringify({ content: text }),
        });

        if (res.ok) {
            const newReply = await res.json();
            if (replyToId === comment.id) {
                setReplies((prev: any[]) => [...prev, newReply]);
            }
            setShowReplyInput(false);
        }
    };

    const visibleReplies = showAllReplies ? replies : replies.slice(0, 2);

    const timeAgo = formatDistanceToNowStrict(new Date(comment.createdAt), {
        locale: es,
        addSuffix: true,
    });

    const fullTime = format(new Date(comment.createdAt), "PPPPp", { locale: es });

    return (
        <div className="relative flex mb-3">
            <div className="relative w-10 mr-2">
                <Link
                    href={`/${comment.user.username}`}
                    className="block cursor-pointer"
                    aria-label={`${comment.user.username}`}
                >
                    <AvatarWithTooltip user={comment.user} />
                </Link>
            </div>

            <div className="flex-1">
                <div className="bg-white/5 px-3 py-2 rounded-2xl border border-white/10 text-sm backdrop-blur-sm">
                    <div className="text-white whitespace-pre-line leading-snug">
                        {comment.content}
                    </div>

                    <div className="flex items-center justify-between mt-2 text-xs text-white/50">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    whileHover={{ scale: 1.05 }}
                                    onClick={handleLike}
                                    disabled={isPending}
                                    className={clsx(
                                        "transition hover:text-white",
                                        liked && "text-red-400"
                                    )}
                                >
                                    {isPending ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Heart className="w-4 h-4" />
                                    )}
                                </motion.button>

                                <div className="flex -space-x-2">
                                    {(comment.likes || [])
                                        .filter((like: any) => like?.user)
                                        .slice(0, 5)
                                        .map((like: any) => (
                                            <div
                                                key={like.user.id}
                                                className="w-[22px] h-[22px] rounded-full overflow-hidden"
                                            >
                                                <AvatarWithTooltip
                                                    user={like.user}
                                                    sizeClass="w-[22px] h-[22px]"
                                                    tooltip={true}
                                                />
                                            </div>
                                        ))}

                                    {comment.likes?.filter((like: any) => like?.user).length >
                                        5 && (
                                            <div className="w-[22px] h-[22px] z-10 rounded-full bg-white/30 text-white text-[10px] flex items-center justify-center">
                                                +
                                                {comment.likes.filter((like: any) => like?.user)
                                                    .length - 5}
                                            </div>
                                        )}
                                </div>
                            </div>

                            {!parentId && (
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    whileHover={{ scale: 1.05 }}
                                    onClick={() => setShowReplyInput((prev) => !prev)}
                                    className="flex items-center gap-1 hover:text-white transition"
                                >
                                    <Reply className="w-4 h-4" />
                                    <span>{t("posts.comments.reply")}</span>
                                </motion.button>
                            )}
                        </div>

                        <Tooltip.Provider delayDuration={100}>
                            <Tooltip.Root>
                                <Tooltip.Trigger asChild>
                                    <span className="text-[11px] cursor-default">
                                        {timeAgo}
                                    </span>
                                </Tooltip.Trigger>
                                <Tooltip.Portal>
                                    <Tooltip.Content
                                        side="top"
                                        sideOffset={6}
                                        className="z-50 px-2 py-1 text-xs text-white bg-black rounded shadow-sm animate-fade-in"
                                    >
                                        {fullTime}
                                        <Tooltip.Arrow className="fill-black" />
                                    </Tooltip.Content>
                                </Tooltip.Portal>
                            </Tooltip.Root>
                        </Tooltip.Provider>
                    </div>
                </div>

                {showReplyInput && <ReplyInput t={t} onSend={handleReply} />}

                <AnimatePresence>
                    {replies.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.3 }}
                            className="mt-3 flex flex-col gap-0"
                        >
                            {visibleReplies.map((reply: any, index: number) => (
                                <CommentItem
                                    t={t}
                                    key={reply.id}
                                    comment={reply}
                                    post={post}
                                    depth={depth + 1}
                                    parentId={comment.id}
                                    isLast={index === replies.length - 1}
                                />
                            ))}

                            {replies.length > 2 && (
                                <motion.button
                                    whileTap={{ scale: 0.97 }}
                                    whileHover={{ scale: 1.02 }}
                                    onClick={() => setShowAllReplies((prev) => !prev)}
                                    className="flex justify-center items-center mx-auto my-0 gap-2 px-4 py-1 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white/70 hover:text-white font-medium rounded-full text-xs transition-all duration-300 w-max shadow-sm cursor-pointer"
                                >
                                    {showAllReplies ? (
                                        <>
                                            <ChevronUp className="w-4 h-4" />
                                            {t("posts.comments.replies.hideAll")}
                                        </>
                                    ) : (
                                        <>
                                            <ChevronDown className="w-4 h-4" />
                                            {t("posts.comments.replies.showAll")}
                                        </>
                                    )}
                                </motion.button>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
