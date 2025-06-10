"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { TrendingUp } from "lucide-react";

export function LearningPyramidSection() {
  const sectionRef = useRef(null);
  const pyramidRef = useRef(null);
  const isSectionInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const isPyramidInView = useInView(pyramidRef, { once: true, amount: 0.2 });

  const pyramidData = [
    {
      method: "Teaching others (Peer tutoring)",
      retention: 90,
      color: "bg-chart-1",
    },
    {
      method: "Practice by doing (Past Papers)",
      retention: 75,
      color: "bg-chart-2",
    },
    { method: "Demonstrations", retention: 50, color: "bg-chart-3" },
    { method: "Watching videos", retention: 30, color: "bg-chart-4" },
    { method: "Reading", retention: 10, color: "bg-chart-5" },
    { method: "Listening to lectures", retention: 5, color: "bg-destructive" },
  ];

  return (
    <section ref={sectionRef} className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={
            isSectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
          }
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
              Active Learning: The Science Behind Better Retention
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Our focus on past papers, videos, and peer support is
              scientifically proven to help you remember more and perform
              better.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Learning Pyramid Visualization */}
            <motion.div
              ref={pyramidRef}
              initial={{ opacity: 0, x: -50 }}
              animate={
                isSectionInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }
              }
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-4"
            >
              <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
                Learning Pyramid
              </h3>
              {pyramidData.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  animate={
                    isPyramidInView
                      ? { opacity: 1, x: 0 }
                      : { opacity: 0, x: -30 }
                  }
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="relative"
                >
                  <div className="flex items-center justify-between p-4 bg-card rounded-lg hover:bg-accent transition-colors duration-300">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-foreground mb-1">
                        {item.method}
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                        <motion.div
                          className={`h-2 rounded-full ${item.color}`}
                          initial={{ width: 0 }}
                          animate={
                            isPyramidInView
                              ? { width: `${item.retention}%` }
                              : { width: 0 }
                          }
                          transition={{
                            duration: 1,
                            delay: 0.3 + index * 0.1,
                            ease: "easeOut",
                          }}
                        />
                      </div>
                    </div>
                    <div className="ml-4 text-right">
                      <span className="text-2xl font-bold text-foreground">
                        {item.retention}%
                      </span>
                      <div className="text-xs text-muted-foreground">
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
              animate={
                isSectionInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }
              }
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-6"
            >
              <div className="bg-accent rounded-lg p-8">
                <div className="flex items-center mb-4">
                  <TrendingUp className="w-8 h-8 text-primary mr-3" />
                  <h3 className="text-2xl font-bold text-foreground">
                    How LearnFun SL Maximizes Your Learning
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-3 h-3 bg-chart-2 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-foreground">
                        Past Papers Practice (75% retention)
                      </h4>
                      <p className="text-muted-foreground">
                        Active problem-solving with real exam questions
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-3 h-3 bg-chart-4 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-foreground">
                        Video Lessons (30% retention)
                      </h4>
                      <p className="text-muted-foreground">
                        Visual learning with curated educational content
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-3 h-3 bg-chart-1 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-foreground">
                        Peer Tutoring (90% retention)
                      </h4>
                      <p className="text-muted-foreground">
                        Teaching and learning from fellow students
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-card rounded-lg border">
                  <p className="text-primary font-medium">
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
