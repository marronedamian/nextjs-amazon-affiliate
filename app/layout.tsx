import { ReactNode } from "react";
import "@/app/globals.css";
import GlassFilterDefinitions from "@/components/Shared/GlassFilterDefinitions";
import { Session } from "@/providers/session";

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <body>
                <GlassFilterDefinitions />
                <Session>
                    {children}
                </Session>
            </body>
        </html>
    );
}
