"use client";

import React from "react";
import type { GradePresentationResponse } from "../lib/api";

const ResultsPanel: React.FC<{ results: GradePresentationResponse }> = ({ results }) => {
  const scoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 6) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const overallScore = Number(results.score_overall);

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      {/* Header with overall score */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Presentation Results</h3>
          <div className="text-right">
            <div className="text-2xl font-bold">{results.score_overall}</div>
            <div className="text-sm opacity-90">Overall Score</div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Score breakdown */}
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(results.scores).map(([key, value]) => (
            <div key={key} className={`p-3 rounded-lg border ${scoreColor(Number(value))}`}>
              <div className="text-lg font-semibold">{value}</div>
              <div className="text-xs capitalize font-medium">
                {key.replace(/_/g, ' ')}
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-slate-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-800 mb-2 flex items-center">
            <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Summary
          </h4>
          <p className="text-sm text-gray-700 leading-relaxed">{results.feedback.summary}</p>
        </div>

        {/* Strengths and Improvements */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-green-50 rounded-lg p-4 border border-green-100">
            <h5 className="font-medium text-green-800 mb-3 flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Strengths
            </h5>
            <ul className="space-y-2">
              {results.feedback.strengths.map((strength, i) => (
                <li key={i} className="text-sm text-green-700 flex items-start">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                  {strength}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
            <h5 className="font-medium text-orange-800 mb-3 flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Areas to Improve
            </h5>
            <ul className="space-y-2">
              {results.feedback.areas_to_improve.map((area, i) => (
                <li key={i} className="text-sm text-orange-700 flex items-start">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                  {area}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Suggested Script */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
          <h5 className="font-medium text-blue-800 mb-3 flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Suggested Improvement Script
          </h5>
          <div className="bg-white rounded border border-blue-200 p-3 text-sm text-gray-700 font-mono leading-relaxed max-h-32 overflow-y-auto">
            {results.feedback.suggested_script}
          </div>
        </div>

        {/* Model Audio */}
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
          <h5 className="font-medium text-purple-800 mb-3 flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m-2.829-2.829a2 2 0 010-2.828M9 5l8 8v-8z" />
            </svg>
            Model Delivery Audio
          </h5>
          {results.model_delivery_audio_url ? (
            <div className="bg-white rounded border border-purple-200 p-3">
              <audio 
                controls 
                src={results.model_delivery_audio_url} 
                className="w-full"
                style={{ height: '40px' }}
              />
            </div>
          ) : (
            <div className="text-sm text-purple-600 bg-white rounded border border-purple-200 p-3">
              No audio URL returned from the analysis.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsPanel;
