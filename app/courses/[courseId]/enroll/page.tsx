"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, Target, Zap, Settings, BookOpen } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function CourseEnrollPage({
  params,
}: {
  params: { courseId: string }
}) {
  const [selectedPace, setSelectedPace] = useState("mediocre")
  const [customDays, setCustomDays] = useState("")
  const [isEnrolling, setIsEnrolling] = useState(false)
  const router = useRouter()
  const [enrollmentMode, setEnrollmentMode] = useState("full")

  const paceOptions = [
    {
      id: "compact",
      title: "Compact Pace",
      description: "Intensive learning for quick completion",
      speed: "1.25x speed",
      duration: "30 days",
      icon: Zap,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      id: "mediocre",
      title: "Mediocre Pace",
      description: "Balanced approach for steady progress",
      speed: "1.0x speed",
      duration: "45 days",
      icon: Target,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      recommended: true,
    },
    {
      id: "lenient",
      title: "Lenient Pace",
      description: "Relaxed learning with flexible schedule",
      speed: "0.75x speed",
      duration: "60 days",
      icon: Clock,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      id: "custom",
      title: "Custom Pace",
      description: "Set your own target completion date",
      speed: "Custom speed",
      duration: "Your choice",
      icon: Settings,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ]

  const handleEnroll = async () => {
    setIsEnrolling(true)

    // Simulate enrollment process
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Redirect to course dashboard
    router.push(`/courses/${params.courseId}/dashboard`)
  }

  const getEstimatedCompletion = () => {
    switch (selectedPace) {
      case "compact":
        return "30 days"
      case "mediocre":
        return "45 days"
      case "lenient":
        return "60 days"
      case "custom":
        return customDays ? `${customDays} days` : "Not set"
      default:
        return "45 days"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <Button asChild variant="outline" className="mb-4">
            <Link href={`/courses/${params.courseId}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Course
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Enroll in Course</h1>
            <p className="text-gray-600 mt-1">Choose your learning pace and start your journey</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Course Info */}
          <Card>
            <CardHeader>
              <CardTitle>Quantum Mechanics Fundamentals</CardTitle>
              <CardDescription>
                Comprehensive introduction to quantum mechanics covering wave-particle duality, uncertainty principle,
                and fundamental quantum concepts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <span>12 weeks • 24 chapters</span>
                <span>Intermediate level</span>
                <span>Physics</span>
                <Badge variant="secondary">Free Course</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Learning Pace Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Choose Your Learning Pace</CardTitle>
              <CardDescription>
                Select a pace that fits your schedule and learning style. You can always adjust this later.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={selectedPace} onValueChange={setSelectedPace} className="space-y-4">
                {paceOptions.map((option) => (
                  <div key={option.id} className="relative">
                    <RadioGroupItem value={option.id} id={option.id} className="peer sr-only" />
                    <Label
                      htmlFor={option.id}
                      className="flex cursor-pointer items-start space-x-4 rounded-lg border-2 border-gray-200 p-4 transition-all hover:border-gray-300 peer-checked:border-blue-500 peer-checked:bg-blue-50"
                    >
                      <div className={`p-2 rounded-lg ${option.bgColor}`}>
                        <option.icon className={`h-5 w-5 ${option.color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold">{option.title}</h3>
                          {option.recommended && (
                            <Badge variant="default" className="text-xs">
                              Recommended
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm">
                          <span className={`font-medium ${option.color}`}>{option.speed}</span>
                          <span className="text-gray-500">Target: {option.duration}</span>
                        </div>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              {/* Custom Pace Input */}
              {selectedPace === "custom" && (
                <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <Label htmlFor="customDays" className="text-sm font-medium">
                    Target completion (days)
                  </Label>
                  <Input
                    id="customDays"
                    type="number"
                    placeholder="e.g., 90"
                    value={customDays}
                    onChange={(e) => setCustomDays(e.target.value)}
                    className="mt-2 max-w-xs"
                    min="1"
                    max="365"
                  />
                  <p className="text-xs text-purple-700 mt-1">Choose between 1-365 days based on your availability</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Enrollment Mode Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Enrollment Mode</CardTitle>
              <CardDescription>Choose how you want to engage with this course content.</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={enrollmentMode} onValueChange={setEnrollmentMode} className="space-y-4">
                <div className="relative">
                  <RadioGroupItem value="full" id="full" className="peer sr-only" />
                  <Label
                    htmlFor="full"
                    className="flex cursor-pointer items-start space-x-4 rounded-lg border-2 border-gray-200 p-4 transition-all hover:border-gray-300 peer-checked:border-blue-500 peer-checked:bg-blue-50"
                  >
                    <div className="p-2 rounded-lg bg-blue-50">
                      <Target className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">Full Enrollment</h3>
                        <Badge variant="default" className="text-xs">
                          Recommended
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Engage with all activities, track progress, and earn a certificate
                      </p>
                      <div className="flex items-center space-x-4 mt-2 text-sm">
                        <span className="text-green-600">✓ All study materials</span>
                        <span className="text-green-600">✓ Assignments & exams</span>
                        <span className="text-green-600">✓ Progress tracking</span>
                      </div>
                    </div>
                  </Label>
                </div>

                <div className="relative">
                  <RadioGroupItem value="viewer" id="viewer" className="peer sr-only" />
                  <Label
                    htmlFor="viewer"
                    className="flex cursor-pointer items-start space-x-4 rounded-lg border-2 border-gray-200 p-4 transition-all hover:border-gray-300 peer-checked:border-purple-500 peer-checked:bg-purple-50"
                  >
                    <div className="p-2 rounded-lg bg-purple-50">
                      <BookOpen className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">Viewer Mode</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Access all study materials without assignments, progress tracking, or formal assessment
                      </p>
                      <div className="flex items-center space-x-4 mt-2 text-sm">
                        <span className="text-green-600">✓ All study materials</span>
                        <span className="text-gray-500">✗ No assignments</span>
                        <span className="text-green-600">✓ TestGen access</span>
                      </div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Enrollment Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Enrollment Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Selected Pace:</span>
                  <span className="font-medium">{paceOptions.find((p) => p.id === selectedPace)?.title}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Estimated Completion:</span>
                  <span className="font-medium">{getEstimatedCompletion()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Course Price:</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Enrollment Mode:</span>
                  <span className="font-medium">{enrollmentMode === "full" ? "Full Enrollment" : "Viewer Mode"}</span>
                </div>
                <div className="border-t pt-4">
                  <Button
                    onClick={handleEnroll}
                    disabled={isEnrolling || (selectedPace === "custom" && !customDays)}
                    className="w-full"
                    size="lg"
                  >
                    {isEnrolling ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                        Enrolling...
                      </>
                    ) : (
                      "Enroll & Start Learning"
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* What's Included */}
          <Card>
            <CardHeader>
              <CardTitle>What's Included</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Learning Materials</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 24 comprehensive chapters</li>
                    <li>• Video lectures and demonstrations</li>
                    <li>• Interactive presentations</li>
                    <li>• Formula sheets and summaries</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Assessments & Support</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Daily assignments and quizzes</li>
                    <li>• Weekly and midcourse exams</li>
                    <li>• AI tutoring assistance</li>
                    <li>• Community discussion forums</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
