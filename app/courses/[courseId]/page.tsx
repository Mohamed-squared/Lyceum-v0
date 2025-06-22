"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Users, Clock, Globe, BookOpen, Play, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getCourse } from "@/lib/api"
import { languageLabels, type Course } from "@/lib/mock-data"

export default function CourseDetailPage({
  params,
}: {
  params: { courseId: string }
}) {
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)

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

  // Mock chapters for demonstration
  const mockChapters = [
    {
      id: "1",
      title: "Introduction to the Subject",
      duration: "45 min",
      description: "Overview and fundamental concepts",
    },
    { id: "2", title: "Core Principles", duration: "60 min", description: "Deep dive into the main principles" },
    {
      id: "3",
      title: "Practical Applications",
      duration: "75 min",
      description: "Real-world examples and case studies",
    },
    { id: "4", title: "Advanced Topics", duration: "90 min", description: "Complex concepts and theories" },
    { id: "5", title: "Final Assessment", duration: "30 min", description: "Test your knowledge and skills" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <Button asChild variant="outline" className="mb-4">
            <Link href="/courses">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Courses
            </Link>
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Header */}
            <div className="bg-white rounded-lg border p-8">
              <div className="flex items-start space-x-6">
                <div className="w-48 h-32 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={course.thumbnail || "/placeholder.svg"}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
                  <p className="text-lg text-gray-600 mb-4">by {course.instructor}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="secondary">{course.subject}</Badge>
                    <Badge variant="outline">{course.level}</Badge>
                    <Badge variant="outline" className="flex items-center">
                      <Globe className="h-3 w-3 mr-1" />
                      {languageLabels[course.language]}
                    </Badge>
                  </div>

                  <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                      <span>
                        {course.rating} ({course.enrollments} reviews)
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{course.enrollments.toLocaleString()} enrolled</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{course.duration}</span>
                    </div>
                  </div>

                  <p className="text-gray-700 leading-relaxed">{course.description}</p>
                </div>
              </div>
            </div>

            {/* Course Content */}
            <Card>
              <CardHeader>
                <CardTitle>Course Content</CardTitle>
                <CardDescription>
                  {mockChapters.length} chapters • Estimated {course.duration} total
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockChapters.map((chapter, index) => (
                    <div key={chapter.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{chapter.title}</h3>
                            <p className="text-sm text-gray-600">{chapter.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-500">{chapter.duration}</span>
                          <Button asChild size="sm" variant="outline">
                            <Link href={`/courses/${course.id}/chapters/${chapter.id}`}>
                              <Play className="h-4 w-4 mr-1" />
                              Start
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Prerequisites */}
            <Card>
              <CardHeader>
                <CardTitle>Prerequisites</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-700">
                  <li>• Basic understanding of the subject area</li>
                  <li>• High school level mathematics</li>
                  <li>• Access to a computer and internet connection</li>
                  <li>• Willingness to learn and practice</li>
                </ul>
              </CardContent>
            </Card>

            {/* What You'll Learn */}
            <Card>
              <CardHeader>
                <CardTitle>What You'll Learn</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-700">
                  <li>• Master the fundamental concepts and principles</li>
                  <li>• Apply theoretical knowledge to practical problems</li>
                  <li>• Develop critical thinking and analytical skills</li>
                  <li>• Gain confidence in the subject matter</li>
                  <li>• Prepare for advanced topics and further study</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Enrollment Card */}
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="text-3xl font-bold text-blue-600">{course.price}</div>
                  <Button className="w-full" size="lg">
                    {course.price === "Free" ? "Enroll Now" : "Purchase Course"}
                  </Button>
                  <p className="text-xs text-gray-500">30-day money-back guarantee</p>
                </div>
              </CardContent>
            </Card>

            {/* Course Features */}
            <Card>
              <CardHeader>
                <CardTitle>This course includes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-4 w-4 text-gray-500" />
                    <span>Comprehensive study materials</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Play className="h-4 w-4 text-gray-500" />
                    <span>Video lectures and demonstrations</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span>Community discussion forums</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>Lifetime access</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Instructor */}
            <Card>
              <CardHeader>
                <CardTitle>Instructor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-lg font-medium text-blue-600">
                    {course.instructor
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{course.instructor}</h3>
                    <p className="text-sm text-gray-600">Expert in {course.subject}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span>⭐ 4.8 rating</span>
                      <span>👥 10,000+ students</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
