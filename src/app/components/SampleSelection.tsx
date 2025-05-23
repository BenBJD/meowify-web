"use client";

import { useState } from "react";
import { FiUploadCloud, FiMusic, FiCheck } from "react-icons/fi";
import { AudioPlayer } from "./AudioPlayer";
import { getPitchName, extractPitchFromFilename, getAllMidiPitches } from "../utils/midiUtils";
import { useToast } from "./ToastProvider";

interface SampleSelectionProps {
  samples: Record<number, File | null>;
  setSamples: (samples: Record<number, File | null> | ((prev: Record<number, File | null>) => Record<number, File | null>)) => void;
  sampleUrls: Record<number, string>;
}

export function SampleSelection({
  samples,
  setSamples,
  sampleUrls,
}: SampleSelectionProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const { showToast } = useToast();
  const midiPitches = getAllMidiPitches();

  const handleSampleChange = (
    pitch: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSamples((prev: Record<number, File | null>) => ({
        ...prev,
        [pitch]: files[0],
      }));
    }
  };

  // Handle batch upload of multiple samples
  const handleBatchSampleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    // Create a copy of the current samples
    const newSamples = { ...samples };
    const successfulUploads: { name: string; pitch: number }[] = [];
    const failedUploads: { name: string; reason: string }[] = [];

    // Process each file
    Array.from(e.target.files).forEach((file) => {
      // Extract pitch from filename
      const pitch = extractPitchFromFilename(file.name);

      if (pitch !== null && pitch >= 0 && pitch < 128) {
        // Valid pitch found, assign the sample
        newSamples[pitch] = file;
        successfulUploads.push({ name: file.name, pitch });
      } else {
        // No valid pitch found in the filename
        failedUploads.push({
          name: file.name,
          reason: "Could not detect a valid pitch in the filename",
        });
      }
    });

    // Update the samples state
    setSamples(newSamples);

    // Show feedback to the user
    if (successfulUploads.length > 0) {
      const message =
        `Successfully assigned ${successfulUploads.length} sample${successfulUploads.length > 1 ? "s" : ""
        }:\n` +
        successfulUploads
          .map(
            (s) => `- ${s.name} → ${getPitchName(s.pitch)} (MIDI: ${s.pitch})`,
          )
          .join("\n");

      if (failedUploads.length > 0) {
        const failMessage =
          `Failed to assign ${failedUploads.length} sample${failedUploads.length > 1 ? "s" : ""
          }:\n` +
          failedUploads.map((f) => `- ${f.name}: ${f.reason}`).join("\n");

        // Show mixed success/failure message
        showToast(message, "success");
        showToast(failMessage, "warning");
      } else {
        // Show success only message
        showToast(message, "success");
      }
    } else if (failedUploads.length > 0) {
      showToast(
        `Failed to assign ${failedUploads.length} sample${failedUploads.length > 1 ? "s" : ""
        }. Make sure your filenames contain a valid note name (e.g., a4.wav, C#3.mp3).`,
        "error"
      );
    }
  };

  // Filter pitches based on search term
  const filteredPitches = searchTerm
    ? midiPitches.filter((pitch) => {
      const pitchName = getPitchName(pitch);
      return (
        pitchName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pitch.toString().includes(searchTerm)
      );
    })
    : midiPitches;

  return (
    <div className="card-modern bg-white dark:bg-gray-800 p-6 sticky top-20 transition-all duration-300">
      <h2 className="text-2xl font-bold mb-2 dark:text-white bg-gradient-secondary bg-clip-text text-transparent inline-block">
        Assign Samples
      </h2>
      <p className="mb-4 text-gray-600 dark:text-gray-400 text-sm">
        Select audio samples for each MIDI note to create your custom vocal
        track. You can upload samples individually or batch upload multiple
        samples with pitch information in the filename (e.g., a4.wav, C#3.mp3).
      </p>

      {/* Batch upload button */}
      <div className="mb-4">
        <label className="flex items-center justify-center p-3 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200 border-purple-300 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20 group">
          <input
            type="file"
            accept="audio/*"
            multiple
            onChange={handleBatchSampleUpload}
            className="hidden"
          />
          <FiUploadCloud className="w-5 h-5 mr-2 text-purple-500 dark:text-purple-400 group-hover:scale-110 transition-transform duration-200" />
          <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
            Batch Upload Samples
          </span>
        </label>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 italic">
          Files must have pitch in name (e.g., a4.wav, C#3.mp3)
        </p>
      </div>

      <div className="flex items-center mb-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
        <FiMusic className="text-gray-500 dark:text-gray-400 w-5 h-5 mr-3" />
        <input
          type="text"
          placeholder="Search notes (e.g., C4, F#3)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-transparent border-none focus:outline-none text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500"
        />
      </div>

      <div className="max-h-[65vh] overflow-y-auto pr-2 space-y-3">
        {filteredPitches.map((pitch) => {
          const hasFile = !!samples[pitch];
          const pitchName = getPitchName(pitch);
          const isBlackKey = pitchName.includes("#");

          // Determine if this is a C note (start of an octave)
          const isOctaveStart =
            pitchName.includes("C") && !pitchName.includes("#");

          return (
            <div key={pitch}>
              {isOctaveStart && (
                <div className="mt-6 mb-2 first:mt-0">
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Octave {pitchName.slice(-1)}
                  </h3>
                  <div className="h-px bg-gradient-to-r from-purple-200 to-transparent dark:from-purple-800 mt-1"></div>
                </div>
              )}

              <div
                className={`border rounded-lg transition-all duration-200 card-hover ${hasFile
                  ? "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20"
                  : isBlackKey
                    ? "border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800"
                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700"
                  }`}
              >
                <div className="p-3">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <div
                        className={`w-8 h-8 rounded-md flex items-center justify-center mr-2 text-white font-medium ${isBlackKey
                          ? "bg-gray-800 dark:bg-gray-900"
                          : "bg-gradient-primary"
                          }`}
                      >
                        {pitchName.replace(/[0-9]/g, "")}
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 font-medium">
                        {pitchName}
                        <span className="text-gray-400 dark:text-gray-500 text-xs ml-1">
                          ({pitch})
                        </span>
                      </span>
                    </div>

                    {hasFile && (
                      <FiCheck className="text-green-500 dark:text-green-400 w-5 h-5" />
                    )}
                  </div>

                  <label
                    className={`
                      flex items-center justify-center border border-dashed rounded p-2 cursor-pointer
                      transition-colors duration-200
                      ${hasFile
                        ? "border-green-300 dark:border-green-700 hover:bg-green-100 dark:hover:bg-green-900/30"
                        : "border-gray-300 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-500 hover:bg-gray-50 dark:hover:bg-gray-600/50"
                      }
                    `}
                  >
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={(e) => handleSampleChange(pitch, e)}
                      className="hidden"
                    />
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {hasFile ? "Change sample" : "Select sample"}
                    </span>
                  </label>

                  {samples[pitch] && (
                    <div className="mt-2">
                      <div className="text-xs text-green-600 dark:text-green-400 truncate">
                        {samples[pitch]?.name}
                      </div>
                      {sampleUrls[pitch] && (
                        <AudioPlayer
                          audioUrl={sampleUrls[pitch]}
                          small={true}
                          className="mt-2"
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
