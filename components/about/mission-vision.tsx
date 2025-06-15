"use client";

import { motion, Variants } from "framer-motion";
import { Lightbulb, Rocket, CheckCircle } from "lucide-react";

export function MissionVision() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-12"
        >
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full mr-4">
                <Rocket className="h-6 w-6 text-blue-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Our Mission
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              We believe every student deserves access to premium educational
              resources and effective learning methodologies, regardless of
              their economic background. Our mission is to eliminate educational
              inequality by providing a comprehensive, free platform that makes
              learning engaging, organized, and scientifically effective.
            </p>
          </motion.div>
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full mr-4">
                <Lightbulb className="h-6 w-6 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Our Vision for the Future
              </h2>
            </div>
            <div className="text-gray-600 dark:text-gray-300">
              <h3 className="font-semibold text-lg mb-2 text-gray-800 dark:text-gray-100">
                Short-term Goals (Next 12 Months):
              </h3>
              <ul className="list-disc list-inside space-y-1 mb-4">
                <li>
                  Expand to cover curricula from other countries in South Asia
                </li>
                <li>Add multilingual support (Sinhala, Tamil)</li>
                <li>Introduce peer tutoring features</li>
                <li>Mobile app development for iOS and Android</li>
              </ul>
              <h3 className="font-semibold text-lg mb-2 text-gray-800 dark:text-gray-100">
                Long-term Vision (2-5 Years):
              </h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Become the leading educational platform in South Asia</li>
                <li>Partner with schools and educational institutions</li>
                <li>Develop AI tutoring capabilities</li>
                <li>Create a global community of learners</li>
              </ul>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
