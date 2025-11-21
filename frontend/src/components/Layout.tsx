"use client";

import React from "react";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen">

      <div className="max-w-6xl mx-auto">{children}</div>
    </div>
  );
};

export default Layout;
