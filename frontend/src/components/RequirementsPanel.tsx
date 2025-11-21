"use client";

import React from "react";
import type { GradePresentationResponse } from "../lib/api";

const GRADING_CRITERIA = [
  { 
    id: "clarity", 
    text: "Clarity", 
    description: "Clear articulation, pronunciation, and vocal quality",
    maxScore: 100 
  },
  { 
    id: "structure", 
    text: "Structure", 
    description: "Logical organization and flow of content",
    maxScore: 100 
  },
  { 
    id: "delivery", 
    text: "Delivery", 
    description: "Confidence, body language, and engagement",
    maxScore: 100 
  },
  { 
    id: "pacing", 
    text: "Pacing", 
    description: "Appropriate speed and rhythm throughout presentation",
    maxScore: 100 
  },
  { 
    id: "filler_words", 
    text: "Filler Words", 
    description: "Minimal use of 'um', 'uh', and other filler words",
    maxScore: 100 
  },
];

interface RequirementsPanelProps {
  results?: GradePresentationResponse | null;
}

const RequirementsPanel: React.FC<RequirementsPanelProps> = ({ results }) => {
  // Use actual results if available, otherwise show default empty state
  const lastTrialGrades = results ? results.scores : null;

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600';
    if (score >= 80) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 90) return 'bg-emerald-50 border-emerald-200';
    if (score >= 80) return 'bg-green-50 border-green-200';
    if (score >= 70) return 'bg-yellow-50 border-yellow-200';
    if (score >= 60) return 'bg-orange-50 border-orange-200';
    return 'bg-red-50 border-red-200';
  };

  const overallScore = results ? Number(results.score_overall) : null;

  return (
    <div className="space-y-4">
      {/* Overall Score */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">Overall Score</span>
          {overallScore !== null ? (
            <span className={`text-2xl font-bold ${getScoreColor(overallScore)}`}>
              {overallScore}
            </span>
          ) : (
            <span className="text-2xl font-bold text-gray-400">--</span>
          )}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          {overallScore !== null ? (
            <div 
              className={`h-3 rounded-full transition-all duration-300 ease-out ${
                overallScore >= 90 ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' :
                overallScore >= 80 ? 'bg-gradient-to-r from-green-500 to-green-600' :
                overallScore >= 70 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                overallScore >= 60 ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
                'bg-gradient-to-r from-red-500 to-red-600'
              }`}
              style={{ width: `${overallScore}%` }}
            />
          ) : (
            <div className="h-3 rounded-full bg-gray-300" style={{ width: '0%' }} />
          )}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {overallScore !== null ? 'Last Trial Results' : 'No results yet - record a presentation to see your scores'}
        </div>
      </div>

      {/* Detailed Scores */}
      <div className="space-y-3">
        {GRADING_CRITERIA.map((criterion) => {
          const score = lastTrialGrades ? lastTrialGrades[criterion.id as keyof typeof lastTrialGrades] : null;
          const displayScore = score !== null ? Number(score) : null;
          
          return (
            <div 
              key={criterion.id} 
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                displayScore !== null ? getScoreBackground(displayScore) : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-medium text-gray-800">
                      {criterion.text}
                    </h4>
                    {displayScore !== null ? (
                      <span className={`text-lg font-bold ${getScoreColor(displayScore)}`}>
                        {displayScore}
                      </span>
                    ) : (
                      <span className="text-lg font-bold text-gray-400">--</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mb-2">
                    {criterion.description}
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    {displayScore !== null ? (
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ease-out ${
                          displayScore >= 90 ? 'bg-emerald-500' :
                          displayScore >= 80 ? 'bg-green-500' :
                          displayScore >= 70 ? 'bg-yellow-500' :
                          displayScore >= 60 ? 'bg-orange-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${displayScore}%` }}
                      />
                    ) : (
                      <div className="h-2 rounded-full bg-gray-300" style={{ width: '0%' }} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Grade Summary */}
      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
        <div className="text-xs text-slate-600 space-y-1">
          <div className="flex justify-between">
            <span>Total Criteria:</span>
            <span className="font-medium">{GRADING_CRITERIA.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Average Score:</span>
            {overallScore !== null ? (
              <span className={`font-medium ${getScoreColor(overallScore)}`}>
                {overallScore}/100
              </span>
            ) : (
              <span className="font-medium text-gray-400">--/100</span>
            )}
          </div>
          <div className="flex justify-between">
            <span>Grade:</span>
            {overallScore !== null ? (
              <span className={`font-medium ${getScoreColor(overallScore)}`}>
                {overallScore >= 90 ? 'A' : 
                 overallScore >= 80 ? 'B' : 
                 overallScore >= 70 ? 'C' : 
                 overallScore >= 60 ? 'D' : 'F'}
              </span>
            ) : (
              <span className="font-medium text-gray-400">--</span>
            )}
          </div>
        </div>
      </div>

      {/* Additional Results Sections - only show when results are available */}
      {results && (
        <>
          {/* Summary */}
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <h4 className="font-medium text-gray-800 mb-2 flex items-center">
              <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Summary
            </h4>
            <p className="text-sm text-gray-700 leading-relaxed">{results.summary}</p>
          </div>

          {/* Strengths */}
          <div className="bg-green-50 rounded-lg p-4 border border-green-100">
            <h5 className="font-medium text-green-800 mb-3 flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Strengths
            </h5>
            <ul className="space-y-2">
              {results.strengths.map((strength, i) => (
                <li key={i} className="text-sm text-green-700 flex items-start">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                  {strength}
                </li>
              ))}
            </ul>
          </div>
          
          {/* Areas to Improve */}
          <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
            <h5 className="font-medium text-orange-800 mb-3 flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Areas to Improve
            </h5>
            <ul className="space-y-2">
              {results.areas_to_improve.map((area, i) => (
                <li key={i} className="text-sm text-orange-700 flex items-start">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                  {area}
                </li>
              ))}
            </ul>
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
              {results.suggested_script}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RequirementsPanel;
