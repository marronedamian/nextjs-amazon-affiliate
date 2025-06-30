"use client";

import Image from "next/image";
import Link from "next/link";

export default function ChatHeader({
    name,
    avatar,
    username,
    onClose,
    isTyping,
}: {
    name: string;
    avatar: string;
    username: string;
    onClose: () => void;
    isTyping: boolean;
}) {
    return (
        <div className="flex items-center justify-between px-4 py-3 md:px-6 border-b border-white/10 bg-white/5">
            <Link href={`/${username}`} className="flex items-center gap-3 group cursor-pointer">
                <Image
                    src={avatar}
                    alt={name}
                    width={40}
                    height={40}
                    className="rounded-full object-cover group-hover:opacity-90 transition"
                />
                <div>
                    <h2 className="text-base font-semibold text-white group-hover:underline">
                        {name}
                    </h2>
                    {isTyping && <span className="text-sm text-green-400">Typing...</span>}
                </div>
            </Link>
            <button
                className="md:hidden cursor-pointer text-white/60 text-sm px-3 py-1 border border-white/20 rounded-full hover:text-white hover:border-white"
                onClick={onClose}
            >
                Close
            </button>
        </div>
    );
}
