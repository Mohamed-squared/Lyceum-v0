import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Users, Clock, Globe } from "lucide-react"
import Link from "next/link"
import type { Course } from "@/lib/mock-data"
import { languageLabels } from "@/lib/mock-data"

interface CourseCardProps {
  course: Course
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
        <img src={course.thumbnail || "/placeholder.svg"} alt={course.title} className="w-full h-full object-cover" />
      </div>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
            <CardDescription className="mt-1">by {course.instructor}</CardDescription>
          </div>
          <div className="flex items-center space-x-1 text-sm">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>{course.rating}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="secondary">{course.subject}</Badge>
          <Badge variant="outline">{course.level}</Badge>
          <Badge variant="outline" className="flex items-center">
            <Globe className="h-3 w-3 mr-1" />
            {languageLabels[course.language]}
          </Badge>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            {course.enrollments.toLocaleString()}
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {course.duration}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-blue-600">{course.price}</span>
          <Button asChild size="sm">
            <Link href={`/courses/${course.id}/dashboard`}>
              {course.price === "Free" ? "Enroll Now" : "View Details"}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
