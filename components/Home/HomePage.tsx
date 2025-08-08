"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence, cubicBezier } from "framer-motion";
import { useTranslation } from "react-i18next";

import useSessionTracker from "@/hooks/auth/useSessionTracker";
import StoryCarousel from "@/components/Story/StoryCarousel";
import Feed from "@/components/Feed/FeedContent";
import CategorySidebar from "@/components/Category/CategorySidebar";
import Background from "@/components/Shared/Background";

export default function HomePage({ lang }: { lang: string }) {
    const { t } = useTranslation("common");
    const { data: session, status } = useSession();
    const router = useRouter();

    useSessionTracker();

    useEffect(() => {
        if (status === "unauthenticated") {
            // router.push(`/${lang}/auth/login`);
        }
    }, [status, lang, router]);

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

    return (
        <Background>
            <div className="flex w-full min-h-screen">
                {/* Sidebar */}
                <CategorySidebar t={t} />

                {/* Main content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key="homeScreen"
                        className="flex-1 flex flex-col items-center justify-start h-full w-full space-y-4 pb-24 px-4"
                        variants={screenVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                    >
                        <div className="w-full">
                            <StoryCarousel t={t} />
                        </div>

                        <div className="w-full">
                            <Feed t={t} />
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </Background>
    );
}
