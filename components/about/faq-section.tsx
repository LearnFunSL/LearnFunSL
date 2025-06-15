"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Is the platform really completely free?",
    answer:
      "Yes! There are no hidden costs, premium features, or advertisements. Every tool and resource is available to every student at no cost.",
  },
  {
    question: "How do you keep the platform running without charging users?",
    answer:
      "The platform is currently sustained through personal investment and efficient technology use. We're committed to keeping it free for students while exploring sustainable funding models that don't compromise our mission.",
  },
  {
    question: "Can I access the platform on my mobile device?",
    answer:
      "Yes! Our platform is fully responsive and works seamlessly on smartphones, tablets, and computers. We're also developing dedicated mobile apps.",
  },
  {
    question: "How often is content updated?",
    answer:
      "We regularly update our content library with new past papers, resources, and features based on curriculum changes and user feedback.",
  },
  {
    question: "Can I contribute content to the platform?",
    answer:
      "We welcome community contributions! Students and teachers can suggest resources, share study materials, and provide feedback to help improve the platform.",
  },
];

export function FaqSection() {
  return (
    <section className="py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Frequently Asked Questions
          </h2>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
