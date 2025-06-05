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

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
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
  },
  twitter: {
    card: "summary_large_image",
    title: "LearnFun SL - Empowering Sri Lankan Students",
    description:
      "Free educational resources and AI-powered learning tools for Sri Lankan students.",
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
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning={true}>
        <body className={`${inter.className} flex flex-col min-h-screen`}>
          <Header />
          <PageTransitionWrapper>
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>
          </PageTransitionWrapper>
          <Footer />
          <ScrollToTopButton />
        </body>
      </html>
    </ClerkProvider>
  );
}
