"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SignInButton, SignedOut } from "@clerk/nextjs";
import { useInView } from "framer-motion";
import { useRef } from "react";

import { features, getColorClasses, type Feature } from "@/lib/features-data"; // Ensure this resolves to .tsx

export function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Comprehensive Learning Features
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
            Everything you need for academic success, from past papers to
            AI-powered assistance, all in one comprehensive platform.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              className={`bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-l-4 ${
                feature.status === "available"
                  ? "border-green-500"
                  : "border-orange-500"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center ${getColorClasses(feature.color, feature.status)}`}
                >
                  {feature.icon}
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    feature.status === "available"
                      ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                      : "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300"
                  }`}
                >
                  {feature.status === "available"
                    ? "✅ Available"
                    : "🚧 Coming Soon"}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        <SignedOut>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-16 text-center"
          >
            <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-lg p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">
                Ready to Transform Your Learning Experience?
              </h3>
              <p className="text-lg mb-6 opacity-90">
                Join thousands of Sri Lankan students who are already improving
                their academic performance with LearnFun SL.
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block"
              >
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-blue-600 px-8 py-3 font-semibold hover:bg-gray-100 transition-colors duration-300"
                >
                  <SignInButton mode="modal">
                    Get Started Today - It&apos;s Free!
                  </SignInButton>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </SignedOut>
      </div>
    </section>
  );
}
