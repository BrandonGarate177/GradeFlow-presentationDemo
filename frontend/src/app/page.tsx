"use client";

import React, { useState, useEffect, useRef } from "react";
import Layout from "../components/Layout";
import RequirementsPanel from "../components/RequirementsPanel";
import SlidesViewer from "../components/SlidesViewer";
import RecordControls from "../components/RecordControls";
import type { GradePresentationResponse } from "../lib/api";

export default function Page() {
  const [status, setStatus] = useState<string>("Idle");
  const [results, setResults] = useState<GradePresentationResponse | null>(null);

  // Sidebar (requirements panel) open state and width
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState<number>(320);
  const isResizing = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(0);

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("sidebarWidth") : null;
    if (saved) setSidebarWidth(parseInt(saved, 10));
  }, []);

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (!isResizing.current) return;
      const dx = e.clientX - startX.current;
      const newWidth = Math.min(640, Math.max(200, startWidth.current + dx));
      setSidebarWidth(newWidth);
    }
    function onMouseUp() {
      if (isResizing.current) {
        isResizing.current = false;
        localStorage.setItem("sidebarWidth", String(sidebarWidth));
      }
    }
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [sidebarWidth]);

  function handleMouseDown(e: React.MouseEvent) {
    isResizing.current = true;
    startX.current = e.clientX;
    startWidth.current = sidebarWidth;
  }

  function toggleSidebar() {
    setSidebarOpen((s) => !s);
  }

  return (
    <Layout>
      <div className="flex h-screen bg-white">
        <aside
          className="bg-white border-r border-gray-200 shadow-sm transition-all duration-300 ease-in-out relative flex flex-col"
          style={{ width: sidebarOpen ? sidebarWidth : 0, minWidth: sidebarOpen ? 280 : 0 }}
        >
          <div className="flex-shrink-0 p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
      
                Evaluation Rubric
              </h3>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setSidebarWidth(320)}
                  className="text-xs px-2 py-1 rounded-md bg-white border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm"
                  title="Reset width"
                >
                  Reset
                </button>
                <button
                  onClick={toggleSidebar}
                  className="text-xs px-2 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm"
                  title={sidebarOpen ? "Hide panel" : "Show panel"}
                >
                  {sidebarOpen ? "Hide" : "Show"}
                </button>
              </div>
            </div>
          </div>

          {sidebarOpen && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 p-6 overflow-y-auto">
                <RequirementsPanel results={results} />
              </div>
              
              <div className="flex-shrink-0 p-6 border-t border-gray-100 bg-gray-50">
                <RecordControls setStatus={setStatus} setResults={setResults} />
                <div className="mt-3 px-3 py-2 rounded-md bg-white border border-gray-200">
                  <div className="text-xs font-medium text-gray-500 mb-1">Status</div>
                  <div className="text-sm font-medium text-gray-800 flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      status === "Recording" ? "bg-red-500 animate-pulse" :
                      status === "Processing" ? "bg-yellow-500 animate-pulse" :
                      status === "Completed" ? "bg-green-500" :
                      "bg-gray-400"
                    }`} />
                    {status}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modern resizer handle */}
          {sidebarOpen && (
            <div
              onMouseDown={handleMouseDown}
              className="absolute top-0 -right-1 h-full w-2 cursor-col-resize group hover:bg-blue-200 transition-colors"
              style={{ zIndex: 40 }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 right-0.5 w-0.5 h-8 bg-gray-300 group-hover:bg-blue-400 transition-colors rounded-full" />
            </div>
          )}
        </aside>

        <main className="flex-1 flex flex-col bg-gray-50 relative">
          {/* Modern show button when sidebar is closed */}
          {!sidebarOpen && (
            <button
              onClick={toggleSidebar}
              className="absolute top-4 left-4 z-50 px-3 py-2 rounded-lg bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-all duration-200 hover:scale-105 flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="font-medium">Show Rubric</span>
            </button>
          )}
          
          <div className="flex-1 p-6">
            <div className="h-full">
              <SlidesViewer />
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
}
