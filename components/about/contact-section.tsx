"use client";

import { motion } from "framer-motion";
import { Mail, Send, Users } from "lucide-react";
import Link from "next/link";

export function ContactSection() {
  return (
    <section className="py-12 sm:py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Connect With Us
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            We&apos;re always listening. Reach out with questions, feedback, or
            suggestions.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Link
              href="mailto:eduhelpsl2025@gmail.com"
              className="group"
              target="_blank"
            >
              <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                <Mail className="h-10 w-10 mx-auto text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Email Us
                </h3>
                <p className="text-gray-500 dark:text-gray-400 group-hover:text-blue-500 transition-colors">
                  eduhelpsl2025@gmail.com
                </p>
              </div>
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link href="#" className="group" target="_blank">
              <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                <Send className="h-10 w-10 mx-auto text-green-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Social Media
                </h3>
                <p className="text-gray-500 dark:text-gray-400 group-hover:text-green-500 transition-colors">
                  Follow us for updates
                </p>
              </div>
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link href="#" className="group" target="_blank">
              <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                <Users className="h-10 w-10 mx-auto text-purple-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Student Community
                </h3>
                <p className="text-gray-500 dark:text-gray-400 group-hover:text-purple-500 transition-colors">
                  Join our Discord/Telegram
                </p>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
