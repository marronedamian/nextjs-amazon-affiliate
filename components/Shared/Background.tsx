import { ReactNode } from "react";

export default function Background({ children }: { children: ReactNode }) {
    return (
        <main className="relative min-h-screen overflow-hidden text-white font-sans bg-fallbackDark bg-custom-radial">
            <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-1/3 left-[-10%] w-[400px] h-[400px] bg-pink-500 opacity-20 rounded-full blur-[200px] animate-pulse-slow" />
                <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-purple-500 opacity-20 rounded-full blur-[180px] animate-pulse-slow delay-[700ms]" />
                <div className="absolute bottom-[-5%] left-[35%] w-[600px] h-[600px] bg-blue-500 opacity-10 rounded-full blur-[240px] animate-pulse-slow delay-[1000ms]" />
            </div>
            {children}
        </main>
    );
}
