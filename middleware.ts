import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
  publicRoutes: [
    "/",
    "/api/webhooks(.*)",
    "/resources(.*)",
    "/ai-help",
    "/about",
    "/contact",
    "/videos",
    "/flashcards(.*)",
    "/sso-callback(.*)",
  ],
};
