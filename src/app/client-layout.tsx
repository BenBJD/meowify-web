"use client";

import React from "react";
import { ThemeProvider } from "./components/ThemeProvider";
import { ThemeToggle } from "./components/ThemeToggle";
import { ToastProvider } from "./components/ToastProvider";
import { ApiStatusIndicator } from "./components/ApiStatusIndicator";

function Header() {
  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-gray-900 shadow-md backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 transition-all duration-300">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="text-2xl font-extrabold bg-gradient-primary bg-clip-text text-transparent animate-pulse-subtle">
            Meowify
          </div>
          <span className="text-xs px-2 py-1 rounded-full bg-gradient-secondary text-white font-medium animate-bounce-subtle">
            Beta
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <ApiStatusIndicator />
          <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">
            Help
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

export function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          <Header />
          <main className="flex-grow animate-fade-in">
            {children}
          </main>
          <footer className="py-6 px-4 bg-white dark:bg-gray-800 shadow-inner mt-12 transition-colors duration-300">
            <div className="container mx-auto text-center text-sm text-gray-500 dark:text-gray-400">
              <p>© {new Date().getFullYear()} Meowify. All rights reserved.</p>
              <p className="mt-2">Made with 🐱 and machine learning magic.</p>
            </div>
          </footer>
        </div>
      </ToastProvider>
    </ThemeProvider>
  );
}
