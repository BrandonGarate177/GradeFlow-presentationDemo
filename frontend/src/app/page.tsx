"use client";

import React, { useState, useEffect, useRef } from "react";
import Layout from "../components/Layout";
import RequirementsPanel from "../components/RequirementsPanel";
import SlidesViewer from "../components/SlidesViewer";
import RecordControls from "../components/RecordControls";
import ResultsPanel from "../components/ResultsPanel";
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
      <div className="flex h-full">
        <aside
          className="p-4 border-r border-gray-200 bg-white transition-all duration-150 overflow-hidden relative"
          style={{ width: sidebarOpen ? sidebarWidth : 0, minWidth: sidebarOpen ? 200 : 0 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Rubric</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setSidebarWidth(320)}
                className="text-xs px-2 py-1 rounded bg-gray-100"
                title="Reset width"
              >
                Reset
              </button>
              <button
                onClick={toggleSidebar}
                className="text-xs px-2 py-1 rounded bg-gray-100"
                title={sidebarOpen ? "Hide panel" : "Show panel"}
              >
                {sidebarOpen ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {sidebarOpen && (
            <>
              <RequirementsPanel />
              <div className="mt-4">
                <RecordControls setStatus={setStatus} setResults={setResults} />
                <div className="text-sm text-gray-600">Status: {status}</div>
                {results && <ResultsPanel results={results} />}
              </div>
            </>
          )}

          {/* resizer: small visible handle at the right edge */}
          {sidebarOpen && (
            <div
              onMouseDown={handleMouseDown}
              style={{
                position: "absolute",
                top: 0,
                right: -4,
                height: "100%",
                width: 8,
                cursor: "col-resize",
                zIndex: 40,
              }}
            />
          )}
        </aside>

        <main className="flex-1 p-4">
          {/* show a small open button when sidebar is closed */}
          {!sidebarOpen && (
            <button
              onClick={toggleSidebar}
              className="mb-4 px-2 py-1 rounded bg-gray-100"
              style={{ position: "absolute", left: 6, top: 80, zIndex: 50 }}
            >
              Show Rubric
            </button>
          )}
          <div className="space-y-4">
            <SlidesViewer />

          </div>
        </main>
      </div>
    </Layout>
  );
}
