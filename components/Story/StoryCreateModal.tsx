"use client";

import { useEffect, useRef, useState } from "react";
import { UploadDropzone } from "@uploadthing/react";
import { toast } from "react-hot-toast";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { io } from "socket.io-client";
import { motion } from "framer-motion";
import { Loader2, Globe, SendHorizonal, X, Lock, CheckCircle } from "lucide-react";

interface Props {
    t: any;
    onClose: () => void;
    onStoryCreated?: () => void;
}

export default function StoryCreateModal({ t, onClose, onStoryCreated }: Props) {
    const [description, setDescription] = useState("");
    const [images, setImages] = useState<string[]>([]);
    const [isGlobal, setIsGlobal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const socketRef = useRef<any>(null);

    useEffect(() => {
        if (!socketRef.current) {
            const socket = io({ path: "/api/socket" });
            socketRef.current = socket;
        }
        return () => {
            socketRef.current?.disconnect();
            socketRef.current = null;
        };
    }, []);

    const handleSubmit = async () => {
        if (!description.trim() || images.length === 0) {
            toast.error("Agrega descripción e imágenes");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/stories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ images, description, isGlobal }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data?.message || "Error");

            toast.success(t("stories.published"));
            socketRef.current?.emit("new-story", { storyId: data.storyId });

            onStoryCreated?.();
            onClose();
        } catch (err) {
            console.error(err);
            toast.error("Error al publicar historia");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/70 backdrop-blur-md px-4 py-8">
            <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 40, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl bg-white/5 backdrop-blur-lg p-5 shadow-2xl border border-white/10"
            >
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold text-white">
                        {t("stories.new")}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-white/70 transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <textarea
                    className="mb-0 w-full resize-none rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#f6339a] backdrop-blur-sm"
                    placeholder={t("stories.descriptionPlaceholder")}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                />

                <div className="relative group mb-3">
                    {images.length < 4 ? (
                        <UploadDropzone<OurFileRouter, "storyImageUploader">
                            endpoint="storyImageUploader"
                            onUploadBegin={() => setUploading(true)}
                            onClientUploadComplete={(res) => {
                                const urls = res.map((f) => f.url);
                                setImages((prev) => [...prev, ...urls]);
                                setUploading(false);
                            }}
                            onUploadError={(err) => {
                                toast.error(err.message);
                                setUploading(false);
                            }}
                            appearance={{
                                container:
                                    "w-full h-25 flex items-center justify-center border-2 border-dashed border-white/15 rounded-xl bg-white/5 backdrop-blur-md transition hover:border-[#f6339a] relative cursor-pointer overflow-hidden",
                                label: "hidden",
                                uploadIcon: "hidden",
                                button: "hidden",
                                allowedContent: "hidden",
                            }}
                            config={{ mode: "auto" }}
                        />
                    ) : (
                        <div className="w-full h-25 mt-2 flex items-center justify-center border border-green-400/20 bg-green-500/10 rounded-xl text-green-300 text-sm gap-2">
                            <CheckCircle className="w-4 h-4" /> {t("stories.maxImages")}
                        </div>
                    )}

                    {!uploading && images.length < 4 && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-4">
                            <div className="text-3xl text-[#f6339a] mb-1">📸</div>
                            <p className="text-white/80 text-sm leading-tight">
                                {t("stories.uploadImages")}
                            </p>
                            <p className="text-xs text-white/40 mt-1">
                                ({t("stories.maxImagesCount")})
                            </p>
                        </div>
                    )}

                    {uploading && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-6 h-6 border-2 border-white/30 border-t-[#f6339a] rounded-full animate-spin"></div>
                        </div>
                    )}
                </div>

                {images.length > 0 && (
                    <div className="mt-3 grid grid-cols-4 gap-2">
                        {images.map((url, i) => (
                            <div
                                key={i}
                                className="relative group w-full aspect-square border border-white/10 rounded-xl overflow-hidden shadow-md"
                            >
                                <img
                                    src={url}
                                    alt={`uploaded-${i}`}
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    onClick={() =>
                                        setImages((prev) =>
                                            prev.filter((_, index) => index !== i)
                                        )
                                    }
                                    className="absolute top-1 right-1 bg-black/60 text-white text-xs rounded-full px-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition"
                                    title={t("global.delete") || "Eliminar"}
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-4 flex items-center gap-3 text-sm text-white">
                    <button
                        onClick={() => setIsGlobal(!isGlobal)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm border transition-all duration-200 hover:bg-white/10 cursor-pointer ${isGlobal
                            ? "border-pink-500 bg-pink-500/10"
                            : "border-white/10 bg-white/5"
                            }`}
                    >
                        {isGlobal ? (
                            <Globe className="w-4 h-4" />
                        ) : (
                            <Lock className="w-4 h-4" />
                        )}
                        {t("stories.global") || "Hacer público"}
                    </button>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    {/* Botón Cancelar */}
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={onClose}
                        disabled={loading}
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-white/10 backdrop-blur-2xl border border-white/30 hover:bg-white/20 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {t("global.cancel")}
                    </motion.button>

                    {/* Botón Post con ícono Send */}
                    <motion.button
                        whileTap={{ scale: 0.98 }}
                        whileHover={{ scale: 1.03 }}
                        onClick={handleSubmit}
                        disabled={loading || images.length === 0 || !description.trim()}
                        className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-white/10 backdrop-blur-2xl border border-pink-500 hover:bg-pink-600/30 text-pink-300 hover:text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin text-pink-300" />
                        ) : (
                            <>
                                <SendHorizonal size={18} />
                                {t("stories.post")}
                            </>
                        )}
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
}
