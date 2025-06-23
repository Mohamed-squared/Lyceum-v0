"use client"

import { useMemo } from "react"
import useSWR from "swr"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Clock, Users, Eye, AlertTriangle, Info, Library } from "lucide-react"
import Link from "next/link"
import { getMyCourses } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import type { Course as BaseCourseType } from "@/lib/mock-data" // Using mock-data Course as a base

// Assuming the API returns courses with an optional 'progress' field
// and 'enrollments' instead of 'enrolled'
interface MyCourse extends BaseCourseType {
  progress?: number; // Progress percentage
  enrollments?: number; // Number of enrollments
  // 'image' might be 'thumbnail' from API
  thumbnail?: string;
}

function CourseCardSkeleton() {
  return (
    <Card className="bg-card">
      <CardHeader>
        <Skeleton className="aspect-video bg-muted rounded-md mb-4" />
        <Skeleton className="h-6 w-3/4 mb-1" /> {/* Title */}
        <Skeleton className="h-4 w-full mb-1" /> {/* Description line 1 */}
        <Skeleton className="h-4 w-5/6 mb-1" /> {/* Description line 2 */}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-20" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-10" />
          </div>
          <Skeleton className="h-2 w-full" /> {/* Progress bar */}
        </div>
        <Skeleton className="h-10 w-full" /> {/* Button */}
      </CardContent>
    </Card>
  )
}

function MyCoursesPageSkeleton() {
  return (
    <div className="container mx-auto p-6 bg-background">
      <div className="mb-8">
        <Skeleton className="h-9 w-48 mb-2" />
        <Skeleton className="h-5 w-96" />
      </div>
      <Tabs defaultValue="full" className="space-y-6">
        <TabsList>
          <Skeleton className="h-10 w-32 mr-2" />
          <Skeleton className="h-10 w-32" />
        </TabsList>
        <TabsContent value="full" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => <CourseCardSkeleton key={`full-skel-${i}`} />)}
          </div>
        </TabsContent>
        <TabsContent value="viewer" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(2)].map((_, i) => <CourseCardSkeleton key={`viewer-skel-${i}`} />)}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function EmptyState({ message, showExploreButton = true }: { message: string, showExploreButton?: boolean }) {
  return (
    <div className="text-center py-12 col-span-full">
      <Library className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-foreground mb-2">No Courses Here</h3>
      <p className="text-muted-foreground mb-6">{message}</p>
      {showExploreButton && (
        <Button asChild>
          <Link href="/courses">Explore Courses</Link>
        </Button>
      )}
    </div>
  )
}


export default function MyCoursesPage() {
  const { data: enrolledCourses, error, isLoading } = useSWR<MyCourse[]>('/api/my-courses', getMyCourses);

  const { fullModeCourses, viewerModeCourses } = useMemo(() => {
    if (!enrolledCourses) return { fullModeCourses: [], viewerModeCourses: [] };
    return {
      fullModeCourses: enrolledCourses.filter((course) => typeof course.progress === 'number' && course.progress >= 0 && course.progress <= 100),
      viewerModeCourses: enrolledCourses.filter((course) => typeof course.progress !== 'number' || course.progress < 0 || course.progress > 100),
    };
  }, [enrolledCourses]);


  if (isLoading) {
    return <MyCoursesPageSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center px-4">
        <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">Failed to Load Your Courses</h2>
        <p className="text-muted-foreground mb-6">
          We couldn't fetch your enrolled courses. Please try refreshing the page.
        </p>
        <p className="text-sm text-destructive mb-4">Error: {error.message}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  if (!enrolledCourses || enrolledCourses.length === 0) {
    return (
      <div className="container mx-auto p-6 bg-background">
         <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">My Courses</h1>
            <p className="text-muted-foreground">Manage your enrolled courses and track your learning progress</p>
        </div>
        <EmptyState message="You haven't enrolled in any courses yet. Why not explore our catalog?" />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 bg-background">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">My Courses</h1>
        <p className="text-muted-foreground">Manage your enrolled courses and track your learning progress</p>
      </div>

      <Tabs defaultValue="full" className="space-y-6">
        <TabsList>
          <TabsTrigger value="full">Full Mode ({fullModeCourses.length})</TabsTrigger>
          <TabsTrigger value="viewer">Viewer Mode ({viewerModeCourses.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="full" className="space-y-6">
          {fullModeCourses.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {fullModeCourses.map((course) => (
                <Card key={course.id} className="bg-card">
                  <CardHeader>
                    <div className="aspect-video bg-muted rounded-md mb-4">
                      <img
                        src={course.thumbnail || course.image || "/placeholder.svg"}
                        alt={course.title}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                    <CardTitle className="text-foreground">{course.title}</CardTitle>
                    <CardDescription className="text-muted-foreground line-clamp-2">{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Clock className="mr-1 h-4 w-4" />
                        {course.duration || 'N/A'}
                      </div>
                      <div className="flex items-center">
                        <Users className="mr-1 h-4 w-4" />
                        {(course.enrollments || course.enrolled || 0).toLocaleString()}
                      </div>
                    </div>

                    {typeof course.progress === 'number' && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="text-foreground">{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button asChild className="flex-1">
                        <Link href={`/courses/${course.id}/learn`}> {/* Assuming /learn for continuing */}
                          <BookOpen className="mr-2 h-4 w-4" />
                          Continue
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState message="No courses in 'Full Mode'. These are courses you can actively progress through." showExploreButton={false} />
          )}
        </TabsContent>

        <TabsContent value="viewer" className="space-y-6">
          {viewerModeCourses.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {viewerModeCourses.map((course) => (
                <Card key={course.id} className="bg-card">
                  <CardHeader>
                    <div className="aspect-video bg-muted rounded-md mb-4">
                      <img
                        src={course.thumbnail || course.image || "/placeholder.svg"}
                        alt={course.title}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-foreground">{course.title}</CardTitle>
                      <Badge variant="secondary">
                        <Eye className="mr-1 h-3 w-3" />
                        Viewer
                      </Badge>
                    </div>
                    <CardDescription className="text-muted-foreground line-clamp-2">{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Clock className="mr-1 h-4 w-4" />
                        {course.duration || 'N/A'}
                      </div>
                      <div className="flex items-center">
                        <Users className="mr-1 h-4 w-4" />
                        {(course.enrollments || course.enrolled || 0).toLocaleString()}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button asChild variant="outline" className="flex-1">
                        <Link href={`/courses/${course.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Content
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
             <EmptyState message="No courses in 'Viewer Mode'. These might be courses you have read-only access to." showExploreButton={false} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
