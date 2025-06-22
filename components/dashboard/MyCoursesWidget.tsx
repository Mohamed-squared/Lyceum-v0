import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { BookOpen, Clock } from "lucide-react"
import Link from "next/link"
import type { Course } from "@/lib/mock-data"

interface MyCoursesWidgetProps {
  courses: Course[]
}

export function MyCoursesWidget({ courses }: MyCoursesWidgetProps) {
  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">My Courses</h2>
        <Button asChild>
          <Link href="/courses">
            <BookOpen className="h-4 w-4 mr-2" />
            Browse Courses
          </Link>
        </Button>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="hover:shadow-lg transition-shadow">
            <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
              <img
                src={course.thumbnail || "/placeholder.svg"}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader>
              <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
              <CardDescription>by {course.instructor}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span>{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {course.duration}
                  </div>
                </div>
                <Button asChild className="w-full" size="sm">
                  <Link href={`/courses/${course.id}`}>Continue Learning</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
