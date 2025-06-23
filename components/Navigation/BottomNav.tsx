"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { FaHome, FaNewspaper, FaHeart, FaComments, FaUser } from "react-icons/fa";
import { motion } from "framer-motion";
import type { IconType } from "react-icons";

const navItems: { icon: IconType; route: string; label: string }[] = [
    { icon: FaHome, route: "/", label: "Home" },
    { icon: FaNewspaper, route: "/blog", label: "Blog" },
    { icon: FaHeart, route: "/likes", label: "Likes" },
    { icon: FaComments, route: "/messages", label: "Messages" },
    { icon: FaUser, route: "/profile", label: "Profile" },
];

const BottomNav = () => {
    const router = useRouter();
    const pathname = usePathname();

    const [selected, setSelected] = useState("/");

    // Detectar la ruta activa sin el idioma
    useEffect(() => {
        const [, lang, section] = pathname.split("/"); // ['', 'es', 'profile']
        const current = `/${section || ""}`; // si estás en /es => '/'
        const match = navItems.find((item) => current === item.route);
        if (match) {
            setSelected(match.route);
        }
    }, [pathname]);

    const handleNavigation = (route: string) => {
        const [, lang] = pathname.split("/"); // obtenemos el idioma actual
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
                        return (
                            <motion.button
                                key={index}
                                onClick={() => handleNavigation(item.route)}
                                whileTap={{ scale: 0.9 }}
                                className="cursor-pointer group"
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
                            </motion.button>
                        );
                    })}
                </div>
            </motion.nav>
        </AnimatePresence>
    );
};

export default BottomNav;
