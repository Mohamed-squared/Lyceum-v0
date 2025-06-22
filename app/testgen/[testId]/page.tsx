"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Clock, ChevronLeft, ChevronRight, Send } from "lucide-react"
import { LatexRenderer } from "@/components/LatexRenderer"

interface Question {
  id: string
  type: "mcq" | "written"
  question: string
  options?: string[]
  hasLatex?: boolean
}

const mockQuestions: Question[] = [
  {
    id: "1",
    type: "mcq",
    question: "What is the derivative of $f(x) = x^2 + 3x + 2$?",
    options: ["$2x + 3$", "$x^2 + 3$", "$2x + 2$", "$x + 3$"],
    hasLatex: true,
  },
  {
    id: "2",
    type: "written",
    question: "Solve the integral: $$\\int_{0}^{1} x^2 dx$$",
    hasLatex: true,
  },
  {
    id: "3",
    type: "mcq",
    question: "Which of the following is a fundamental force in physics?",
    options: ["Electromagnetic force", "Centrifugal force", "Friction", "Tension"],
  },
]

export default function TestTakingInterface({ params }: { params: { testId: string } }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [timeLeft, setTimeLeft] = useState(3600) // 1 hour in seconds
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    if (timeLeft > 0 && !isSubmitted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft, isSubmitted])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }))
  }

  const handleNext = () => {
    if (currentQuestion < mockQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = () => {
    setIsSubmitted(true)
    // Handle test submission logic here
  }

  const question = mockQuestions[currentQuestion]
  const progress = ((currentQuestion + 1) / mockQuestions.length) * 100

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-green-600 dark:text-green-400">Test Submitted!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">Your answers have been recorded successfully.</p>
            <Button asChild>
              <a href="/testgen">Return to TestGen Suite</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-foreground">Physics Chapter 5 Practice</h1>
              <p className="text-sm text-muted-foreground">
                Question {currentQuestion + 1} of {mockQuestions.length}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <Badge variant={timeLeft < 300 ? "destructive" : "secondary"}>{formatTime(timeLeft)}</Badge>
              </div>
              <div className="w-32">
                <Progress value={progress} className="h-2" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Question {currentQuestion + 1}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Question */}
              <div className="prose prose-lg max-w-none dark:prose-invert">
                {question.hasLatex ? <LatexRenderer>{question.question}</LatexRenderer> : <p>{question.question}</p>}
              </div>

              {/* Answer Area */}
              <div className="space-y-4">
                {question.type === "mcq" && question.options ? (
                  <RadioGroup
                    value={answers[question.id] || ""}
                    onValueChange={(value) => handleAnswerChange(question.id, value)}
                  >
                    {question.options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`option-${index}`} />
                        <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                          <LatexRenderer>{option}</LatexRenderer>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="written-answer">Your Answer:</Label>
                    <Textarea
                      id="written-answer"
                      placeholder="Type your answer here... (LaTeX supported: use $ for inline math, $$ for display math)"
                      value={answers[question.id] || ""}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      rows={6}
                    />
                    {answers[question.id] && (
                      <div className="mt-4 p-4 bg-muted rounded-lg">
                        <p className="text-sm font-medium mb-2">Preview:</p>
                        <LatexRenderer>{answers[question.id]}</LatexRenderer>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="sticky bottom-0 bg-card/80 backdrop-blur-sm border-t">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <div className="flex items-center space-x-2">
              {mockQuestions.map((_, index) => (
                <Button
                  key={index}
                  variant={
                    index === currentQuestion ? "default" : answers[mockQuestions[index].id] ? "secondary" : "outline"
                  }
                  size="sm"
                  onClick={() => setCurrentQuestion(index)}
                  className="w-8 h-8 p-0"
                >
                  {index + 1}
                </Button>
              ))}
            </div>

            {currentQuestion === mockQuestions.length - 1 ? (
              <Button onClick={handleSubmit}>
                <Send className="h-4 w-4 mr-2" />
                Submit Test
              </Button>
            ) : (
              <Button onClick={handleNext}>
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </footer>
    </div>
  )
}
