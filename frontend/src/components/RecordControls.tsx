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
    <div className="flex items-center space-x-4">
      <button
        onClick={() => (recording ? stopRecording() : startRecording())}
        className={`px-4 py-2 rounded text-white ${recording ? "bg-red-600" : "bg-green-600"}`}>
        {recording ? "Stop Recording" : "Start Recording"}
      </button>
      <div className="text-sm text-gray-700">Microphone will be requested when starting.</div>
    </div>
  );
};

export default RecordControls;
