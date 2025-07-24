"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Star, Loader2, Database } from "lucide-react"
import Link from "next/link"

interface FormData {
  name: string
  branch: string
  rating: number
  valuableTopic: string
  feedbackComments: string
}

export default function FeedbackForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    branch: "",
    rating: 0,
    valuableTopic: "",
    feedbackComments: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hoveredStar, setHoveredStar] = useState(0)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.branch || !formData.rating) {
      toast({
        title: "Missing Information",
        description: "Please fill in your branch name and rating.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Feedback Submitted! 🎉",
          description: "Thank you for your valuable feedback!",
        })
        // Reset form
        setFormData({
          name: "",
          branch: "",
          rating: 0,
          valuableTopic: "",
          feedbackComments: "",
        })
      } else {
        throw new Error("Failed to submit feedback")
      }
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black bg-fixed p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with navigation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-cyan-400 font-mono">Java FS Feedback</h1>
          <Link href="/data">
            <Button
              variant="outline"
              className="border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all duration-300 bg-transparent"
            >
              <Database className="w-4 h-4 mr-2" />
              View Data
            </Button>
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Card className="bg-black/30 backdrop-blur-xl border-cyan-400/25 shadow-2xl shadow-cyan-400/10">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl md:text-4xl font-bold text-cyan-300 font-mono">
                💻 Java Full Stack Feedback
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                  <Label htmlFor="name" className="text-cyan-300 font-semibold text-base">
                    Your Name (Optional):
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="mt-2 bg-black/60 border-cyan-400 text-cyan-100 placeholder:text-cyan-300/60 focus:border-cyan-300 focus:ring-cyan-300/20"
                  />
                </motion.div>

                {/* Branch Field */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                  <Label htmlFor="branch" className="text-cyan-300 font-semibold text-base">
                    Your Branch Name: *
                  </Label>
                  <Input
                    id="branch"
                    type="text"
                    placeholder="Enter your branch name"
                    value={formData.branch}
                    onChange={(e) => handleInputChange("branch", e.target.value)}
                    className="mt-2 bg-black/60 border-cyan-400 text-cyan-100 placeholder:text-cyan-300/60 focus:border-cyan-300 focus:ring-cyan-300/20"
                    required
                  />
                </motion.div>

                {/* Star Rating */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                  <Label className="text-cyan-300 font-semibold text-base">Overall Rating for the Training: *</Label>
                  <div className="flex justify-center mt-4 gap-2">
                    {[5, 4, 3, 2, 1].map((star) => (
                      <motion.button
                        key={star}
                        type="button"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 1.4 }}
                        onMouseEnter={() => setHoveredStar(star)}
                        onMouseLeave={() => setHoveredStar(0)}
                        onClick={() => handleInputChange("rating", star)}
                        className="focus:outline-none"
                      >
                        <Star
                          size={48}
                          className={`transition-all duration-200 ${
                            star <= (hoveredStar || formData.rating)
                              ? "fill-cyan-400 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                              : "text-gray-600 hover:text-cyan-400/50"
                          }`}
                        />
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* Most Valuable Topic */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                  <Label htmlFor="valuable" className="text-cyan-300 font-semibold text-base">
                    Most Valuable Topic You Learned:
                  </Label>
                  <Textarea
                    id="valuable"
                    placeholder="What concept helped you the most..."
                    value={formData.valuableTopic}
                    onChange={(e) => handleInputChange("valuableTopic", e.target.value)}
                    className="mt-2 bg-black/60 border-cyan-400 text-cyan-100 placeholder:text-cyan-300/60 focus:border-cyan-300 focus:ring-cyan-300/20 min-h-[100px]"
                    rows={4}
                  />
                </motion.div>

                {/* Trainer Description */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-cyan-400/5 border border-cyan-400/20 rounded-lg p-4"
                >
                  <Label className="text-cyan-300 font-semibold text-base">About Your Trainer:</Label>
                  <p className="mt-2 text-cyan-200/80 text-sm leading-relaxed">
                    Your trainer is a passionate and experienced Java Full Stack Developer and Instructor. Known for
                    breaking down complex concepts into simple, real-world examples, he focuses on hands-on coding,
                    industry-relevant projects, and guiding each student with personalized attention throughout the
                    training journey.
                  </p>
                </motion.div>

                {/* Feedback Comments */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
                  <Label htmlFor="feedback" className="text-cyan-300 font-semibold text-base">
                    Your Comments on the Training:
                  </Label>
                  <Textarea
                    id="feedback"
                    placeholder="Write your feedback here..."
                    value={formData.feedbackComments}
                    onChange={(e) => handleInputChange("feedbackComments", e.target.value)}
                    className="mt-2 bg-black/60 border-cyan-400 text-cyan-100 placeholder:text-cyan-300/60 focus:border-cyan-300 focus:ring-cyan-300/20 min-h-[100px]"
                    rows={4}
                  />
                </motion.div>

                {/* Submit Button */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-transparent border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all duration-300 text-lg font-semibold py-6 tracking-wider uppercase shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.6)]"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Feedback"
                    )}
                  </Button>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
