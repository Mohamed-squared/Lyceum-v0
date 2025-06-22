"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sparkles, CheckCircle, Clock, AlertCircle, Loader2, ArrowRight } from "lucide-react"
import Link from "next/link"
import { getGenerationProgress } from "@/lib/api"
import type { GenerationStep } from "@/lib/mock-data"

interface GenerationProgressData {
  progress: number
  currentStep: string
  steps: GenerationStep[]
  estimatedTimeRemaining: string
}

export default function CourseGenerationPage({
  params,
}: {
  params: { courseId: string }
}) {
  const [data, setData] = useState<GenerationProgressData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const progressData = await getGenerationProgress(params.courseId)
        setData(progressData)

        if (progressData.progress >= 100) {
          setIsComplete(true)
        }
      } catch (error) {
        console.error("Failed to fetch generation progress:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProgress()

    // Simulate progress updates
    if (!isComplete) {
      const interval = setInterval(() => {
        fetchProgress()
      }, 3000)

      return () => clearInterval(interval)
    }
  }, [params.courseId, isComplete])

  const getStatusIcon = (status: GenerationStep["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "in-progress":
        return <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
      case "failed":
        return <AlertCircle className="h-5 w-5 text-red-600" />
      default:
        return <Clock className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusColor = (status: GenerationStep["status"]) => {
    switch (status) {
      case "completed":
        return "text-green-600"
      case "in-progress":
        return "text-blue-600"
      case "failed":
        return "text-red-600"
      default:
        return "text-gray-500"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Failed to load generation progress</h2>
          <p className="text-gray-600">Please try refreshing the page</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Course Generation in Progress</h1>
              <p className="text-gray-600 mt-1">Your AI-powered course is being created</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="px-3 py-1">
                Course ID: {params.courseId}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Overall Progress */}
          <Card>
            <CardHeader className="text-center">
              <div className="flex items-center justify-center mb-4">
                {isComplete ? (
                  <CheckCircle className="h-12 w-12 text-green-600" />
                ) : (
                  <Sparkles className="h-12 w-12 text-blue-600 animate-pulse" />
                )}
              </div>
              <CardTitle className="text-2xl">
                {isComplete ? "Course Generation Complete!" : "AI Course Generation in Progress"}
              </CardTitle>
              <CardDescription>
                {isComplete
                  ? "Your course has been successfully created and is ready for use"
                  : `Please don't close this page. Estimated time remaining: ${data.estimatedTimeRemaining}`}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Overall Progress</span>
                  <span>{data.progress}%</span>
                </div>
                <Progress value={data.progress} className="h-3" />
              </div>

              {!isComplete && (
                <div className="text-center">
                  <p className="text-lg font-medium text-blue-600">{data.currentStep}</p>
                </div>
              )}

              {isComplete && (
                <div className="text-center space-y-4">
                  <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
                  <div>
                    <p className="text-green-600 font-semibold text-lg">Course created successfully!</p>
                    <p className="text-sm text-gray-600">You can now manage your course and start enrolling students</p>
                  </div>
                  <div className="flex justify-center space-x-4">
                    <Button asChild>
                      <Link href={`/courses/${params.courseId}`}>
                        View Course <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link href={`/courses/${params.courseId}/manage`}>Manage Course</Link>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Detailed Steps */}
          <Card>
            <CardHeader>
              <CardTitle>Generation Steps</CardTitle>
              <CardDescription>Detailed progress of each generation phase</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.steps.map((step, index) => (
                  <div key={step.id} className="flex items-start space-x-4 p-4 rounded-lg border">
                    <div className="flex-shrink-0 mt-1">{getStatusIcon(step.status)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className={`font-medium ${getStatusColor(step.status)}`}>{step.title}</h3>
                        <Badge
                          variant={
                            step.status === "completed"
                              ? "default"
                              : step.status === "in-progress"
                                ? "secondary"
                                : step.status === "failed"
                                  ? "destructive"
                                  : "outline"
                          }
                        >
                          {step.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* What's Happening */}
          {!isComplete && (
            <Card>
              <CardHeader>
                <CardTitle>What's happening behind the scenes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 rounded-lg p-4">
                  <ul className="text-sm space-y-2 text-blue-800">
                    <li>• AI is analyzing your textbook's table of contents and structure</li>
                    <li>• Transcribing and processing lecture videos using AssemblyAI</li>
                    <li>• Generating comprehensive notes and summaries for each chapter</li>
                    <li>• Creating practice questions and assessments with multiple difficulty levels</li>
                    <li>• Building interactive presentations and visual aids</li>
                    <li>• Mapping lecture content to corresponding textbook chapters</li>
                    <li>• Organizing all resources into a cohesive course structure</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
