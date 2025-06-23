"use client";

import React, { useState, useRef } from "react";
import ReactPlayer from "react-player";
import Picker, { EmojiClickData } from "emoji-picker-react";

type ReelProps = {
  videoUrl: string;
  onFocus: (focused: boolean) => void;
};

/**
 * Un solo reel en pantalla completa: video + input de comentarios
 * + emoji picker (si lo deseas).
 */
export default function ReelComponent({ videoUrl, onFocus }: ReelProps) {
  const [comment, setComment] = useState("");
  const [isPlaying, setIsPlaying] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  // Para forzar autoplay en móviles, usamos muted
  const muted = true;

  const emojiList = ["😀", "😅", "😂", "🤣", "😊", "😍", "🥳", "😎", "🤩", "😇"];
  const randomEmoji = emojiList[Math.floor(Math.random() * emojiList.length)];

  const handleSendComment = () => {
    if (comment.trim()) {
      console.log("Comentario enviado:", comment);
      setComment("");
    }
  };

  const addEmoji = (emojiObject: EmojiClickData) => {
    if (emojiObject?.emoji) {
      setComment((prev) => prev + emojiObject.emoji);
    }
  };

  // Al enfocar el input, pausamos el video y ocultamos BottomNav
  const handleFocus = () => {
    setIsPlaying(false);
    setShowEmojiPicker(false);
    onFocus(true);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker((prev) => {
      const newState = !prev;
      setIsPlaying(!newState);
      onFocus(newState);
      return newState;
    });
  };

  return (
    <div className="relative w-full h-screen flex flex-col justify-between bg-black">
      {/* VIDEO */}
      <div className="relative w-full h-full">
        <ReactPlayer
          url={videoUrl}
          playing={isPlaying}
          muted={muted}
          loop
          // pointerEvents="none" para no interceptar el swipe
          style={{ objectFit: "cover", pointerEvents: "none" }}
          width="100%"
          height="100%"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      </div>

      {/* Barra de comentarios en la parte inferior */}
      <div className="absolute bottom-0 left-0 w-full px-4 pb-4">
        <div className="flex items-center bg-white rounded-full shadow-md p-2">
          <input
            type="text"
            value={comment}
            onFocus={handleFocus}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 rounded-full outline-none text-black"
          />
          <button onClick={toggleEmojiPicker} className="ml-2 text-2xl focus:outline-none">
            {randomEmoji}
          </button>
          {showEmojiPicker && (
            <div
              ref={emojiPickerRef}
              className="absolute bottom-16 right-4 z-50"
            >
              <Picker onEmojiClick={addEmoji} />
            </div>
          )}
          <button
            onClick={handleSendComment}
            className="ml-2 px-4 py-2 bg-[#f6339a] text-white rounded-full focus:outline-none"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
