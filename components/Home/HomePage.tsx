"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence, cubicBezier } from "framer-motion";
import { FaChevronDown } from "@/components/Shared/Icons";

import StoryCarousel from "@/components/Story/StoryCarousel";
import BottomNav from "@/components/Navigation/BottomNav";
import ReelsFeed from "@/components/Reels/ReelsFeed";
import FullScreenReels from "@/components/Reels/FullScreenReels";

export default function HomePage({ lang }: { lang: string }) {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showBottomNav, setShowBottomNav] = useState(true);
    const [showReels, setShowReels] = useState(false);
    const [currentReelIndex, setCurrentReelIndex] = useState(0);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push(`/${lang}/auth/login`);
        }
    }, [status, lang, router]);

    const toggleMenu = () => setIsMenuOpen((prev) => !prev);
    const handleLogout = () => signOut({ callbackUrl: `/${lang}` });

    const handleReelsFocus = (focused: boolean) => setShowBottomNav(!focused);
    const openFullScreenReel = (index: number) => {
        setCurrentReelIndex(index);
        setShowReels(true);
        setShowBottomNav(false);
    };
    const closeFullScreenReel = () => {
        setShowReels(false);
        setShowBottomNav(true);
    };

    const screenVariants = {
        initial: { opacity: 0, scale: 0.9 },
        animate: {
            opacity: 1,
            scale: 1,
            transition: { duration: 1, ease: cubicBezier(0.16, 1, 0.3, 1) },
        },
        exit: {
            opacity: 0,
            transition: { duration: 0.2, ease: cubicBezier(0.7, 0, 0.84, 0) },
        },
    };

    const videos = [
        "https://videos.pexels.com/video-files/4830364/4830364-uhd_1440_2732_25fps.mp4",
        "https://videos.pexels.com/video-files/27776045/12221991_1080_1920_24fps.mp4",
        "https://videos.pexels.com/video-files/26964354/12037348_1080_1920_30fps.mp4",
    ];

    return (
        <main className="relative min-h-screen overflow-hidden text-white font-sans bg-gradient-radial from-[#1a1a1d] via-[#111114] to-[#0a0a0a]">
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute top-1/3 left-[-10%] w-[400px] h-[400px] bg-pink-500 opacity-20 rounded-full blur-[200px] animate-pulse-slow" />
                <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-purple-500 opacity-20 rounded-full blur-[180px] animate-pulse-slow delay-700" />
                <div className="absolute bottom-[-5%] left-[35%] w-[600px] h-[600px] bg-blue-500 opacity-10 rounded-full blur-[240px] animate-pulse-slow delay-1000" />
            </div>
            <AnimatePresence mode="wait">
                <motion.div
                    key="homeScreen"
                    className="relative z-10 flex flex-col items-center justify-start h-full w-full"
                    variants={screenVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                >
                    {/* Historias */}
                    <div className="w-full">
                        <StoryCarousel />
                    </div>

                    {/* Reels Feed
                    <div className="w-full flex-1">
                        <ReelsFeed videos={videos} onReelClick={openFullScreenReel} />
                    </div> */}
                </motion.div>
            </AnimatePresence>

            <AnimatePresence>
                {showReels && (
                    <FullScreenReels
                        videos={videos}
                        initialIndex={currentReelIndex}
                        onFocus={handleReelsFocus}
                        onClose={closeFullScreenReel}
                    />
                )}
            </AnimatePresence>
        </main>
    );
}