"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp, Target, BookOpen, AlertTriangle } from "lucide-react"

const subjects = ["Physics", "Mathematics", "Computer Science", "Chemistry", "Biology"]

const mockDifficultyData = [
  { difficulty: "Easy", score: 92, total: 100 },
  { difficulty: "Medium", score: 78, total: 100 },
  { difficulty: "Hard", score: 65, total: 100 },
  { difficulty: "Expert", score: 45, total: 100 },
]

const mockMasteryData = [
  { chapter: "Mechanics", consecutive: 8, target: 10 },
  { chapter: "Thermodynamics", consecutive: 5, target: 10 },
  { chapter: "Electromagnetism", consecutive: 12, target: 10 },
  { chapter: "Optics", consecutive: 3, target: 10 },
  { chapter: "Modern Physics", consecutive: 7, target: 10 },
]

const mockQuestionsData = [
  { chapter: "Mechanics", attempted: 45, correct: 38 },
  { chapter: "Thermodynamics", attempted: 32, correct: 24 },
  { chapter: "Electromagnetism", attempted: 56, correct: 48 },
  { chapter: "Optics", attempted: 28, correct: 19 },
  { chapter: "Modern Physics", attempted: 41, correct: 33 },
]

const mockWrongAnswersData = [
  { chapter: "Mechanics", wrong: 7, total: 45 },
  { chapter: "Thermodynamics", wrong: 8, total: 32 },
  { chapter: "Electromagnetism", wrong: 8, total: 56 },
  { chapter: "Optics", wrong: 9, total: 28 },
  { chapter: "Modern Physics", wrong: 8, total: 41 },
]

function DifficultyScoreChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5" />
          Performance by Difficulty
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={mockDifficultyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="difficulty" />
            <YAxis domain={[0, 100]} />
            <Tooltip formatter={(value) => [`${value}%`, "Score"]} />
            <Bar dataKey="score" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

function ConsecutiveMasteryChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Consecutive Correct Answers
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={mockMasteryData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="chapter" angle={-45} textAnchor="end" height={80} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="consecutive" fill="#10b981" name="Current Streak" />
            <Bar dataKey="target" fill="#e5e7eb" name="Target (10)" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

function QuestionsAttemptedChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Questions Attempted vs Correct
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={mockQuestionsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="chapter" angle={-45} textAnchor="end" height={80} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="attempted" fill="#f59e0b" name="Attempted" />
            <Bar dataKey="correct" fill="#10b981" name="Correct" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

function WrongAnswersChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Wrong Answers by Chapter
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={mockWrongAnswersData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="chapter" angle={-45} textAnchor="end" height={80} />
            <YAxis />
            <Tooltip formatter={(value, name) => [value, name === "wrong" ? "Wrong Answers" : "Total Questions"]} />
            <Bar dataKey="wrong" fill="#ef4444" name="Wrong" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export default function TestGenProgressPage() {
  const [selectedSubject, setSelectedSubject] = useState("Physics")

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">TestGen Progress Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Track your performance across different subjects and difficulty levels
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select subject" />
            </SelectTrigger>
            <SelectContent>
              {subjects.map((subject) => (
                <SelectItem key={subject} value={subject}>
                  {subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Badge variant="secondary">Subject: {selectedSubject}</Badge>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">202</div>
            <div className="text-sm text-muted-foreground">Total Questions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">162</div>
            <div className="text-sm text-muted-foreground">Correct Answers</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">80%</div>
            <div className="text-sm text-muted-foreground">Overall Accuracy</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">12</div>
            <div className="text-sm text-muted-foreground">Best Streak</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <DifficultyScoreChart />
        <ConsecutiveMasteryChart />
        <QuestionsAttemptedChart />
        <WrongAnswersChart />
      </div>
    </div>
  )
}
