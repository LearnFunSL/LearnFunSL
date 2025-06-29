"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Book,
  Film,
  Cpu,
  WalletCards,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserButton, useUser } from "@clerk/nextjs";

const navigationItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/flashcards", label: "Flashcards", icon: WalletCards },
  { href: "/resources", label: "Resources", icon: Book },
  { href: "/videos", label: "Videos", icon: Film },
  { href: "/ai-help", label: "AI Help", icon: Cpu },
];

export function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(true);
  const pathname = usePathname();
  const { user } = useUser();

  const toggleSidebar = () => setIsExpanded(!isExpanded);

  return (
    <motion.aside
      initial={false}
      animate={{ width: isExpanded ? 280 : 80 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="hidden md:flex flex-col h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-4 sticky top-0"
    >
      <div className="flex items-center justify-between mb-8">
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">LF</span>
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  LearnFun SL
                </span>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="rounded-full"
        >
          {isExpanded ? (
            <ChevronsLeft className="w-5 h-5" />
          ) : (
            <ChevronsRight className="w-5 h-5" />
          )}
        </Button>
      </div>

      <nav className="flex-1">
        <ul role="menu" aria-label="Main navigation">
          {navigationItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href} passHref>
                <div
                  role="menuitem"
                  tabIndex={0}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className={`flex items-center p-3 my-1 rounded-lg cursor-pointer transition-colors ${
                    pathname === item.href
                      ? "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 font-semibold"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <item.icon className="w-6 h-6 flex-shrink-0" />
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.span
                        initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                        animate={{
                          opacity: 1,
                          width: "auto",
                          marginLeft: "1rem",
                        }}
                        exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden whitespace-nowrap"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <footer className="p-3 mt-auto border-t border-border">
        <div className="flex items-center">
          <UserButton afterSignOutUrl="/" />
          <AnimatePresence>
            {isExpanded && user && (
              <motion.div
                initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                animate={{ opacity: 1, width: "auto", marginLeft: "0.75rem" }}
                exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden whitespace-nowrap leading-tight"
              >
                <p className="font-semibold">{user.fullName}</p>
                <p className="text-sm text-muted-foreground">
                  {user.primaryEmailAddress?.emailAddress}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </footer>
    </motion.aside>
  );
}
