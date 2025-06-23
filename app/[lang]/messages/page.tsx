"use client";

import { useState } from "react";
import { users } from "@/mocks/messages.mock";
import Image from "next/image";
import Background from "@/components/Shared/Background";
import LiquidGlassWrapper from "@/components/Shared/LiquidGlassWrapper";
import Sidebar from "@/components/Messages/Sidebar";
import ChatHeader from "@/components/Messages/ChatHeader";
import ChatMessages from "@/components/Messages/ChatMessages";
import ChatInput from "@/components/Messages/ChatInput";

export default function MessagesPage() {
    const [input, setInput] = useState("");
    const [activeUser, setActiveUser] = useState(users[0]);
    const [mobileView, setMobileView] = useState(false);

    return (
        <Background>
            {/* Layout */}
            <div className="relative flex items-center justify-center min-h-screen px-4">
                <div className="relative w-full max-w-md md:max-w-4xl h-[75vh] flex flex-col md:flex-row rounded-3xl overflow-hidden border border-white/10 backdrop-blur-xl">
                    {/* Sidebar */}
                    <aside className={`w-full md:w-1/3 h-full flex flex-col ${mobileView ? "hidden md:flex" : "flex"}`}>
                        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 md:hidden">
                            <h2 className="text-lg font-bold">Messages</h2>
                        </div>
                        <Sidebar activeUserId={activeUser.id} onSelect={(id) => {
                            const user = users.find((u) => u.id === id);
                            if (user) {
                                setActiveUser(user);
                                setMobileView(true);
                            }
                        }} />
                        <div className="md:hidden px-4 py-3 bg-white/10 border-t border-white/10">
                            <h4 className="text-xs font-semibold text-white/70 mb-2">Recently Contacted</h4>
                            <div className="flex space-x-3 overflow-x-auto">
                                {users.map((user) => (
                                    <Image key={user.id} src={user.avatar} alt={user.name} width={40} height={40} className="rounded-full border-2 border-white/20" />
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Chat */}
                    <section className={`w-full md:flex-1 h-full flex flex-col bg-white/5 ${mobileView ? "fixed inset-0 z-50 md:static md:flex" : "hidden md:flex"}`}>
                        <ChatHeader name={activeUser.name} avatar={activeUser.avatar} onClose={() => setMobileView(false)} />
                        <LiquidGlassWrapper className="flex flex-col h-full w-full overflow-hidden" rounded={false}>
                            <ChatMessages userId={activeUser.id} />
                        </LiquidGlassWrapper>
                        <ChatInput input={input} onChange={setInput} />
                    </section>
                </div>
            </div>
        </Background>
    );
}
