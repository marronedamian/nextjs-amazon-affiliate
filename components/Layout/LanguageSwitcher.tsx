"use client";

import { usePathname, useRouter } from "next/navigation";
import { getTranslatedSlug } from "@/utils/getTranslatedSlug";
import { useMemo } from "react";

const languages = ["es", "en"] as const;

export default function LanguageSwitcher() {
    const router = useRouter();
    const pathname = usePathname();

    const segments = useMemo(() => pathname.split("/").filter(Boolean), [pathname]);
    const currentLang = segments[0];
    const isBlog = segments[1] === "blog";
    const slug = segments[2];

    const switchTo = (lang: string) => {
        if (isBlog && slug) {
            const translatedSlug = getTranslatedSlug(slug, currentLang, lang);
            router.push(`/${lang}/blog/${translatedSlug}`);
        } else {
            const restOfPath = segments.slice(1).join("/");
            router.push(`/${lang}/${restOfPath}`);
        }
    };

    return (
        <div className="flex gap-2 px-2 py-1 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 shadow-sm">
            {languages.map((lang) => (
                <button
                    key={lang}
                    aria-label={`Cambiar a ${lang.toUpperCase()}`}
                    onClick={() => switchTo(lang)}
                    className={`cursor-pointer px-3 py-1 rounded-full text-sm font-medium transition-all duration-200
            ${lang === currentLang
                            ? "bg-pink-500/20 text-pink-300 border border-pink-400 shadow-inner"
                            : "text-gray-300 hover:text-white hover:bg-white/10"
                        }`}
                >
                    {lang.toUpperCase()}
                </button>
            ))}
        </div>
    );
}
