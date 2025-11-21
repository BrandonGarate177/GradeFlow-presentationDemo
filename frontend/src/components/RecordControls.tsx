"use client";

import React, { useRef, useState } from "react";
import { gradePresentation } from "../lib/api";
import type { GradePresentationResponse } from "../lib/api";

type Props = {
  setStatus: (s: string) => void;
  setResults: (r: GradePresentationResponse | null) => void;
};

const RecordControls: React.FC<Props> = ({ setStatus, setResults }) => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const [recording, setRecording] = useState(false);

  const startRecording = async () => {
    setStatus("Requesting mic...");
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mr = new MediaRecorder(stream);
    mediaRecorderRef.current = mr;
    chunksRef.current = [];

    mr.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    mr.onstart = () => {
      setRecording(true);
      setStatus("Recording...");
    };

    mr.start();
  };

  const stopRecording = async () => {
    setStatus("Stopping...");
    const mr = mediaRecorderRef.current;
    if (!mr) return;
    return new Promise<void>((resolve) => {
      mr.onstop = async () => {
        setRecording(false);
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });

        // Upload to backend
        setStatus("Uploading & grading...");
        try {
          const res = await gradePresentation(blob);
          setResults(res);
          setStatus("Done");
        } catch (err) {
          console.error(err);
          setStatus("Error uploading or grading");
        }

        resolve();
      };
      mr.stop();
      // stop tracks
      try {
        (mr as any).stream?.getTracks?.().forEach((t: MediaStreamTrack) => t.stop());
      } catch {}
    });
  };

  return (
    <div className="space-y-4">
      <button
        onClick={() => (recording ? stopRecording() : startRecording())}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 shadow-sm ${
          recording 
            ? "bg-red-600 hover:bg-red-700 text-white animate-pulse" 
            : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white hover:shadow-md"
        }`}
        disabled={!recording && !mediaRecorderRef.current}
      >
        {recording ? (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10h6v4H9V10z" />
            </svg>
            <span>Stop Recording</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
            <span>Start Recording</span>
          </>
        )}
      </button>
      
 
    </div>
  );
};

export default RecordControls;
