"use client";

import React from "react";
import ReactPlayer from "react-player";

type ReelsFeedProps = {
  videos: string[];
  onReelClick: (index: number) => void;
};

/**
 * ReelsFeed: Muestra los Reels como “publicaciones” en un contenedor scrollable.
 * Al hacer click en un Reel, se llama a onReelClick(index).
 */
export default function ReelsFeed({ videos, onReelClick }: ReelsFeedProps) {
  return (
    <div className="max-h-screen overflow-y-auto px-4">
      {videos.map((videoUrl, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-md mb-4 cursor-pointer"
          onClick={() => onReelClick(index)}
        >
          {/* Mini Player. Mute para permitir autoplay en móvil */}
          <ReactPlayer
            url={videoUrl}
            playing
            muted
            loop
            // Ajusta el alto según tu diseño preferido (ej. 300px)
            width="100%"
            height={300}
            style={{ objectFit: "cover", pointerEvents: "none" }}
          />
          <div className="p-2">
            <p className="text-sm text-gray-700">Reel #{index + 1}</p>
            {/* Puedes añadir más detalles (descripción, likes, comentarios, etc.) */}
          </div>
        </div>
      ))}
    </div>
  );
}
