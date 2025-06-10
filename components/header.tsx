"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, ChevronDown, Globe } from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("EN");
  const pathname = usePathname();

  const languages = [
    { code: "EN", label: "English" },
    { code: "தமிழ்", label: "Tamil" },
    { code: "සිං", label: "Sinhala" },
  ];

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/resources", label: "Resources" },
    { href: "/videos", label: "Videos" },
    { href: "/ai-help", label: "AI Help" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b">
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
              <span className="text-xl font-bold text-foreground">
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
                  className={`relative group text-muted-foreground transition-colors duration-200 font-medium ${pathname === item.href ? "text-primary font-semibold" : "hover:text-primary"}`}
                >
                  {item.label}
                  <span
                    className={`absolute bottom-[-2px] left-0 h-0.5 bg-blue-600 transition-all duration-300 ease-out group-hover:w-full ${pathname === item.href ? "w-full" : "w-0"}`}
                  ></span>
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Language Selector & Login */}
          <div className="hidden md:flex items-center space-x-4">
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

            <ThemeToggle />

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
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 border-t"
          >
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative group block py-2 text-muted-foreground transition-colors duration-200 font-medium ${pathname === item.href ? "text-primary font-semibold" : "hover:text-primary"}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 bg-blue-600 transition-all duration-300 ease-out group-hover:w-full ${pathname === item.href ? "w-full" : "w-0"}`}
                  ></span>
                </Link>
              ))}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center space-x-2">
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
                  <ThemeToggle />
                </div>

                <div>
                  <SignedOut>
                    <Button asChild variant="default" size="default">
                      <SignInButton mode="modal">Login</SignInButton>
                    </Button>
                  </SignedOut>
                  <SignedIn>
                    <UserButton afterSignOutUrl="/" />
                  </SignedIn>
                </div>
              </div>
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  );
}
