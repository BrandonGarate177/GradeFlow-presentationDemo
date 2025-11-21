import "./globals.css";
import React from "react";

export const metadata = {
  title: "GradeFlow - Presentation Demo",
  description: "Record and grade presentations",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
