import { SpeedInsights } from "@vercel/speed-insights/next";
import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ScrollToTopButton } from "@/components/ui/scroll-to-top-button";
import { PageTransitionWrapper } from "@/components/page-transition-wrapper";
import QueryProvider from "@/components/QueryProvider";
import { cn } from "@/lib/utils";
import { fontSans } from "@/lib/fonts";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { NewUserModalManager } from "@/components/common/NewUserModalManager";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ),
  title:
    "LearnFun SL - Empowering Sri Lankan Students with Modern Learning Tools",
  description:
    "Accessible, multilingual study resources to improve academic success and reduce stress. Free past papers, video lessons, AI help, and more for Sri Lankan students.",
  keywords:
    "Sri Lanka education, past papers, study resources, AI tutoring, multilingual learning, Tamil, Sinhala, English",
  authors: [{ name: "LearnFun SL Team" }],
  openGraph: {
    title: "LearnFun SL - Modern Learning Tools for Sri Lankan Students",
    description:
      "Free educational platform with past papers, video lessons, and AI assistance in Tamil, Sinhala, and English.",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "LearnFun SL - Empowering Sri Lankan Students",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LearnFun SL - Empowering Sri Lankan Students",
    description:
      "Free educational resources and AI-powered learning tools for Sri Lankan students.",
    images: ["/twitter-default.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        elements: {
          // Attempt to target the modal's close button
          // The exact key might vary, 'modalCloseButton' is a common pattern
          modalCloseButton: {
            "&:focus-visible": {
              // Prefer focus-visible for accessibility
              outline: "none",
              boxShadow: "none",
            },
            "&:focus": {
              // Fallback for general focus
              outline: "none",
              boxShadow: "none",
            },
          },
        },
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn(
            "flex flex-col min-h-screen bg-background text-foreground",
            fontSans.className,
          )}
          suppressHydrationWarning
        >
          <QueryProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <NewUserModalManager>
                <div className="flex-1">
                  <Header />
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
        </body>
      </html>
    </ClerkProvider>
  );
}
