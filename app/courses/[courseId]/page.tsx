"use client"

import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Users, Clock, Globe, BookOpen, Play, ArrowLeft, AlertTriangle, Info } from "lucide-react"
import Link from "next/link"
import { getCourseDetails } from "@/lib/api" // Corrected API function
import { Skeleton } from "@/components/ui/skeleton"
// Assuming Course type is defined in a central place, possibly extended for details
// For now, using a generic Course type, and will access properties with optional chaining.
import { languageLabels, type Course as BaseCourseType } from "@/lib/mock-data" // Keep for languageLabels, Course type might be different

// Define a more detailed Course type if needed, including chapters, prerequisites etc.
interface Chapter {
  id: string;
  title: string;
  duration: string;
  description?: string;
  // ... other chapter properties
}

interface Instructor {
  name: string;
  avatarUrl?: string;
  bio?: string;
  rating?: number;
  students?: number;
  subject?: string; // Or expertise
}

interface Course extends BaseCourseType {
  chapters?: Chapter[];
  prerequisites?: string[];
  whatYoullLearn?: string[];
  features?: string[];
  instructor: Instructor; // Make instructor an object
  // Add other detailed fields as returned by the API
}

function CourseDetailPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <Skeleton className="h-9 w-40 mb-4" /> {/* Back to Courses Button */}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content Skeleton */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Header Skeleton */}
            <div className="bg-white rounded-lg border p-8">
              <div className="flex items-start space-x-6">
                <Skeleton className="w-48 h-32 rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-8 w-3/4" /> {/* Title */}
                  <Skeleton className="h-6 w-1/2" /> {/* Instructor */}
                  <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-6 w-20" /> <Skeleton className="h-6 w-16" /> <Skeleton className="h-6 w-24" />
                  </div>
                  <div className="flex items-center space-x-6">
                    <Skeleton className="h-5 w-28" /> <Skeleton className="h-5 w-24" /> <Skeleton className="h-5 w-20" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              </div>
            </div>

            {/* Course Content Skeleton */}
            <Card>
              <CardHeader>
                <Skeleton className="h-7 w-48 mb-1" /> {/* CardTitle */}
                <Skeleton className="h-5 w-64" /> {/* CardDescription */}
              </CardHeader>
              <CardContent className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Skeleton className="w-8 h-8 rounded-full" />
                        <div className="space-y-1">
                          <Skeleton className="h-5 w-56" />
                          <Skeleton className="h-4 w-72" />
                        </div>
                      </div>
                      <Skeleton className="h-8 w-24" /> {/* Start Button */}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Prerequisites Skeleton */}
            <Card>
              <CardHeader><Skeleton className="h-7 w-40" /></CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" /> <Skeleton className="h-4 w-5/6" /> <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>

            {/* What You'll Learn Skeleton */}
            <Card>
              <CardHeader><Skeleton className="h-7 w-52" /></CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" /> <Skeleton className="h-4 w-5/6" /> <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Skeleton */}
          <div className="space-y-6">
            <Card><CardContent className="pt-6 space-y-3"><Skeleton className="h-8 w-24 mx-auto" /> <Skeleton className="h-12 w-full" /> <Skeleton className="h-4 w-40 mx-auto" /></CardContent></Card>
            <Card>
              <CardHeader><Skeleton className="h-7 w-44" /></CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-5 w-full" /> <Skeleton className="h-5 w-full" /> <Skeleton className="h-5 w-full" /> <Skeleton className="h-5 w-full" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader><Skeleton className="h-7 w-32" /></CardHeader>
              <CardContent className="flex items-start space-x-4">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-5 w-3/4" /> <Skeleton className="h-4 w-1/2" /> <Skeleton className="h-4 w-3/4" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}


export default function CourseDetailPage({
  params,
}: {
  params: { courseId: string }
}) {
  const { courseId } = params;
  const { data: course, error, isLoading } = useSWR<Course>(
    courseId ? `/api/courses/${courseId}` : null, // SWR key, null if courseId is not available
    () => getCourseDetails(courseId) // Fetcher function
  );

  if (isLoading) {
    return <CourseDetailPageSkeleton />;
  }

  if (error) {
    // TODO: Differentiate 404 error from other errors if API provides status code
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center px-4">
        <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {error.message?.includes("not found") || error.message?.includes("404") ? "Course Not Found" : "Failed to Load Course"}
        </h2>
        <p className="text-gray-600 mb-6">
          {error.message?.includes("not found") || error.message?.includes("404")
            ? "The course you are looking for doesn't exist or may have been removed."
            : "We couldn't fetch the course details. It might be a temporary issue."
          }
        </p>
        {!(error.message?.includes("not found") || error.message?.includes("404")) &&
          <p className="text-sm text-gray-500 mb-4">Error: {error.message}</p>
        }
        <Button asChild variant="outline" className="mr-2">
          <Link href="/courses">Browse Other Courses</Link>
        </Button>
        {!(error.message?.includes("not found") || error.message?.includes("404")) &&
         <Button onClick={() => window.location.reload()}>Try Again</Button>
        }
      </div>
    );
  }

  if (!course) {
    // This case should ideally be covered by isLoading or error states.
    // If it's reached, it means SWR resolved without data and without error.
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center px-4">
        <Info className="h-16 w-16 text-blue-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Data Unavailable</h2>
        <p className="text-gray-600 mb-6">
          The details for this course could not be loaded at the moment.
        </p>
        <Button asChild>
          <Link href="/courses">Back to Courses</Link>
        </Button>
      </div>
    );
  }

  const courseInstructor = typeof course.instructor === 'string' ? { name: course.instructor } : course.instructor;


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
                    // Use a placeholder if thumbnail is not available
                    src={course.thumbnail || `https://via.placeholder.com/300x200?text=${encodeURIComponent(course.title)}`}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
                  <p className="text-lg text-gray-600 mb-4">by {courseInstructor.name}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {course.subject && <Badge variant="secondary">{course.subject}</Badge>}
                    {course.level && <Badge variant="outline">{course.level}</Badge>}
                    {course.language && languageLabels[course.language as keyof typeof languageLabels] && (
                        <Badge variant="outline" className="flex items-center">
                        <Globe className="h-3 w-3 mr-1" />
                        {languageLabels[course.language as keyof typeof languageLabels]}
                        </Badge>
                    )}
                  </div>

                  <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                      <span>
                        {course.rating || 'N/A'} ({course.enrollments || 0} reviews)
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{(course.enrollments || 0).toLocaleString()} enrolled</span>
                    </div>
                    {course.duration && (
                        <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{course.duration}</span>
                        </div>
                    )}
                  </div>

                  <p className="text-gray-700 leading-relaxed">{course.description || "No description available."}</p>
                </div>
              </div>
            </div>

            {/* Course Content */}
            {course.chapters && course.chapters.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Course Content</CardTitle>
                  <CardDescription>
                    {course.chapters.length} chapter{course.chapters.length !== 1 ? 's' : ''}
                    {course.duration && ` • Estimated ${course.duration} total`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {course.chapters.map((chapter, index) => (
                      <div key={chapter.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                              {index + 1}
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">{chapter.title}</h3>
                              {chapter.description && <p className="text-sm text-gray-600">{chapter.description}</p>}
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            {chapter.duration && <span className="text-sm text-gray-500">{chapter.duration}</span>}
                            <Button asChild size="sm" variant="outline">
                              {/* TODO: Update link to actual chapter/lesson page */}
                              <Link href={`/courses/${course.id}/learn/${chapter.id}`}>
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
            ) : (
              <Card>
                <CardHeader><CardTitle>Course Content</CardTitle></CardHeader>
                <CardContent><p className="text-gray-600">Chapter information is not yet available for this course.</p></CardContent>
              </Card>
            )}

            {/* Prerequisites */}
            {course.prerequisites && course.prerequisites.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Prerequisites</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {course.prerequisites.map((prereq, index) => (
                      <li key={index}>{prereq}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* What You'll Learn */}
            {course.whatYoullLearn && course.whatYoullLearn.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>What You'll Learn</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {course.whatYoullLearn.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Enrollment Card */}
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="text-3xl font-bold text-blue-600">{course.price || "N/A"}</div>
                  {/* TODO: Link to actual enrollment/purchase flow */}
                  <Button asChild className="w-full" size="lg" disabled={!course.price}>
                     <Link href={`/courses/${course.id}/enroll`}>
                        {course.price === "Free" ? "Enroll Now" : "Purchase Course"}
                     </Link>
                  </Button>
                  <p className="text-xs text-gray-500">30-day money-back guarantee</p>
                </div>
              </CardContent>
            </Card>

            {/* Course Features */}
            {course.features && course.features.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>This course includes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    {course.features.map((feature, index) => (
                       <div key={index} className="flex items-center space-x-2">
                         {/* TODO: Could map feature types to icons */}
                         <Info className="h-4 w-4 text-gray-500 flex-shrink-0" />
                         <span>{feature}</span>
                       </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Instructor */}
            <Card>
              <CardHeader>
                <CardTitle>Instructor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-lg font-medium text-blue-600 overflow-hidden">
                    {courseInstructor.avatarUrl ? (
                        <img src={courseInstructor.avatarUrl} alt={courseInstructor.name} className="w-full h-full object-cover" />
                    ) : (
                        courseInstructor.name.split(" ").map((n) => n[0]).join("").substring(0,2).toUpperCase()
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{courseInstructor.name}</h3>
                    {courseInstructor.subject && <p className="text-sm text-gray-600">Expert in {courseInstructor.subject}</p>}
                    {(courseInstructor.rating || courseInstructor.students) && (
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        {courseInstructor.rating && <span>⭐ {courseInstructor.rating.toFixed(1)} rating</span>}
                        {courseInstructor.students && <span>👥 {courseInstructor.students.toLocaleString()} students</span>}
                        </div>
                    )}
                    {/* TODO: Link to instructor profile page if available */}
                  </div>
                </div>
                {courseInstructor.bio && <p className="text-sm text-gray-600 mt-3">{courseInstructor.bio}</p>}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
