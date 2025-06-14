"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { TrendingUp } from "lucide-react";

export function LearningPyramidSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const pyramidData = [
    {
      method: "Teaching others (Peer tutoring)",
      retention: 90,
      color: "bg-green-500",
    },
    {
      method: "Practice by doing (Past Papers)",
      retention: 75,
      color: "bg-blue-500",
    },
    { method: "Demonstrations", retention: 50, color: "bg-yellow-500" },
    { method: "Watching videos", retention: 30, color: "bg-orange-500" },
    { method: "Reading", retention: 10, color: "bg-red-400" },
    { method: "Listening to lectures", retention: 5, color: "bg-red-500" },
  ];

  return (
    <section ref={ref} className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Active Learning: The Science Behind Better Retention
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
              Our focus on past papers, videos, and peer support is
              scientifically proven to help you remember more and perform
              better.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Learning Pyramid Visualization */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-4"
            >
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                Learning Pyramid
              </h3>
              {pyramidData.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  animate={
                    isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }
                  }
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="relative"
                >
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                        {item.method}
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <motion.div
                          className={`h-2 rounded-full ${item.color}`}
                          initial={{ width: 0 }}
                          animate={
                            isInView
                              ? { width: `${item.retention}%` }
                              : { width: 0 }
                          }
                          transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                        />
                      </div>
                    </div>
                    <div className="ml-4 text-right">
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        {item.retention}%
                      </span>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        retention
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Explanation */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-6"
            >
              <div className="bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-900/30 dark:to-green-900/30 rounded-lg p-8">
                <div className="flex items-center mb-4">
                  <TrendingUp className="w-8 h-8 text-blue-600 dark:text-blue-400 mr-3" />
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    How LearnFun SL Maximizes Your Learning
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-3 h-3 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        Past Papers Practice (75% retention)
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300">
                        Active problem-solving with real exam questions
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        Video Lessons (30% retention)
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300">
                        Visual learning with curated educational content
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-3 h-3 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        Peer Tutoring (90% retention)
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300">
                        Teaching and learning from fellow students
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-blue-800 dark:text-blue-300 font-medium">
                    💡 Result: Up to 90% better retention compared to
                    traditional lecture-based learning!
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
