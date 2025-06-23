"use client";

import React, { useState } from "react";
import { motion, PanInfo } from "framer-motion";
import ReelComponent from "./ReelComponent";

type FullScreenReelsProps = {
  videos: string[];
  initialIndex: number; // con qué reel empieza
  onFocus: (focused: boolean) => void; // para ocultar bottom nav cuando se interactúa
  onClose: () => void; // cierra el modo fullscreen
};

export default function FullScreenReels({
  videos,
  initialIndex,
  onFocus,
  onClose,
}: FullScreenReelsProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const handleSwipeUp = () => {
    if (currentIndex < videos.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      onFocus(true); // Ocultamos BottomNav
    }
  };

  const handleSwipeDown = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      onFocus(true);
    } else {
      // Si estamos en el primer reel y bajamos, cerramos fullscreen
      onClose();
    }
  };

  const handlePanEnd = (_event: PointerEvent, info: PanInfo) => {
    const offsetY = info.offset.y;
    if (offsetY < -50) {
      handleSwipeUp();
    } else if (offsetY > 50) {
      handleSwipeDown();
    }
  };

  return (
    // Contenedor a pantalla completa:
    <div className="fixed inset-0 z-50 bg-black overflow-hidden">
      <motion.div
        className="relative w-full h-full"
        // Movemos la vista -currentIndex * 100 vh para mostrar cada reel
        initial={{ y: 0 }}
        animate={{ y: -currentIndex * 100 + "vh" }}
        transition={{ ease: "easeInOut", duration: 0.5 }}
      >
        {videos.map((videoUrl, index) => (
          <motion.div
            key={index}
            className="relative w-full h-screen"
            style={{ touchAction: "none" }} // Permite a Framer Motion atrapar el gesto
            onPanEnd={handlePanEnd}
          >
            <ReelComponent videoUrl={videoUrl} onFocus={onFocus} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
