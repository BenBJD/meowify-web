"use client";

import { useState, useRef, useEffect } from "react";
import { FiPlay, FiPause } from "react-icons/fi";

interface AudioPlayerProps {
  audioUrl: string;
  label?: string;
  small?: boolean;
  className?: string;
}

export function AudioPlayer({
  audioUrl,
  label,
  small = false,
  className = "",
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const handleEnded = () => setIsPlaying(false);
      audio.addEventListener("ended", handleEnded);
      return () => {
        audio.removeEventListener("ended", handleEnded);
      };
    }
  }, []);

  return (
    <div className={`flex items-center ${className}`}>
      <button
        onClick={togglePlay}
        className={`
          ${small ? "w-8 h-8" : "w-10 h-10"} 
          rounded-full 
          flex items-center justify-center 
          ${
            isPlaying
              ? "bg-purple-500 dark:bg-purple-600 text-white"
              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
          } 
          hover:bg-purple-400 dark:hover:bg-purple-500 
          transition-colors duration-200
        `}
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? (
          <FiPause className={small ? "w-4 h-4" : "w-5 h-5"} />
        ) : (
          <FiPlay className={small ? "w-4 h-4" : "w-5 h-5"} />
        )}
      </button>

      {label && (
        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
          {label}
        </span>
      )}

      <audio ref={audioRef} src={audioUrl} />
    </div>
  );
}