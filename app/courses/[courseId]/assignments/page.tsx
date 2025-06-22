"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Calendar, Clock, Trophy, Lock, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

interface Assignment {
  id: string
  title: string
  type: "daily" | "weekly" | "midcourse" | "final"
  status: "locked" | "available" | "completed"
  score?: number
  maxScore: number
  dueDate: string
  description: string
  timeLimit?: string
}

// Mock function to check enrollment mode - in real app, this would come from context/API
const getEnrollmentMode = () => {
  // For demo purposes, randomly return viewer mode for some users
  return Math.random() > 0.7 ? "viewer" : "full"
}

const mockAssignments: Assignment[] = [
  // Daily Assignments
  {
    id: "1",
    title: "Day 1: Wave-Particle Duality Quiz",
    type: "daily",
    status: "completed",
    score: 85,
    maxScore: 100,
    dueDate: "2024-01-15",
    description: "Quick assessment on fundamental concepts",
    timeLimit: "15 minutes",
  },
  {
    id: "2",
    title: "Day 2: Uncertainty Principle Problems",
    type: "daily",
    status: "available",
    maxScore: 100,
    dueDate: "2024-01-16",
    description: "Problem-solving exercises on Heisenberg uncertainty",
    timeLimit: "20 minutes",
  },
  {
    id: "3",
    title: "Day 3: Schrödinger Equation Basics",
    type: "daily",
    status: "locked",
    maxScore: 100,
    dueDate: "2024-01-17",
    description: "Introduction to the fundamental equation",
    timeLimit: "25 minutes",
  },
  // Weekly Exams
  {
    id: "4",
    title: "Week 1 Comprehensive Exam",
    type: "weekly",
    status: "available",
    maxScore: 200,
    dueDate: "2024-01-21",
    description: "Covers all material from the first week",
    timeLimit: "90 minutes",
  },
  {
    id: "5",
    title: "Week 2 Comprehensive Exam",
    type: "weekly",
    status: "locked",
    maxScore: 200,
    dueDate: "2024-01-28",
    description: "Mathematical formalism and applications",
    timeLimit: "90 minutes",
  },
  // Midcourse Exams
  {
    id: "6",
    title: "Midcourse Exam 1: Foundations",
    type: "midcourse",
    status: "locked",
    maxScore: 300,
    dueDate: "2024-02-15",
    description: "Comprehensive exam on quantum foundations",
    timeLimit: "2 hours",
  },
  {
    id: "7",
    title: "Midcourse Exam 2: Applications",
    type: "midcourse",
    status: "locked",
    maxScore: 300,
    dueDate: "2024-03-15",
    description: "Real-world applications and problem solving",
    timeLimit: "2 hours",
  },
  // Final Exams
  {
    id: "8",
    title: "Final Exam 1: Theory",
    type: "final",
    status: "locked",
    maxScore: 400,
    dueDate: "2024-04-15",
    description: "Theoretical understanding and concepts",
    timeLimit: "3 hours",
  },
  {
    id: "9",
    title: "Final Exam 2: Practical Applications",
    type: "final",
    status: "locked",
    maxScore: 400,
    dueDate: "2024-04-20",
    description: "Problem solving and real-world applications",
    timeLimit: "3 hours",
  },
]

const getStatusIcon = (status: Assignment["status"]) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="w-4 h-4 text-green-500" />
    case "available":
      return <AlertCircle className="w-4 h-4 text-blue-500" />
    case "locked":
      return <Lock className="w-4 h-4 text-muted-foreground" />
  }
}

const getStatusColor = (status: Assignment["status"]) => {
  switch (status) {
    case "completed":
      return "bg-green-500"
    case "available":
      return "bg-blue-500"
    case "locked":
      return "bg-muted-foreground"
  }
}

const getTypeIcon = (type: Assignment["type"]) => {
  switch (type) {
    case "daily":
      return <Calendar className="w-4 h-4" />
    case "weekly":
      return <Clock className="w-4 h-4" />
    case "midcourse":
    case "final":
      return <Trophy className="w-4 h-4" />
  }
}

export default function AssignmentsPage() {
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const enrollmentMode = getEnrollmentMode()
  const params = useParams()

  // If user is in viewer mode, show message instead of assignments
  if (enrollmentMode === "viewer") {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Assignments & Exams</h1>
          <p className="text-muted-foreground mt-2">Track your progress through course assessments</p>
        </div>

        <Card>
          <CardContent className="text-center py-12">
            <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Assignments Disabled in Viewer Mode</h3>
            <p className="text-gray-600 mb-4">
              Assignments and exams are disabled in Viewer Mode. To participate in assessments and track your progress,
              you need to re-enroll in Full Enrollment mode.
            </p>
            <Button asChild>
              <Link href={`/courses/${params?.courseId}/enroll`}>Switch to Full Enrollment</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const groupedAssignments = {
    daily: mockAssignments.filter((a) => a.type === "daily"),
    weekly: mockAssignments.filter((a) => a.type === "weekly"),
    midcourse: mockAssignments.filter((a) => a.type === "midcourse"),
    final: mockAssignments.filter((a) => a.type === "final"),
  }

  const completedAssignments = mockAssignments.filter((a) => a.status === "completed").length
  const totalAssignments = mockAssignments.length
  const overallProgress = (completedAssignments / totalAssignments) * 100

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Assignments & Exams</h1>
          <p className="text-muted-foreground mt-2">Track your progress through course assessments</p>
        </div>
        <Card className="w-64">
          <CardContent className="p-4">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">Overall Progress</p>
              <Progress value={overallProgress} className="h-2" />
              <p className="text-sm font-medium">
                {completedAssignments} of {totalAssignments} completed
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Accordion type="multiple" className="space-y-4">
        <AccordionItem value="daily" className="border rounded-lg">
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-blue-500" />
              <div className="text-left">
                <h3 className="font-semibold">Daily Assignments</h3>
                <p className="text-sm text-muted-foreground">Short daily tasks to reinforce learning</p>
              </div>
              <Badge variant="secondary" className="ml-auto">
                {groupedAssignments.daily.filter((a) => a.status === "completed").length} /{" "}
                {groupedAssignments.daily.length}
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4">
            <div className="grid gap-4">
              {groupedAssignments.daily.map((assignment) => (
                <Card key={assignment.id} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(assignment.status)}
                        <div>
                          <CardTitle className="text-base">{assignment.title}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">{assignment.description}</p>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        {assignment.status === "completed" && assignment.score && (
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            {assignment.score}/{assignment.maxScore}
                          </Badge>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Due: {new Date(assignment.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {assignment.timeLimit}
                        </span>
                        <span>{assignment.maxScore} points</span>
                      </div>
                      <Button
                        size="sm"
                        disabled={assignment.status === "locked"}
                        variant={assignment.status === "completed" ? "outline" : "default"}
                      >
                        {assignment.status === "completed"
                          ? "Review"
                          : assignment.status === "available"
                            ? "Start"
                            : "Locked"}
                      </Button>
                    </div>
                  </CardContent>
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-lg ${getStatusColor(assignment.status)}`}
                  />
                </Card>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="weekly" className="border rounded-lg">
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-orange-500" />
              <div className="text-left">
                <h3 className="font-semibold">Weekly Exams</h3>
                <p className="text-sm text-muted-foreground">Comprehensive weekly assessments</p>
              </div>
              <Badge variant="secondary" className="ml-auto">
                {groupedAssignments.weekly.filter((a) => a.status === "completed").length} /{" "}
                {groupedAssignments.weekly.length}
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4">
            <div className="grid gap-4">
              {groupedAssignments.weekly.map((assignment) => (
                <Card key={assignment.id} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(assignment.status)}
                        <div>
                          <CardTitle className="text-base">{assignment.title}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">{assignment.description}</p>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        {assignment.status === "completed" && assignment.score && (
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            {assignment.score}/{assignment.maxScore}
                          </Badge>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Due: {new Date(assignment.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {assignment.timeLimit}
                        </span>
                        <span>{assignment.maxScore} points</span>
                      </div>
                      <Button
                        size="sm"
                        disabled={assignment.status === "locked"}
                        variant={assignment.status === "completed" ? "outline" : "default"}
                      >
                        {assignment.status === "completed"
                          ? "Review"
                          : assignment.status === "available"
                            ? "Start"
                            : "Locked"}
                      </Button>
                    </div>
                  </CardContent>
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-lg ${getStatusColor(assignment.status)}`}
                  />
                </Card>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="midcourse" className="border rounded-lg">
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <div className="flex items-center gap-3">
              <Trophy className="w-5 h-5 text-purple-500" />
              <div className="text-left">
                <h3 className="font-semibold">Midcourse Exams</h3>
                <p className="text-sm text-muted-foreground">Major milestone assessments</p>
              </div>
              <Badge variant="secondary" className="ml-auto">
                {groupedAssignments.midcourse.filter((a) => a.status === "completed").length} /{" "}
                {groupedAssignments.midcourse.length}
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4">
            <div className="grid gap-4">
              {groupedAssignments.midcourse.map((assignment) => (
                <Card key={assignment.id} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(assignment.status)}
                        <div>
                          <CardTitle className="text-base">{assignment.title}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">{assignment.description}</p>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        {assignment.status === "completed" && assignment.score && (
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            {assignment.score}/{assignment.maxScore}
                          </Badge>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Due: {new Date(assignment.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {assignment.timeLimit}
                        </span>
                        <span>{assignment.maxScore} points</span>
                      </div>
                      <Button
                        size="sm"
                        disabled={assignment.status === "locked"}
                        variant={assignment.status === "completed" ? "outline" : "default"}
                      >
                        {assignment.status === "completed"
                          ? "Review"
                          : assignment.status === "available"
                            ? "Start"
                            : "Locked"}
                      </Button>
                    </div>
                  </CardContent>
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-lg ${getStatusColor(assignment.status)}`}
                  />
                </Card>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="final" className="border rounded-lg">
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <div className="flex items-center gap-3">
              <Trophy className="w-5 h-5 text-red-500" />
              <div className="text-left">
                <h3 className="font-semibold">Final Exams</h3>
                <p className="text-sm text-muted-foreground">Comprehensive final assessments</p>
              </div>
              <Badge variant="secondary" className="ml-auto">
                {groupedAssignments.final.filter((a) => a.status === "completed").length} /{" "}
                {groupedAssignments.final.length}
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4">
            <div className="grid gap-4">
              {groupedAssignments.final.map((assignment) => (
                <Card key={assignment.id} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(assignment.status)}
                        <div>
                          <CardTitle className="text-base">{assignment.title}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">{assignment.description}</p>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        {assignment.status === "completed" && assignment.score && (
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            {assignment.score}/{assignment.maxScore}
                          </Badge>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Due: {new Date(assignment.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {assignment.timeLimit}
                        </span>
                        <span>{assignment.maxScore} points</span>
                      </div>
                      <Button
                        size="sm"
                        disabled={assignment.status === "locked"}
                        variant={assignment.status === "completed" ? "outline" : "default"}
                      >
                        {assignment.status === "completed"
                          ? "Review"
                          : assignment.status === "available"
                            ? "Start"
                            : "Locked"}
                      </Button>
                    </div>
                  </CardContent>
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-lg ${getStatusColor(assignment.status)}`}
                  />
                </Card>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
