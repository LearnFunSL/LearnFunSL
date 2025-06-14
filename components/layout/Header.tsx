"use client";

import { Menu } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
      <div className="container mx-auto h-16 flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <button className="md:hidden">
            <Menu size={24} />
          </button>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {/* User avatar placeholder */}
          <div className="h-9 w-9 rounded-full bg-gray-300 dark:bg-gray-600"></div>
        </div>
      </div>
    </header>
  );
}
