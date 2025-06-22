import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Star, Users } from "lucide-react"
import Link from "next/link"
import type { Course } from "@/lib/mock-data"

interface MyCreationsWidgetProps {
  courses: Course[]
}

export function MyCreationsWidget({ courses }: MyCreationsWidgetProps) {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "generating":
        return "secondary"
      case "failed":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getActionLink = (course: Course) => {
    if (course.status === "generating") {
      return `/courses/${course.id}/generation`
    }
    return `/courses/${course.id}/manage`
  }

  const getActionText = (status: string) => {
    switch (status) {
      case "generating":
        return "View Progress"
      case "active":
        return "Manage"
      case "failed":
        return "Retry"
      default:
        return "View"
    }
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">My Creations</h2>
        <Button asChild>
          <Link href="/create-course">
            <Plus className="h-4 w-4 mr-2" />
            Create Course
          </Link>
        </Button>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="hover:shadow-lg transition-shadow">
            <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
              <img
                src={course.thumbnail || "/placeholder.svg"}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader>
              <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
              <div className="flex items-center space-x-2">
                <Badge variant={getStatusVariant(course.status || "active")}>{course.status || "active"}</Badge>
                {course.status === "active" && course.rating > 0 && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                    {course.rating}
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {course.status === "active" && (
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {course.enrollments} enrolled
                    </div>
                    <span>{course.price}</span>
                  </div>
                )}
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link href={getActionLink(course)}>{getActionText(course.status || "active")}</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
