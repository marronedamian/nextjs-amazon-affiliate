"use client";

import {
    Heart,
    Repeat,
    MessageCircle,
    Loader2,
} from "lucide-react";
import * as Tooltip from "@radix-ui/react-tooltip";
import clsx from "clsx";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { AnimatePresence } from "framer-motion";
import { EmojiClickData } from "emoji-picker-react";
import { useRouter } from "next/navigation";

import PostComment from "@/components/Posts/Feed/Layout/PostComment";
import PostCommentList from "@/components/Posts/Feed/Comment/PostCommentList";
import AvatarWithTooltip from "@/components/Posts/Feed/Lib/AvatarWithTooltip";
import { set } from "date-fns";
import { t } from "i18next";

interface Props {
    originalPost: any;
    userId: string;
    hasLiked: boolean;
    hasReposted: boolean;
    setHasLiked: (val: boolean) => void;
    setHasReposted: (val: boolean) => void;
    setLikeCount: (fn: (prev: number) => number) => void;
    setRepostCount: (fn: (prev: number) => number) => void;
    loadingLike: boolean;
    setLoadingLike: (val: boolean) => void;
    loadingRepost: boolean;
    setLoadingRepost: (val: boolean) => void;
    showInlineComments?: boolean;
}

export default function PostActions({
    originalPost,
    userId,
    hasLiked,
    hasReposted,
    setHasLiked,
    setHasReposted,
    setLikeCount,
    setRepostCount,
    loadingLike,
    setLoadingLike,
    loadingRepost,
    setLoadingRepost,
    showInlineComments = false,
}: Props) {
    const { data: session } = useSession();
    const router = useRouter();
    const isAuthor = originalPost.user.id === userId;

    const [showCommentBox, setShowCommentBox] = useState(showInlineComments);
    const [comment, setComment] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [loading, setLoading] = useState(false);
    const [comments, setComments] = useState<any[]>([]);
    const [postLikes, setPostLikes] = useState(originalPost.likes || []);
    const [repostCount, setRepostCountInternal] = useState(
        originalPost._count?.reposts || 0
    );

    useEffect(() => {
        if (showInlineComments) {
            fetch(`/api/posts/${originalPost.id}/comments`)
                .then(res => res.json())
                .then(data => {
                    setComments(data);
                    setShowCommentBox(true);
                });
        }
    }, []);

    const toggleCommentBox = async () => {
        if (!showInlineComments) {
            router.push(`/post/${originalPost.id}`);
            return;
        }

        if (!showCommentBox) {
            const res = await fetch(`/api/posts/${originalPost.id}/comments`);
            if (res.ok) {
                const data = await res.json();
                setComments(data);
            }
        }

        setShowCommentBox((prev) => !prev);
    };


    const handleLike = async () => {
        if (!session) {
            router.push("/auth/login");
            return;
        }

        if (loadingLike) return;
        try {
            setLoadingLike(true);
            const method = hasLiked ? "DELETE" : "POST";
            const res = await fetch(`/api/posts/${originalPost.id}/like`, { method });

            if (res.ok) {
                setHasLiked(!hasLiked);
                setLikeCount((prev: number) => prev + (hasLiked ? -1 : 1));

                const updatedLikes = hasLiked
                    ? postLikes.filter((like: any) => like.userId !== userId)
                    : [
                        ...postLikes,
                        {
                            userId,
                            user: {
                                id: userId,
                                name: session?.user?.name || "Usuario",
                                image: session?.user?.image || "/fallback-avatar.png",
                                username: session?.user?.username || "",
                            },
                        },
                    ];

                setPostLikes(updatedLikes);
            }
        } finally {
            setLoadingLike(false);
        }
    };

    const handleRepost = async () => {
        if (!session) {
            router.push("/auth/login");
            return;
        }

        if (loadingRepost || isAuthor) return;
        try {
            setLoadingRepost(true);
            const method = hasReposted ? "DELETE" : "POST";
            const res = await fetch(`/api/posts/${originalPost.id}/repost`, { method });
            if (res.ok) {
                setHasReposted(!hasReposted);
                setRepostCount((prev) => prev + (hasReposted ? -1 : 1));
                setRepostCountInternal((prev: any) => prev + (hasReposted ? -1 : 1));
            }
        } finally {
            setLoadingRepost(false);
        }
    };

    const handleSendComment = async () => {
        if (!comment.trim()) return;
        try {
            setLoading(true);
            await fetch(`/api/posts/${originalPost.id}/comments`, {
                method: "POST",
                body: JSON.stringify({ content: comment }),
            });
            setComment("");
            setShowEmojiPicker(false);

            const res = await fetch(`/api/posts/${originalPost.id}/comments`);
            if (res.ok) {
                const data = await res.json();
                setComments(data);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="flex items-start justify-between px-4 pb-4 flex-wrap">
                <div className="flex items-center gap-6 flex-wrap">
                    {/* Like */}
                    <div className="flex items-center gap-2 cursor-pointer">
                        <button
                            onClick={handleLike}
                            disabled={loadingLike}
                            className={clsx(
                                "flex items-center gap-1 transition cursor-pointer",
                                loadingLike && "opacity-50 cursor-not-allowed",
                                hasLiked ? "text-red-400 hover:text-red-300" : "text-white/80 hover:text-white"
                            )}
                        >
                            {loadingLike ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Heart className="w-5 h-5" />
                            )}
                            {postLikes.length === 0 && (
                                <span className="text-sm">0</span>
                            )}
                        </button>

                        <div className="flex -space-x-2">
                            {postLikes
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
                                            tooltip
                                        />
                                    </div>
                                ))}
                            {postLikes.length > 5 && (
                                <div className="w-[22px] h-[22px] z-10 rounded-full bg-white/30 text-white text-[10px] flex items-center justify-center">
                                    +{postLikes.length - 5}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Repost */}
                    <Tooltip.Provider>
                        <Tooltip.Root>
                            <Tooltip.Trigger asChild>
                                <button
                                    onClick={handleRepost}
                                    disabled={isAuthor || loadingRepost}
                                    className={clsx(
                                        "flex items-center gap-1 transition cursor-pointer",
                                        (loadingRepost || isAuthor) && "opacity-50 cursor-not-allowed",
                                        hasReposted ? "text-green-400 hover:text-green-300" : "text-white/80 hover:text-white"
                                    )}
                                >
                                    {loadingRepost ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <Repeat className="w-5 h-5" />
                                    )}
                                    <span className="text-sm">{repostCount}</span>
                                </button>
                            </Tooltip.Trigger>
                            {isAuthor && (
                                <Tooltip.Content
                                    side="top"
                                    className="bg-black text-white px-2 py-1 rounded text-xs shadow-lg"
                                >
                                    {t("posts.feed.cannotRepostOwnPost")}
                                </Tooltip.Content>
                            )}
                        </Tooltip.Root>
                    </Tooltip.Provider>

                    {/* Comentarios */}
                    <button
                        onClick={toggleCommentBox}
                        className={clsx(
                            "flex items-center gap-1 text-white/80 hover:text-white transition cursor-pointer",
                            loading && "opacity-50"
                        )}
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <MessageCircle className="w-5 h-5" />
                        )}
                        <span className="text-sm">{originalPost._count?.comments || 0}</span>
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {showCommentBox && showInlineComments && (
                    <>
                        <PostCommentList t={t} post={originalPost} comments={comments} showComments={showInlineComments} />
                        <PostComment
                            comment={comment}
                            onChange={setComment}
                            onFocus={() => { }}
                            onBlur={() => { }}
                            onToggleEmoji={() => setShowEmojiPicker((s) => !s)}
                            showEmojiPicker={showEmojiPicker}
                            onEmojiClick={(emoji: EmojiClickData) =>
                                setComment((prev) => prev + emoji.emoji)
                            }
                            onSend={handleSendComment}
                            loading={loading}
                            placeholder={t("posts.comments.placeholder")}
                            randomEmoji="💬"
                        />
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
