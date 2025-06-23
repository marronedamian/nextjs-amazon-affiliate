import { ReactNode } from "react";
import clsx from "clsx";

export default function LiquidGlassWrapper({
    children,
    className = "",
    rounded = true,
}: {
    children: ReactNode;
    className?: string;
    rounded?: boolean;
}) {
    const borderClass = rounded ? "rounded-2xl" : "";

    return (
        <div className={clsx("relative overflow-visible isolate", borderClass, className)}>
            {/* Capa de distorsión */}
            <div
                className={clsx(
                    "absolute inset-0 z-0 backdrop-blur-[4px]",
                    borderClass
                )}
                style={{ filter: "url(#glass-distortion-soft)" }}
            />
            {/* Capa de tinte */}
            <div className={clsx(
                "absolute inset-0 z-10 bg-white/10 backdrop-brightness-[1.1]",
                borderClass
            )} />
            {/* Borde visual */}
            <div
                className={clsx(
                    "absolute inset-0 z-20 border border-white/10",
                    borderClass
                )}
            />
            {/* Contenido visible */}
            <div className="relative z-30">{children}</div>
        </div>
    );
}
