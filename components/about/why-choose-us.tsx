"use client";

import { motion, Variants } from "framer-motion";
import { BadgeCheck, Zap, TrendingUp, Users } from "lucide-react";

const features = [
  {
    icon: <BadgeCheck className="w-6 h-6 text-white" />,
    title: "100% Free",
    description:
      "No subscription fees, ever. All features are available to every student.",
  },
  {
    icon: <Zap className="w-6 h-6 text-white" />,
    title: "No Advertisements",
    description:
      "Enjoy a clean, distraction-free learning environment to help you focus.",
  },
  {
    icon: <TrendingUp className="w-6 h-6 text-white" />,
    title: "No Premium Tiers",
    description:
      "We believe in equality. Every user gets access to the same powerful tools.",
  },
  {
    icon: <Users className="w-6 h-6 text-white" />,
    title: "Open Access",
    description:
      "No registration barriers for basic resources. Access what you need, when you need it.",
  },
];

export function WhyChooseUs() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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
            Why Completely Free?
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            We believe that access to quality educational resources
            shouldn&apos;t depend on your family&apos;s financial situation.
            Education is a fundamental right.
          </p>
        </motion.div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-600 text-white mb-4">
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
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 max-w-2xl mx-auto"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-4">
              Our Sustainability Model
            </h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li className="flex items-start">
                <BadgeCheck className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                <span>
                  <strong>Personal Investment:</strong> Sustained through the
                  founder&apos;s commitment.
                </span>
              </li>
              <li className="flex items-start">
                <BadgeCheck className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                <span>
                  <strong>Efficient Technology:</strong> Using modern tech to
                  minimize operational costs.
                </span>
              </li>
              <li className="flex items-start">
                <BadgeCheck className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                <span>
                  <strong>Community Support:</strong> Relying on user
                  contributions and feedback.
                </span>
              </li>
              <li className="flex items-start">
                <BadgeCheck className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                <span>
                  <strong>Future Partnerships:</strong> Exploring collaborations
                  without compromising our free model.
                </span>
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
