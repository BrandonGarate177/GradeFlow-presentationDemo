"use client";

import React from "react";

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

const RequirementsPanel: React.FC = () => {
  // Mock data for last trial - in real app this would come from API
  const lastTrialGrades = {
    clarity: 82,
    structure: 76,
    delivery: 70,
    pacing: 88,
    filler_words: 64
  };

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

  const overallScore = Math.round(
    Object.values(lastTrialGrades).reduce((sum, score) => sum + score, 0) / Object.values(lastTrialGrades).length
  );

  return (
    <div className="space-y-4">
      {/* Overall Score */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">Overall Score</span>
          <span className={`text-2xl font-bold ${getScoreColor(overallScore)}`}>
            {overallScore}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
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
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Last Trial Results
        </div>
      </div>

      {/* Detailed Scores */}
      <div className="space-y-3">
        {GRADING_CRITERIA.map((criterion) => {
          const score = lastTrialGrades[criterion.id as keyof typeof lastTrialGrades];
          return (
            <div 
              key={criterion.id} 
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${getScoreBackground(score)}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-medium text-gray-800">
                      {criterion.text}
                    </h4>
                    <span className={`text-lg font-bold ${getScoreColor(score)}`}>
                      {score}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">
                    {criterion.description}
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ease-out ${
                        score >= 90 ? 'bg-emerald-500' :
                        score >= 80 ? 'bg-green-500' :
                        score >= 70 ? 'bg-yellow-500' :
                        score >= 60 ? 'bg-orange-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${score}%` }}
                    />
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
            <span className={`font-medium ${getScoreColor(overallScore)}`}>
              {overallScore}/100
            </span>
          </div>
          <div className="flex justify-between">
            <span>Grade:</span>
            <span className={`font-medium ${getScoreColor(overallScore)}`}>
              {overallScore >= 90 ? 'A' : 
               overallScore >= 80 ? 'B' : 
               overallScore >= 70 ? 'C' : 
               overallScore >= 60 ? 'D' : 'F'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequirementsPanel;
