"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
    FaHome,
    FaNewspaper,
    FaHeart,
    FaComments,
    FaUser,
} from "react-icons/fa";
import { useConversation } from "@/context/ConversationContext";
import useUnreadMessagesSocket from "@/hooks/sockets/useUnreadMessagesSocket";
import useUnreadNotificationsSocket from "@/hooks/sockets/useUnreadNotificationsSocket";
import type { IconType } from "react-icons";

const BottomNav = () => {
    const router = useRouter();
    const pathname = usePathname();
    const { data: session } = useSession();
    const { activeConversationId } = useConversation();

    const username = (session?.user as any)?.username ?? "";
    const userId = session?.user?.id || "";

    const unreadMessages = useUnreadMessagesSocket(
        userId,
        pathname ?? "",
        activeConversationId
    );
    const unreadNotifications = useUnreadNotificationsSocket(userId);

    const [selected, setSelected] = useState("/");

    const navItems = useMemo(() => {
        const items = [
            { icon: FaHome, route: "/", label: "Home" },
            { icon: FaNewspaper, route: "/blog", label: "Blog" },
        ];

        if (session?.user) {
            items.push(
                { icon: FaHeart, route: "/notifications", label: "Notifications" },
                { icon: FaComments, route: "/messages", label: "Messages" },
                { icon: FaUser, route: `/${username}`, label: "Profile" }
            );
        }

        return items;
    }, [session, username]);

    useEffect(() => {
        if (!pathname) return;

        const cleanPath = pathname.replace(/^\/(es|en)/, "") || "/";
        const match = navItems.find((item) => item.route === cleanPath);
        setSelected(match ? match.route : "");
    }, [pathname, navItems]);

    const handleNavigation = (route: string) => {
        const [, lang] = pathname?.split("/") ?? [];
        const target = route === "/" ? `/${lang}` : `/${lang}${route}`;
        setSelected(route);
        router.push(target);
    };

    return (
        <AnimatePresence>
            <motion.nav
                className="fixed bottom-4 w-full flex justify-center z-50"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 50, damping: 15 }}
            >
                <div className="flex items-center justify-around px-4 py-2 bg-white/5 border border-white/10 backdrop-blur-xl rounded-full shadow-2xl">
                    {navItems.map((item, index) => {
                        const isActive = selected === item.route;

                        const showMessagesBadge =
                            item.route === "/messages" &&
                            unreadMessages > 0 &&
                            (!pathname?.includes("/messages") || !activeConversationId);

                        const showNotificationsBadge =
                            item.route === "/notifications" &&
                            unreadNotifications > 0 &&
                            !(pathname?.includes("/notifications"));

                        const showBadge = showMessagesBadge || showNotificationsBadge;
                        const badgeCount = item.route === "/messages"
                            ? unreadMessages
                            : unreadNotifications;

                        return (
                            <motion.button
                                key={index}
                                onClick={() => handleNavigation(item.route)}
                                whileTap={{ scale: 0.9 }}
                                className="cursor-pointer group relative"
                            >
                                <div
                                    className={`relative w-10 h-10 p-[2px] rounded-full transition-transform ${isActive
                                        ? "bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 shadow-md scale-105"
                                        : "bg-transparent group-hover:scale-105"
                                        }`}
                                >
                                    <div
                                        className={`w-full h-full rounded-full flex items-center justify-center transition-all ${isActive
                                            ? "bg-white"
                                            : "text-white group-hover:brightness-125"
                                            }`}
                                    >
                                        {React.createElement(item.icon as React.ElementType, {
                                            className: "w-5 h-5",
                                            color: isActive ? "#f6339a" : "white",
                                        })}
                                    </div>
                                </div>

                                {showBadge && (
                                    <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                        {badgeCount > 99 ? "99+" : badgeCount}
                                    </span>
                                )}
                            </motion.button>
                        );
                    })}
                </div>
            </motion.nav>
        </AnimatePresence>
    );
};

export default BottomNav;
