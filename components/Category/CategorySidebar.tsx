"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    UserIcon,
    TagIcon,
    MenuIcon,
    XIcon,
} from "lucide-react";

type Category = {
    id: string;
    emoji: string;
    label: string;
    query: string;
    notifications?: number;
};

export default function CategorySidebar({ t }: { t: any }) {
    const [collapsed, setCollapsed] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isScrolling, setIsScrolling] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const locale = pathname?.split("/")[1] || "en";
    const router = useRouter();
    const searchParams = useSearchParams();
    const selectedCategory = searchParams?.get("category");

    const selectedCategoryRaw = selectedCategory || "";
    const normalizedSelected = selectedCategoryRaw.replace(/\s+/g, "+");

    // Cerrar menú móvil al cambiar ruta
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname, searchParams]);

    useEffect(() => {
        if (!isScrolling) return;

        const timeout = setTimeout(() => setIsScrolling(false), 1000);
        return () => clearTimeout(timeout);
    }, [isScrolling]);

    useEffect(() => {
        fetch("/api/categories", {
            headers: {
                "x-lang": locale,
            },
        })
            .then((res) => res.json())
            .then((data) => setCategories(data.categories || []))
            .catch((err) => console.error("Failed to fetch categories", err));
    }, [locale]);

    // Botón de hamburguesa para móviles
    const MobileToggleButton = () => (
        <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={clsx(
                "fixed top-3 left-4 z-50 lg:hidden",
                "w-10 h-10 rounded-full shadow-xl border border-[#F5339A]",
                "bg-[#F5339A]/10 text-[#F5339A] hover:bg-[#F5339A]/20 hover:text-white",
                "flex items-center justify-center transition-all duration-300 cursor-pointer"
            )}
        >
            {mobileMenuOpen ? <XIcon size={20} /> : <MenuIcon size={20} />}
        </button>
    );

    // Contenido del menú (compartido entre móvil y desktop)
    const MenuContent = ({ isMobile = false }: { isMobile?: boolean }) => (
        <>
            {/* Botón flotante de minimizar (solo desktop) */}
            {!isMobile && (
                <div className="absolute top-1/2 right-[-18px] transform -translate-y-1/2 z-10">
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className={clsx(
                            "w-9 h-9 rounded-full shadow-xl border border-[#F5339A]",
                            "bg-[#F5339A]/10 text-[#F5339A] hover:bg-[#F5339A]/20 hover:text-white",
                            "flex items-center justify-center transition-all duration-300 cursor-pointer"
                        )}
                    >
                        {collapsed ? <ChevronRightIcon size={18} /> : <ChevronLeftIcon size={18} />}
                    </button>
                </div>
            )}

            {/* Info de usuario */}
            {!collapsed && (<>{/*
                <div className="flex items-center gap-1 px-3 py-3 mb-3 border-b border-white/10">
                    <div className="bg-gray-600 rounded-full p-2">
                        <UserIcon size={20} className="text-white" />
                    </div>
                    <div>
                        <p className="text-white font-medium">Bienvenido</p>
                        <p className="text-white/50 text-xs">Explorá las categorías</p>
                    </div>
                </div>
            */}</>)}

            {/* Categorías */}
            <div
                onScroll={() => setIsScrolling(true)}
                className={clsx(
                    "flex-1 pr-1 overflow-y-auto transition-all duration-300 custom-scrollbar",
                    collapsed && !isMobile ? "" : "px-1",
                    isScrolling ? "scroll-visible" : "scroll-hidden"
                )}
            >
                {(!collapsed || isMobile) && (
                    <h2 className="text-white/50 text-xs font-semibold tracking-wide px-2 mb-2 uppercase">
                        {t("categories.title")}
                    </h2>
                )}
                <nav className="flex flex-col gap-2 px-[2px]">
                    {categories.map((cat) => {
                        const isActive = normalizedSelected === cat.query;

                        // clonar params actuales
                        const baseParams = new URLSearchParams(searchParams?.toString() || "");

                        // toggle de la query "category", preservando el resto
                        const nextParams = new URLSearchParams(baseParams);
                        if (isActive) {
                            nextParams.delete("category");
                        } else {
                            nextParams.set("category", cat.query);
                        }

                        // construir href final
                        const href = nextParams.toString()
                            ? `/${locale}?${nextParams.toString()}`
                            : `/${locale}`;

                        const hasBadge = 1; // cat.notifications && cat.notifications > 0;

                        return (
                            <div key={cat.id} className={clsx(
                                "relative",
                                "rounded-full",
                                isActive && "bg-[#F5339A]/30 border-[#F5339A] border",
                            )}>
                                <Link
                                    href={href}
                                    replace
                                    scroll={false}
                                    className={clsx(
                                        "inline-flex items-center gap-3",
                                        "w-full rounded-full text-sm font-semibold transition-all duration-300 ease-in-out",
                                        "border border-transparent backdrop-blur-md bg-white/5 text-white px-4 py-2",
                                        "hover:bg-[#F5339A]/20 hover:text-white hover:border-[#F5339A] hover:backdrop-blur-md hover:scale-[1.01]",
                                        "active:scale-[0.96] focus:outline-none focus:ring-2 focus:ring-[#F5339A]/40",
                                        "disabled:opacity-50 disabled:cursor-not-allowed",
                                        "shadow-none",
                                        isActive && "bg-[#F5339A]/30 border-[#F5339A]",
                                        collapsed && !isMobile && "justify-center p-3 px-0"
                                    )}
                                    title={(collapsed && !isMobile) ? cat.label : ""}
                                >
                                    <span className="text-xl" aria-hidden="true">
                                        {cat.emoji ? cat.emoji : <TagIcon size={18} />}
                                    </span>
                                    {(!collapsed || isMobile) && <span className="truncate">{cat.label}</span>}
                                    {/*!collapsed && hasBadge && (
                                        <span className="ml-auto text-[10px] bg-[#F5339A] text-white px-1.5 h-4 min-w-[1.1rem] rounded-full flex items-center justify-center animate-pulse">
                                        {1 > 9 ? "9+" : 1}
                                        </span>
                                    )*/}
                                </Link>

                                {/* Badge visible en modo colapsado */}
                                {/*collapsed && hasBadge && (
                                    <div className="absolute top-0 right-3 w-4 h-4 rounded-full bg-[#F5339A] text-white text-[10px] flex items-center justify-center font-bold animate-pulse shadow-md">
                                        {1 > 9 ? "9+" : 1}
                                    </div>
                                )*/}
                            </div>
                        );
                    })}
                </nav>
            </div>

            {/* Scroll custom */}
            <style jsx>{`
                .custom-scrollbar {
                    scrollbar-gutter: stable; 
                    scrollbar-width: thin;
                }

                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }

                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }

                .custom-scrollbar::-webkit-scrollbar-thumb {
                    border-radius: 9999px;
                    background-color: #f5339a66;
                    transition: opacity 0.3s ease;
                    opacity: 0;
                }

                .scroll-visible::-webkit-scrollbar-thumb {
                    opacity: 1;
                }

                .scroll-hidden::-webkit-scrollbar-thumb {
                    opacity: 0;
                }

                .scroll-hidden {
                    scrollbar-color: transparent transparent; /* Firefox */
                }

                .scroll-visible {
                    scrollbar-color: #f5339a66 transparent; /* Firefox */
                }
            `}</style>
        </>
    );

    return (
        <>
            {/* Botón de hamburguesa para móviles */}
            <MobileToggleButton />

            {/* Versión de escritorio (oculta en móviles) */}
            <aside
                className={clsx(
                    "sticky top-0 hidden lg:flex flex-col h-screen z-49 px-2 py-4 transition-all duration-300",
                    "bg-[#0E0E0E] border-r border-white/10 shadow-inner backdrop-blur-md mt-15",
                    collapsed ? "w-[96px]" : "w-[260px]"
                )}
            >
                <MenuContent />
            </aside>

            {/* Versión móvil (overlay) */}
            <div
                className={clsx(
                    "fixed inset-0 z-40 lg:hidden transition-all duration-300",
                    mobileMenuOpen
                        ? "opacity-100 pointer-events-auto"
                        : "opacity-0 pointer-events-none"
                )}
            >
                {/* Fondo oscuro */}
                <div
                    className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                    onClick={() => setMobileMenuOpen(false)}
                />

                {/* Menú deslizable */}
                <div
                    className={clsx(
                        "absolute top-0 left-0 h-full w-[260px] bg-[#0E0E0E] border-r border-white/10 shadow-inner backdrop-blur-md py-4 transition-transform duration-300",
                        mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                    )}
                >
                    <MenuContent isMobile={true} />
                </div>
            </div>
        </>
    );
}