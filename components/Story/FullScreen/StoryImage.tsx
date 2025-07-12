"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface Props {
    url: string;
    alt: string;
    description?: string;
    onLoad: () => void;
    loading: boolean;
}

export default function StoryImage({ url, alt, description, onLoad, loading }: Props) {
    return (
        <>
            {/* Loading spinner */}
            {loading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60">
                    <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                </div>
            )}

            {/* Image with fade-in effect */}
            <motion.div
                className="absolute inset-0 z-0"
                initial={{ opacity: 0.3 }}
                animate={{ opacity: loading ? 0.3 : 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
            >
                <Image
                    src={url}
                    alt={alt}
                    fill
                    priority
                    onLoadingComplete={onLoad}
                    className="object-cover rounded-tl-2xl rounded-tr-2xl"
                />
            </motion.div>

            {/* Description overlay */}
            {description && (
                <div className="absolute bottom-0 left-0 right-0 z-20 px-4 py-3 text-sm text-white bg-gradient-to-t from-black/70 via-black/40 to-transparent">
                    {description}
                </div>
            )}
        </>
    );
}
