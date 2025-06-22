"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BookOpen,
  Target,
  Clock,
  Trophy,
  TrendingUp,
  Calendar,
  FileText,
  Users,
  Zap,
  ArrowRight,
  Play,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"
import { getCourse } from "@/lib/api"
import type { Course } from "@/lib/mock-data"

// Mock function to check enrollment mode
const getEnrollmentMode = () => {
  return Math.random() > 0.7 ? "viewer" : "full"
}

export default function CourseDashboardPage({
  params,
}: {
  params: { courseId: string }
}) {
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const enrollmentMode = getEnrollmentMode()

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const courseData = await getCourse(params.courseId)
        setCourse(courseData)
      } catch (error) {
        console.error("Failed to fetch course:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCourse()
  }, [params.courseId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Course not found</h2>
          <p className="text-gray-600 mb-4">The course you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href="/courses">Browse Courses</Link>
          </Button>
        </div>
      </div>
    )
  }

  const todaysObjective = {
    title: "Study Chapter 3: Wave Functions",
    description: "Learn about wave function properties and normalization",
    chapterId: "3",
    estimatedTime: "45 minutes",
  }

  const upcomingDeadlines = [
    { title: "Chapter 2 Quiz", dueDate: "Tomorrow", type: "quiz" },
    { title: "Weekly Exam 1", dueDate: "3 days", type: "exam" },
    { title: "Problem Set 3", dueDate: "5 days", type: "assignment" },
  ]

  const recentActivity = [
    { action: "Completed Chapter 2: Kinematics", time: "2 hours ago", type: "chapter" },
    { action: "Scored 85% on Quiz 2", time: "1 day ago", type: "quiz" },
    { action: "Started Problem Set 2", time: "2 days ago", type: "assignment" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
              <p className="text-gray-600 mt-1">Course Dashboard</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary">Progress: {course.progress}%</Badge>
              <Button asChild>
                <Link href={`/testgen?course=${params.courseId}`}>
                  <Zap className="h-4 w-4 mr-2" />
                  Generate Quick Test
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Dashboard</TabsTrigger>
            <TabsTrigger value="study">Study Material</TabsTrigger>
            <TabsTrigger value="assignments">Assignments & Exams</TabsTrigger>
            <TabsTrigger value="notes">Notes & Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Today's Objective - Only show for full enrollment */}
                {enrollmentMode === "full" && (
                  <Card className="border-l-4 border-l-blue-500">
                    <CardHeader>
                      <div className="flex items-center space-x-2">
                        <Target className="h-5 w-5 text-blue-600" />
                        <CardTitle>Today's Objective</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{todaysObjective.title}</h3>
                          <p className="text-gray-600">{todaysObjective.description}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {todaysObjective.estimatedTime}
                            </div>
                          </div>
                          <Button asChild>
                            <Link href={`/courses/${params.courseId}/chapters/${todaysObjective.chapterId}`}>
                              Start Learning <ArrowRight className="h-4 w-4 ml-2" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Viewer Mode Message */}
                {enrollmentMode === "viewer" && (
                  <Card className="border-l-4 border-l-purple-500">
                    <CardHeader>
                      <div className="flex items-center space-x-2">
                        <BookOpen className="h-5 w-5 text-purple-600" />
                        <CardTitle>Viewer Mode Active</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Browse Course Materials</h3>
                          <p className="text-gray-600">
                            You're in viewer mode. Access all study materials without progress tracking or assignments.
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span className="text-green-600">✓ All study materials available</span>
                            <span className="text-green-600">✓ TestGen access enabled</span>
                          </div>
                          <Button asChild>
                            <Link href={`/courses/${params.courseId}/study`}>
                              Browse Materials <ArrowRight className="h-4 w-4 ml-2" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Progress Overview - Only show for full enrollment */}
                {enrollmentMode === "full" && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <TrendingUp className="h-5 w-5 mr-2" />
                        Progress Overview
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Overall Course Progress</span>
                            <span>{course.progress}%</span>
                          </div>
                          <Progress value={course.progress} className="h-3" />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">8</div>
                            <div className="text-sm text-blue-700">Chapters Completed</div>
                          </div>
                          <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">12</div>
                            <div className="text-sm text-green-700">Assignments Done</div>
                          </div>
                          <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <div className="text-2xl font-bold text-purple-600">85%</div>
                            <div className="text-sm text-purple-700">Average Score</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            {activity.type === "chapter" && <BookOpen className="h-4 w-4 text-blue-600" />}
                            {activity.type === "quiz" && <Trophy className="h-4 w-4 text-blue-600" />}
                            {activity.type === "assignment" && <FileText className="h-4 w-4 text-blue-600" />}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                            <p className="text-xs text-gray-500">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Upcoming Deadlines */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2" />
                      Upcoming Deadlines
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {upcomingDeadlines.map((deadline, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{deadline.title}</p>
                            <p className="text-xs text-gray-500 capitalize">{deadline.type}</p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {deadline.dueDate}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button asChild variant="outline" className="w-full" size="sm">
                      <Link href={`/courses/${params.courseId}/study`}>
                        <BookOpen className="h-4 w-4 mr-2" />
                        Continue Studying
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full" size="sm">
                      <Link href={`/courses/${params.courseId}/assignments`}>
                        <FileText className="h-4 w-4 mr-2" />
                        View Assignments
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full" size="sm">
                      <Link href="/ai-chat">
                        <Users className="h-4 w-4 mr-2" />
                        Ask AI Tutor
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                {/* Study Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle>Study Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Study Streak</span>
                        <span className="font-semibold">7 days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Time Spent</span>
                        <span className="font-semibold">24.5 hours</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Avg. Session</span>
                        <span className="font-semibold">45 minutes</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Completion Rate</span>
                        <span className="font-semibold">92%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="study" className="mt-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Study Material</h2>
                <Button asChild>
                  <Link href={`/testgen?course=${params.courseId}`}>
                    <Zap className="h-4 w-4 mr-2" />
                    Generate Quick Test
                  </Link>
                </Button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Mock chapters */}
                {[1, 2, 3, 4, 5, 6].map((chapterNum) => (
                  <Card key={chapterNum} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Chapter {chapterNum}</CardTitle>
                        {chapterNum <= 2 && <CheckCircle className="h-5 w-5 text-green-600" />}
                      </div>
                      <CardDescription>
                        {chapterNum === 1 && "Introduction to Quantum Mechanics"}
                        {chapterNum === 2 && "Wave-Particle Duality"}
                        {chapterNum === 3 && "Wave Functions"}
                        {chapterNum === 4 && "Uncertainty Principle"}
                        {chapterNum === 5 && "Schrödinger Equation"}
                        {chapterNum === 6 && "Quantum Tunneling"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Duration:</span>
                          <span>45 minutes</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Status:</span>
                          <Badge variant={chapterNum <= 2 ? "default" : chapterNum === 3 ? "secondary" : "outline"}>
                            {chapterNum <= 2 ? "Completed" : chapterNum === 3 ? "In Progress" : "Locked"}
                          </Badge>
                        </div>
                        <Button asChild className="w-full" size="sm" disabled={chapterNum > 3}>
                          <Link href={`/courses/${params.courseId}/chapters/${chapterNum}`}>
                            <Play className="h-4 w-4 mr-2" />
                            {chapterNum <= 2 ? "Review" : chapterNum === 3 ? "Continue" : "Locked"}
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="assignments" className="mt-6">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Assignments & Exams</h2>
              <p className="text-gray-600">Track your progress on graded activities and assessments.</p>

              {/* This will be implemented in the next part */}
              <Card>
                <CardContent className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Assignments Coming Soon</h3>
                  <p className="text-gray-600">Assignment tracking will be available in the next update</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="notes" className="mt-6">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Notes & Documents</h2>
              <p className="text-gray-600">Your personal notes and downloaded course materials.</p>

              <Card>
                <CardContent className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Notes Yet</h3>
                  <p className="text-gray-600">Start taking notes during your study sessions</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
