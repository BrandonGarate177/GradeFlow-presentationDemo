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
    try {
      console.log("Starting recording...");
      setStatus("Requesting mic...");
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("Got media stream:", stream);
      
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      chunksRef.current = [];

      mr.ondataavailable = (e) => {
        console.log("Data available:", e.data.size, "bytes");
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mr.onstart = () => {
        console.log("Recording started");
        setRecording(true);
        setStatus("Recording...");
      };

      mr.onerror = (e) => {
        console.error("MediaRecorder error:", e);
        setStatus("Recording error");
      };

      console.log("Starting MediaRecorder...");
      mr.start();
    } catch (err) {
      console.error("Failed to start recording:", err);
      setStatus("Failed to access microphone");
    }
  };

  const stopRecording = async () => {
    console.log("Stopping recording...");
    setStatus("Stopping...");
    const mr = mediaRecorderRef.current;
    if (!mr) {
      console.log("No MediaRecorder found");
      return;
    }
    
    return new Promise<void>((resolve) => {
      mr.onstop = async () => {
        console.log("Recording stopped, chunks:", chunksRef.current.length);
        setRecording(false);
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        console.log("Created blob:", blob.size, "bytes");

        // Upload to backend
        setStatus("Uploading & grading...");
        try {
          console.log("Uploading to backend...");
          const res = await gradePresentation(blob);
          console.log("Got response:", res);
          setResults(res);
          setStatus("Done");
        } catch (err) {
          console.error("Upload/grading error:", err);
          setStatus("Error uploading or grading");
        }

        resolve();
      };
      
      console.log("Calling mr.stop()...");
      mr.stop();
      
      // stop tracks
      try {
        const stream = (mr as any).stream;
        if (stream && stream.getTracks) {
          console.log("Stopping media tracks...");
          stream.getTracks().forEach((t: MediaStreamTrack) => {
            console.log("Stopping track:", t.kind);
            t.stop();
          });
        }
      } catch (e) {
        console.warn("Error stopping tracks:", e);
      }
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
