"use client";

import Image from "next/image";
import { users } from "@/mocks/messages.mock";

export default function Sidebar({
    activeUserId,
    onSelect,
}: {
    activeUserId: number;
    onSelect: (id: number) => void;
}) {
    return (
        <div className="flex-1 overflow-y-auto bg-white/5 border-white/10">
            {users.map((user) => (
                <div
                    key={user.id}
                    className={`flex items-center gap-3 px-4 py-3 hover:bg-white/10 cursor-pointer transition ${activeUserId === user.id ? "bg-white/10" : ""}`}
                    onClick={() => onSelect(user.id)}
                >
                    <Image src={user.avatar} alt={user.name} width={40} height={40} className="rounded-full object-cover" />
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white truncate">{user.name}</p>
                        <p className="text-xs text-white/60 truncate">{user.message}</p>
                    </div>
                    <span className="text-xs text-white/40 hidden md:block">{user.time}</span>
                </div>
            ))}
        </div>
    );
}
