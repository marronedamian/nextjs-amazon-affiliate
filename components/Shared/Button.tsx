import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Button = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(
    ({ className, children, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center gap-2 cursor-pointer",
                    "px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ease-in-out",
                    "bg-green-500/20 text-green-300 border border-green-400/20 backdrop-blur-md",
                    "hover:bg-green-500/30 hover:text-white hover:scale-[1.03]",
                    "active:scale-[0.96] focus:outline-none focus:ring-2 focus:ring-green-500/40",
                    "disabled:opacity-50 disabled:cursor-not-allowed shadow-xl",
                    className
                )}
                {...props}
            >
                {children}
            </button>
        );
    }
);

Button.displayName = "Button";
