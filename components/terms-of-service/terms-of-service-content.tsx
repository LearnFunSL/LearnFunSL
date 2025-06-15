"use client";
import React from "react";
import { motion, Variants } from "framer-motion";

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeInOut",
    },
  },
};

export function TermsOfServiceContent() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="prose dark:prose-invert max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8"
    >
      <h1>Terms of Service</h1>
      <p>
        <strong>Educational Resource Library</strong>
      </p>
      <p>
        <em>Last Updated: June 15, 2025</em>
      </p>

      <hr />

      <h2>Welcome</h2>
      <p>
        By using Educational Resource Library, you agree to these terms. If
        you&apos;re under 18, make sure your parents know you&apos;re using our
        platform.
      </p>
      <p>
        <strong>Our Promise:</strong> This platform is completely free forever -
        no ads, no premium features, no hidden costs.
      </p>

      <hr />

      <h2>What We Provide</h2>
      <ul>
        <li>Free access to past papers, textbooks, and study materials</li>
        <li>Flashcards, notes, calendar, and progress tracking tools</li>
        <li>Video lectures and educational content</li>
        <li>A safe learning environment for students</li>
      </ul>

      <hr />

      <h2>Your Account</h2>
      <p>
        <strong>To use our platform:</strong>
      </p>
      <ul>
        <li>Provide accurate information when signing up</li>
        <li>Keep your password secure</li>
        <li>Don&apos;t share your account with others</li>
        <li>You&apos;re responsible for activity on your account</li>
      </ul>
      <p>
        <strong>Account Requirements:</strong>
      </p>
      <ul>
        <li>Must be at least 13 years old</li>
        <li>One account per person</li>
        <li>Contact us if someone else accesses your account</li>
      </ul>

      <hr />

      <h2>What You Can Do</h2>
      <p>
        ✅ <strong>Allowed:</strong>
      </p>
      <ul>
        <li>Use all resources for your personal study</li>
        <li>Create and share study materials</li>
        <li>Collaborate with other students</li>
        <li>Track your academic progress</li>
        <li>Access everything for free</li>
      </ul>

      <hr />

      <h2>What You Cannot Do</h2>
      <p>
        ❌ <strong>Not Allowed:</strong>
      </p>
      <ul>
        <li>Use the platform for anything illegal</li>
        <li>Harass, bully, or threaten other users</li>
        <li>Share current exam answers or cheat</li>
        <li>Upload inappropriate or harmful content</li>
        <li>Try to hack or damage our systems</li>
        <li>Use our content for commercial purposes</li>
        <li>Create multiple accounts</li>
      </ul>
      <p>
        <strong>Academic Integrity:</strong> Don&apos;t use our platform to
        cheat. Use it to learn better.
      </p>

      <hr />

      <h2>Your Content</h2>
      <ul>
        <li>You own the notes and materials you create</li>
        <li>We can store and display your content to provide our service</li>
        <li>
          Don&apos;t upload content that belongs to others without permission
        </li>
        <li>We may remove content that violates these terms</li>
      </ul>

      <hr />

      <h2>Our Content</h2>
      <ul>
        <li>
          Educational materials on our platform are for your personal study only
        </li>
        <li>Don&apos;t redistribute or sell our content</li>
        <li>Some content comes from third parties and has their own rules</li>
        <li>We respect copyright and expect you to do the same</li>
      </ul>

      <hr />

      <h2>Privacy</h2>
      <p>Your privacy matters to us:</p>
      <ul>
        <li>We don&apos;t sell your data (ever)</li>
        <li>We don&apos;t show ads</li>
        <li>We only collect information needed to help you study</li>
        <li>Read our Privacy Policy for full details</li>
        <li>Parents can contact us about their child&apos;s account</li>
      </ul>

      <hr />

      <h2>Platform Changes</h2>
      <p>We may:</p>
      <ul>
        <li>Add new features or remove old ones</li>
        <li>Update these terms (we&apos;ll notify you of major changes)</li>
        <li>Temporarily shut down for maintenance</li>
        <li>Make the platform better based on your feedback</li>
      </ul>

      <hr />

      <h2>Account Termination</h2>
      <p>
        <strong>You can:</strong>
      </p>
      <ul>
        <li>Delete your account anytime through settings</li>
        <li>Stop using the platform whenever you want</li>
      </ul>
      <p>
        <strong>We may suspend accounts if:</strong>
      </p>
      <ul>
        <li>You violate these terms</li>
        <li>You don&apos;t use your account for a very long time</li>
        <li>Required by law</li>
      </ul>

      <hr />

      <h2>Important Legal Stuff</h2>
      <p>
        <strong>Our Liability:</strong>
      </p>
      <ul>
        <li>We provide the platform &quot;as is&quot;</li>
        <li>
          We&apos;re not responsible if the platform is temporarily unavailable
        </li>
        <li>We&apos;re not liable for how you use the information you find</li>
        <li>Always verify important information from official sources</li>
      </ul>
      <p>
        <strong>Your Responsibility:</strong>
      </p>
      <ul>
        <li>You&apos;re responsible for how you use our platform</li>
        <li>Don&apos;t blame us if you violate your school&apos;s rules</li>
        <li>Follow your local laws and school policies</li>
      </ul>

      <hr />

      <h2>Disputes</h2>
      <p>If there&apos;s a problem:</p>
      <ol>
        <li>Contact us first - we want to help solve it</li>
        <li>Most issues can be resolved through friendly communication</li>
        <li>These terms are governed by Sri Lankan law</li>
      </ol>

      <hr />

      <h2>Contact Us</h2>
      <p>Questions about these terms?</p>
      <ul>
        <li>
          <strong>Email:</strong> eduhelpsl2025@gmail.com
        </li>
        <li>
          <strong>General Support:</strong> eduhelpsl2025@gmail.com
        </li>
      </ul>

      <hr />

      <h2>Final Notes</h2>
      <ul>
        <li>These terms work together with our Privacy Policy</li>
        <li>
          We may update these terms - we&apos;ll let you know about big changes
        </li>
        <li>
          If part of these terms doesn&apos;t work legally, the rest still
          applies
        </li>
        <li>This is a student-built platform focused on helping you succeed</li>
      </ul>
      <p>
        <strong>Remember:</strong> We created this platform to help students
        like you. Use it responsibly, be kind to others, and focus on learning!
      </p>

      <hr />

      <p>
        <em>Built by student Jeevagumar Abivarman for students worldwide</em>
      </p>
      <p>
        <strong>
          Educational Resource Library - Empowering students through accessible,
          quality education
        </strong>
      </p>
    </motion.div>
  );
}
