import { TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
    ({ className, ...props }, ref) => {
        return (
            <textarea
                ref={ref}
                className={cn(
                    "w-full min-h-[80px] resize-none rounded-xl px-4 py-3 text-sm text-white",
                    "bg-white/5 border border-white/10 placeholder-white/50",
                    "focus:outline-none focus:ring-2 focus:ring-[#f6339a] focus:border-[#f6339a]/40",
                    "hover:bg-white/10 transition-all duration-200 ease-in-out",
                    "backdrop-blur-md shadow-sm",
                    className
                )}
                {...props}
            />
        );
    }
);

Textarea.displayName = "Textarea";
