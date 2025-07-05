"use client";

import React from "react";
import { useSignIn } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose, // Ensure DialogClose is imported
} from "@/components/ui/dialog";

// Proper Google icon (G logo)
const GoogleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
    <path d="M1 1h22v22H1z" fill="none" />
  </svg>
);

const FacebookIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 36 36"
    fill="url(#facebook-gradient)"
    {...props}
    className="w-5 h-5"
  >
    <defs>
      <linearGradient
        x1="50%"
        x2="50%"
        y1="97.078%"
        y2="0%"
        id="facebook-gradient"
      >
        <stop offset="0%" stopColor="#0062E0" />
        <stop offset="100%" stopColor="#19AFFF" />
      </linearGradient>
    </defs>
    <path d="M15 35.8C6.5 34.3 0 26.9 0 18 0 8.1 8.1 0 18 0s18 8.1 18 18c0 8.9-6.5 16.3-15 17.8l-1-.8h-4l-1 .8z" />
    <path
      fill="#FFF"
      d="m25 23 .8-5H21v-3.5c0-1.4.5-2.5 2.7-2.5H26V7.4c-1.3-.2-2.7-.4-4-.4-4.1 0-7 2.5-7 7v4h-4.5v5H15v12.7c1 .2 2 .3 3 .3s2-.1 3-.3V23h4z"
    />
  </svg>
);

interface CustomSignInModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode; // For the DialogTrigger
}

export function CustomSignInModal({
  open,
  onOpenChange,
  children,
}: CustomSignInModalProps) {
  const { signIn, isLoaded } = useSignIn();
  const [isLoadingProvider, setIsLoadingProvider] = React.useState<
    "google" | "facebook" | null
  >(null);

  const handleOAuthSignIn = async (provider: "google" | "facebook") => {
    setIsLoadingProvider(provider);
    if (!isLoaded || !signIn) {
      console.error("Sign-in process not ready");
      setIsLoadingProvider(null); // Reset on early exit
      return;
    }

    try {
      await signIn.authenticateWithRedirect({
        strategy: `oauth_${provider}`,
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/",
      });
      // Redirect happens, so setIsLoadingProvider(null) might not be strictly necessary here
      // unless there's a scenario where authenticateWithRedirect doesn't redirect but also doesn't throw.
    } catch (error) {
      console.error(`Error signing in with ${provider}:`, error);
      setIsLoadingProvider(null); // Reset loading state on error
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-xs bg-card p-6 rounded-lg shadow-xl border-border/20">
        <DialogHeader className="text-center mb-4">
          <DialogTitle className="text-xl font-semibold text-foreground">
            Sign In
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Choose your preferred way to continue.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2.5 py-5 rounded-lg border-border/50 hover:bg-muted/50 transition-colors duration-150 text-sm font-medium"
            onClick={() => handleOAuthSignIn("google")}
            disabled={isLoadingProvider === "google"}
          >
            <GoogleIcon />
            {isLoadingProvider === "google"
              ? "Signing in..."
              : "Continue with Google"}
          </Button>
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2.5 py-5 rounded-lg border-border/50 hover:bg-muted/50 transition-colors duration-150 text-sm font-medium"
            onClick={() => handleOAuthSignIn("facebook")}
            disabled={isLoadingProvider === "facebook"}
          >
            <FacebookIcon />
            {isLoadingProvider === "facebook"
              ? "Signing in..."
              : "Continue with Facebook"}
          </Button>
        </div>

        <div className="text-center mt-6">
          <p className="text-xs text-muted-foreground">
            By continuing, you agree to our{" "}
            <a
              href="#"
              className="underline hover:text-primary transition-colors"
            >
              Terms
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="underline hover:text-primary transition-colors"
            >
              Privacy Policy
            </a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
