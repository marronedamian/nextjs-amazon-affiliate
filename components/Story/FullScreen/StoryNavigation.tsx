"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
    onPrevious: () => void;
    onNext: () => void;
}

export default function StoryNavigation({ onPrevious, onNext }: Props) {
    const sharedButtonStyle =
        "p-2 rounded-full bg-white/10 hover:bg-white/20 transition text-white backdrop-blur-sm cursor-pointer";

    return (
        <>
            {/* Zona izquierda */}
            <div
                onClick={onPrevious}
                className="absolute inset-y-0 left-0 w-1/3 z-10 flex items-center justify-start group cursor-pointer"
            >
                <div className="w-full h-full flex items-center justify-start px-4 bg-gradient-to-r from-black/25 to-transparent group-hover:from-black/40 transition-all duration-200">
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        whileHover={{ scale: 1.05 }}
                        aria-label="Anterior"
                        className={sharedButtonStyle}
                    >
                        <ChevronLeft size={26} />
                    </motion.button>
                </div>
            </div>

            {/* Zona derecha */}
            <div
                onClick={onNext}
                className="absolute inset-y-0 right-0 w-1/3 z-10 flex items-center justify-end group cursor-pointer"
            >
                <div className="w-full h-full flex items-center justify-end px-4 bg-gradient-to-l from-black/25 to-transparent group-hover:from-black/40 transition-all duration-200">
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        whileHover={{ scale: 1.05 }}
                        aria-label="Siguiente"
                        className={sharedButtonStyle}
                    >
                        <ChevronRight size={26} />
                    </motion.button>
                </div>
            </div>
        </>
    );
}
