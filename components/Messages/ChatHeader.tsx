"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ChatHeader({
    t,
    name,
    avatar,
    username,
    onClose,
    isTyping,
}: {
    t: any;
    name: string;
    avatar: string;
    username: string;
    onClose: () => void;
    isTyping: boolean;
}) {
    return (
        <motion.div
            className="flex items-center justify-between px-4 py-3 md:px-6 border-b border-white/10 bg-white/5"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <Link
                href={`/${username}`}
                className="flex items-center gap-3 group cursor-pointer"
            >
                <motion.div
                    className="relative"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    <Image
                        src={avatar}
                        alt={name}
                        width={40}
                        height={40}
                        className="rounded-full object-cover transition-opacity duration-200 group-hover:opacity-90"
                    />
                </motion.div>

                <div className="flex flex-col">
                    <span className="text-base font-semibold text-white transition group-hover:underline">
                        {name}
                    </span>

                    {isTyping && (
                        <div className="flex items-center h-4 mt-0 space-x-1">
                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce [animation-delay:0ms]" />
                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce [animation-delay:150ms]" />
                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce [animation-delay:300ms]" />
                        </div>
                    )}
                </div>
            </Link>

            <motion.button
                className="md:hidden cursor-pointer text-white/60 text-sm px-3 py-1 border border-white/20 rounded-full hover:text-white hover:border-white active:scale-95 transition-all"
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
            >
                {t("global.close")}
            </motion.button>
        </motion.div>
    );
}
