"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Star, Calendar, User, Building, MessageSquare, Lightbulb, Loader2 } from "lucide-react"
import Link from "next/link"

interface FeedbackData {
  id: number
  name: string | null
  branch: string
  rating: number
  valuable_topic: string | null
  feedback_comments: string | null
  created_at: string
}

export default function DataPage() {
  const [feedbackData, setFeedbackData] = useState<FeedbackData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchFeedbackData()
  }, [])

  const fetchFeedbackData = async () => {
    try {
      const response = await fetch("/api/data")
      if (!response.ok) {
        throw new Error("Failed to fetch data")
      }
      const data = await response.json()
      setFeedbackData(data)
    } catch (err) {
      setError("Failed to load feedback data")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} size={16} className={`${i < rating ? "fill-cyan-400 text-cyan-400" : "text-gray-600"}`} />
    ))
  }

  const getAverageRating = () => {
    if (feedbackData.length === 0) return 0
    const sum = feedbackData.reduce((acc, feedback) => acc + feedback.rating, 0)
    return (sum / feedbackData.length).toFixed(1)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black bg-fixed flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-cyan-400 mx-auto mb-4" />
          <p className="text-cyan-300 text-lg">Loading feedback data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black bg-fixed flex items-center justify-center p-4">
        <Card className="bg-black/30 backdrop-blur-xl border-red-400/25 max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <h2 className="text-red-400 text-xl font-bold mb-2">Connection Error</h2>
            <p className="text-red-300 mb-4">{error}</p>
            <div className="space-y-3">
              <Button
                onClick={fetchFeedbackData}
                variant="outline"
                className="border-cyan-400 text-cyan-400 bg-transparent hover:bg-cyan-400 hover:text-black w-full"
              >
                Try Again
              </Button>
              <Button
                onClick={() => window.open("/api/health", "_blank")}
                variant="outline"
                className="border-yellow-400 text-yellow-400 bg-transparent hover:bg-yellow-400 hover:text-black w-full"
              >
                Check Database Status
              </Button>
              <Link href="/">
                <Button className="bg-cyan-400 text-black hover:bg-cyan-300 w-full">Back to Form</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black bg-fixed p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-cyan-400 font-mono mb-2">Feedback Data</h1>
            <div className="flex flex-wrap gap-4 text-sm text-cyan-300">
              <span>Total Responses: {feedbackData.length}</span>
              <span>Average Rating: {getAverageRating()}/5</span>
            </div>
          </div>
          <Link href="/">
            <Button
              variant="outline"
              className="border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all duration-300 bg-transparent"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Form
            </Button>
          </Link>
        </motion.div>

        {/* Feedback Cards */}
        <div className="grid gap-6 md:gap-8">
          {feedbackData.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="bg-black/30 backdrop-blur-xl border-cyan-400/25">
                <CardContent className="p-8 text-center">
                  <p className="text-cyan-300 text-lg">No feedback data available yet.</p>
                  <Link href="/">
                    <Button className="mt-4 bg-cyan-400 text-black hover:bg-cyan-300">Submit First Feedback</Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            feedbackData.map((feedback, index) => (
              <motion.div
                key={feedback.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-black/30 backdrop-blur-xl border-cyan-400/25 shadow-lg shadow-cyan-400/5 hover:shadow-cyan-400/10 transition-all duration-300">
                  <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-cyan-400" />
                        <CardTitle className="text-cyan-300 text-lg">{feedback.name || "Anonymous"}</CardTitle>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          {renderStars(feedback.rating)}
                          <span className="text-cyan-300 ml-2 font-semibold">{feedback.rating}/5</span>
                        </div>
                        <Badge variant="outline" className="border-cyan-400/50 text-cyan-300">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(feedback.created_at)}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-cyan-400" />
                      <span className="text-cyan-300 font-semibold">Branch:</span>
                      <span className="text-cyan-100">{feedback.branch}</span>
                    </div>

                    {feedback.valuable_topic && (
                      <div className="bg-cyan-400/5 border border-cyan-400/20 rounded-lg p-4">
                        <div className="flex items-start gap-2 mb-2">
                          <Lightbulb className="w-4 h-4 text-cyan-400 mt-0.5" />
                          <span className="text-cyan-300 font-semibold">Most Valuable Topic:</span>
                        </div>
                        <p className="text-cyan-100 leading-relaxed pl-6">{feedback.valuable_topic}</p>
                      </div>
                    )}

                    {feedback.feedback_comments && (
                      <div className="bg-cyan-400/5 border border-cyan-400/20 rounded-lg p-4">
                        <div className="flex items-start gap-2 mb-2">
                          <MessageSquare className="w-4 h-4 text-cyan-400 mt-0.5" />
                          <span className="text-cyan-300 font-semibold">Comments:</span>
                        </div>
                        <p className="text-cyan-100 leading-relaxed pl-6">{feedback.feedback_comments}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
