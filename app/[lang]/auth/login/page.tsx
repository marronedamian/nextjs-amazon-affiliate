"use client";

import { useTranslation } from "react-i18next";
import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LiquidGlassWrapper from "@/components/Shared/LiquidGlassWrapper";

export default function LoginPage() {
    const { t } = useTranslation("common");
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "authenticated") {
            router.replace("/");
        }
    }, [status, router]);

    if (status === "loading") return null;

    return (
        <main className="relative min-h-screen bg-gradient-radial from-[#1a1a1d] via-[#111114] to-[#0a0a0a] text-white font-sans overflow-hidden">
            {/* Blobs de fondo */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute top-1/3 left-[-10%] w-[400px] h-[400px] bg-pink-500 opacity-20 rounded-full blur-[200px] animate-pulse-slow" />
                <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-purple-500 opacity-20 rounded-full blur-[180px] animate-pulse-slow delay-700" />
                <div className="absolute bottom-[-5%] left-[35%] w-[600px] h-[600px] bg-blue-500 opacity-10 rounded-full blur-[240px] animate-pulse-slow delay-1000" />
            </div>

            {/* Contenido centrado */}
            <div className="relative flex items-center justify-center min-h-screen px-4">
                <LiquidGlassWrapper className="relative max-w-md w-full px-6 py-12 border border-white/10 rounded-3xl shadow-xl text-center">
                    <h1 className="text-3xl font-bold mb-4">{t("login.welcome")}</h1>
                    <p className="text-sm text-gray-300 mb-8">{t("login.title")}</p>

                    <div className="bg-white/5 backdrop-blur-sm rounded-full border border-white/10 shadow-sm inline-block">
                        <button
                            onClick={() =>
                                signIn("google", { callbackUrl: "/" })
                            }
                            className="cursor-pointer px-6 py-3 rounded-full text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                        >
                            {t("login.signInWithGoogle")}
                        </button>
                    </div>
                </LiquidGlassWrapper>
            </div>
        </main>
    );
}
