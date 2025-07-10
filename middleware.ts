import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
  publicRoutes: [
    "/",
    "/resources(.*)",
    "/ai-help",
    "/api/clerk/webhook(.*)",
    "/about",
    "/contact",
    "/videos",
    "/flashcards(.*)",
    "/sso-callback(.*)",
  ],
};
