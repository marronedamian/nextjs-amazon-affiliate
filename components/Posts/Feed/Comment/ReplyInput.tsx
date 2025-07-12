"use client";

import { useState } from "react";
import { SendHorizonal, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import clsx from "clsx";

export default function ReplyInput({ t, onSend }: { t: any; onSend: (text: string) => void }) {
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!text.trim()) return;
        setLoading(true);
        await onSend(text);
        setText("");
        setLoading(false);
    };

    return (
      <div className="flex items-end gap-2 mt-3 mb-3 w-full">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={1}
          placeholder={t("posts.comments.replies.placeholder")}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          className="flex-1 resize-none bg-white/10 rounded-2xl px-4 py-2 text-sm text-white outline-none backdrop-blur-md border border-white/10 placeholder-white/50 min-h-[36px] max-h-[88px] w-full transition focus:ring-2 focus:ring-pink-500/30"
        />
        <motion.button
          whileTap={{ scale: 0.98 }}
          whileHover={{ scale: 1.03 }}
          onClick={handleSend}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 px-5 py-2 bg-white/10 backdrop-blur-2xl border border-pink-500 hover:bg-pink-600/30 text-pink-300 hover:text-white font-semibold rounded-full transition-all duration-300 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin text-pink-300" />
          ) : (
            <SendHorizonal size={18} />
          )}
        </motion.button>
      </div>
    );
}
