"use client";

import { useState, useEffect } from "react";
import { SongUpload } from "./components/SongUpload";
import { SampleSelection } from "./components/SampleSelection";
import { ProcessButton } from "./components/ProcessButton";
import { useToast } from "./components/ToastProvider";

export default function Home() {
  const [selectedSong, setSelectedSong] = useState<File | null>(null);
  const [samples, setSamples] = useState<Record<number, File | null>>({});
  const [songUrl, setSongUrl] = useState<string | null>(null);
  const [sampleUrls, setSampleUrls] = useState<Record<number, string>>({});
  const [meowifiedAudioUrl, setMeowifiedAudioUrl] = useState<string | null>(
    null,
  );
  const { showToast } = useToast();

  // Count how many samples are selected
  const selectedSamplesCount = Object.values(samples).filter(Boolean).length;

  // Create audio URLs for files
  useEffect(() => {
    // Clean up previous URL if it exists
    if (songUrl) {
      URL.revokeObjectURL(songUrl);
    }

    // Create new URL if a song is selected
    if (selectedSong) {
      const url = URL.createObjectURL(selectedSong);
      setSongUrl(url);
    } else {
      setSongUrl(null);
    }

    // Cleanup function
    return () => {
      if (songUrl) {
        URL.revokeObjectURL(songUrl);
      }
    };
  }, [selectedSong]);

  // Create audio URLs for samples
  useEffect(() => {
    // Clean up previous URLs
    Object.values(sampleUrls).forEach((url) => {
      URL.revokeObjectURL(url);
    });

    // Create new URLs for samples
    const newSampleUrls: Record<number, string> = {};
    Object.entries(samples).forEach(([pitch, file]) => {
      if (file) {
        newSampleUrls[Number(pitch)] = URL.createObjectURL(file);
      }
    });

    setSampleUrls(newSampleUrls);

    // Cleanup function
    return () => {
      Object.values(newSampleUrls).forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, [samples]);

  // Clean up meowified audio URL when the component unmounts
  useEffect(() => {
    return () => {
      if (meowifiedAudioUrl) {
        URL.revokeObjectURL(meowifiedAudioUrl);
      }
    };
  }, [meowifiedAudioUrl]);

  // Process the song with the selected samples
  const handleProcess = async () => {
    if (!selectedSong || selectedSamplesCount === 0) return;

    try {
      // Create a FormData object to send to the API
      const formData = new FormData();
      formData.append("audio_file", selectedSong);

      // Create an array to store sample information
      const sampleInfos: { id: string; pitch: number; filename: string }[] = [];

      // Add each sample to the FormData and collect sample info
      Object.entries(samples).forEach(([pitch, file]) => {
        if (file) {
          // Generate a unique ID for this sample
          const sampleId = `sample_${pitch}`;
          formData.append("samples", file);

          // Add sample info (pitch mapping)
          sampleInfos.push({
            id: sampleId,
            pitch: parseInt(pitch),
            filename: file.name,
          });
        }
      });

      // Add sample info as JSON
      formData.append("sample_infos", JSON.stringify(sampleInfos));

      // Send the request to our Next.js API route
      const response = await fetch("/api/meowify", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        // Handle error response
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to process audio");
      }

      // Get the processed audio as a blob
      const audioBlob = await response.blob();

      // Clean up previous URL if it exists
      if (meowifiedAudioUrl) {
        URL.revokeObjectURL(meowifiedAudioUrl);
      }

      // Create a URL for the blob
      const audioUrl = URL.createObjectURL(audioBlob);
      setMeowifiedAudioUrl(audioUrl);

      // Show success message
      showToast(
        "Processing complete! Your meowified audio is ready to play.",
        "success",
      );
    } catch (error) {
      // Show error message
      showToast(
        `Error: ${error instanceof Error ? error.message : "Failed to process audio"}`,
        "error",
      );
      console.error("Processing error:", error);
      throw error; // Re-throw to let the ProcessButton component handle it
    }
  };


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1 animate-slide-up">
          {/* Song Upload Component */}
          <SongUpload 
            selectedSong={selectedSong} 
            setSelectedSong={setSelectedSong} 
            songUrl={songUrl} 
          />

          {/* Process Button Component */}
          <div className="mt-6">
            <ProcessButton
              selectedSong={selectedSong}
              selectedSamplesCount={selectedSamplesCount}
              meowifiedAudioUrl={meowifiedAudioUrl}
              setMeowifiedAudioUrl={setMeowifiedAudioUrl}
              onProcess={handleProcess}
            />
          </div>
        </div>

        {/* Sidebar for Sample Selection */}
        <div className="lg:w-1/3 w-full animate-slide-in-right">
          <SampleSelection
            samples={samples}
            setSamples={setSamples}
            sampleUrls={sampleUrls}
          />
        </div>
      </div>
    </div>
  );
}
