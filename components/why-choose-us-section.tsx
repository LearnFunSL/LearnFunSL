"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { CheckCircle, Star, Shield, Zap } from "lucide-react";

export function WhyChooseUsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const features = [
    {
      icon: <Star className="w-6 h-6" />,
      title: "Local Relevance",
      description:
        "Built specifically for Sri Lankan syllabuses and exam patterns",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Cultural Understanding",
      description:
        "Designed with deep understanding of local educational culture",
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "No-Cost Access",
      description: "Completely free platform with no hidden charges",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Real-World Impact",
      description: "Proven results with actual students and real exam success",
    },
  ];

  return (
    <section
      ref={ref}
      className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0.9, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0.9, y: 10 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="max-w-4xl mx-auto text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Why Choose LearnFun SL?
          </h2>

          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            Unlike generic study apps, LearnFun SL is built specifically for Sri
            Lankan syllabuses. Our tools are designed with real students and
            real exam struggles in mind — everything you need, nothing you
            don&apos;t.
          </p>

          <div className="bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400 mr-3" />
              <span className="text-2xl font-bold text-green-800 dark:text-green-300">
                100% Free Forever
              </span>
            </div>
            <p className="text-green-700 dark:text-green-300 text-lg">
              No subscriptions, no premium features, no hidden costs. Quality
              education should be accessible to everyone.
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0.95, y: 5 }}
              animate={
                isInView ? { opacity: 1, y: 0 } : { opacity: 0.95, y: 5 }
              }
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <div className="w-12 h-12 bg-blue-600 dark:bg-blue-500 rounded-lg flex items-center justify-center mb-4 text-white">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0.95, y: 5 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0.95, y: 5 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          className="mt-16 text-center"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Vast Variety of Resources
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              From past papers and textbooks to video lessons and AI-powered
              help, we provide everything you need for academic success in one
              place.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
