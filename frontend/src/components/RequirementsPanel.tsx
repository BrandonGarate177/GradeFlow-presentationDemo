"use client";

import React, { useState } from "react";

const REQUIREMENTS = [
  { id: 1, text: "Clear introduction", description: "Strong opening that engages audience", weight: 15 },
  { id: 2, text: "3+ main points", description: "Well-structured content with clear arguments", weight: 25 },
  { id: 3, text: "Logical structure", description: "Smooth transitions and coherent flow", weight: 20 },
  { id: 4, text: "Good pacing", description: "Appropriate timing and rhythm", weight: 15 },
  { id: 5, text: "Confident delivery", description: "Clear voice, good posture, eye contact", weight: 15 },
  { id: 6, text: "Clear visuals", description: "Effective and readable slides", weight: 10 },
];

const RequirementsPanel: React.FC = () => {
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());

  const toggleCheck = (id: number) => {
    setCheckedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const completionPercentage = Math.round((checkedItems.size / REQUIREMENTS.length) * 100);

  return (
    <div className="space-y-4">
      {/* Progress indicator */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">Progress</span>
          <span className="text-sm font-bold text-blue-600">{completionPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {checkedItems.size} of {REQUIREMENTS.length} criteria met
        </div>
      </div>

      {/* Requirements list */}
      <div className="space-y-3">
        {REQUIREMENTS.map((requirement) => {
          const isChecked = checkedItems.has(requirement.id);
          return (
            <div 
              key={requirement.id} 
              className={`p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer hover:shadow-md ${
                isChecked 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
              onClick={() => toggleCheck(requirement.id)}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                    isChecked 
                      ? 'border-green-500 bg-green-500' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}>
                    {isChecked && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className={`text-sm font-medium transition-colors ${
                      isChecked ? 'text-green-800' : 'text-gray-800'
                    }`}>
                      {requirement.text}
                    </h4>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                        {requirement.weight}%
                      </span>
                    </div>
                  </div>
                  <p className={`text-xs mt-1 transition-colors ${
                    isChecked ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {requirement.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
        <div className="text-xs text-slate-600 space-y-1">
          <div className="flex justify-between">
            <span>Total Weight:</span>
            <span className="font-medium">100%</span>
          </div>
          <div className="flex justify-between">
            <span>Completed:</span>
            <span className={`font-medium ${checkedItems.size === REQUIREMENTS.length ? 'text-green-600' : 'text-slate-600'}`}>
              {REQUIREMENTS.filter(r => checkedItems.has(r.id)).reduce((sum, r) => sum + r.weight, 0)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequirementsPanel;
