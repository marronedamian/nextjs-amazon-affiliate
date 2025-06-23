"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Picker, { EmojiClickData } from "emoji-picker-react";

interface Story {
  name: string;
  avatarUrl: string;
  images: string[];
  seen: boolean[];
}

interface FullscreenStoryProps {
  stories: Story[];
  initialIndex: number;
  onClose: () => void;
  onStoryChange: (storyIndex: number, imageIndex: number) => void;
}

export default function FullscreenStory({
  stories,
  initialIndex,
  onClose,
  onStoryChange,
}: FullscreenStoryProps) {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(initialIndex);
  const firstUnseenImageIndex = stories[initialIndex].seen.findIndex(
    (seen) => !seen
  );
  const initialImageIndex =
    firstUnseenImageIndex !== -1 ? firstUnseenImageIndex : 0;

  const [currentImageIndex, setCurrentImageIndex] = useState(initialImageIndex);
  const [progress, setProgress] = useState(0);
  const [comment, setComment] = useState("");
  const [isPaused, setIsPaused] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const emojiPickerRef = useRef<HTMLDivElement>(null);

  const emojiList = ["😀", "😅", "😂", "🤣", "😊", "😍", "🥳", "😎", "🤩", "😇"];
  const randomEmoji = useRef(
    emojiList[Math.floor(Math.random() * emojiList.length)]
  ).current;

  // Bloquear scroll del body mientras está montado
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Avanzar el progreso cada 60ms si no está en pausa
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (!isPaused) {
      timer = setInterval(() => {
        setProgress((prev) => prev + 1);
      }, 60);
    }

    if (progress >= 100) {
      handleNextImage();
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [progress, isPaused]);

  // Marcar imagen como vista
  useEffect(() => {
    if (!stories[currentStoryIndex].seen[currentImageIndex]) {
      const updatedStories = [...stories];
      updatedStories[currentStoryIndex].seen[currentImageIndex] = true;
      onStoryChange(currentStoryIndex, currentImageIndex);
    }
  }, [currentImageIndex]);

  // Cerrar picker al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
        setIsPaused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleNextImage = () => {
    const story = stories[currentStoryIndex];
    if (currentImageIndex < story.images.length - 1) {
      setCurrentImageIndex((idx) => idx + 1);
      setProgress(0);
    } else if (currentStoryIndex < stories.length - 1) {
      const newStoryIndex = currentStoryIndex + 1;
      setCurrentStoryIndex(newStoryIndex);
      const nextUnseen = stories[newStoryIndex].seen.findIndex((s) => !s);
      setCurrentImageIndex(nextUnseen !== -1 ? nextUnseen : 0);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handlePreviousImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex((idx) => idx - 1);
      setProgress(0);
    } else if (currentStoryIndex > 0) {
      const prevStoryIndex = currentStoryIndex - 1;
      setCurrentStoryIndex(prevStoryIndex);
      const lastIndex = stories[prevStoryIndex].images.length - 1;
      const prevUnseen = stories[prevStoryIndex].seen.findIndex((s) => !s);
      setCurrentImageIndex(prevUnseen !== -1 ? prevUnseen : lastIndex);
      setProgress(0);
    }
  };

  const handleMouseDown = () => setIsPaused(true);
  const handleMouseUp = () => setIsPaused(false);
  const handleFocus = () => {
    setIsPaused(true);
    setShowEmojiPicker(false);
  };
  const handleBlur = () => setIsPaused(false);

  const toggleEmojiPicker = () => {
    setShowEmojiPicker((prev) => {
      setIsPaused(!prev);
      return !prev;
    });
  };

  const addEmoji = (emojiData: EmojiClickData) => {
    if (emojiData.emoji) {
      setComment((prev) => prev + emojiData.emoji);
    }
  };

  const handleSendComment = () => {
    if (comment.trim()) {
      console.log("Comentario enviado:", comment);
      setComment("");
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black flex flex-col justify-between items-center z-[10000] pt-25 pb-30 pl-5 pr-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Contenedor de imagen */}
      <div
        className="relative w-full h-full max-w-md flex flex-col justify-center"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
      >
        <Image
          src={stories[currentStoryIndex].images[currentImageIndex]}
          alt={stories[currentStoryIndex].name}
          fill
          className="object-cover rounded-tl-2xl rounded-tr-2xl"
        />

        {/* Barra de progreso */}
        <div className="absolute top-4 left-0 right-0 flex space-x-1 px-2">
          {stories[currentStoryIndex].images.map((_, idx) => (
            <motion.div key={idx} className="flex-1 h-1 bg-gray-700 rounded-full">
              <motion.div
                className={`h-full ${idx <= currentImageIndex ? "bg-[#f6339a]" : "bg-[#e3e4e8]"
                  } rounded-full`}
                style={{
                  width: `${idx === currentImageIndex ? progress : 100}%`,
                }}
                transition={{ duration: 0.1, ease: "linear" }}
              />
            </motion.div>
          ))}
        </div>

        {/* Header interno (avatar + nombre + cerrar) */}
        <div className="absolute top-12 left-0 right-0 flex items-center justify-between px-4 z-20">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <Image
                src={stories[currentStoryIndex].avatarUrl}
                alt={stories[currentStoryIndex].name}
                width={40}
                height={40}
                className="object-cover h-full"
              />
            </div>
            <span className="text-white font-semibold">
              {stories[currentStoryIndex].name}
            </span>
          </div>
          <button onClick={onClose} className="text-white text-3xl z-30">
            ✕
          </button>
        </div>

        {/* Navegación anterior/siguiente */}
        <div className="absolute inset-y-0 left-4 flex items-center z-10 cursor-pointer">
          <button onClick={handlePreviousImage} className="text-white text-4xl">
            ‹
          </button>
        </div>
        <div className="absolute inset-y-0 right-4 flex items-center z-10 cursor-pointer">
          <button onClick={handleNextImage} className="text-white text-4xl">
            ›
          </button>
        </div>
      </div>

      {/* Barra de comentarios */}
      <div className="relative flex items-center p-4 bg-white w-full max-w-md shadow-md rounded-bl-2xl rounded-br-2xl">
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Type a message here..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none text-black"
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <button onClick={toggleEmojiPicker} className="ml-2 text-2xl focus:outline-none">
          {randomEmoji}
        </button>
        {showEmojiPicker && (
          <div ref={emojiPickerRef} className="absolute bottom-16 right-0 z-50">
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
    </motion.div>
  );
}
