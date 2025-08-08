"use client";

import { useRef, useState, useEffect } from "react";
import { Textarea } from "@/components/Shared/Textarea";
import useClickOutside from "@/hooks/posts/useClickOutside";
import { PostActions } from "./Create/Actions";
import { PostPreview } from "./Create/Preview";
import { Pickers } from "./Create/Pickers";
import { useImageUploader } from "@/hooks/posts/useImageUploader";
import { toast } from "react-toastify";
import { ChevronDownIcon, SearchIcon } from "lucide-react";
import { usePathname } from "next/navigation";

function isUrl(text: string) {
    return /^https?:\/\/[\w.-]+\.[a-z]{2,}(\/\S*)?/i.test(text);
}

function getYouTubeVideoId(url: string): string | null {
    const ytRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/;
    const match = url.match(ytRegex);
    return match ? match[1] : null;
}

function getVimeoVideoId(url: string): string | null {
    const match = url.match(/vimeo\.com\/(\d+)/);
    return match ? match[1] : null;
}

function getTikTokEmbedUrl(url: string): string | null {
    const match = url.match(/tiktok\.com\/(?:@[^\/]+\/video\/(\d+))/);
    return match ? `https://www.tiktok.com/embed/v2/${match[1]}` : null;
}

async function fetchLinkPreview(url: string) {
    try {
        const res = await fetch(`/api/link-preview?url=${encodeURIComponent(url)}`);
        return await res.json();
    } catch (e) {
        return null;
    }
}

export default function CreatePost({ t }: { t: any }) {
    const pathname = usePathname();

    const [imageError, setImageError] = useState<string | null>(null);
    const [rawContent, setRawContent] = useState("");
    const [displayContent, setDisplayContent] = useState("");
    const { uploadImages, isUploading } = useImageUploader();
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showGifPicker, setShowGifPicker] = useState(false);
    const [showMentionSearch, setShowMentionSearch] = useState(false);
    const [selectedGifs, setSelectedGifs] = useState<string[]>([]);
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [mentionIds, setMentionIds] = useState<Set<string>>(new Set());
    const [isPosting, setIsPosting] = useState(false);
    const [mentionQuery, setMentionQuery] = useState("");
    const [caretPos, setCaretPos] = useState(0);
    const [linkPreviews, setLinkPreviews] = useState<Record<string, any>>({});
    const [loadingLinks, setLoadingLinks] = useState<Set<string>>(new Set());
    const [detectedLinks, setDetectedLinks] = useState<Set<string>>(new Set());
    const [playedEmbeds, setPlayedEmbeds] = useState<Set<string>>(new Set());
    const [categories, setCategories] = useState<{ id: string; name: string; emoji: string; label: string }[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const emojiRef = useRef(null);
    const gifRef = useRef(null);
    const mentionRef = useRef(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const locale = pathname?.split("/")[1] || "en";

    useClickOutside(dropdownRef, () => setDropdownOpen(false));
    useClickOutside(emojiRef, () => setShowEmojiPicker(false));
    useClickOutside(gifRef, () => setShowGifPicker(false));
    useClickOutside(mentionRef, () => setShowMentionSearch(false));

    useEffect(() => {
        const fetchCategories = async () => {
            const res = await fetch("/api/categories", {
                headers: { "x-lang": locale },
            });
            const data = await res.json();
            setCategories(data.categories || []);
        };

        fetchCategories();
    }, [locale]);

    useEffect(() => {
        const lastAt = rawContent.lastIndexOf("@", caretPos - 1);
        if (lastAt === -1) {
            setShowMentionSearch(false);
            setMentionQuery("");
            return;
        }
        const textAfterAt = rawContent.slice(lastAt + 1, caretPos);
        if (!/\s/.test(textAfterAt)) {
            setMentionQuery(textAfterAt);
            setShowMentionSearch(true);
        } else {
            setMentionQuery("");
            setShowMentionSearch(false);
        }
    }, [rawContent, caretPos]);

    useEffect(() => {
        const urlRegex = /https?:\/\/[\w.-]+\.[a-z]{2,}(\/\S*)?/gi;
        const links = rawContent.match(urlRegex) || [];

        links.forEach((link) => {
            if (!linkPreviews[link] && !loadingLinks.has(link)) {
                setLoadingLinks((prev) => new Set(prev).add(link));
                fetchLinkPreview(link).then((data) => {
                    setLinkPreviews((prev) => ({ ...prev, [link]: data }));
                    setDetectedLinks((prev) => new Set(prev).add(link));
                    setLoadingLinks((prev) => {
                        const copy = new Set(prev);
                        copy.delete(link);
                        return copy;
                    });
                });
            }
        });

        const cleanedContent = rawContent.replace(urlRegex, "").replace(/\s{2,}/g, " ");
        setDisplayContent(cleanedContent.trimStart());
    }, [rawContent]);

    const handlePost = async () => {
        const links = Array.from(detectedLinks);
        const finalContent = displayContent.trim() + (links.length ? "\n\n" + links.join("\n") : "");

        if (!finalContent.trim() && selectedImages.length === 0 && selectedGifs.length === 0) return;

        try {
            setIsPosting(true);
            const imageUrls = selectedImages.length > 0 ? await uploadImages(selectedImages) : [];
            const gifUrls = selectedGifs;
            const mentionIdsArray = Array.from(mentionIds);

            const res = await fetch("/api/posts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: finalContent, categoryId: selectedCategoryId, imageUrls, gifUrls, mentionIds: mentionIdsArray })
            });

            if (!res.ok) throw new Error("Error al publicar");

            toast.success(t("posts.create.success"));
            setRawContent("");
            setDisplayContent("");
            setSelectedImages([]);
            setSelectedGifs([]);
            setShowEmojiPicker(false);
            setShowGifPicker(false);
            setShowMentionSearch(false);
            setMentionIds(new Set());
            setLinkPreviews({});
            setDetectedLinks(new Set());
            setPlayedEmbeds(new Set());
        } catch (err) {
            console.error(err);
            toast.error("No se pudo publicar");
        } finally {
            setIsPosting(false);
        }
    };

    return (
        <div className="w-full h-full">
            <div className="w-full h-full px-4 py-4 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-md space-y-5">
                <div className="flex items-start gap-4">
                    <div className="flex-1 relative">
                        <Textarea
                            ref={textareaRef}
                            value={displayContent}
                            onChange={(e) => {
                                setRawContent(e.target.value);
                                setCaretPos(e.target.selectionStart || 0);
                            }}
                            placeholder={t("posts.create.placeholder")}
                            inputMode="text"
                            autoComplete="off"
                            className="bg-transparent text-white border-none resize-none focus:ring-0 text-base placeholder-white/40"
                        />

                        <div className="mb-4 relative" ref={dropdownRef}>
                            {/*<label className="block text-white/70 text-sm mb-1">
                                {t("categories.title")}
                            </label>*/}

                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="w-full flex items-center justify-between gap-2 bg-white/1 text-white rounded-lg px-2 py-2 border border-0 backdrop-blur placeholder-white/40 hover:bg-white/15 transition-colors cursor-pointer"
                            >
                                <div className="flex items-center gap-2 truncate">
                                    {selectedCategoryId ? (
                                        <>
                                            <span className="text-lg">
                                                {categories.find((c: any) => c.id === selectedCategoryId)?.emoji}
                                            </span>
                                            <span>
                                                {categories.find((c: any) => c.id === selectedCategoryId)?.label}
                                            </span>
                                        </>
                                    ) : (
                                        <span className={`flex items-center px-0 py-0.5 cursor-pointer text-white/60 transition-colors`}>
                                            <SearchIcon className="size-6 pr-1" />
                                            {t("categories.select")}
                                        </span>
                                    )}
                                </div>
                                <ChevronDownIcon
                                    size={16}
                                    className={`text-white/60 transition-transform ${dropdownOpen ? "rotate-180" : ""
                                        }`}
                                />
                            </button>

                            {dropdownOpen && (
                                <div className="absolute z-20 w-full mt-1 bg-[#0E0E0E] border border-white/10 rounded-lg shadow-lg overflow-hidden">
                                    <div className="max-h-60 overflow-y-auto custom-scrollbar">
                                        <div
                                            className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-white/10 transition-colors text-white/60 hover:text-white ${!selectedCategoryId ? "bg-[#F5339A]/10 text-[#F5339A]" : ""
                                                }`}
                                            onClick={() => {
                                                setSelectedCategoryId(null);
                                                setDropdownOpen(false);
                                            }}
                                        >
                                            <span className="text-lg">❌</span>
                                            <span className="truncate">{t("categories.emptyCategory")}</span>
                                        </div>

                                        {categories.map((cat) => (
                                            <div
                                                key={cat.id}
                                                className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-white/10 transition-colors ${selectedCategoryId === cat.id
                                                    ? "bg-[#F5339A]/10 text-[#F5339A]"
                                                    : "text-white/80"
                                                    }`}
                                                onClick={() => {
                                                    setSelectedCategoryId(cat.id);
                                                    setDropdownOpen(false);
                                                }}
                                            >
                                                <span className="text-lg">{cat.emoji}</span>
                                                <span className="truncate">{cat.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <PostActions
                            t={t}
                            fileInputRef={fileInputRef}
                            content={rawContent}
                            onPost={handlePost}
                            isPosting={isPosting || isUploading}
                            setShowEmojiPicker={setShowEmojiPicker}
                            setShowGifPicker={setShowGifPicker}
                            handleMentionToggle={() => setShowMentionSearch(prev => !prev)}
                            selectedImages={selectedImages}
                            selectedGifs={selectedGifs}
                            handleImageUpload={(e: any) => {
                                if (!e.target.files) return;

                                const files = Array.from(e.target.files);

                                const oversized = files.filter((f: any) => f.size > 4 * 1024 * 1024);
                                if (oversized.length > 0) {
                                    setImageError(t("posts.create.imageSizeError"));
                                    return;
                                }

                                if (selectedImages.length + files.length > 4) {
                                    setImageError(t("posts.create.imageLimitError"));
                                    return;
                                }

                                setSelectedImages((prev: any) => [...prev, ...files]);
                                setImageError(null);
                            }}
                        />

                        {imageError && (
                            <div className="relative w-full bg-white/5 border border-[#f6339a]/40 rounded-xl backdrop-blur-md mb-4 overflow-hidden px-4 py-3 mt-3">
                                <div className="flex flex-col items-center justify-center text-center relative">
                                    <p className="text-white/80 text-sm leading-snug">{imageError}</p>
                                </div>
                                <button
                                    onClick={() => setImageError(null)}
                                    className="absolute top-2 right-2 text-white/60 hover:text-white text-xs cursor-pointer"
                                >
                                    ✖
                                </button>
                            </div>
                        )}

                        <Pickers
                            showEmojiPicker={showEmojiPicker}
                            showGifPicker={showGifPicker}
                            showMentionSearch={showMentionSearch}
                            emojiRef={emojiRef}
                            gifRef={gifRef}
                            mentionRef={mentionRef}
                            onEmojiClick={(emoji: any) => setRawContent(prev => prev + emoji.emoji)}
                            onGifSelect={(gifUrl: any) => {
                                setSelectedGifs(prev => [...prev, gifUrl]);
                                setShowGifPicker(false);
                            }}
                            mentionQuery={mentionQuery}
                            onMentionSelect={(mention: any) => {
                                const lastAt = rawContent.lastIndexOf("@", caretPos - 1);
                                const before = rawContent.slice(0, lastAt);
                                const after = rawContent.slice(caretPos);
                                const inserted = `@${mention.username} `;
                                const updated = `${before}${inserted}${after}`;
                                setRawContent(updated);
                                setMentionIds(prev => new Set(prev).add(mention.id));
                                setShowMentionSearch(false);
                                setTimeout(() => {
                                    const pos = before.length + inserted.length;
                                    textareaRef.current?.focus();
                                    textareaRef.current?.setSelectionRange(pos, pos);
                                    setCaretPos(pos);
                                }, 0);
                            }}
                            onCloseGif={() => setShowGifPicker(false)}
                        />

                        <PostPreview
                            selectedImages={selectedImages}
                            selectedGifs={selectedGifs}
                            removeImage={(index) => setSelectedImages(prev => prev.filter((_, i) => i !== index))}
                            removeGif={(index) => setSelectedGifs(prev => prev.filter((_, i) => i !== index))}
                        />

                        {Array.from(detectedLinks).map((url) => {
                            const data = linkPreviews[url];
                            const yt = getYouTubeVideoId(url);
                            const vimeo = getVimeoVideoId(url);
                            const tiktok = getTikTokEmbedUrl(url);
                            const isPlayed = playedEmbeds.has(url);

                            return (
                                <div key={url} className="relative rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-4 w-full mt-4">
                                    <button
                                        onClick={() => {
                                            setLinkPreviews(prev => { const copy = { ...prev }; delete copy[url]; return copy; });
                                            setDetectedLinks(prev => { const copy = new Set(prev); copy.delete(url); return copy; });
                                            setPlayedEmbeds(prev => { const copy = new Set(prev); copy.delete(url); return copy; });
                                        }}
                                        className="absolute top-2 right-2 text-white text-xs bg-black/50 px-2 py-1 rounded cursor-pointer"
                                    >✕</button>

                                    {yt ? (
                                        isPlayed ? (
                                            <iframe
                                                src={`https://www.youtube.com/embed/${yt}?autoplay=1`}
                                                className="w-full aspect-video rounded-xl"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            ></iframe>
                                        ) : (
                                            <div
                                                className="relative w-full aspect-video cursor-pointer"
                                                onClick={() => setPlayedEmbeds(prev => new Set(prev).add(url))}
                                            >
                                                <img
                                                    src={`https://img.youtube.com/vi/${yt}/hqdefault.jpg`}
                                                    className="w-full h-full object-cover rounded-xl"
                                                    alt="YouTube thumbnail"
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                                    <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M8 5v14l11-7z" />
                                                    </svg>
                                                </div>
                                            </div>
                                        )
                                    ) : vimeo ? (
                                        <iframe
                                            src={`https://player.vimeo.com/video/${vimeo}`}
                                            className="w-full aspect-video rounded-xl"
                                            frameBorder="0"
                                            allow="autoplay; fullscreen; picture-in-picture"
                                            allowFullScreen
                                        ></iframe>
                                    ) : tiktok ? (
                                        <iframe
                                            src={tiktok}
                                            className="w-full aspect-[9/16] rounded-xl"
                                            allow="autoplay; encrypted-media"
                                            allowFullScreen
                                        ></iframe>
                                    ) : (
                                        <>
                                            {data?.image && (
                                                <img src={data.image} alt={data.title} className="w-full h-48 object-cover rounded mb-3" />
                                            )}
                                            <div className="text-white font-semibold text-sm mb-1">{data?.title}</div>
                                            <div className="text-white/70 text-xs">{data?.description}</div>
                                        </>
                                    )}
                                </div>
                            );
                        })}

                        {Array.from(loadingLinks).map((url) => (
                            <div key={url} className="w-full mt-4 p-4 text-white text-sm bg-white/5 rounded-xl border border-white/10">
                                {t("posts.create.loadingLink")}
                            </div>
                        ))}

                    </div>
                </div>
            </div>
        </div>
    );
}
