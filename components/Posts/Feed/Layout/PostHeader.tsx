"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { MoreVertical, Trash2 } from "lucide-react";
import * as Tooltip from "@radix-ui/react-tooltip";
import { formatDistanceToNow, format } from "date-fns";
import { es } from "date-fns/locale";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LiquidGlassWrapper from "@/components/Shared/LiquidGlassWrapper";

export default function PostHeader({ t, post, isRepost, originalPost, onDelete }: any) {
    const router = useRouter();
    const { data: session } = useSession();
    const isAuthor = session?.user?.id === post.user.id;
    const formattedTooltipDate = format(new Date(post.createdAt), "PPPPp", { locale: es });

    const [menuOpen, setMenuOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        };

        if (menuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuOpen]);

    const handleDelete = async () => {
        if (isDeleting) return;
        setMenuOpen(false);
        setIsDeleting(true);

        try {
            const res = await fetch(`/api/posts/${post.id}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                const msg = await res.text();
                throw new Error(msg || "Error al eliminar");
            }

            if (onDelete) onDelete(post.id);
        } catch (err) {
            console.error("Error eliminando post:", err);
            alert("Hubo un problema al eliminar el post.");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="flex items-start justify-between px-4 pt-4 pb-2 relative">
            <div className="flex gap-3">
                <div className="relative w-10 h-10 shrink-0">
                    <Tooltip.Provider>
                        <Tooltip.Root>
                            <Tooltip.Trigger asChild>
                                <Link
                                    href={`/${post.user.username}`}
                                    className="cursor-pointer group block w-full h-full"
                                >
                                    <Image
                                        src={post.user.image || "/fallback-avatar.png"}
                                        alt={post.user.name}
                                        fill
                                        className="rounded-full object-cover border border-white group-hover:brightness-110 transition"
                                    />
                                </Link>
                            </Tooltip.Trigger>
                            <Tooltip.Portal>
                                <Tooltip.Content
                                    side="top"
                                    sideOffset={6}
                                    className="bg-black text-white px-2 py-1 rounded text-xs shadow-lg z-[9999]"
                                >
                                    {post.user.name}
                                </Tooltip.Content>
                            </Tooltip.Portal>
                        </Tooltip.Root>
                    </Tooltip.Provider>

                    {isRepost && post.user.id !== originalPost.user.id && (
                        <Tooltip.Provider>
                            <Tooltip.Root>
                                <Tooltip.Trigger asChild>
                                    <Link
                                        href={`/${originalPost.user.username}`}
                                        className="absolute -bottom-2 -right-2 w-7 h-7 cursor-pointer"
                                    >
                                        <Image
                                            src={originalPost.user.image || "/fallback-avatar.png"}
                                            alt={originalPost.user.name}
                                            fill
                                            className="rounded-full object-cover border-2 border-white shadow-md"
                                        />
                                    </Link>
                                </Tooltip.Trigger>
                                <Tooltip.Portal>
                                    <Tooltip.Content
                                        side="top"
                                        sideOffset={6}
                                        className="bg-black text-white px-2 py-1 rounded text-xs shadow-lg z-[9999]"
                                    >
                                        {originalPost.user.name}
                                    </Tooltip.Content>
                                </Tooltip.Portal>
                            </Tooltip.Root>
                        </Tooltip.Provider>
                    )}
                </div>

                <div className="mt-0.5">
                    <Tooltip.Provider>
                        <Tooltip.Root>
                            <Tooltip.Trigger asChild>
                                <Link
                                    href={`/${post.user.username}`}
                                    className="text-white font-semibold text-sm leading-tight hover:underline transition cursor-pointer"
                                >
                                    {post.user.name}
                                </Link>
                            </Tooltip.Trigger>
                            <Tooltip.Portal>
                                <Tooltip.Content
                                    side="top"
                                    sideOffset={6}
                                    className="bg-black text-white px-2 py-1 rounded text-xs shadow-lg z-[9999]"
                                >
                                    {post.user.name}
                                </Tooltip.Content>
                            </Tooltip.Portal>
                        </Tooltip.Root>
                    </Tooltip.Provider>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2 text-xs text-white/50">
                        <Tooltip.Provider>
                            <Tooltip.Root>
                                <Tooltip.Trigger asChild>
                                    <span className="cursor-help">
                                        {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                                    </span>
                                </Tooltip.Trigger>
                                <Tooltip.Portal>
                                    <Tooltip.Content
                                        side="top"
                                        sideOffset={6}
                                        className="bg-black text-white px-2 py-1 rounded text-xs shadow-lg z-[9999]"
                                    >
                                        {formattedTooltipDate}
                                    </Tooltip.Content>
                                </Tooltip.Portal>
                            </Tooltip.Root>
                        </Tooltip.Provider>

                        {isRepost && post.user.id !== originalPost.user.id && (
                            <span className="flex flex-wrap gap-1 text-green-400">
                                <span className="sm:inline hidden">·</span>
                                <span>{t("posts.feed.repostOf")}</span>
                                <Tooltip.Provider>
                                    <Tooltip.Root>
                                        <Tooltip.Trigger asChild>
                                            <Link
                                                href={`/${originalPost.user.username}`}
                                                className="hover:underline transition cursor-pointer"
                                            >
                                                @{originalPost.user.username}
                                            </Link>
                                        </Tooltip.Trigger>
                                        <Tooltip.Portal>
                                            <Tooltip.Content
                                                side="top"
                                                sideOffset={6}
                                                className="bg-black text-white px-2 py-1 rounded text-xs shadow-lg z-[9999]"
                                            >
                                                {originalPost.user.name}
                                            </Tooltip.Content>
                                        </Tooltip.Portal>
                                    </Tooltip.Root>
                                </Tooltip.Provider>
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {isAuthor && (
                <div className="relative">
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        disabled={isDeleting}
                        className="text-white/70 w-6 h-6 mt-1 cursor-pointer hover:text-white transition disabled:opacity-50 flex items-center justify-center"
                    >
                        {isDeleting ? (
                            <svg
                                className="w-4 h-4 animate-spin text-white"
                                viewBox="0 0 24 24"
                                fill="none"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                />
                            </svg>
                        ) : (
                            <MoreVertical size={18} />
                        )}
                    </button>

                    {menuOpen && (
                        <div
                            ref={menuRef}
                            className="absolute top-[30px] right-0 z-[100] w-44 mt-1"
                        >
                            <LiquidGlassWrapper className="w-full border-b border-white/10 shadow-[inset_0_-1px_0_0_rgba(255,255,255,0.1)] transition-all duration-300">
                                <div
                                    onClick={handleDelete}
                                    className="flex items-center gap-2 px-4 py-2 text-sm text-white hover:text-red-200 hover:bg-red-500/10 rounded-2xl cursor-pointer transition"
                                >
                                    {isDeleting ? (
                                        <svg
                                            className="w-4 h-4 animate-spin text-white"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            />
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                            />
                                        </svg>
                                    ) : (
                                        <Trash2 size={16} />
                                    )}
                                    {isDeleting ? t("posts.feed.deleting") : t("posts.feed.deletePost")}
                                </div>
                            </LiquidGlassWrapper>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
