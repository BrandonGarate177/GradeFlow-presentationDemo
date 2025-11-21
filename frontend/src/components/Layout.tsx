"use client";

import React from "react";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="h-screen w-full">{children}</div>
    </div>
  );
};

export default Layout;
