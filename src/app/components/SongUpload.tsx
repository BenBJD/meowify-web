"use client";

import { useState, useCallback, useRef } from "react";
import { FiUploadCloud, FiCheck, FiInfo } from "react-icons/fi";
import { AudioPlayer } from "./AudioPlayer";

interface SongUploadProps {
  selectedSong: File | null;
  setSelectedSong: (song: File | null) => void;
  songUrl: string | null;
}

export function SongUpload({ selectedSong, setSelectedSong, songUrl }: SongUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSongChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedSong(e.target.files[0]);
    }
  };

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (!isDragging) {
        setIsDragging(true);
      }
    },
    [isDragging],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        if (file.type.startsWith("audio/")) {
          setSelectedSong(file);
        }
      }
    },
    [setSelectedSong],
  );

  return (
    <div className="card-modern bg-white dark:bg-gray-800 p-6 transition-all duration-300">
      <h2 className="text-2xl font-bold mb-6 dark:text-white bg-gradient-primary bg-clip-text text-transparent inline-block">
        Upload Your Song
      </h2>

      <div
        className={`mb-6 border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${isDragging
          ? "border-purple-500 dark:border-purple-400 bg-purple-50 dark:bg-purple-900/20"
          : "border-gray-300 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-500"
          }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={handleSongChange}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center py-4">
          <FiUploadCloud
            className={`w-16 h-16 mb-4 transition-colors duration-300 ${isDragging
              ? "text-purple-500 dark:text-purple-400"
              : "text-gray-400 dark:text-gray-500"
              }`}
          />

          <p className="text-lg font-medium mb-2 dark:text-white">
            {isDragging
              ? "Drop your audio file here"
              : "Drag & drop your audio file here"}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            or click to browse your files
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Supports MP3, WAV, FLAC, and other audio formats
          </p>
        </div>
      </div>

      {selectedSong && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 animate-fade-in">
          <div className="flex items-start">
            <FiCheck className="text-green-500 dark:text-green-400 w-5 h-5 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <p className="font-medium text-green-800 dark:text-green-300">
                File selected successfully!
              </p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                {selectedSong.name} (
                {(selectedSong.size / (1024 * 1024)).toFixed(2)} MB)
              </p>
            </div>
          </div>

          {songUrl && (
            <div className="mt-3 pt-3 border-t border-green-200 dark:border-green-800">
              <AudioPlayer
                audioUrl={songUrl}
                label="Preview song"
                className="mt-1"
              />
            </div>
          )}
        </div>
      )}

      <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex items-start">
        <FiInfo className="text-blue-500 dark:text-blue-400 w-5 h-5 mt-0.5 mr-3 flex-shrink-0" />
        <div className="text-sm text-blue-700 dark:text-blue-300">
          <p>Your song will be processed to separate vocals, which will then be transcribed to MIDI.</p>
          <p className="mt-1">Next, you&apos;ll be able to replace the original vocals with your custom samples.</p>
        </div>
      </div>
    </div>
  );
}
