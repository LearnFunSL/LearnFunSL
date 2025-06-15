"use client";

import { AboutHero } from "@/components/about/about-hero";
import { FounderStory } from "@/components/about/founder-story";
import { MissionVision } from "@/components/about/mission-vision";
import { Testimonials } from "@/components/about/testimonials";
import { WhyChooseUs } from "@/components/about/why-choose-us";
import { FaqSection } from "@/components/about/faq-section";
import { ContactSection } from "@/components/about/contact-section";

export default function AboutUsPage() {
  return (
    <div className="flex flex-col gap-16 md:gap-24">
      <AboutHero />
      <FounderStory />
      <MissionVision />
      <WhyChooseUs />
      <Testimonials />
      <FaqSection />
      <ContactSection />
    </div>
  );
}
