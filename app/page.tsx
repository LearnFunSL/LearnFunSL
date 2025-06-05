"use client";
import { HeroSection } from "@/components/hero-section";
import { AboutSection } from "@/components/about-section";
import { WhyChooseUsSection } from "@/components/why-choose-us-section";
import { LearningPyramidSection } from "@/components/learning-pyramid-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { FeaturesSection } from "@/components/features-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <WhyChooseUsSection />
      <LearningPyramidSection />
      <TestimonialsSection />
      <FeaturesSection />
    </>
  );
}
