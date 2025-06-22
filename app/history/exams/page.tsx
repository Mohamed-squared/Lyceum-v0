"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileText, Eye, Trash2, Trophy, Clock, Target } from "lucide-react"
import Link from "next/link"

interface CompletedExam {
  id: string
  type: "TestGen" | "Skip Exam" | "Weekly Exam" | "Daily Assignment" | "Midcourse Exam" | "Final Exam"
  courseName?: string
  completionDate: string
  score: number
  maxScore: number
  duration: string
}

interface PendingExam {
  id: string
  type: string
  courseName?: string
  submissionDate: string
  chapters: string[]
  totalQuestions: number
}

const mockCompletedExams: CompletedExam[] = [
  {
    id: "exam_001",
    type: "TestGen",
    courseName: "Quantum Mechanics",
    completionDate: "2024-01-15",
    score: 85,
    maxScore: 100,
    duration: "45 minutes",
  },
  {
    id: "exam_002",
    type: "Weekly Exam",
    courseName: "Quantum Mechanics Fundamentals",
    completionDate: "2024-01-14",
    score: 78,
    maxScore: 100,
    duration: "90 minutes",
  },
  {
    id: "exam_003",
    type: "Skip Exam",
    courseName: "Quantum Mechanics Fundamentals",
    completionDate: "2024-01-12",
    score: 92,
    maxScore: 100,
    duration: "15 minutes",
  },
  {
    id: "exam_004",
    type: "Daily Assignment",
    courseName: "Quantum Mechanics Fundamentals",
    completionDate: "2024-01-10",
    score: 88,
    maxScore: 100,
    duration: "20 minutes",
  },
  {
    id: "exam_005",
    type: "TestGen",
    courseName: "Physics",
    completionDate: "2024-01-08",
    score: 76,
    maxScore: 100,
    duration: "60 minutes",
  },
]

const mockPendingExams: PendingExam[] = [
  {
    id: "pending_001",
    type: "TestGen - Physics",
    submissionDate: "2024-01-16",
    chapters: ["Mechanics", "Thermodynamics", "Electromagnetism"],
    totalQuestions: 25,
  },
  {
    id: "pending_002",
    type: "TestGen - Mathematics",
    submissionDate: "2024-01-15",
    chapters: ["Calculus", "Linear Algebra"],
    totalQuestions: 20,
  },
]

const getTypeIcon = (type: string) => {
  switch (type) {
    case "TestGen":
      return <Target className="w-4 h-4" />
    case "Weekly Exam":
    case "Midcourse Exam":
    case "Final Exam":
      return <Trophy className="w-4 h-4" />
    case "Skip Exam":
    case "Daily Assignment":
      return <Clock className="w-4 h-4" />
    default:
      return <FileText className="w-4 h-4" />
  }
}

const getTypeColor = (type: string) => {
  switch (type) {
    case "TestGen":
      return "bg-blue-500"
    case "Weekly Exam":
      return "bg-orange-500"
    case "Midcourse Exam":
    case "Final Exam":
      return "bg-red-500"
    case "Skip Exam":
      return "bg-green-500"
    case "Daily Assignment":
      return "bg-purple-500"
    default:
      return "bg-gray-500"
  }
}

export default function ExamHistoryPage() {
  const [pendingResults, setPendingResults] = useState<Record<string, { mcqWrong: number; problemsWrong: number }>>({})

  const handleResultsSubmit = (examId: string) => {
    // Mock submission logic
    console.log("Submitting results for exam:", examId, pendingResults[examId])
    // Remove from pending list
    setPendingResults((prev) => {
      const newResults = { ...prev }
      delete newResults[examId]
      return newResults
    })
  }

  const updatePendingResult = (examId: string, field: "mcqWrong" | "problemsWrong", value: number) => {
    setPendingResults((prev) => ({
      ...prev,
      [examId]: {
        ...prev[examId],
        [field]: value,
      },
    }))
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Exam History & Review</h1>
        <p className="text-muted-foreground mt-2">Track your assessment performance and review detailed results</p>
      </div>

      <Tabs defaultValue="completed" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="completed" className="flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            Completed ({mockCompletedExams.length})
          </TabsTrigger>
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Pending PDF ({mockPendingExams.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="completed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Completed Assessments</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Exam ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockCompletedExams.map((exam) => (
                    <TableRow key={exam.id}>
                      <TableCell className="font-mono text-sm">{exam.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTypeIcon(exam.type)}
                          <Badge variant="secondary" className={`text-white ${getTypeColor(exam.type)}`}>
                            {exam.type}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>{exam.courseName || "General"}</TableCell>
                      <TableCell>{new Date(exam.completionDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-semibold ${exam.score >= 80 ? "text-green-600" : exam.score >= 60 ? "text-yellow-600" : "text-red-600"}`}
                          >
                            {exam.score}/{exam.maxScore}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            ({Math.round((exam.score / exam.maxScore) * 100)}%)
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{exam.duration}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button asChild size="sm" variant="outline">
                            <Link href={`/history/exams/review/${exam.id}`}>
                              <Eye className="w-4 h-4 mr-1" />
                              Review
                            </Link>
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <div className="grid gap-4">
            {mockPendingExams.map((exam) => (
              <Card key={exam.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{exam.type}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Submitted: {new Date(exam.submissionDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="outline">{exam.totalQuestions} questions</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-2">Chapters covered:</p>
                      <div className="flex flex-wrap gap-2">
                        {exam.chapters.map((chapter, index) => (
                          <Badge key={index} variant="secondary">
                            {chapter}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="default">
                            <FileText className="w-4 h-4 mr-2" />
                            Enter Results
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Enter Exam Results - {exam.type}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            {exam.chapters.map((chapter, index) => (
                              <div key={index} className="space-y-3">
                                <h4 className="font-medium">{chapter}</h4>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label>MCQs Wrong</Label>
                                    <Input
                                      type="number"
                                      min="0"
                                      placeholder="0"
                                      onChange={(e) => updatePendingResult(exam.id, "mcqWrong", Number(e.target.value))}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Problems Wrong</Label>
                                    <Input
                                      type="number"
                                      min="0"
                                      placeholder="0"
                                      onChange={(e) =>
                                        updatePendingResult(exam.id, "problemsWrong", Number(e.target.value))
                                      }
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                            <Button onClick={() => handleResultsSubmit(exam.id)} className="w-full">
                              Submit Results
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button variant="outline" className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Pending
                      </Button>
                    </div>
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
