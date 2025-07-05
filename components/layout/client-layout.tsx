"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { awardXP } from "@/lib/actions/xp.actions";
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

interface ConditionalHeaderProps {
  xp: number;
}

function ConditionalHeader({ xp }: ConditionalHeaderProps) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");

  return !isDashboard ? <Header xp={xp} /> : null;
}

interface ClientLayoutProps {
  children: React.ReactNode;
  xp: number;
}

export function ClientLayout({ children, xp }: ClientLayoutProps) {
  const pathname = usePathname();
  const { isSignedIn } = useAuth();

  useEffect(() => {
    if (isSignedIn) {
      awardXP("DAILY_LOGIN").then((result) => {
        if (result.success) {
          console.log("Daily login XP awarded successfully.");
        } else if (result.error) {
          console.error("Failed to award daily login XP:", result.error);
        }
        // No message if already awarded today (success: false, no error)
      });
    }
  }, [isSignedIn]);

  return (
    <QueryProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <NewUserModalManager>
          <div className="flex-1">
            <ConditionalHeader xp={xp} />
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
