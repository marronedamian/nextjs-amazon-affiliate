"use client";

import { signOut } from "next-auth/react";
import Image from "next/image";
import LiquidGlassWrapper from "@/components/Shared/LiquidGlassWrapper";

const userStats = {
    favorites: 18,
    saved: 32,
    reviews: 12,
};

export default function Content({ session }: { session: any }) {
    return (
        <main className="relative min-h-screen bg-gradient-radial from-[#1a1a1d] via-[#111114] to-[#0a0a0a] text-white font-sans overflow-hidden">
            {/* Blobs de fondo */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute top-1/3 left-[-10%] w-[400px] h-[400px] bg-pink-500 opacity-20 rounded-full blur-[200px] animate-pulse-slow" />
                <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-purple-500 opacity-20 rounded-full blur-[180px] animate-pulse-slow delay-700" />
                <div className="absolute bottom-[-5%] left-[35%] w-[600px] h-[600px] bg-blue-500 opacity-10 rounded-full blur-[240px] animate-pulse-slow delay-1000" />
            </div>

            {/* Contenido */}
            <div className="relative flex items-center justify-center min-h-screen px-4">
                <LiquidGlassWrapper
                    className="relative max-w-xl w-full px-6 pt-[80px] pb-10 border border-white/10 rounded-3xl shadow-xl text-center overflow-visible"
                    rounded
                >
                    {/* Avatar */}
                    <div className="absolute -top-[150px] left-1/2 transform -translate-x-1/2">
                        <div className="relative w-[120px] h-[120px] rounded-full p-[3px] bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 shadow-lg">
                            <div className="w-full h-full rounded-full overflow-hidden bg-black">
                                <Image
                                    src={session.user.image ?? "/default-avatar.png"}
                                    alt="Avatar"
                                    width={120}
                                    height={120}
                                    className="object-cover w-full h-full"
                                />
                            </div>
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold mt-2">{session.user?.name}</h1>
                    <p className="text-sm text-gray-300 mb-4">{session.user?.email}</p>
                    <p className="text-sm text-gray-400">
                        Amazon Affiliate User
                        <br />
                        Connected with Google
                    </p>

                    {/* Stats */}
                    <div className="flex justify-center gap-10 mt-6 text-sm text-gray-100">
                        {Object.entries(userStats).map(([key, value]) => (
                            <div key={key}>
                                <div className="text-xl font-bold">{value}</div>
                                <div>{key.charAt(0).toUpperCase() + key.slice(1)}</div>
                            </div>
                        ))}
                    </div>

                    {/* Botones */}
                    <div className="mt-10 flex flex-col md:flex-row justify-center gap-4">
                        <LiquidGlassWrapper className="rounded-full cursor-pointer px-4 py-2 border border-white/10 bg-pink-500/10 backdrop-blur-md hover:scale-105 transition">
                            <div className="flex items-center gap-2 text-sm text-pink-300 font-semibold">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 12a5 5 0 100-10 5 5 0 000 10zM10 14c-5.33 0-8 2.667-8 4v2h16v-2c0-1.333-2.67-4-8-4z" />
                                </svg>
                                Connect
                            </div>
                        </LiquidGlassWrapper>

                        <LiquidGlassWrapper className="rounded-full cursor-pointer px-4 py-2 border border-white/10 bg-purple-500/10 backdrop-blur-md hover:scale-105 transition">
                            <div className="flex items-center gap-2 text-sm text-purple-300 font-semibold">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H6l-4 4V5z" />
                                </svg>
                                Message
                            </div>
                        </LiquidGlassWrapper>
                    </div>

                    {/* Botón cerrar sesión */}
                    <LiquidGlassWrapper className="mt-5 inline-flex items-center rounded-full border border-white/10 bg-red-500/10 backdrop-blur-md hover:scale-105 transition">
                        <div
                            onClick={() => signOut({ callbackUrl: "/" })}
                            className="text-sm text-red-300 font-semibold px-5 py-2 cursor-pointer"
                        >
                            Cerrar sesión
                        </div>
                    </LiquidGlassWrapper>
                </LiquidGlassWrapper>
            </div>
        </main>
    );
}
