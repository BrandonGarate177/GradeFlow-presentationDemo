"use client";

import React from "react";
import type { GradePresentationResponse } from "../lib/api";

const ResultsPanel: React.FC<{ results: GradePresentationResponse }> = ({ results }) => {
  return (
    <div className="mt-4 bg-white border rounded p-4">
      <h3 className="text-lg font-semibold">Results</h3>
      <div className="mt-2">
        <div className="text-2xl font-bold">Overall: {results.score_overall}</div>
        <div className="flex gap-4 mt-2">
          <div>Clarity: {results.scores.clarity}</div>
          <div>Pacing: {results.scores.pacing}</div>
          <div>Confidence: {results.scores.confidence}</div>
          <div>Structure: {results.scores.structure}</div>
        </div>
      </div>

      <div className="mt-4">
        <h4 className="font-medium">Summary</h4>
        <p>{results.feedback.summary}</p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <h5 className="font-medium">Strengths</h5>
          <ul className="list-disc pl-5">
            {results.feedback.strengths.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
        <div>
          <h5 className="font-medium">Areas to improve</h5>
          <ul className="list-disc pl-5">
            {results.feedback.areas_to_improve.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4">
        <h5 className="font-medium">Model Delivery Script</h5>
        <pre className="p-2 bg-gray-100 rounded text-sm">{results.feedback.suggested_script}</pre>
      </div>

      <div className="mt-4">
        <h5 className="font-medium">Model Delivery Audio</h5>
        {results.model_delivery_audio_url ? (
          <audio controls src={results.model_delivery_audio_url} />
        ) : (
          <div className="text-sm text-gray-500">No audio URL returned.</div>
        )}
      </div>
    </div>
  );
};

export default ResultsPanel;
