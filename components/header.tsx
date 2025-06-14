"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, ChevronDown, Globe, Sun, Moon } from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { useTheme } from "next-themes";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("EN");
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const languages = [
    { code: "EN", label: "English" },
    { code: "தமிழ்", label: "Tamil" },
    { code: "සිං", label: "Sinhala" },
  ];

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/flashcards", label: "Flashcards" },
    { href: "/resources", label: "Resources" },
    { href: "/videos", label: "Videos" },
    { href: "/ai-help", label: "AI Help" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="focus:outline-none focus:ring-2 focus:ring-primary/40 rounded-md"
            aria-label="Go to homepage"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">LF</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                LearnFun SL
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <Link
                  href={item.href}
                  className={`relative group text-gray-700 dark:text-gray-300 transition-colors duration-200 font-medium ${pathname === item.href ? "text-blue-600 dark:text-blue-400 font-semibold" : "hover:text-blue-600 dark:hover:text-blue-400"}`}
                >
                  {item.label}
                  <span
                    className={`absolute bottom-[-2px] left-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-300 ease-out group-hover:w-full ${pathname === item.href ? "w-full" : "w-0"}`}
                  ></span>
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Language Selector, Theme Toggle & Login */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle */}
            {mounted && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-full w-9 h-9 p-0"
                aria-label={
                  theme === "dark"
                    ? "Switch to light mode"
                    : "Switch to dark mode"
                }
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-1"
                  aria-label={`Select language, current language: ${currentLanguage}`}
                >
                  <Globe className="w-4 h-4" />
                  <span className="flex-shrink-0">{currentLanguage}</span>
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setCurrentLanguage(lang.code)}
                    className="cursor-pointer"
                  >
                    {lang.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <SignedOut>
              <Button asChild variant="default" size="default">
                <SignInButton mode="modal">Login</SignInButton>
              </Button>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 dark:text-gray-300" />
            ) : (
              <Menu className="w-6 h-6 dark:text-gray-300" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 border-t border-gray-100 dark:border-gray-800"
          >
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative group block py-2 text-gray-700 dark:text-gray-300 transition-colors duration-200 font-medium ${pathname === item.href ? "text-blue-600 dark:text-blue-400 font-semibold" : "hover:text-blue-600 dark:hover:text-blue-400"}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-300 ease-out group-hover:w-full ${pathname === item.href ? "w-full" : "w-0"}`}
                  ></span>
                </Link>
              ))}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                {/* Mobile Theme Toggle */}
                {mounted && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setTheme(theme === "dark" ? "light" : "dark")
                    }
                    className="rounded-full w-9 h-9 p-0"
                    aria-label={
                      theme === "dark"
                        ? "Switch to light mode"
                        : "Switch to dark mode"
                    }
                  >
                    {theme === "dark" ? (
                      <Sun className="h-4 w-4" />
                    ) : (
                      <Moon className="h-4 w-4" />
                    )}
                  </Button>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-1"
                      aria-label={`Select language, current language: ${currentLanguage}`}
                    >
                      <Globe className="w-4 h-4" />
                      <span className="flex-shrink-0">{currentLanguage}</span>
                      <ChevronDown className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {languages.map((lang) => (
                      <DropdownMenuItem
                        key={lang.code}
                        onClick={() => setCurrentLanguage(lang.code)}
                        className="cursor-pointer"
                      >
                        {lang.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <SignedOut>
                  <Button asChild variant="default" size="default">
                    <SignInButton mode="modal">Login</SignInButton>
                  </Button>
                </SignedOut>
                <SignedIn>
                  <UserButton afterSignOutUrl="/" />
                </SignedIn>
              </div>
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  );
}
