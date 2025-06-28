"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import LanguageSwitcher from "./LanguageSwitcher";
import LiquidGlassWrapper from "@/components/Shared/LiquidGlassWrapper";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Header() {
    const { t } = useTranslation("common");
    const { data: session } = useSession();
    const [menuOpen, setMenuOpen] = useState(false);
    const avatarBtnRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const pathname = usePathname();
    const currentLang = pathname?.split("/")[1];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                !menuRef.current?.contains(event.target as Node) &&
                !avatarBtnRef.current?.contains(event.target as Node)
            ) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="fixed top-0 left-0 w-full z-50">
            <LiquidGlassWrapper
                rounded={false}
                className="w-full border-b border-white/10 shadow-[inset_0_-1px_0_0_rgba(255,255,255,0.1)] transition-all duration-300"
            >
                <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between relative">
                    {/* Logo */}
                    <Link
                        href={`/${currentLang}`}
                        className="group text-xl md:text-2xl font-bold text-white tracking-tight"
                    >
                        <span className="group-hover:text-pink-400 transition-colors">
                            <span className="text-pink-500">Amazon</span> Affiliate
                        </span>
                    </Link>

                    {/* Idioma y sesión */}
                    <div className="flex items-center gap-4 relative">
                        <LanguageSwitcher />

                        {session?.user ? (
                            <>
                                {/* Avatar */}
                                <button
                                    ref={avatarBtnRef}
                                    onClick={() => setMenuOpen(!menuOpen)}
                                    className="cursor-pointer"
                                >
                                    <div className="relative w-9 h-9 rounded-full p-[2px] bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 shadow-md hover:scale-105 transition-transform">
                                        <div className="w-full h-full rounded-full overflow-hidden bg-black">
                                            <Image
                                                src={session.user.image ?? "/default-avatar.png"}
                                                alt="Avatar"
                                                width={36}
                                                height={36}
                                                className="object-cover w-full h-full"
                                                unoptimized
                                            />
                                        </div>
                                    </div>
                                </button>

                                {/* Menú debajo del avatar */}
                                {menuOpen && (
                                    <div
                                        ref={menuRef}
                                        className="absolute top-[52px] right-0 z-[100] w-44 mt-1"
                                    >
                                        <LiquidGlassWrapper className="w-full border-b border-white/10 shadow-[inset_0_-1px_0_0_rgba(255,255,255,0.1)] transition-all duration-300">
                                            <Link
                                                href={`/${currentLang}/${session.user.username}`}
                                                className="flex items-center gap-2 px-4 py-2 text-sm text-white cursor-pointer transition"
                                                onClick={() => setMenuOpen(false)}
                                            >
                                                {t("header.profile")}
                                            </Link>
                                            <div
                                                onClick={() => {
                                                    setMenuOpen(false);
                                                    signOut({ callbackUrl: "/" });
                                                }}
                                                className="flex items-center gap-2 px-4 py-2 text-sm text-red-300 cursor-pointer transition"
                                            >
                                                {t("header.signOut")}
                                            </div>
                                        </LiquidGlassWrapper>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="bg-white/5 backdrop-blur-sm rounded-full border border-white/10 shadow-sm">
                                <button
                                    onClick={() => signIn("google")}
                                    className="cursor-pointer px-5 py-2 rounded-full text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                                >
                                    {t("header.signIn")}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </LiquidGlassWrapper>
        </header >
    );
}
