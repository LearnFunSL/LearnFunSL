"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";

interface FlashcardsLayoutProps {
  children: React.ReactNode;
}

export default function FlashcardsLayout({ children }: FlashcardsLayoutProps) {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  // Meta tags should be added using Next.js metadata API or in a custom document
  useEffect(() => {
    // Set viewport meta tag for mobile devices
    document
      .querySelector('meta[name="viewport"]')
      ?.setAttribute(
        "content",
        "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
      );
  }, []);

  if (!isLoaded) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 px-4 sm:px-6">
      <main className="max-w-7xl mx-auto">{children}</main>

      <Toaster />
    </div>
  );
}
