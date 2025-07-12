"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { X } from "lucide-react";

interface Props {
    name: string;
    username: string;
    avatarUrl: string;
    createdAt: Date | string;
    onClose: () => void;
}

function getRelativeTime(date: Date | string): string {
    const now = new Date().getTime();
    const created = new Date(date).getTime();
    const diff = Math.floor((now - created) / 1000);

    if (diff < 60) return `${diff}s`;
    if (diff < 3600) return `${Math.floor(diff / 60)}min`;
    return `${Math.floor(diff / 3600)}h`;
}

export default function StoryHeader({
    name,
    username,
    avatarUrl,
    createdAt,
    onClose,
}: Props) {
    const router = useRouter();
    const relativeTime = getRelativeTime(createdAt);

    return (
        <div className="absolute top-12 left-0 right-0 flex items-center justify-between px-4 z-20">
            {/* Avatar + nombre + tiempo */}
            <div
                onClick={() => router.push(`/${username}`)}
                className="flex items-center space-x-2 cursor-pointer group"
            >
                <div className="w-10 h-10 rounded-full overflow-hidden">
                    <Image
                        src={avatarUrl}
                        alt={name}
                        width={40}
                        height={40}
                        className="object-cover h-full"
                    />
                </div>
                <div className="flex flex-col leading-4">
                    <span className="text-white font-semibold">{name}</span>
                    <motion.span
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-gray-300 text-xs"
                    >
                        {relativeTime}
                    </motion.span>
                </div>
            </div>

            {/* Botón de cerrar */}
            <motion.button
                onClick={onClose}
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
                aria-label="Cerrar"
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition text-white backdrop-blur-sm cursor-pointer z-30"
            >
                <X size={22} className="cursor-pointer" />
            </motion.button>
        </div>
    );
}
