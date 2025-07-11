import type React from "react";

export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { cn } from "@/lib/utils";
import { fontSans } from "@/lib/fonts";
import { ClientLayout } from "@/components/layout/client-layout";
import { getCurrentUserXP } from "@/lib/actions/user.actions";

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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { xp } = await getCurrentUserXP();
  return (
    <ClerkProvider
      appearance={{
        elements: {
          modalCloseButton: {
            "&:focus-visible": {
              outline: "none",
              boxShadow: "none",
            },
            "&:focus": {
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
          <ClientLayout xp={xp}>{children}</ClientLayout>
        </body>
      </html>
    </ClerkProvider>
  );
}
