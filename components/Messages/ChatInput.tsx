"use client";

export default function ChatInput({
    input,
    onChange,
}: {
    input: string;
    onChange: (val: string) => void;
}) {
    return (
        <div className="px-4 py-3 md:px-6 border-t border-white/10 bg-white/5">
            <div className="flex items-center gap-3">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-white/10 rounded-full px-4 py-2 text-sm text-white outline-none backdrop-blur-md border border-white/10 placeholder-white/50"
                />
                <button className="bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 text-white text-sm px-4 py-2 rounded-full hover:opacity-90 transition">
                    Send
                </button>
            </div>
        </div>
    );
}
