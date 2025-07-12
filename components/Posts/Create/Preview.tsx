"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";

export function PostPreview({
    selectedImages,
    selectedGifs,
    removeImage,
    removeGif,
}: {
    selectedImages: File[];
    selectedGifs: string[];
    removeImage: (idx: number) => void;
    removeGif: (idx: number) => void;
}) {
    if (selectedImages.length === 0 && selectedGifs.length === 0) return null;

    return (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mt-4">
            {selectedImages.map((img, idx) => (
                <div key={idx} className="relative w-full aspect-square">
                    <motion.img
                        src={URL.createObjectURL(img)}
                        alt="preview"
                        className="w-full h-full rounded-lg object-cover border border-white/10 hover:brightness-110 transition cursor-pointer"
                        whileHover={{ scale: 1.05 }}
                    />
                    <button
                        className="absolute top-1 right-1 bg-black/70 hover:bg-black text-white rounded-full p-1 cursor-pointer"
                        onClick={() => removeImage(idx)}
                    >
                        <X size={12} />
                    </button>
                </div>
            ))}
            {selectedGifs.map((gif, idx) => (
                <div key={idx} className="relative w-full aspect-square">
                    <motion.img
                        src={gif}
                        alt="gif"
                        className="w-full h-full rounded-lg object-cover border border-white/10 hover:brightness-110 transition cursor-pointer"
                        whileHover={{ scale: 1.05 }}
                    />
                    <button
                        className="absolute top-1 right-1 bg-black/70 hover:bg-black text-white rounded-full p-1 cursor-pointer"
                        onClick={() => removeGif(idx)}
                    >
                        <X size={12} />
                    </button>
                </div>
            ))}
        </div>
    );
}
