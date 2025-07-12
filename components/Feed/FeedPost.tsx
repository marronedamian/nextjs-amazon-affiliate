"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import PostHeader from "@/components/Posts/Feed/Layout/PostHeader";
import PostContent from "@/components/Posts/Feed/Content/PostContent";
import PostMediaGrid from "@/components/Posts/Feed/Lib/PostMediaGrid";
import PostActions from "@/components/Posts/Feed/Actions/PostActions";
import PostLightbox from "@/components/Posts/Feed/Lib/PostLightbox";
import clsx from "clsx";

export default function FeedPost({
    t,
    post,
    showComments,
}: {
    t: any,
    post: any;
    showComments?: boolean;
}) {
    const { data: session } = useSession();
    const userId = session?.user?.id;

    const isRepost = post.isRepost && post.repost;
    const originalPost = isRepost ? post.repost : post;
    const originalMedia = [...(originalPost.images || []), ...(originalPost.gifs || [])];

    const [hasLiked, setHasLiked] = useState(false);
    const [hasReposted, setHasReposted] = useState(false);
    const [likeCount, setLikeCount] = useState(originalPost._count?.likes || 0);
    const [repostCount, setRepostCount] = useState(originalPost._count?.reposts || 0);
    const [loadingLike, setLoadingLike] = useState(false);
    const [loadingRepost, setLoadingRepost] = useState(false);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const [isVisible, setIsVisible] = useState(true);
    const [isFadingOut, setIsFadingOut] = useState(false);

    useEffect(() => {
        if (!userId) return;
        setHasLiked(originalPost.likes?.some((like: any) => like.userId === userId) || false);
        setHasReposted(originalPost.reposts?.some((repost: any) => repost.userId === userId) || false);
    }, [originalPost.likes, originalPost.reposts, userId]);

    const onDelete = () => {
        setIsFadingOut(true);
        setTimeout(() => setIsVisible(false), 300); // Espera 300ms para terminar el fade-out
    };

    if (!isVisible) return null;

    return (
        <>
            <div
                className={clsx(
                    "w-full h-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all flex flex-col",
                    {
                        "opacity-100 transition-opacity duration-300": !isFadingOut,
                        "opacity-0 transition-opacity duration-300": isFadingOut,
                    }
                )}
            >
                <PostHeader
                    t={t}
                    post={post}
                    isRepost={isRepost}
                    originalPost={originalPost}
                    onDelete={onDelete}
                />
                <PostContent t={t} content={originalPost.content} />
                <PostMediaGrid
                    media={originalMedia}
                    setCurrentImageIndex={setCurrentImageIndex}
                    openLightbox={() => setLightboxOpen(true)}
                />
                <PostActions
                    originalPost={originalPost}
                    userId={userId ?? ""}
                    hasLiked={hasLiked}
                    hasReposted={hasReposted}
                    setHasLiked={setHasLiked}
                    setHasReposted={setHasReposted}
                    setLikeCount={setLikeCount}
                    setRepostCount={setRepostCount}
                    loadingLike={loadingLike}
                    setLoadingLike={setLoadingLike}
                    loadingRepost={loadingRepost}
                    setLoadingRepost={setLoadingRepost}
                    showInlineComments={showComments}
                />
            </div>

            <PostLightbox
                open={lightboxOpen}
                onClose={() => setLightboxOpen(false)}
                index={currentImageIndex}
                media={originalMedia}
                user={originalPost.user}
                likeCount={likeCount}
                repostCount={repostCount}
                commentCount={originalPost._count?.comments || 0}
            />
        </>
    );
}
