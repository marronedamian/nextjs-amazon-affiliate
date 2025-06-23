"use client";

import { motion } from "framer-motion";

export default function MessageBubble({ text, time, from }: { text: string; time: string; from: string }) {
    return (
        <div className={`flex ${from === "You" ? "justify-end" : "justify-start"}`}>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`max-w-xs px-4 py-2 rounded-2xl text-sm shadow-md ${from === "You" ? "bg-pink-500/20 text-white" : "bg-white/10 text-white"}`}
            >
                <p>{text}</p>
                <span className="text-xs text-white/40 block mt-1 text-right">{time}</span>
            </motion.div>
        </div>
    );
}
