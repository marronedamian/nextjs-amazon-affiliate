"use client";

import { motion } from "framer-motion";

interface Props {
    total: number;
    current: number;
    progress: number;
}

export default function StoryProgressBar({ total, current, progress }: Props) {
    return (
        <div className="absolute top-4 left-0 right-0 flex space-x-1 px-2">
            {Array.from({ length: total }).map((_, idx) => (
                <motion.div key={idx} className="flex-1 h-1 bg-gray-700 rounded-full">
                    <motion.div
                        className={`h-full ${idx <= current ? "bg-[#f6339a]" : "bg-[#e3e4e8]"} rounded-full`}
                        style={{ width: `${idx === current ? progress : 100}%` }}
                        transition={{ duration: 0.1, ease: "linear" }}
                    />
                </motion.div>
            ))}
        </div>
    );
}
