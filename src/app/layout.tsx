import type { Metadata } from "next";
import "./globals.css";
import React from "react";
import { ClientLayout } from "./client-layout";

export const metadata: Metadata = {
  title: "Meowify",
  description: "Vocal replacement using machine learning",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
