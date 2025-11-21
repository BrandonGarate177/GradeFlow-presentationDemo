"use client";

import React from "react";



const SlidesViewer: React.FC = () => {
  // Read slide ID from NEXT_PUBLIC_SLIDE_ID so it's not hard-coded in source
  const SLIDE_ID = process.env.NEXT_PUBLIC_SLIDE_ID;

  // Use the Google Slides /edit URL so slides can be edited inside the iframe
  const src = SLIDE_ID
    ? `https://docs.google.com/presentation/d/${SLIDE_ID}/edit`
    : "about:blank";

  return (
    <div className="border rounded bg-white overflow-hidden" style={{ height: 480 }}>
      {SLIDE_ID ? (
        <iframe src={src} width="100%" height="100%" title="Slides Viewer" />
      ) : (
        <div className="p-4 text-sm text-gray-600">No slide configured. Set `NEXT_PUBLIC_SLIDE_ID` in your `.env`.</div>
      )}
    </div>
  );
};

export default SlidesViewer;
