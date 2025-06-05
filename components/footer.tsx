"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Twitter, Linkedin, Github, Mail, Globe, ChevronDown } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export function Footer() {
  const [currentLanguage, setCurrentLanguage] = useState("EN")

  const languages = [
    { code: "EN", label: "English" },
    { code: "தமிழ்", label: "Tamil" },
    { code: "සිං", label: "Sinhala" },
  ]

  const socialLinks = [
    { icon: <Twitter className="w-5 h-5" />, href: "#", label: "Follow us on Twitter" },
    { icon: <Linkedin className="w-5 h-5" />, href: "#", label: "Connect on LinkedIn" },
    { icon: <Github className="w-5 h-5" />, href: "#", label: "View our GitHub" },
    { icon: <Mail className="w-5 h-5" />, href: "mailto:contact@learnfunsl.com", label: "Send us an email" },
  ]

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* About Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">LF</span>
              </div>
              <span className="text-xl font-bold">LearnFun SL</span>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Empowering Sri Lankan students with modern, accessible, and effective learning tools. Built by students,
              for students, to make education stress-free and enjoyable across Tamil, Sinhala, and English languages.
            </p>
            <p className="text-gray-400 text-sm">
              Our mission is to democratize quality education and help every student reach their full potential,
              regardless of their background or circumstances.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/resources" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Resources
                </Link>
              </li>
              <li>
                <Link href="/videos" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Videos
                </Link>
              </li>
              <li>
                <Link href="/ai-help" className="text-gray-300 hover:text-white transition-colors duration-200">
                  AI Help
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors duration-200">
                  About Us
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Contact & Legal */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-4">Contact & Legal</h3>
            <ul className="space-y-2 mb-6">
              <li>
                <a
                  href="mailto:contact@learnfunsl.com"
                  className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  contact@learnfunsl.com
                </a>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Terms of Use
                </Link>
              </li>
            </ul>

            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700 flex items-center space-x-1"
                >
                  <Globe className="w-4 h-4" />
                  <span>{currentLanguage}</span>
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setCurrentLanguage(lang.code)}
                    className="text-white hover:bg-gray-700 cursor-pointer"
                  >
                    {lang.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </motion.div>
        </div>

        {/* Social Links & Copyright */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="border-t border-gray-800 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-4 mb-4 md:mb-0">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>

            <div className="text-center md:text-right">
              <p className="text-gray-400 text-sm">© {new Date().getFullYear()} LearnFun SL. All rights reserved.</p>
              <p className="text-gray-500 text-xs mt-1">Made with ❤️ for Sri Lankan students</p>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
