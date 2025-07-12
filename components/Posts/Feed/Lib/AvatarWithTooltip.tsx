import Image from "next/image";
import * as Tooltip from "@radix-ui/react-tooltip";

interface AvatarWithTooltipProps {
    user: { image?: string; name?: string };
    tooltip?: boolean;
    sizeClass?: string; // e.g. 'w-10 h-10'
    borderClass?: string;
}

export default function AvatarWithTooltip({
    user,
    tooltip = true,
    sizeClass = "w-10 h-10",
    borderClass = "", // ❌ sin borde por defecto
}: AvatarWithTooltipProps) {
    const avatar = (
        <div className={`relative ${sizeClass} shrink-0 rounded-full overflow-hidden`}>
            <Image
                src={user.image || "/fallback-avatar.png"}
                alt={user.name || "Avatar"}
                fill
                className={`object-cover ${borderClass}`}
                sizes="40px"
                priority
            />
        </div>
    );

    if (!tooltip) return avatar;

    return (
        <Tooltip.Provider delayDuration={100}>
            <Tooltip.Root>
                <Tooltip.Trigger asChild>
                    {avatar}
                </Tooltip.Trigger>
                <Tooltip.Portal>
                    <Tooltip.Content
                        side="top"
                        sideOffset={6}
                        className="z-50 px-2 py-1 text-xs text-white bg-black rounded shadow-sm animate-fade-in"
                    >
                        {user.name}
                    </Tooltip.Content>
                </Tooltip.Portal>
            </Tooltip.Root>
        </Tooltip.Provider>
    );
}
