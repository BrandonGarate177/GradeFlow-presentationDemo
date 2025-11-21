"use client";

import React from "react";

const REQUIREMENTS = [
  "Clear intro",
  "3+ main points",
  "Logical structure",
  "Good pacing",
  "Confident delivery",
  "Clear visuals",
  "Time limit respected",
];

const RequirementsPanel: React.FC = () => {
  return (
    <div>
      <h3 className="font-semibold mb-2">Rubric</h3>
      <ul className="space-y-2 text-sm">
        {REQUIREMENTS.map((r) => (
          <li key={r} className="flex items-start">
            <input type="checkbox" className="mr-2 mt-1" disabled />
            <span>{r}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RequirementsPanel;
