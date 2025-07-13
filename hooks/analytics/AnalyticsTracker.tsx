"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

declare global {
    interface Window {
        gtag?: (...args: any[]) => void;
        dataLayer?: any[];
    }
}

export function AnalyticsTracker() {
    const pathname = usePathname();

    useEffect(() => {
        // Para Google Analytics 4
        if (typeof window !== "undefined" && window.gtag) {
            window.gtag("config", "G-FZHM4V16ZF", {
                page_path: pathname,
            });
        }

        // Para Google Tag Manager
        if (typeof window !== "undefined" && window.dataLayer) {
            window.dataLayer.push({
                event: "pageview",
                page: pathname,
            });
        }
    }, [pathname]);

    return null;
}
