"use client";

import { useState } from "react";
import {
  FiZap,
  FiLoader,
  FiCheck,
  FiVolume2,
  FiDownload,
} from "react-icons/fi";
import { AudioPlayer } from "./AudioPlayer";
import { useToast } from "./ToastProvider";

interface ProcessButtonProps {
  selectedSong: File | null;
  selectedSamplesCount: number;
  meowifiedAudioUrl: string | null;
  setMeowifiedAudioUrl: (url: string | null) => void;
  onProcess: () => Promise<void>;
}

export function ProcessButton({
  selectedSong,
  selectedSamplesCount,
  meowifiedAudioUrl,
  setMeowifiedAudioUrl,
  onProcess,
}: ProcessButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { showToast } = useToast();

  const handleProcess = async () => {
    if (!selectedSong || selectedSamplesCount === 0 || isProcessing) return;

    setIsProcessing(true);
    try {
      await onProcess();
    } catch (error) {
      console.error("Processing error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!meowifiedAudioUrl) return;

    // Create a download link and trigger it
    const downloadLink = document.createElement("a");
    downloadLink.href = meowifiedAudioUrl;
    downloadLink.download = "meowified-audio.mp3";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div className="card-modern bg-white dark:bg-gray-800 p-6 transition-all duration-300">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="mb-4 md:mb-0">
          <h2 className="text-xl font-bold dark:text-white">
            Ready to Meowify?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            {selectedSong && selectedSamplesCount > 0
              ? `Processing will replace vocals in "${selectedSong.name}" with ${selectedSamplesCount} custom samples.`
              : "Select a song and at least one sample to get started."}
          </p>
        </div>

        <button
          onClick={handleProcess}
          disabled={
            !selectedSong || selectedSamplesCount === 0 || isProcessing
          }
          className={`
            px-6 py-3 rounded-lg font-medium text-white 
            transition-all duration-300 transform
            flex items-center space-x-2
            ${
              !selectedSong || selectedSamplesCount === 0
                ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed opacity-70"
                : isProcessing
                ? "bg-purple-600 dark:bg-purple-700"
                : "bg-gradient-primary hover:shadow-lg hover:-translate-y-1 active:translate-y-0 active:shadow-md"
            }
          `}
        >
          {isProcessing ? (
            <>
              <FiLoader className="w-5 h-5 animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <FiZap className="w-5 h-5" />
              <span>Process Song</span>
            </>
          )}
        </button>
      </div>

      {/* Progress indicators */}
      <div className="mt-6 flex items-center">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
          {isProcessing && (
            <div
              className="bg-gradient-primary h-2.5 rounded-full animate-pulse-subtle"
              style={{ width: "60%" }}
            ></div>
          )}
        </div>
      </div>

      {/* Meowified Audio Player (shows after processing) */}
      {meowifiedAudioUrl && (
        <div className="mt-6 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FiVolume2 className="text-purple-500 dark:text-purple-400 w-5 h-5 mr-3" />
              <div>
                <p className="font-medium text-purple-800 dark:text-purple-300">
                  Meowified Audio Ready!
                </p>
                <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">
                  Your processed audio is ready to play.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <AudioPlayer audioUrl={meowifiedAudioUrl} />
              <button
                onClick={handleDownload}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-green-500 dark:bg-green-600 text-white hover:bg-green-400 dark:hover:bg-green-500 transition-colors duration-200"
                aria-label="Download"
              >
                <FiDownload className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status indicators */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          className={`flex items-center p-3 rounded-lg transition-colors duration-300 ${
            selectedSong
              ? "bg-green-50 dark:bg-green-900/20"
              : "bg-gray-100 dark:bg-gray-800"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
              selectedSong
                ? "bg-green-500 dark:bg-green-600"
                : "bg-gray-300 dark:bg-gray-600"
            }`}
          >
            <FiCheck className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium dark:text-white">
              Song Selection
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {selectedSong ? "Complete" : "Required"}
            </p>
          </div>
        </div>

        <div
          className={`flex items-center p-3 rounded-lg transition-colors duration-300 ${
            selectedSamplesCount > 0
              ? "bg-green-50 dark:bg-green-900/20"
              : "bg-gray-100 dark:bg-gray-800"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
              selectedSamplesCount > 0
                ? "bg-green-500 dark:bg-green-600"
                : "bg-gray-300 dark:bg-gray-600"
            }`}
          >
            <FiCheck className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium dark:text-white">
              Sample Selection
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {selectedSamplesCount > 0
                ? `${selectedSamplesCount} samples selected`
                : "At least one required"}
            </p>
          </div>
        </div>

        <div
          className={`flex items-center p-3 rounded-lg transition-colors duration-300 ${
            isProcessing
              ? "bg-purple-50 dark:bg-purple-900/20 animate-pulse-subtle"
              : meowifiedAudioUrl
              ? "bg-green-50 dark:bg-green-900/20"
              : "bg-gray-100 dark:bg-gray-800"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
              isProcessing
                ? "bg-purple-500 dark:bg-purple-600"
                : meowifiedAudioUrl
                ? "bg-green-500 dark:bg-green-600"
                : "bg-gray-300 dark:bg-gray-600"
            }`}
          >
            {isProcessing ? (
              <FiLoader className="w-4 h-4 text-white animate-spin" />
            ) : meowifiedAudioUrl ? (
              <FiCheck className="w-4 h-4 text-white" />
            ) : (
              <FiZap className="w-4 h-4 text-white" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium dark:text-white">Processing</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {isProcessing
                ? "In progress..."
                : meowifiedAudioUrl
                ? "Complete"
                : "Ready to start"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}