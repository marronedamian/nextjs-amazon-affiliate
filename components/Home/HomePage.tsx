"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence, cubicBezier } from "framer-motion";

import StoryCarousel from "@/components/Story/StoryCarousel";
import BottomNav from "@/components/Navigation/BottomNav";
import ReelsFeed from "@/components/Reels/ReelsFeed";
import FullScreenReels from "@/components/Reels/FullScreenReels";
import Feed from "@/components/Feed/FeedContent";
import Background from "@/components/Shared/Background";

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
        <Background>
            <AnimatePresence mode="wait">
                <motion.div
                    key="homeScreen"
                    className="relative z-10 flex flex-col items-center justify-start h-full w-full space-y-4 pb-24"
                    variants={screenVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                >
                    {/* Historias */}
                    <div className="w-full">
                        <StoryCarousel />
                    </div>

                    {/* Feed */}
                    <div className="w-full max-w-xl space-y-6 px-4">
                        <Feed />
                    </div>
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

            {showBottomNav && <BottomNav />}
        </Background>
    );
}
