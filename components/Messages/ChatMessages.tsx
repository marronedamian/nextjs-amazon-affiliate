"use client";

import MessageBubble from "./MessageBubble";
import { messagesByUserId } from "@/mocks/messages.mock";

export default function ChatMessages({ userId }: { userId: number }) {
    const messages = messagesByUserId[userId] || [];

    return (
        <div className="flex-1 overflow-y-auto px-4 py-3 md:px-6 space-y-4 h-full">
            {messages.map((msg) => (
                <MessageBubble key={msg.id} text={msg.text} time={msg.time} from={msg.from} />
            ))}
        </div>
    );
}
