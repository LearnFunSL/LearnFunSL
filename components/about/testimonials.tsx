"use client";

import { motion, Variants } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    quote:
      "LearnFun SL has been a game-changer for my studies. The resources are top-notch and the AI tutor is incredibly helpful.",
    name: "Aisha Perera",
    title: "A/L Student, Colombo",
    avatar: "/avatars/aisha-perera.jpg",
  },
  {
    quote:
      "As a parent, I am so grateful for this platform. It's safe, free, and has genuinely helped my son improve his grades.",
    name: "Ravi de Silva",
    title: "Parent, Kandy",
    avatar: "/avatars/ravi-desilva.jpg",
  },
  {
    quote:
      "Finally, a platform that understands the needs of Sri Lankan students. The multilingual content is a huge advantage.",
    name: "Fathima Rizwan",
    title: "O/L Student, Galle",
    avatar: "/avatars/fathima-rizwan.jpg",
  },
];

export function Testimonials() {
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
            Loved by Students and Parents
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Hear what our community has to say about their experience with
            LearnFun SL.
          </p>
        </motion.div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="h-full flex flex-col">
                <CardContent className="p-6 flex-grow flex flex-col">
                  <Quote className="w-8 h-8 text-blue-500 mb-4" />
                  <blockquote className="text-gray-600 dark:text-gray-300 italic mb-6 flex-grow">
                    &quot;{testimonial.quote}&quot;
                  </blockquote>
                  <div className="flex items-center">
                    <Avatar className="w-12 h-12 mr-4">
                      <AvatarImage
                        src={testimonial.avatar}
                        alt={testimonial.name}
                      />
                      <AvatarFallback>
                        {testimonial.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {testimonial.title}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
