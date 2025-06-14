"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface PageTransitionWrapperProps {
  children: ReactNode;
}

export function PageTransitionWrapper({
  children,
}: PageTransitionWrapperProps) {
  const pathname = usePathname();

  // Skip animation for the homepage and AI help page
  if (pathname === "/" || pathname === "/ai-help") {
    return <>{children}</>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0.95, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0.95, y: 5 }}
        transition={{
          duration: 0.2,
          ease: [0.33, 1, 0.68, 1],
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
