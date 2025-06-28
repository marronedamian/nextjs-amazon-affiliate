"use client";

import Image from "next/image";

export default function ChatHeader({ name, avatar, onClose, isTyping }: {
    name: string;
    avatar: string;
    onClose: () => void;
    isTyping: boolean;
}) {
    return (
        <div className="flex items-center justify-between px-4 py-3 md:px-6 border-b border-white/10 bg-white/5">
            <div className="flex items-center gap-3">
                <Image src={avatar} alt={name} width={40} height={40} className="rounded-full object-cover" />
                <div>
                    <h2 className="text-base font-semibold text-white">{name}</h2>
                    {isTyping && <span className="text-sm text-green-400">Typing...</span>}
                </div>
            </div>
            <button
                className="md:hidden cursor-pointer text-white/60 text-sm px-3 py-1 border border-white/20 rounded-full hover:text-white hover:border-white"
                onClick={onClose}
            >
                Close
            </button>
        </div>
    );
}

