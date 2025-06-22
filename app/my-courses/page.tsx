"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Clock, Users, Eye } from "lucide-react"
import Link from "next/link"
import { mockCourses } from "@/lib/mock-data"

export default function MyCoursesPage() {
  const enrolledCourses = mockCourses.filter((course) => course.isEnrolled)
  const fullModeCourses = enrolledCourses.filter((course) => course.progress !== undefined)
  const viewerModeCourses = enrolledCourses.filter((course) => course.progress === undefined)

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
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {fullModeCourses.map((course) => (
              <Card key={course.id} className="bg-card">
                <CardHeader>
                  <div className="aspect-video bg-muted rounded-md mb-4">
                    <img
                      src={course.image || "/placeholder.svg"}
                      alt={course.title}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                  <CardTitle className="text-foreground">{course.title}</CardTitle>
                  <CardDescription className="text-muted-foreground">{course.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Clock className="mr-1 h-4 w-4" />
                      {course.duration}
                    </div>
                    <div className="flex items-center">
                      <Users className="mr-1 h-4 w-4" />
                      {course.enrolled.toLocaleString()}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="text-foreground">{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>

                  <div className="flex gap-2">
                    <Button asChild className="flex-1">
                      <Link href={`/courses/${course.id}`}>
                        <BookOpen className="mr-2 h-4 w-4" />
                        Continue
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="viewer" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {viewerModeCourses.map((course) => (
              <Card key={course.id} className="bg-card">
                <CardHeader>
                  <div className="aspect-video bg-muted rounded-md mb-4">
                    <img
                      src={course.image || "/placeholder.svg"}
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
                  <CardDescription className="text-muted-foreground">{course.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Clock className="mr-1 h-4 w-4" />
                      {course.duration}
                    </div>
                    <div className="flex items-center">
                      <Users className="mr-1 h-4 w-4" />
                      {course.enrolled.toLocaleString()}
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
        </TabsContent>
      </Tabs>
    </div>
  )
}
