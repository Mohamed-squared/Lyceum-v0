"use client"

import { useRef } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ExportAsPDFButton } from "@/components/ExportAsPDFButton"
import { QuestionReview } from "@/components/QuestionReview"
import { LatexRenderer } from "@/components/LatexRenderer"
import { ArrowLeft, Trophy, Clock, Target, TrendingUp } from "lucide-react"
import Link from "next/link"

const mockExamData = {
  id: "exam_001",
  type: "TestGen",
  courseName: "Quantum Mechanics",
  completionDate: "2024-01-15",
  duration: "45 minutes",
  totalScore: 85,
  maxScore: 100,
  overallSummary: {
    performance: "Good",
    strengths: ["Strong understanding of wave-particle duality", "Excellent mathematical problem-solving"],
    weaknesses: ["Uncertainty principle applications", "Quantum tunneling concepts"],
    timeManagement: "Efficient - completed 5 minutes early",
    difficulty: "Appropriate for your level",
  },
  overallAiFeedback: `## Overall Performance Analysis

**Score: 85/100 (85%)**

Your performance on this quantum mechanics assessment demonstrates a solid understanding of fundamental concepts with room for improvement in specific areas.

### Strengths Demonstrated:
- **Wave-Particle Duality**: Excellent grasp of the conceptual framework
- **Mathematical Applications**: Strong problem-solving skills in Schrödinger equation applications
- **Time Management**: Completed the exam efficiently with time to spare

### Areas for Improvement:
- **Uncertainty Principle**: Consider reviewing Heisenberg's uncertainty principle and its practical applications
- **Quantum Tunneling**: The mathematical treatment of tunneling phenomena needs reinforcement

### Recommendations:
1. Review Chapter 4 materials on uncertainty principle
2. Practice more problems involving tunneling calculations
3. Focus on conceptual understanding rather than memorization

**Overall Grade: B+ (Very Good)**`,
  questions: [
    {
      id: "Q1",
      question: "What is the de Broglie wavelength of an electron moving at velocity $v = 2.0 \\times 10^6$ m/s?",
      type: "written" as const,
      userAnswer:
        "$\\lambda = \\frac{h}{mv} = \\frac{6.626 \\times 10^{-34}}{9.109 \\times 10^{-31} \\times 2.0 \\times 10^6} = 3.64 \\times 10^{-10}$ m",
      correctAnswer:
        "$\\lambda = \\frac{h}{mv} = \\frac{6.626 \\times 10^{-34}}{9.109 \\times 10^{-31} \\times 2.0 \\times 10^6} = 3.64 \\times 10^{-10}$ m",
      isCorrect: true,
      scoreAwarded: 5,
      maxScore: 5,
      aiMarkingFeedback:
        "Excellent work! You correctly applied the de Broglie wavelength formula and performed accurate calculations. Your significant figures are appropriate for the given data.",
      chapter: "Wave-Particle Duality",
      difficulty: "Medium",
    },
    {
      id: "Q2",
      question:
        "Which of the following best describes the uncertainty principle?\n\nA) Position and momentum can both be measured exactly\nB) The more precisely position is known, the less precisely momentum can be known\nC) Uncertainty only applies to large objects\nD) Measurement uncertainty is due to instrument limitations",
      type: "mcq" as const,
      userAnswer: "A) Position and momentum can both be measured exactly",
      correctAnswer: "B) The more precisely position is known, the less precisely momentum can be known",
      isCorrect: false,
      scoreAwarded: 0,
      maxScore: 3,
      chapter: "Uncertainty Principle",
      difficulty: "Easy",
    },
    {
      id: "Q3",
      question:
        "Calculate the probability of finding a particle in a 1D infinite square well between $x = 0$ and $x = L/4$ for the ground state.",
      type: "written" as const,
      userAnswer:
        "$P = \\int_0^{L/4} |\\psi_1(x)|^2 dx = \\int_0^{L/4} \\frac{2}{L} \\sin^2(\\frac{\\pi x}{L}) dx = 0.091$",
      correctAnswer:
        "$P = \\int_0^{L/4} |\\psi_1(x)|^2 dx = \\int_0^{L/4} \\frac{2}{L} \\sin^2(\\frac{\\pi x}{L}) dx = 0.091$",
      isCorrect: true,
      scoreAwarded: 7,
      maxScore: 7,
      aiMarkingFeedback:
        "Perfect solution! You correctly set up the probability integral and evaluated it accurately. Your understanding of the ground state wave function is excellent.",
      chapter: "Quantum States",
      difficulty: "Hard",
    },
  ],
}

export default function ExamReviewPage() {
  const params = useParams()
  const reviewRef = useRef<HTMLDivElement>(null)

  const examData = mockExamData // In real app, fetch based on params.examId

  const correctAnswers = examData.questions.filter((q) => q.isCorrect).length
  const totalQuestions = examData.questions.length
  const accuracyPercentage = (correctAnswers / totalQuestions) * 100

  return (
    <div className="container mx-auto py-6 space-y-6" ref={reviewRef}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline">
            <Link href="/history/exams">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to History
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Exam Review</h1>
            <p className="text-muted-foreground">
              {examData.type} • {examData.courseName} • {new Date(examData.completionDate).toLocaleDateString()}
            </p>
          </div>
        </div>
        <ExportAsPDFButton
          targetRef={reviewRef}
          filename={`exam-review-${examData.id}`}
          buttonText="Export Full Review"
        />
      </div>

      {/* Overall Summary */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Trophy className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">
              {examData.totalScore}/{examData.maxScore}
            </div>
            <div className="text-sm text-muted-foreground">Total Score</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">
              {correctAnswers}/{totalQuestions}
            </div>
            <div className="text-sm text-muted-foreground">Correct Answers</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{Math.round(accuracyPercentage)}%</div>
            <div className="text-sm text-muted-foreground">Accuracy</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{examData.duration}</div>
            <div className="text-sm text-muted-foreground">Duration</div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Overall Progress</span>
              <span>{Math.round((examData.totalScore / examData.maxScore) * 100)}%</span>
            </div>
            <Progress value={(examData.totalScore / examData.maxScore) * 100} className="h-3" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-green-700 mb-2">Strengths</h4>
              <ul className="space-y-1">
                {examData.overallSummary.strengths.map((strength, index) => (
                  <li key={index} className="text-sm flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    {strength}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-red-700 mb-2">Areas for Improvement</h4>
              <ul className="space-y-1">
                {examData.overallSummary.weaknesses.map((weakness, index) => (
                  <li key={index} className="text-sm flex items-start">
                    <span className="text-red-600 mr-2">•</span>
                    {weakness}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overall AI Feedback */}
      <Card>
        <CardHeader>
          <CardTitle>Overall AI Feedback</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <LatexRenderer content={examData.overallAiFeedback} />
        </CardContent>
      </Card>

      {/* Question Breakdown */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Question Breakdown</h2>
          <Badge variant="secondary">{examData.questions.length} questions</Badge>
        </div>

        {examData.questions.map((question) => (
          <QuestionReview key={question.id} question={question} />
        ))}
      </div>
    </div>
  )
}
