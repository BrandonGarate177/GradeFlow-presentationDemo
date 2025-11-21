"use client";

import React, { useState } from "react";

const SlidesViewer: React.FC = () => {
  const [slideId, setSlideId] = useState<string>("");
  const [inputUrl, setInputUrl] = useState<string>("");
  const [error, setError] = useState<string>("");

  // Function to extract slide ID from Google Slides URL
  const extractSlideId = (url: string): string | null => {
    try {
      // Common Google Slides URL patterns:
      // https://docs.google.com/presentation/d/SLIDE_ID/edit
      // https://docs.google.com/presentation/d/SLIDE_ID/edit#slide=id.p
      // https://docs.google.com/presentation/d/SLIDE_ID
      const regex = /\/presentation\/d\/([a-zA-Z0-9-_]+)/;
      const match = url.match(regex);
      return match ? match[1] : null;
    } catch {
      return null;
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!inputUrl.trim()) {
      setError("Please enter a Google Slides URL");
      return;
    }

    const extractedId = extractSlideId(inputUrl.trim());
    if (!extractedId) {
      setError("Invalid Google Slides URL. Please check the format and try again.");
      return;
    }

    setSlideId(extractedId);
  };

  // Clear the slides and start over
  const handleClear = () => {
    setSlideId("");
    setInputUrl("");
    setError("");
  };

  // Use the Google Slides /edit URL so slides can be edited inside the iframe
  const src = slideId ? `https://docs.google.com/presentation/d/${slideId}/edit` : "";
    


  return (
    <div className="h-full w-full rounded-xl overflow-hidden shadow-lg border border-gray-200 bg-white">
      {slideId ? (
        <div className="h-full flex flex-col">
          {/* Header with clear button */}
          <div className="flex-shrink-0 bg-gray-50 border-b border-gray-200 px-4 py-2 flex items-center justify-between">
            <div className="text-sm text-gray-600 truncate mr-4">
              Showing: {slideId}
            </div>
            <button
              onClick={handleClear}
              className="text-xs px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              Change Slides
            </button>
          </div>
          
          {/* Iframe container */}
          <div className="flex-1">
            <iframe 
              src={src} 
              width="100%" 
              height="100%" 
              title="Google Slides Viewer"
              style={{ border: 'none' }}
            />
          </div>
        </div>
      ) : (
        <div className="h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="text-center p-8 max-w-lg w-full mx-4">
          
            
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Load Your Google Slides</h3>
            <p className="text-sm text-gray-600 mb-6">
              Enter the URL of your Google Slides presentation to get started.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="slides-url" className="block text-sm font-medium text-gray-700 mb-2">
                  Google Slides URL
                </label>
                <input
                  id="slides-url"
                  type="url"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="https://docs.google.com/presentation/d/your-slide-id/edit"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  required
                />
                {error && (
                  <p className="mt-2 text-sm text-red-600">{error}</p>
                )}
              </div>
              
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
              >
                Load Slides
              </button>
            </form>
            
            <div className="mt-6 text-xs text-gray-500 bg-gray-100 p-3 rounded-lg">
              <strong>Tip:</strong> Make sure your Google Slides presentation is set to "Anyone with the link can view" for it to work properly.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SlidesViewer;
