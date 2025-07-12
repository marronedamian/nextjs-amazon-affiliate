"use client";

import { useState, useEffect, useRef } from "react";
import { User, Search } from "lucide-react";
import useClickOutside from "@/hooks/posts/useClickOutside";
import { useTranslation } from "next-i18next";

interface MentionUser {
    id: string;
    name: string;
    username: string;
    image: string | null;
}

export default function MentionSearch({
    onSelect,
    onClose,
    initialQuery = "",
}: {
    onSelect: (user: MentionUser) => void;
    onClose?: () => void;
    initialQuery?: string;
}) {
    const { t } = useTranslation("common");
    const [query, setQuery] = useState(initialQuery);
    const [users, setUsers] = useState<MentionUser[]>([]);
    const [loading, setLoading] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const containerRef = useRef(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useClickOutside(containerRef, () => onClose?.());

    // Focus al input al abrir
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    // Buscar usuarios al cambiar el query
    useEffect(() => {
        const load = async () => {
            if (!query.trim()) {
                setUsers([]);
                return;
            }

            setLoading(true);
            try {
                const res = await fetch(`/api/users/search?query=${encodeURIComponent(query)}`);
                const data = await res.json();

                if (Array.isArray(data)) {
                    setUsers(data);
                    setHighlightedIndex(0);
                } else {
                    console.error("Expected array but got:", data);
                    setUsers([]);
                }
            } catch (e) {
                console.error("Error loading mention users", e);
                setUsers([]);
            } finally {
                setLoading(false);
            }
        };

        const timeout = setTimeout(load, 250);
        return () => clearTimeout(timeout);
    }, [query]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setHighlightedIndex((prev) => (prev + 1) % users.length);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlightedIndex((prev) => (prev - 1 + users.length) % users.length);
        } else if (e.key === "Enter" && users[highlightedIndex]) {
            e.preventDefault();
            onSelect(users[highlightedIndex]);
        } else if (e.key === "Escape") {
            onClose?.();
        }
    };

    return (
        <div
            ref={containerRef}
            className="absolute top-full z-[9999] w-75 max-h-[420px] bg-[#222222]/100 border border-[#151616]/100 rounded-2xl shadow-lg backdrop-blur-xl p-4 overflow-hidden left-0 sm:w-[90vw] sm:max-w-sm"
        >
            <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 w-4 h-4 pointer-events-none" />
                <input
                    ref={inputRef}
                    type="text"
                    placeholder={t("posts.create.searchUsers")}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full pl-9 pr-4 py-2 text-sm text-white bg-white/10 placeholder-white/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f6339a] hover:bg-white/20 transition"
                />
            </div>

            {loading ? (
                <div className="flex justify-center py-6 text-white/60 text-sm">{t("global.loading")}</div>
            ) : users.length === 0 ? (
                <div className="text-white/50 text-sm text-center py-6">{t("global.noUsersFound")}</div>
            ) : (
                <div className="space-y-2 overflow-y-auto pr-1 max-h-[280px] scrollbar-thin scrollbar-thumb-white/10 scrollbar-thumb-rounded-full">
                    {users.map((u, index) => (
                        <div
                            key={u.id}
                            onClick={() => onSelect(u)}
                            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ${highlightedIndex === index ? "bg-white/10" : "hover:bg-white/5"
                                }`}
                        >
                            {u.image ? (
                                <img src={u.image} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                            ) : (
                                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-white/40">
                                    <User className="w-4 h-4" />
                                </div>
                            )}
                            <div className="text-white">
                                <div className="font-semibold text-sm">{u.name}</div>
                                <div className="text-xs text-white/50">@{u.username}</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
