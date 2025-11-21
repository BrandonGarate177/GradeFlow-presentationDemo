"use client";

import React from "react";

const SlidesViewer: React.FC = () => {
  // Read slide ID from NEXT_PUBLIC_SLIDE_ID so it's not hard-coded in source
  const SLIDE_ID = process.env.NEXT_PUBLIC_SLIDE_ID;
    console.log("SlidesViewer using SLIDE_ID:", SLIDE_ID);

  // Use the Google Slides /edit URL so slides can be edited inside the iframe
  const src = SLIDE_ID
    ? `https://docs.google.com/presentation/d/${SLIDE_ID}/edit`
    : "about:blank";
    


  return (
    <div className="h-full w-full rounded-xl overflow-hidden shadow-lg border border-gray-200 bg-white">
      {SLIDE_ID ? (
        <iframe 
          src={src} 
          width="100%" 
          height="100%" 
          title="Slides Viewer"
          className="rounded-xl"
          style={{ border: 'none' }}
        />
      ) : (
        <div className="h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="text-center p-8 max-w-md">
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V1a1 1 0 011-1h2a1 1 0 011 1v18a1 1 0 01-1 1H4a1 1 0 01-1-1V1a1 1 0 011-1h2a1 1 0 011 1v3z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Presentation Configured</h3>
            <p className="text-sm text-gray-600 mb-4">
              To display your presentation, set the <code className="bg-gray-200 px-2 py-1 rounded">NEXT_PUBLIC_SLIDE_ID</code> environment variable in your <code className="bg-gray-200 px-2 py-1 rounded">.env</code> file.
            </p>
            <div className="text-xs text-gray-500 bg-gray-100 p-3 rounded-lg">
              <strong>Example:</strong><br />
              NEXT_PUBLIC_SLIDE_ID=your_google_slides_id
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SlidesViewer;
