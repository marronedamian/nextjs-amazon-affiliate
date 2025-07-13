"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, easeInOut, easeIn } from "framer-motion";
import FullscreenStory from "@/components/Story/FullScreenStory";
import StoryCreateModal from "@/components/Story/StoryCreateModal";
import { io } from "socket.io-client";
import { useSession } from "next-auth/react";
import type { Story } from "@/types/story.types";

const storyVariants = {
    initial: { y: -30, opacity: 0 },
    animate: (index: number) => ({
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.5,
            ease: easeInOut,
            delay: index * 0.15,
        },
    }),
    exit: {
        y: -30,
        opacity: 0,
        transition: { duration: 0.4, ease: easeIn },
    },
};
type StoryCarouselProps = {
    t: any;
};

export default function StoryCarousel({
    t
}: StoryCarouselProps) {
    const { data: session, status } = useSession();
    const [stories, setStories] = useState<Story[]>([]);
    const [showFullscreen, setShowFullscreen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const socketRef = useRef<any>(null);

    const fetchStories = async () => {
        const res = await fetch("/api/stories/feed");
        const data = await res.json();

        const grouped: Story[] = data.map((story: any) => {
            const allImages = story.stories.flatMap((story: any) =>
                story.images.map((img: string, idx: number) => ({
                    url: img,
                    seen: story.seen[idx],
                    storyId: story.storyId,
                    description: story.description,
                    createdAt: story.createdAt,
                    fullySeen: story.fullySeen,
                }))
            );

            return {
                userId: story.id,
                username: story.username,
                name: story.name,
                avatarUrl: story.avatarUrl,
                images: allImages,
            };
        });

        setStories(grouped);
    };

    useEffect(() => {
        fetchStories();

        const socket = io({ path: "/api/socket" });
        socketRef.current = socket;

        socket.on("new-story", fetchStories);

        return () => {
            socket.disconnect();
        };
    }, []);

    const openFullscreen = (index: number) => {
        setCurrentIndex(index);
        setShowFullscreen(true);
    };

    const closeFullscreen = () => setShowFullscreen(false);

    const handleImageSeen = (storyIndex: number, imageIndex: number) => {
        setStories((prev) =>
            prev.map((story, idx) =>
                idx === storyIndex
                    ? {
                        ...story,
                        images: story.images.map((img, i) =>
                            i === imageIndex ? { ...img, seen: true } : img
                        ),
                    }
                    : story
            )
        );
    };

    return (
        <>
            {stories.length > 0 ? (
                <section className="pt-20 pb-2 px-8 text-center z-10 relative">
                    <div className="max-w-7xl mx-auto p-0 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-lg">
                        <motion.div
                            className="flex space-x-4 p-4 overflow-x-auto w-full"
                            initial="initial"
                            animate="animate"
                            exit="exit"
                        >
                            {status === "authenticated" && (
                                <motion.div
                                    className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform"
                                    whileTap={{ scale: 0.9 }}
                                    custom={0}
                                    variants={storyVariants}
                                    onClick={() => setShowCreateModal(true)}
                                >
                                    <div className="relative w-16 h-16">
                                        <div className="absolute inset-0 flex justify-center items-center z-20">
                                            <svg
                                                width="80"
                                                height="80"
                                                viewBox="0 0 80 80"
                                                className="absolute w-full h-full"
                                                style={{ transform: "rotate(-90deg)" }}
                                            >
                                                <circle
                                                    cx="40"
                                                    cy="40"
                                                    r="36"
                                                    fill="none"
                                                    stroke="#f6339a"
                                                    strokeWidth="2"
                                                />
                                            </svg>
                                        </div>
                                        <div className="flex items-center justify-center w-16 h-16 rounded-full z-10 p-[5px]">
                                            <div className="bg-gray-200 p-1 w-full h-full flex items-center justify-center rounded-full">
                                                <span className="text-2xl text-[#f6339a]">+</span>
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-gray-300 mt-2">{t("stories.add")}</span>
                                </motion.div>
                            )}

                            {stories.map((story, index) => {
                                const coverImage =
                                    story.images.find((img) => !img.seen)?.url ??
                                    story.images[0].url;

                                return (
                                    <motion.div
                                        key={index}
                                        className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform"
                                        whileTap={{ scale: 0.9 }}
                                        custom={index + 1}
                                        variants={storyVariants}
                                        onClick={() => openFullscreen(index)}
                                    >
                                        <div className="relative w-16 h-16">
                                            <div className="absolute inset-0 flex justify-center items-center z-20">
                                                <svg
                                                    width="80"
                                                    height="80"
                                                    viewBox="0 0 80 80"
                                                    className="absolute w-full h-full"
                                                    style={{ transform: "rotate(-90deg)" }}
                                                >
                                                    {story.images.map((img, i) => {
                                                        const start = (i / story.images.length) * 360;
                                                        const end = ((i + 1) / story.images.length) * 360;
                                                        return (
                                                            <circle
                                                                key={i}
                                                                cx="40"
                                                                cy="40"
                                                                r="36"
                                                                fill="none"
                                                                stroke={img.seen ? "#e3e4e8" : "#f6339a"}
                                                                strokeWidth="2"
                                                                strokeDasharray={`${((end - start) / 360) * Math.PI * 72
                                                                    } ${(1 - (end - start) / 360) * Math.PI * 72}`}
                                                                strokeDashoffset={`-${(start / 360) * Math.PI * 72
                                                                    }`}
                                                            />
                                                        );
                                                    })}
                                                </svg>
                                            </div>
                                            <Image
                                                src={coverImage}
                                                alt={story.name}
                                                fill
                                                className="object-cover rounded-full z-10 p-1"
                                            />
                                        </div>
                                        <span className="text-gray-300 mt-2" title={story.name}>
                                            {story.name.length > 8
                                                ? story.name.slice(0, 8) + "…"
                                                : story.name}
                                        </span>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    </div>
                </section>
            ) : (
                <section className="pt-20 pb-2 px-8 text-center z-10 relative"></section>
            )}

            {status === "authenticated" && showCreateModal && (
                <StoryCreateModal
                    t={t}
                    onClose={() => setShowCreateModal(false)}
                    onStoryCreated={fetchStories}
                />
            )}

            <AnimatePresence>
                {showFullscreen && (
                    <FullscreenStory
                        t={t}
                        stories={stories}
                        initialIndex={currentIndex}
                        onClose={closeFullscreen}
                        onMarkImageSeen={handleImageSeen}
                    />
                )}
            </AnimatePresence>
        </>
    );
};

