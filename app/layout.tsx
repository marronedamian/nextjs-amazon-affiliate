import { ReactNode } from "react";
import "@/app/globals.css";
import GlassFilterDefinitions from "@/components/Shared/GlassFilterDefinitions";
import { Session } from "@/providers/session";
import Script from "next/script";
import { AnalyticsTracker } from "@/hooks/analytics/AnalyticsTracker";

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <head>
               
            </head>
            <body>
                {/* GTM fallback para usuarios sin JS */}
                <noscript>
                    <iframe
                        src="https://www.googletagmanager.com/ns.html?id=GTM-MXD9LTVF"
                        height="0"
                        width="0"
                        style={{ display: "none", visibility: "hidden" }}
                    />
                </noscript>

                <GlassFilterDefinitions />
                <Session>
                    <AnalyticsTracker />
                    {children}
                </Session>
            </body>
        </html>
    );
}
