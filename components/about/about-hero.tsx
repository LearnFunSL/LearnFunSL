"use client";

import { motion, Variants } from "framer-motion";

export function AboutHero() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-24 sm:py-32">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto px-4 sm:px-6 lg:px-8 relative text-center"
      >
        <motion.h1
          variants={itemVariants}
          className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-gray-900 dark:text-white"
        >
          Revolutionizing Education in Sri Lanka, One Student at a Time
        </motion.h1>
        <motion.p
          variants={itemVariants}
          className="mt-6 max-w-3xl mx-auto text-lg sm:text-xl text-gray-600 dark:text-gray-300"
        >
          A completely free, comprehensive educational platform built by a
          student, for students – with no ads, no premium features, just pure
          learning.
        </motion.p>
      </motion.div>
    </section>
  );
}
