"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, Video, MessageCircle, ArrowRight } from "lucide-react";

export function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section className="relative bg-background py-20 lg:py-32 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto text-center"
        >
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight"
          >
            Empowering Sri Lankan Students with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-600">
              Modern Learning Tools
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl sm:text-2xl text-muted-foreground mb-8 leading-relaxed max-w-3xl mx-auto"
          >
            Accessible, multilingual study resources to improve academic success
            and reduce stress
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <Button
              asChild
              size="lg"
              className="px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <Link href="/resources">
                <BookOpen className="w-5 h-5 mr-2" />
                Explore Resources
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="secondary"
              className="px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300 group"
            >
              <Link href="/videos">
                <Video className="w-5 h-5 mr-2" />
                Watch Videos
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300 group"
            >
              <Link href="/ai-help">
                <MessageCircle className="w-5 h-5 mr-2" />
                AI Chat Help
              </Link>
            </Button>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-chart-1 mb-2">100%</div>
              <div className="text-muted-foreground">Free Access</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-chart-2 mb-2">3</div>
              <div className="text-muted-foreground">Languages</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-chart-3 mb-2">1000+</div>
              <div className="text-muted-foreground">Resources</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
