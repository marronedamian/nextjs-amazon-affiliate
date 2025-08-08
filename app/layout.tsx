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
                {/* Google Tag Manager */}
                <Script
                    id="gtm-script"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-MXD9LTVF');
            `,
                    }}
                />

                {/* Google Analytics (si no lo tenés dentro de GTM) */}
                <Script
                    src="https://www.googletagmanager.com/gtag/js?id=G-FZHM4V16ZF"
                    strategy="afterInteractive"
                />
                <Script
                    id="ga-script"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-FZHM4V16ZF');
            `,
                    }}
                />
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
