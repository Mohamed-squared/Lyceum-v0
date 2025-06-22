"use client"

import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Trophy, TrendingUp, Calendar, Target, BookOpen, Clock } from "lucide-react"

const mockDailyScores = [
  { day: "Day 1", score: 85 },
  { day: "Day 2", score: 78 },
  { day: "Day 3", score: 92 },
  { day: "Day 4", score: 88 },
  { day: "Day 5", score: 95 },
  { day: "Day 6", score: 82 },
  { day: "Day 7", score: 90 },
]

const mockWeeklyExams = [
  { week: "Week 1", score: 85 },
  { week: "Week 2", score: 78 },
  { week: "Week 3", score: 92 },
]

const mockScoreBreakdown = [
  {
    component: "Daily Assignments",
    averageScore: 87.2,
    weight: 30,
    contribution: 26.16,
    status: "On Track",
  },
  {
    component: "Weekly Exams",
    averageScore: 85.0,
    weight: 25,
    contribution: 21.25,
    status: "Good",
  },
  {
    component: "Midcourse Exams",
    averageScore: 0,
    weight: 25,
    contribution: 0,
    status: "Pending",
  },
  {
    component: "Final Exams",
    averageScore: 0,
    weight: 20,
    contribution: 0,
    status: "Pending",
  },
]

export default function CourseProgressPage() {
  const params = useParams()

  const totalContribution = mockScoreBreakdown.reduce((sum, item) => sum + item.contribution, 0)
  const projectedGrade = totalContribution / 0.55 // Assuming 55% of course completed

  const getLetterGrade = (score: number) => {
    if (score >= 90) return "A"
    if (score >= 80) return "B"
    if (score >= 70) return "C"
    if (score >= 60) return "D"
    return "F"
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Course Progress Dashboard</h1>
        <p className="text-muted-foreground mt-2">Quantum Mechanics Fundamentals - Detailed Performance Analysis</p>
      </div>

      {/* Overall Grade & Performance */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Trophy className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{totalContribution.toFixed(1)}%</div>
            <div className="text-sm text-muted-foreground">Current Total</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{getLetterGrade(projectedGrade)}</div>
            <div className="text-sm text-muted-foreground">Projected Grade</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">95%</div>
            <div className="text-sm text-muted-foreground">Attendance</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">On Track</div>
            <div className="text-sm text-muted-foreground">Current Pace</div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Daily Assignment Scores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockDailyScores}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value) => [`${value}%`, "Score"]} />
                <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Weekly Exam Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockWeeklyExams}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value) => [`${value}%`, "Score"]} />
                <Bar dataKey="score" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Score Breakdown Table */}
      <Card>
        <CardHeader>
          <CardTitle>Grade Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Component</TableHead>
                <TableHead>Weight</TableHead>
                <TableHead>Average Score</TableHead>
                <TableHead>Contribution</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockScoreBreakdown.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.component}</TableCell>
                  <TableCell>{item.weight}%</TableCell>
                  <TableCell>{item.averageScore > 0 ? `${item.averageScore}%` : "N/A"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{item.contribution.toFixed(2)}%</span>
                      <Progress value={(item.contribution / item.weight) * 100} className="w-16 h-2" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        item.status === "On Track"
                          ? "default"
                          : item.status === "Good"
                            ? "secondary"
                            : item.status === "Pending"
                              ? "outline"
                              : "destructive"
                      }
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-semibold">Projected Final Grade</h4>
                <p className="text-sm text-muted-foreground">Based on current performance</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{projectedGrade.toFixed(1)}%</div>
                <div className="text-lg font-semibold">{getLetterGrade(projectedGrade)}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
