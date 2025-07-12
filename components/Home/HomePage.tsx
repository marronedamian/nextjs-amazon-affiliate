"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence, cubicBezier } from "framer-motion";
import { useTranslation } from "react-i18next";

import useSessionTracker from "@/hooks/auth/useSessionTracker";
import StoryCarousel from "@/components/Story/StoryCarousel";
import Feed from "@/components/Feed/FeedContent";
import Background from "@/components/Shared/Background";

export default function HomePage({ lang }: { lang: string }) {
    const { t } = useTranslation("common");
    const { data: session, status } = useSession();
    const router = useRouter();

    useSessionTracker();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push(`/${lang}/auth/login`);
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
                        <StoryCarousel t={t} />
                    </div>

                    {/* Feed */}
                    <div className="w-full">
                        <Feed t={t} />
                    </div>
                </motion.div>
            </AnimatePresence>
        </Background>
    );
}
