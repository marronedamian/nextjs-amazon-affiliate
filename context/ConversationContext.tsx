"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type ConversationContextType = {
    activeConversationId?: string;
    setActiveConversationId: (id?: string) => void;
    unreadMap: Record<string, number>;
    setUnreadMap: (map: Record<string, number>) => void;
};

const ConversationContext = createContext<ConversationContextType>({
    activeConversationId: undefined,
    setActiveConversationId: () => { },
    unreadMap: {},
    setUnreadMap: () => { },
});

export function ConversationProvider({ children }: { children: ReactNode }) {
    const [activeConversationId, setActiveConversationId] = useState<string>();
    const [unreadMap, setUnreadMap] = useState<Record<string, number>>({});

    return (
        <ConversationContext.Provider
            value={{
                activeConversationId,
                setActiveConversationId,
                unreadMap,
                setUnreadMap,
            }}
        >
            {children}
        </ConversationContext.Provider>
    );
}

export function useConversation() {
    return useContext(ConversationContext);
}
