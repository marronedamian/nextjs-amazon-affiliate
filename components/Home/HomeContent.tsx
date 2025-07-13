"use client";

import { useSession } from "next-auth/react";
import LandingPage from "@/components/Home/LandingPage";
import HomePage from "@/components/Home/HomePage";

export default function HomeContent({ lang }: { lang: string }) {
    const { status } = useSession();

    if (status === "loading") return null;

    return <HomePage lang={lang} />;

    /*
        return status === "authenticated" ? (
            <HomePage lang={lang} />
        ) : (
            <LandingPage lang={lang} />
        );
    */
}