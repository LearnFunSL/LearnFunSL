---
trigger: model_decision
---

LearnFun SL - Product Requirements Document
1. Executive Summary
1.1 Product Overview
LearnFun SL is a comprehensive, multilingual web platform designed as a one-stop academic resource for Sri Lankan students from Grade 1 to 13. The platform provides access to organized past papers, textbooks, curated video lessons, and an AI-powered chatbot for subject help, career guidance, and motivation.
1.2 Mission Statement
To democratize quality education in Sri Lanka by providing equal access to learning resources in all three main languages (Sinhala, Tamil, English), bridging the gap between urban and rural education while supporting student mental health and academic performance.
1.3 Key Success Metrics
User Adoption: Target 1000+ active users within 6 months of launch
Content Engagement: 70% + of users accessing multiple resource types
AI Interaction: 50% + of users engaging with the AI chatbot
Geographic Reach: Users from at least 5 districts of Sri Lanka
Academic Impact: Measurable improvement in user academic performance
2. Problem Statement
2.1 Current Challenges in Sri Lankan Education
Accessibility Issues: Limited access to quality educational materials in rural areas
Language Barriers: Lack of comprehensive resources in native languages
Resource Inequality: Significant disparity between urban and rural school resources
Student Mental Health: High stress levels and dropout rates, including concerning suicide rates
Passive Learning: Over-reliance on rote learning methods
Fragmented Resources: Educational materials are scattered across different platforms
No creativity: Creativity is not well promoted
2.2 Target Pain Points
Students struggling to find past papers and textbooks
Lack of personalized academic support
Limited access to quality video lessons aligned with the local curriculum
Insufficient career guidance and motivation
Language-specific learning barriers
3. Target Audience
3.1 Primary Audience
Sri Lankan Students (Grades 1-13)
Demographics: Ages 6-18, all socioeconomic backgrounds
Priority Segments:
Low-performing or demotivated students
Students in under-resourced schools
Students in rural/remote areas
Language Preferences: Tamil, Sinhala, English
Device Usage: Primarily mobile devices, limited speed internet
3.2 Secondary Audience
Educators: School teachers and private tutors seeking supplementary resources
NGOs: Educational initiatives supporting Sri Lankan students
Parents: Seeking additional learning support for their children
3.3 User Personas
Persona 1: Rural Student - Kasun (Grade 10)
Lives in the Polonnaruwa district
Limited internet access, uses a mobile phone
Struggles with English-medium subjects
Lacks access to past papers and quality study materials
Prefers a Sinhala language interface
Persona 2: Urban Underperformer - Priya (Grade 12)
Lives in Colombo, with good internet access
Has resources but lacks motivation and guidance
Needs career counseling and study techniques
Bilingual (Tamil/English)
Persona 3: Teacher - Mr. Perera
Government school teacher in Kandy
Seeks supplementary materials for students
Wants to contribute quality content
Needs tools to track student progress
4. Product Goals and Objectives
4.1 Primary Goals
Improve Academic Performance: Provide structured access to essential learning materials
Reduce Educational Inequality: Offer equal access across all districts and languages
Enhance Student Engagement: Move from passive to active learning methods
Support Mental Health: Reduce academic stress through accessible support systems
Modernize Learning: Integrate AI-powered assistance into study habits
4.2 Success Criteria
Accessibility: 95% uptime with <3s load times
Content Coverage: 100+ past papers across all the core subjects
User Satisfaction: 4.5+ star rating from users
Geographic Distribution: Users from at least 5 districts within 6 months
Engagement: Average session duration >10 minutes
5. Product Features and Requirements
5.1 MVP Features (Launch Phase)
5.1.1 Past Papers Access
Description: Easy access to GCE O/L and A/L past papers. User Story: "As a student, I want to find and download past papers by subject and year so that I can practice for my exams."
Core Requirements:
Upload, categorize, and store PDF past papers (only by admins)
Search and filter by grade, year, term, type, and medium
PDF download functionality
Mobile-optimized interface

Acceptance Criteria:
Users can search papers within 2 clicks
Download speed <3 seconds for the average paper
Papers categorized with 99% accuracy
Mobile responsive design
5.1.2 Textbook Library
Description: Access to government textbooks and summaries. User Story: "As a student, I want to access textbook chapters and summaries so that I can study effectively without physical books."
Core Requirements:
Store and categorize textbook PDFs and summaries (by website admins)
Browse interface by grade and subject
A PDF download and text display for notes
Multilingual metadata support
Acceptance Criteria:
All Grade 1-13 core subject textbooks are available
Summaries available in all three languages
Search functionality across textbook content


5.1.3 Curated Video Lessons
Description: YouTube video collection aligned with the Sri Lankan curriculum. User Story: "As a student, I want to watch video lessons that match my syllabus so that I can understand difficult concepts better."
Core Requirements:
Store and categorize YouTube video links
Browse and filter interface
Embedded video player
Curriculum alignment tags
Acceptance Criteria:
Videos load within 3 seconds
All videos are pre-screened for quality and relevance
Playback works on mobile devices

5.1.4 AI Chatbot (Basic)
Description: Gemini 2.5 Flash-based chatbot with RAG system. User Story: "As a student, I want to ask questions about my studies and get helpful answers so that I can learn more effectively."
Core Requirements:
Gemini 2.5 Flash API integration
Vector database setup for RAG
Chat interface with conversation history
Rate limiting per user (20 per user/day)
Prompt engineering for educational responses
Acceptance Criteria:
Response time <2 seconds for queries
Accuracy rate >80% for curriculum-related questions
Support for all three languages
20 queries per day per user limit
Safety disclaimers included



5.1.5 Multilingual Support
Description: The interface is available in English, Sinhala, and Tamil. User Story: "As a student, I want to use the platform in my preferred language so that I can understand everything clearly."
Core Requirements:
next-i18next implementation
Translation JSON files for all three languages
Language switcher component
Localized content display
Acceptance Criteria:
Complete UI translation 
Language switching within 0.5 seconds
Font support for all scripts



5.2 Post-MVP Features (Future Releases)
5.2.1 Progress Tracker
Description: Personalized dashboard for learning progress. User Story: "As a student, I want to track my study progress so that I can stay motivated and organized."
Features:
Mark the content as completed
Visual progress dashboard
Subject-wise completion tracking
Study streak counters
5.2.2 Peer Tutoring
Description: Community-driven Q&A and mentorship. User Story: "As a student, I want to ask questions to other students and share my knowledge so that we can help each other learn."
Features:
Forum-style question posting
User reputation system
Direct messaging for tutoring
Subject-specific communities
5.2.3 Gamification
Description: Points, badges, and leaderboards for engagement. User Story: "As a student, I want to earn rewards for studying so that learning becomes more fun and motivating."
Features:
Point system for activities
Achievement badges
Leaderboards (optional participation)
Daily/weekly challenges
5.2.4 Teacher Portal
Description: Content contribution and validation system. User Story: "As a teacher, I want to upload and validate educational content so that I can contribute to student learning."
Features:
Content upload interface
Review and approval workflow
5.2.5 Admin Panel
Description: Web-based dashboard for managing platform content, users, and system operations. User Story: "As an admin, I want to manage all platform content and users so that I can maintain quality and monitor system performance with ease."
Features:
Content upload and categorization
User management and role assignment
AI chatbot monitoring and configuration
Analytics dashboard with usage metrics
Bulk content import via CSV
Content approval workflow
System settings and maintenance tools


6. Technical Architecture
6.1 Technology Stack
Frontend
Framework: React with Next.js (SSR, routing, i18n)
Styling: Tailwind CSS
Animations: Framer Motion
PWA: Next.js PWA plugin
Internationalization: next-i18next
Backend
Runtime: Node.js
Framework: Express.js via Next.js API routes
Deployment: Vercel serverless functions
Database & Storage
Primary Database: Supabase PostgreSQL
File Storage: Cloudflare R2
Vector Database: pinecone
Authentication: Clerk
External Services
AI: Google Gemini 2.5 Flash API
Videos: YouTube (embedded)
Analytics: PostHog
Infrastructure
Hosting: Vercel
CDN: Vercel Edge Network
CI/CD: Vercel GitHub integration
Monitoring: Vercel Analytics, Supabase Dashboard
6.2 System Architecture
The system follows a modern web architecture with the following components:
Client Layer: Next.js PWA with responsive design
API Layer: Serverless functions handling business logic
Data Layer: Supabase ecosystem for all data needs
AI Layer: RAG-enhanced Gemini integration
External Integrations: YouTube, Clerk, PostHog
6.3 Data Models
User Model
User {
  id: UUID
  email: String
  name: String
  grade: Integer
  preferred_language: Enum
  created_at: Timestamp
  last_active: Timestamp
}

Content Model
Content {
  id: UUID
  title: String
  type: Enum (pastpaper, textbook, other)
  subject: String
  grade: Integer
  year: Integer
  term: Integer
  medium: Enum
  file_url: String
  metadata: JSON
  created_at: Timestamp
}

7. User Experience Design
7.1 Design Principles
Mobile-First: Responsive design optimized for mobile devices and PCs
Accessibility: WCAG 2.1 AA compliance
Performance: Fast loading with progressive enhancement
Simplicity: Minimal clicks to reach content
Localization: Cultural sensitivity in design elements
7.2 User Journey
Primary User Flow
Landing: User arrives at the homepage
Language Selection: Choose preferred language (if not detected)
Navigation: Select main section (Resources/Videos/AI Help)
Filtering (resources): Choose grade -> content type -> subject -> resources 
Filtering (videos): choose grade -> subject -> unit -> videos
Content Access: download content
AI Interaction: Ask questions and receive contextual help in the AI chat section
Key Interactions
Search: Global search with smart suggestions
Filter: Multi-level filtering with clear labels
Download: One-click download.
Chat: Conversational AI interface with typing indicators
7.3 Interface Requirements
Response Time: <2 seconds for all page loads
Mobile Optimization: Touch-friendly interface with proper spacing
Offline Support: beautiful, loveable, smooth animated UI
Dark Mode: Optional dark theme for better mobile viewing
8. Content Strategy
8.1 Initial Content Requirements
Past Papers
Coverage: Grades 1-13
Subjects: Mother language (Tamil or Sinhala), Religion (Buddhism, Catholicism / Christianity, Islam, Hinduism), English language, Mathematics, Science, History, Business & Accounting Studies, Geography, Civic Education, Entrepreneurship Studies, Second Language - Sinhala, Second Language - Tamil, Music, Dance, Art, Appreciation of English Literary Texts (English Literature), Appreciation of Tamil Literary Texts (Tamil Literature), Appreciation of Arabic Literary Texts (Arabic Literature), Drama and Theatre, Information & Communication Technology, Agriculture & Food Technology, Home Economics, Health & Physical Education, 
Years: 2016 - 2025
Languages: All 3 mediums
Quantity: 100+ papers minimum
Textbooks
Source: Government-published NIE textbooks
Coverage: Grades 1-13 core subjects
Format: Full PDFs and chapter summaries
Languages: Sinhala, Tamil, English editions
Video Lessons
Source: Curated YouTube content
Criteria: Curriculum alignment, quality assessment
Coverage: all the core subjects across all grades
Duration: 10-30 minute lessons preferred
8.2 Content Management
Quality Assurance: Manual review before publishing
Categorization: Standardized tagging system
Updates: Regular content refresh and additions
Copyright Compliance: Only open-license or permitted content


9. AI and RAG System
9.1 AI Capabilities
Subject Help: Answer curriculum-specific questions
Career Guidance: Provide career path suggestions
Motivation: Offer encouragement and study tips
Language Support: Respond in the user's preferred language
9.2 RAG Implementation
Content Indexing: Textbook summaries and key concepts
Vector Storage: pinecone for embeddings
Retrieval: Semantic search for relevant context
Generation: Gemini 2.5 Flash with enhanced prompts
9.3 Safety and Limitations
Rate Limiting: 20 queries per day
Content Filtering: Inappropriate query detection
Disclaimers: Clear AI limitation notices
Only factual information about exam dates and others using the website search


10. Performance Requirements
10.1 Technical Performance
Page Load Time: <3 seconds for initial load
API Response Time: <2 seconds for data queries
AI Response Time: <3 seconds for chatbot queries
File Download: <5 seconds for average PDF
Uptime: 99.5% availability target
10.2 Scalability Requirements
Concurrent Users: Support 100+ simultaneous users
Database: Handle 10,000+ content items
Storage: Supports 10 GB+ of educational content
API Calls: 1,000+ daily AI queries

10.3 Mobile Performance
Low-bandwidth Support: Graceful degradation on slow connections
Battery Efficiency: Optimized for mobile device constraints
Data Usage: Minimal data consumption modes
Lag-free: lag-free smooth performance on lower-end devices
11. Security and Privacy
11.1 Data Protection
User Privacy: Minimal data collection, especially for minors
Authentication: Secure login with Clerk
Data Encryption: In-transit and at-rest encryption
GDPR Compliance: European privacy standards adherence
11.2 Content Security
Access Control: Role-based content access
Rate Limiting: Prevent abuse and scraping
API Security: Secure key management
File Protection: Signed URLs for sensitive content
11.3 AI Safety
Prompt Engineering: Prevent harmful or inappropriate responses
Content Filtering: Block inappropriate queries
Usage Monitoring: Track and analyze AI interactions
Bias Mitigation: Regular testing for cultural and language bias
12. Compliance and Legal
12.1 Educational Compliance
Curriculum Alignment: Adherence to Sri Lankan education standards
Content Licensing: Proper attribution and permissions
Government Relations: Compliance with the education ministry guidelines
12.2 Data Compliance
Local Regulations: Sri Lankan data protection laws
Terms of Service: Clear usage guidelines
Privacy Policy: Transparent data handling practices
13. Localization Strategy
13.1 Language Support
Primary Languages: English, Tamil, Sinhala
UI Translation: Complete interface localization
Content Translation: Key metadata and descriptions
Font Support: Proper rendering for all scripts
13.2 Cultural Considerations
Design Elements: Culturally appropriate colors and imagery
Content Curation: Local context and examples
User Behavior: Adaptation to local learning patterns
Accessibility: Support for diverse learning abilities
14. Launch Strategy
14.1 Pre-Launch Phase (Month 1)
MVP Development: Core features implementation
Content Collection: Initial 100+ papers and resources
Testing: User acceptance testing with target groups
Marketing Preparation: Brand identity and launch materials
14.2 Soft Launch (Month 2)
Beta Testing: Limited user group testing
Feedback Collection: User experience improvements
Performance Optimization: System tuning based on usage
Content Expansion: Additional subjects and grades
14.3 Public Launch (Month 3)
Marketing Campaign: Social media and educational partnerships
PR Outreach: Media coverage and influencer engagement
School Partnerships: Direct outreach to educational institutions
Community Building: User forums and support groups


15. Success Metrics and KPIs
15.1 User Metrics
Monthly Active Users (MAU): Target 1000+ within 6 months
Daily Active Users (DAU): Target 100+ within 6 months
User Retention: 70% week-1, 40% month-1 retention
Session Duration: Average 10+ minutes per session
Geographic Distribution: Users from at least 5 districts
15.2 Engagement Metrics
Content Downloads: 100+ monthly downloads
Video Views: 500+ monthly video views
AI Interactions: 100+ monthly chatbot queries
Feature Adoption: 70% of users accessing multiple features
Return Visits: 50% of users returning within a week
15.3 Performance Metrics
Page Load Speed: <3 seconds average
API Response Time: <2 seconds average
Uptime: 99.5% monthly uptime
Error Rate: <1% of all requests
Mobile Performance: 90+ Lighthouse score
15.4 Business Metrics
User Acquisition Cost: Track organic vs. paid acquisition
Content ROI: Usage per piece of content created
Support Tickets: <5% of users requiring support
Feature Requests: Track and prioritize user demands
16. Risk Assessment and Mitigation
16.1 Technical Risks
Scalability Issues: Mitigation through cloud-native architecture
API Limitations: Backup plans for AI service disruptions
Performance Degradation: Continuous monitoring and optimization
Security Breaches: Multi-layer security implementation

16.2 Content Risks
Copyright Issues: Strict licensing compliance
Content Quality: Manual review and user feedback systems
Outdated Materials: Regular content refresh cycles
Cultural Sensitivity: Local expert review process
16.3 User Adoption Risks
Low Awareness: Comprehensive marketing strategy
Poor User Experience: Extensive user testing
Competition: Unique value proposition focus
Technical Barriers: Progressive enhancement approach
17. Budget and Resource Planning
17.1 Development Costs
Personnel: solo (free)
Infrastructure: free
Content Creation: solo(free)
Design and UX: AI (free)
17.2 Operational Costs
Hosting: Vercel and Supabase free tiers
AI Services: Gemini API usage is free (500 RPD)
Authentication: Clerk free tier
Analytics: PostHog and monitoring tools free tier
17.3 Marketing Budget
Digital Marketing: Social media and online advertising
Content Marketing: Educational blog and resources
Partnership Development: School and NGO outreach
Community Building: Events and Workshops
$0 total budget



18. Timeline and Milestones
18.1 Development Timeline
Month 1: MVP Development
Week 1-2: Core infrastructure setup
Week 3-4: Feature implementation and testing
Month 2: Testing and Optimization
Week 1-2: User testing and feedback integration
Week 3-4: Performance optimization and content addition
Month 3: Launch Preparation
Week 1-2: Marketing material creation
Week 3-4: Soft launch and final preparations
18.2 Key Milestones
Technical MVP Complete: End of Month 1
Beta Testing Complete: Mid Month 2
Content Library Ready: End of Month 2
Public Launch: Beginning of Month 3
First 1,000 Users: End of Month 6
19. Future Roadmap
19.1 Short-term (6 months)
Progress tracking implementation
Mobile app development (PWA enhancement)
Advanced AI features and personalization
Teacher portal beta launch
19.2 Medium-term (12 months)
Peer tutoring platform
Gamification system
Premium subscription model
API for third-party integrations
19.3 Long-term (24 months)
Regional expansion (South Asian markets)
Advanced analytics and insights
AI-powered personalized learning paths
Enterprise solutions for schools
20. Conclusion
LearnFun SL represents a significant opportunity to transform education accessibility in Sri Lanka. By combining comprehensive content access, AI-powered assistance, and multilingual support, the platform addresses critical gaps in the current educational ecosystem.
The phased approach ensures rapid deployment of core functionality while building toward more advanced features. Success will be measured through user adoption, academic impact, and geographic reach across Sri Lanka's diverse educational landscape.
This PRD serves as the foundation for development, providing clear requirements and success criteria for all stakeholders involved in bringing LearnFun SL to Sri Lankan students.

