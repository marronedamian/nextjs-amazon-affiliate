"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import type { Story } from "@/types/story.types";
import { EmojiClickData } from "emoji-picker-react";

import StoryHeader from "./FullScreen/StoryHeader";
import StoryImage from "./FullScreen/StoryImage";
import StoryProgressBar from "./FullScreen/StoryProgressBar";
import StoryNavigation from "./FullScreen/StoryNavigation";
import StoryCommentBox from "./FullScreen/StoryCommentBox";

interface Props {
  t: any;
  stories: Story[];
  initialIndex: number;
  onClose: () => void;
  onMarkImageSeen: (storyIndex: number, imageIndex: number) => void;
}

export default function FullscreenStory({
  t,
  stories,
  initialIndex,
  onClose,
  onMarkImageSeen,
}: Props) {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(initialIndex);
  const firstUnseen = stories[initialIndex]?.images.findIndex((img) => !img.seen);
  const [currentImageIndex, setCurrentImageIndex] = useState(
    firstUnseen !== -1 ? firstUnseen : 0
  );
  const [progress, setProgress] = useState(0);
  const [comment, setComment] = useState("");
  const [isPaused, setIsPaused] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const randomEmoji = useRef(
    ["😀", "😅", "😂", "🤣", "😊", "😍", "🥳", "😎", "🤩", "😇"][
    Math.floor(Math.random() * 10)
    ]
  ).current;

  const markedImages = useRef<Set<string>>(new Set());
  const markedStory = useRef<Set<string>>(new Set());

  const currentStory = stories[currentStoryIndex];
  const currentImg = currentStory?.images[currentImageIndex];

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const shouldPause = isPaused || isImageLoading || showEmojiPicker || !currentImg;
    if (shouldPause) return;

    const timer = setInterval(() => setProgress((p) => p + 1), 60);
    return () => clearInterval(timer);
  }, [isPaused, isImageLoading, showEmojiPicker, currentImg]);

  useEffect(() => {
    if (!currentStory || !currentImg) return;

    const imgKey = `${currentImg.storyId}_${currentImg.url}`;
    if (!currentImg.seen && !markedImages.current.has(imgKey)) {
      markedImages.current.add(imgKey);
      currentStory.images[currentImageIndex].seen = true;
      onMarkImageSeen(currentStoryIndex, currentImageIndex);
      fetch("/api/stories/image-view", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storyId: currentImg.storyId,
          imageUrl: currentImg.url,
        }),
      });
    }

    const allSeen = currentStory.images.every(
      (img) =>
        img.seen ||
        markedImages.current.has(`${currentStory.storyId}_${img.url}`)
    );
    const alreadyMarkedStory =
      currentImg.fullySeen || markedStory.current.has(currentImg.storyId);

    if (allSeen && !alreadyMarkedStory) {
      markedStory.current.add(currentImg.storyId);
      fetch("/api/stories/view", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storyId: currentImg.storyId }),
      });
    }
  }, [currentImg?.url, currentStory?.storyId]);

  useEffect(() => {
    if (!currentStory || !currentImg) return;
    if (progress >= 100) handleNextImage();
  }, [progress]);

  const handleNextImage = () => {
    if (currentImageIndex < currentStory.images.length - 1) {
      setCurrentImageIndex((i) => i + 1);
    } else if (currentStoryIndex < stories.length - 1) {
      const next = currentStoryIndex + 1;
      const first = stories[next].images.findIndex((img) => !img.seen);
      setCurrentStoryIndex(next);
      setCurrentImageIndex(first !== -1 ? first : 0);
    } else onClose();
    setProgress(0);
  };

  const handlePreviousImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex((i) => i - 1);
    } else if (currentStoryIndex > 0) {
      const prev = currentStoryIndex - 1;
      const last = stories[prev].images.length - 1;
      setCurrentStoryIndex(prev);
      setCurrentImageIndex(last);
    }
    setProgress(0);
  };

  const handleSendComment = async () => {
    if (!comment.trim() || !currentImg?.storyId || isSending) return;
    setIsSending(true);
    try {
      const res = await fetch("/api/stories/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storyId: currentImg.storyId,
          message: comment.trim(),
        }),
      });

      if (res.ok) {
        setComment("");
        setShowEmojiPicker(false);
        // toast.success("Comentario enviado");
      } else {
        toast.error("Error al enviar comentario");
      }
    } catch (err) {
      console.error("❌ Error al enviar comentario", err);
      toast.error("Error al enviar comentario");
    } finally {
      setIsSending(false);
    }
  };

  const handleFocus = () => {
    setIsPaused(true);
    setShowEmojiPicker(false);
  };

  const handleBlur = () => {
    setIsPaused(false);
  };

  return currentStory ? (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4 py-8">
      <motion.div
        className="fixed inset-0 z-[10000] flex flex-col justify-between items-center px-5 pt-24 pb-32 bg-black/70 backdrop-blur-lg border border-white/10"
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        {/* Degradado superior */}
        <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-black via-black/50 to-transparent z-10 pointer-events-none" />

        <div
          className="relative w-full h-full max-w-md flex flex-col justify-center"
          onMouseDown={() => setIsPaused(true)}
          onMouseUp={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {currentImg?.url ? (
            <StoryImage
              url={currentImg.url}
              alt={currentStory.name}
              description={currentImg.description}
              onLoad={() => setIsImageLoading(false)}
              loading={isImageLoading}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-black text-white">
              {t("stories.noImage")}
            </div>
          )}
          <StoryProgressBar
            total={currentStory.images.length}
            current={currentImageIndex}
            progress={progress}
          />
          <StoryHeader
            name={currentStory.name}
            username={currentStory.username}
            avatarUrl={currentStory.avatarUrl}
            createdAt={currentImg?.createdAt ?? new Date()}
            onClose={onClose}
          />
          <StoryNavigation
            onPrevious={handlePreviousImage}
            onNext={handleNextImage}
          />
        </div>

        <StoryCommentBox
          t={t}
          comment={comment}
          onChange={setComment}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onToggleEmoji={() => setShowEmojiPicker((prev) => !prev)}
          showEmojiPicker={showEmojiPicker}
          onEmojiClick={(emoji: EmojiClickData) =>
            setComment((prev) => prev + emoji.emoji)
          }
          onSend={handleSendComment}
          randomEmoji={randomEmoji}
          loading={isSending}
          placeholder={t("stories.commentPlaceholder")}
        />
      </motion.div>
    </div>
  ) : null;
}
