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

export function PrivacyPolicyContent() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="prose dark:prose-invert max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8"
    >
      <h1>Privacy Policy</h1>
      <p>
        <strong>Educational Resource Library</strong>
      </p>
      <p>
        <em>Effective Date: June 15, 2025</em>
        <br />
        <em>Last Updated: June 15, 2025</em>
      </p>

      <hr />

      <h2>Introduction</h2>
      <p>
        Welcome to Educational Resource Library (&quot;we,&quot;
        &quot;our,&quot; or &quot;us&quot;). We are committed to protecting your
        privacy and ensuring the security of your personal information. This
        Privacy Policy explains how we collect, use, disclose, and safeguard
        your information when you use our educational platform and services.
      </p>
      <p>
        <strong>Our Commitment:</strong> As a platform built by a student for
        students, we understand the importance of privacy, especially for young
        learners. We are committed to maintaining the highest standards of data
        protection and transparency.
      </p>

      <hr />

      <h2>Information We Collect</h2>
      <h3>Personal Information You Provide</h3>
      <p>When you create an account or use our services, we may collect:</p>
      <ul>
        <li>
          <strong>Account Information:</strong> Name, email address,
          grade/education level, language
        </li>
        <li>
          <strong>Contact Information:</strong> Email address for account
          verification and communication
        </li>
        <li>
          <strong>Study Data:</strong> Notes, flashcards, study schedules,
          progress tracking data
        </li>
        <li>
          <strong>User Content:</strong> Any content you create or upload to the
          platform
        </li>
      </ul>

      <h3>Automatically Collected Information</h3>
      <p>
        We automatically collect certain information when you use our platform:
      </p>
      <ul>
        <li>
          <strong>Usage Data:</strong> Pages visited, features used, time spent
          on platform, study patterns
        </li>
        <li>
          <strong>Device Information:</strong> Device type, operating system,
          browser type and version
        </li>
        <li>
          <strong>Log Data:</strong> IP address, access times, referring URLs
        </li>
        <li>
          <strong>Cookies and Similar Technologies:</strong> For functionality
          and user experience enhancement
        </li>
      </ul>

      <h3>Information from Third Parties</h3>
      <p>We may receive information from:</p>
      <ul>
        <li>
          <strong>Educational Institutions:</strong> If your school provides
          access to our platform
        </li>
        <li>
          <strong>Authentication Services:</strong> If you sign up using Google,
          Facebook, or other social logins
        </li>
        <li>
          <strong>Analytics Providers:</strong> Aggregated usage statistics and
          platform performance data
        </li>
      </ul>

      <hr />

      <h2>How We Use Your Information</h2>
      <p>We use your information for the following purposes:</p>

      <h3>Core Platform Functions</h3>
      <ul>
        <li>
          <strong>Account Management:</strong> Creating and maintaining your
          user account
        </li>
        <li>
          <strong>Educational Services:</strong> Providing access to study
          materials, flashcards, and learning tools
        </li>
        <li>
          <strong>Personalization:</strong> Customizing your learning experience
          and recommendations
        </li>
        <li>
          <strong>Progress Tracking:</strong> Monitoring your study progress and
          academic goals
        </li>
        <li>
          <strong>Content Delivery:</strong> Serving relevant educational
          content and resources
        </li>
      </ul>

      <h3>Platform Improvement</h3>
      <ul>
        <li>
          <strong>Analytics:</strong> Understanding how users interact with our
          platform to improve features
        </li>
        <li>
          <strong>Feature Development:</strong> Developing new tools and
          functionalities based on user needs
        </li>
        <li>
          <strong>Performance Optimization:</strong> Ensuring platform speed,
          reliability, and functionality
        </li>
        <li>
          <strong>Bug Fixes:</strong> Identifying and resolving technical issues
        </li>
      </ul>

      <h3>Communication</h3>
      <ul>
        <li>
          <strong>Account Updates:</strong> Notifying you about account changes,
          security updates
        </li>
        <li>
          <strong>Educational Content:</strong> Sharing study tips, new
          resources, and platform updates
        </li>
        <li>
          <strong>Support:</strong> Responding to your questions, concerns, and
          technical issues
        </li>
        <li>
          <strong>Community:</strong> Facilitating interaction with other users
          (if applicable)
        </li>
      </ul>

      <h3>Legal and Safety</h3>
      <ul>
        <li>
          <strong>Compliance:</strong> Meeting legal obligations and regulatory
          requirements
        </li>
        <li>
          <strong>Security:</strong> Protecting against fraud, abuse, and
          unauthorized access
        </li>
        <li>
          <strong>Enforcement:</strong> Enforcing our Terms of Service and
          community guidelines
        </li>
      </ul>

      <hr />

      <h2>Information Sharing and Disclosure</h2>
      <h3>We Do Not Sell Your Data</h3>
      <p>
        <strong>Important:</strong> We do not sell, rent, or trade your personal
        information to third parties for commercial purposes. Your data is not a
        product.
      </p>
      <h3>Limited Sharing Circumstances</h3>
      <p>We may share your information only in the following situations:</p>
      <ul>
        <li>
          <strong>Service Providers:</strong> With trusted third-party companies
          that help us operate our platform (hosting, analytics, email services)
          under strict confidentiality agreements.
        </li>
        <li>
          <strong>Legal Requirements:</strong> When required by law, court
          order, or government request, or to protect our rights, property, or
          safety.
        </li>
        <li>
          <strong>Business Transfers:</strong> In the unlikely event of a
          merger, acquisition, or sale of assets (with user notification and
          choice).
        </li>
        <li>
          <strong>Consent:</strong> When you explicitly consent to sharing your
          information for specific purposes.
        </li>
        <li>
          <strong>Aggregated Data:</strong> We may share anonymized, aggregated
          statistics that cannot identify individual users.
        </li>
      </ul>

      <hr />

      <h2>Data Security</h2>
      <h3>Our Security Measures</h3>
      <p>
        We implement industry-standard security measures to protect your
        information:
      </p>
      <ul>
        <li>
          <strong>Encryption:</strong> Data transmitted between your device and
          our servers is encrypted using SSL/TLS
        </li>
        <li>
          <strong>Secure Storage:</strong> Personal information is stored on
          secure servers with access controls
        </li>
        <li>
          <strong>Regular Updates:</strong> We regularly update our security
          protocols and software
        </li>
        <li>
          <strong>Access Controls:</strong> Limited access to personal data on a
          need-to-know basis
        </li>
        <li>
          <strong>Monitoring:</strong> Continuous monitoring for security
          threats and vulnerabilities
        </li>
      </ul>

      <h3>Your Role in Security</h3>
      <ul>
        <li>Use strong, unique passwords for your account</li>
        <li>Keep your login credentials confidential</li>
        <li>Log out from shared or public devices</li>
        <li>Report any suspicious activity immediately</li>
        <li>Keep your contact information updated</li>
      </ul>

      <hr />

      <h2>Your Rights and Choices</h2>
      <h3>Access and Control</h3>
      <p>You have the right to:</p>
      <ul>
        <li>
          <strong>Access:</strong> Request copies of your personal information
        </li>
        <li>
          <strong>Update:</strong> Modify or correct your account information at
          any time
        </li>
        <li>
          <strong>Delete:</strong> Request deletion of your account and
          associated data
        </li>
      </ul>

      <h3>Cookies and Tracking</h3>
      <p>You can manage cookies through:</p>
      <ul>
        <li>Browser settings to block or delete cookies</li>
        <li>Opting out of analytics tracking (where available)</li>
        <li>Using privacy-focused browser extensions</li>
      </ul>

      <hr />

      <h2>Special Protections for Minors</h2>
      <h3>Users Under 18</h3>
      <p>
        Given that many of our users are under 18, we take extra precautions:
      </p>
      <ul>
        <li>
          <strong>Minimal Data Collection:</strong> We collect only information
          necessary for educational purposes
        </li>
        <li>
          <strong>Parental Rights:</strong> Parents can request access to or
          deletion of their child&apos;s information
        </li>
        <li>
          <strong>Educational Purpose:</strong> All data use is focused on
          legitimate educational interests
        </li>
        <li>
          <strong>No Behavioral Advertising:</strong> We do not use student data
          for advertising purposes
        </li>
        <li>
          <strong>School Compliance:</strong> We comply with educational privacy
          laws like FERPA and COPPA
        </li>
      </ul>

      <hr />

      <h2>Data Retention</h2>
      <h3>How Long We Keep Your Data</h3>
      <ul>
        <li>
          <strong>Active Accounts:</strong> We retain your data while your
          account is active
        </li>
        <li>
          <strong>Inactive Accounts:</strong> Accounts inactive for 1+ years may
          be deleted after notification
        </li>
        <li>
          <strong>Legal Requirements:</strong> Some data may be retained longer
          to comply with legal obligations
        </li>
        <li>
          <strong>Study Progress:</strong> Educational progress data is retained
          to provide continuous learning support
        </li>
      </ul>

      <h3>Data Deletion</h3>
      <p>When data is deleted:</p>
      <ul>
        <li>
          Personal information is permanently removed from our active systems
        </li>
        <li>
          Backups containing your data are securely destroyed within 30 days
        </li>
        <li>
          Some aggregated, anonymized data may be retained for platform
          improvement
        </li>
      </ul>

      <hr />

      <h2>Third-Party Services</h2>
      <h3>Educational Content Providers</h3>
      <p>We may integrate with third-party educational services:</p>
      <ul>
        <li>Content is clearly labeled when provided by third parties</li>
        <li>Third-party privacy policies apply to their content</li>
        <li>We do not share your personal data without consent</li>
      </ul>

      <h3>Analytics and Performance</h3>
      <p>We use privacy-focused analytics tools:</p>
      <ul>
        <li>Google Analytics (with anonymized IP addresses)</li>
        <li>Performance monitoring services</li>
        <li>All configured to minimize personal data collection</li>
      </ul>

      <hr />

      <h2>Changes to This Privacy Policy</h2>
      <h3>Notification of Changes</h3>
      <p>We may update this Privacy Policy to reflect:</p>
      <ul>
        <li>Changes in our practices or services</li>
        <li>Legal or regulatory changes</li>
        <li>User feedback and platform improvements</li>
      </ul>

      <hr />

      <h2>Your Rights Under Different Laws</h2>
      <h3>Sri Lankan Data Protection Laws</h3>
      <p>
        We comply with all applicable Sri Lankan privacy and data protection
        regulations.
      </p>

      <hr />

      <h3>Complaints</h3>
      <p>
        If you believe we have not addressed your privacy concerns adequately:
      </p>
      <ul>
        <li>Contact your local data protection authority</li>
        <li>Seek legal advice regarding your rights</li>
        <li>File a complaint with relevant regulatory bodies</li>
      </ul>

      <hr />

      <h2>Conclusion</h2>
      <p>
        Your privacy is fundamental to our mission of providing accessible,
        quality education. This Privacy Policy reflects our commitment to
        transparency and protecting your personal information while delivering
        the best possible learning experience.
      </p>
      <p>
        <strong>Remember:</strong> This platform was built by a student who
        understands the importance of privacy and trust in the educational
        journey. We&apos;re committed to maintaining that trust through
        responsible data practices and transparent communication.
      </p>

      <hr />

      <p>
        <em>
          This Privacy Policy is part of our Terms of Service and should be read
          in conjunction with those terms.
        </em>
      </p>
      <p>
        <strong>Educational Resource Library</strong>
        <br />
        <em>Empowering students through accessible, quality education.</em>
      </p>
    </motion.div>
  );
}
