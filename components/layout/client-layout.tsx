"use client";

import { usePathname } from "next/navigation";
import type React from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ScrollToTopButton } from "@/components/ui/scroll-to-top-button";
import { PageTransitionWrapper } from "@/components/page-transition-wrapper";
import QueryProvider from "@/components/QueryProvider";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { NewUserModalManager } from "@/components/common/NewUserModalManager";
import { SpeedInsights } from "@vercel/speed-insights/next";

function ConditionalHeader() {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");

  return !isDashboard ? <Header /> : null;
}

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <NewUserModalManager>
          <div className="flex-1">
            <ConditionalHeader />
            <PageTransitionWrapper>
              <div className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
              </div>
            </PageTransitionWrapper>
            <Footer />
            <ScrollToTopButton />
            <SpeedInsights />
          </div>
          <Toaster />
        </NewUserModalManager>
      </ThemeProvider>
    </QueryProvider>
  );
}
