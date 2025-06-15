"use client";

import { motion, Variants } from "framer-motion";
import Image from "next/image";

export function FounderStory() {
  const imageVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const textVariants: Variants = {
    hidden: { opacity: 0, x: 20 },
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
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Transforming How Sri Lankan Students Learn
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Education shouldn&apos;t be a privilege – it should be accessible,
            engaging, and effective for everyone. That&apos;s the belief that
            sparked the creation of this platform, born from the frustration of
            a 15-year-old student who saw firsthand the gaps in our traditional
            learning system.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            variants={imageVariants}
            initial="hidden"
            animate="visible"
          >
            <Image
              src="/founder-placeholder.jpg"
              alt="Jeevagumar Abivarman, Founder of LearnFun SL"
              width={500}
              height={500}
              className="rounded-xl shadow-lg"
            />
          </motion.div>
          <motion.div
            variants={textVariants}
            initial="hidden"
            animate="visible"
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Jeevagumar Abivarman
            </h3>
            <p className="text-md font-semibold text-blue-600 dark:text-blue-400 mb-4">
              Founder & Developer | 15 Years Old
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              As a current student in the Sri Lankan education system, I
              understand the daily challenges students face. The late nights
              spent searching for past papers, the frustration of disorganized
              notes, the struggle to find quality textbooks, and the lack of
              interactive learning tools – I&apos;ve experienced it all.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              That&apos;s why I decided to build the solution I wished existed.
              Using cutting-edge AI tools and my passion for technology,
              I&apos;ve created a platform that addresses every pain point
              I&apos;ve encountered as a student. This isn&apos;t just a
              business venture – it&apos;s my contribution to making education
              better for every student in Sri Lanka and beyond.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
