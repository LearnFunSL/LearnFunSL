"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import {
  FileText,
  BookOpen,
  Video,
  MessageCircle,
  BarChart3,
  Users,
  Trophy,
  GraduationCap,
  CreditCard,
  Calendar,
  Globe,
  Search,
  Wifi,
  Target,
} from "lucide-react"

export function FeaturesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const features = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Past Papers",
      description: "Organized by subject, grade, term, year, and medium; searchable and downloadable",
      status: "available",
      color: "blue",
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Textbooks",
      description: "Full PDFs, summaries, or chapter-wise notes for comprehensive study",
      status: "available",
      color: "green",
    },
    {
      icon: <Video className="w-6 h-6" />,
      title: "Video Lessons",
      description: "Curated from YouTube; filtered for local curriculum relevance",
      status: "available",
      color: "red",
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "AI Chatbot",
      description: "AI-based bot for subject help, career guidance, and motivation",
      status: "available",
      color: "purple",
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Progress Tracker",
      description: "Dashboard to track chapter progress and learning milestones",
      status: "coming",
      color: "orange",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Peer Tutoring",
      description: "Student-led Q&A or mentorship for collaborative learning",
      status: "coming",
      color: "teal",
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      title: "Gamification",
      description: "Points and badges for activities like solving quizzes or daily login",
      status: "coming",
      color: "yellow",
    },
    {
      icon: <GraduationCap className="w-6 h-6" />,
      title: "Teacher Portal",
      description: "Secure content upload and validation by certified teachers",
      status: "coming",
      color: "indigo",
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: "Flash Cards",
      description: "Create, edit, delete, and manage decks and flashcards",
      status: "available",
      color: "pink",
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Calendar",
      description: "Keep organized and planned with calendars and notes",
      status: "available",
      color: "cyan",
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Multilingual Content",
      description: "All resources and UI in Sinhala, Tamil, and English",
      status: "available",
      color: "emerald",
    },
    {
      icon: <Search className="w-6 h-6" />,
      title: "Smart Search",
      description: "Fast search with filters by subject, grade, year, and medium",
      status: "available",
      color: "slate",
    },
    {
      icon: <Wifi className="w-6 h-6" />,
      title: "Offline Mode",
      description: "Access key content even without internet connection",
      status: "coming",
      color: "stone",
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Personalized Recommendations",
      description: "Smart suggestions based on progress and learning patterns",
      status: "coming",
      color: "rose",
    },
  ]

  const getColorClasses = (color: string, status: string) => {
    const baseColors = {
      blue: status === "available" ? "bg-blue-500 text-white" : "bg-blue-100 text-blue-600",
      green: status === "available" ? "bg-green-500 text-white" : "bg-green-100 text-green-600",
      red: status === "available" ? "bg-red-500 text-white" : "bg-red-100 text-red-600",
      purple: status === "available" ? "bg-purple-500 text-white" : "bg-purple-100 text-purple-600",
      orange: status === "available" ? "bg-orange-500 text-white" : "bg-orange-100 text-orange-600",
      teal: status === "available" ? "bg-teal-500 text-white" : "bg-teal-100 text-teal-600",
      yellow: status === "available" ? "bg-yellow-500 text-white" : "bg-yellow-100 text-yellow-600",
      indigo: status === "available" ? "bg-indigo-500 text-white" : "bg-indigo-100 text-indigo-600",
      pink: status === "available" ? "bg-pink-500 text-white" : "bg-pink-100 text-pink-600",
      cyan: status === "available" ? "bg-cyan-500 text-white" : "bg-cyan-100 text-cyan-600",
      emerald: status === "available" ? "bg-emerald-500 text-white" : "bg-emerald-100 text-emerald-600",
      slate: status === "available" ? "bg-slate-500 text-white" : "bg-slate-100 text-slate-600",
      stone: status === "available" ? "bg-stone-500 text-white" : "bg-stone-100 text-stone-600",
      rose: status === "available" ? "bg-rose-500 text-white" : "bg-rose-100 text-rose-600",
    }
    return baseColors[color as keyof typeof baseColors] || "bg-gray-500 text-white"
  }

  return (
    <section ref={ref} className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Comprehensive Learning Features</h2>
          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Everything you need for academic success, from past papers to AI-powered assistance, all in one
            comprehensive platform.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              className={`bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 ${
                feature.status === "available" ? "border-green-500" : "border-orange-500"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(feature.color, feature.status)}`}
                >
                  {feature.icon}
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    feature.status === "available" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"
                  }`}
                >
                  {feature.status === "available" ? "✅ Available" : "🚧 Coming Soon"}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-lg p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Learning Experience?</h3>
            <p className="text-lg mb-6 opacity-90">
              Join thousands of Sri Lankan students who are already improving their academic performance with LearnFun
              SL.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300"
            >
              Get Started Today - It's Free!
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
