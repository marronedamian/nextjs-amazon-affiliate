"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, easeInOut, easeIn } from "framer-motion";
import FullscreenStory from "@/components/Story/FullScreenStory";
import mockStories from "@/mocks/stories.mock";

const initialStories = mockStories;

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

const StoryCarousel = () => {
    const [stories, setStories] = useState(initialStories);
    const [showFullscreen, setShowFullscreen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const openFullscreen = (index: number) => {
        setCurrentIndex(index);
        setShowFullscreen(true);
    };

    const closeFullscreen = () => {
        setShowFullscreen(false);
    };

    const markStoryAsSeen = (storyIndex: number, imageIndex: number) => {
        setStories((prevStories) =>
            prevStories.map((story, i) =>
                i === storyIndex
                    ? {
                        ...story,
                        seen: story.seen.map((seen, j) =>
                            j <= imageIndex ? true : seen
                        ),
                    }
                    : story
            )
        );
    };

    const handleStoryChange = (newStoryIndex: number, newImageIndex: number) => {
        setCurrentIndex(newStoryIndex);
        markStoryAsSeen(newStoryIndex, newImageIndex);
    };

    return (
        <>
            <section className="pt-20 pb-10 px-5 text-center z-10 relative">
                <div className="max-w-4xl mx-auto p-0 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-lg">
                    <motion.div
                        className="flex space-x-4 p-4 overflow-x-auto w-full"
                        initial="initial"
                        animate="animate"
                        exit="exit"
                    >
                        <motion.div
                            className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform"
                            whileTap={{ scale: 0.9 }}
                            custom={0}
                            variants={storyVariants}
                            onClick={() => alert("Agregar historia")}
                        >
                            <div className="relative w-16 h-16">
                                <div className="absolute inset-0 flex justify-center items-center z-20">
                                    <svg
                                        width="80"
                                        height="80"
                                        viewBox="0 0 80 80"
                                        className="absolute w-full h-full"
                                        style={{ transform: "rotate(-90deg)", zIndex: 2 }}
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
                            <span className="text-gray-300 mt-2">Add</span>
                        </motion.div>

                        {stories.map((story, index) => (
                            <motion.div
                                key={story.id}
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
                                            style={{ transform: "rotate(-90deg)", zIndex: 2 }}
                                        >
                                            {story.images.map((_, i) => {
                                                const startAngle = (i / story.images.length) * 360;
                                                const endAngle =
                                                    ((i + 1) / story.images.length) * 360;
                                                return (
                                                    <circle
                                                        key={i}
                                                        cx="40"
                                                        cy="40"
                                                        r="36"
                                                        fill="none"
                                                        stroke={
                                                            story.seen[i]
                                                                ? "#e3e4e8"
                                                                : "#f6339a"
                                                        }
                                                        strokeWidth="2"
                                                        strokeDasharray={`${((endAngle - startAngle) / 360) *
                                                            Math.PI *
                                                            72
                                                            } ${(1 -
                                                                (endAngle - startAngle) / 360) *
                                                            Math.PI *
                                                            72
                                                            }`}
                                                        strokeDashoffset={`-${(startAngle / 360) *
                                                            Math.PI *
                                                            72
                                                            }`}
                                                    />
                                                );
                                            })}
                                        </svg>
                                    </div>
                                    <Image
                                        src={story.images[0]}
                                        alt={story.name}
                                        fill
                                        className="object-cover rounded-full z-10 p-1"
                                    />
                                </div>
                                <span className="text-gray-300 mt-2">{story.name}</span>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            <AnimatePresence>
                {showFullscreen && (
                    <FullscreenStory
                        stories={stories}
                        initialIndex={currentIndex}
                        onClose={closeFullscreen}
                        onStoryChange={handleStoryChange}
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default StoryCarousel;
