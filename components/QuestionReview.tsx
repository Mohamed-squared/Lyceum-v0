"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ExportAsPDFButton } from "@/components/ExportAsPDFButton"
import { LatexRenderer } from "@/components/LatexRenderer"
import { ChevronDown, MessageCircle, Flag, CheckCircle, XCircle, Send } from "lucide-react"

interface QuestionReviewProps {
  question: {
    id: string
    question: string
    type: "mcq" | "written"
    userAnswer: string
    correctAnswer: string
    isCorrect: boolean
    scoreAwarded: number
    maxScore: number
    aiMarkingFeedback?: string
    chapter: string
    difficulty: string
  }
}

export function QuestionReview({ question }: QuestionReviewProps) {
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [aiChatOpen, setAiChatOpen] = useState(false)
  const [reportOpen, setReportOpen] = useState(false)
  const [reportText, setReportText] = useState("")
  const [chatMessages, setChatMessages] = useState([
    {
      role: "assistant" as const,
      content: `I can help explain this ${question.type === "mcq" ? "multiple choice question" : "problem"} about ${question.chapter}. What would you like to know?`,
    },
  ])
  const [newMessage, setNewMessage] = useState("")
  const questionRef = useRef<HTMLDivElement>(null)

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    setChatMessages((prev) => [
      ...prev,
      { role: "user" as const, content: newMessage },
      { role: "assistant" as const, content: "This is a mock AI response explaining the concept in detail..." },
    ])
    setNewMessage("")
  }

  const handleReportSubmit = () => {
    console.log("Reporting issue:", reportText)
    setReportText("")
    setReportOpen(false)
  }

  return (
    <Card className="mb-6" ref={questionRef}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="text-lg">Question {question.id}</CardTitle>
            <Badge variant="outline">{question.type.toUpperCase()}</Badge>
            <Badge variant="secondary">{question.chapter}</Badge>
            <Badge variant="outline">{question.difficulty}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {question.isCorrect ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600" />
              )}
              <span className={`font-semibold ${question.isCorrect ? "text-green-600" : "text-red-600"}`}>
                {question.scoreAwarded}/{question.maxScore}
              </span>
            </div>
            <ExportAsPDFButton
              targetRef={questionRef}
              filename={`question-${question.id}-review`}
              buttonText="Export"
              size="sm"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Question */}
        <div>
          <h4 className="font-semibold mb-2">Question:</h4>
          <div className="bg-gray-50 p-4 rounded-lg">
            <LatexRenderer content={question.question} />
          </div>
        </div>

        {/* Answers */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold mb-2">Your Answer:</h4>
            <div
              className={`p-4 rounded-lg border-2 ${question.isCorrect ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
            >
              <LatexRenderer content={question.userAnswer} />
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Correct Answer:</h4>
            <div className="p-4 rounded-lg border-2 border-green-200 bg-green-50">
              <LatexRenderer content={question.correctAnswer} />
            </div>
          </div>
        </div>

        {/* AI Marking Feedback for Written Problems */}
        {question.type === "written" && question.aiMarkingFeedback && (
          <Collapsible open={feedbackOpen} onOpenChange={setFeedbackOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full flex items-center justify-between">
                <span>AI Marking Feedback</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${feedbackOpen ? "rotate-180" : ""}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <LatexRenderer content={question.aiMarkingFeedback} />
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Dialog open={aiChatOpen} onOpenChange={setAiChatOpen}>
            <DialogTrigger asChild>
              <Button variant="default">
                <MessageCircle className="w-4 h-4 mr-2" />
                AI Explanation
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh]">
              <DialogHeader>
                <DialogTitle>AI Explanation - Question {question.id}</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col h-96">
                <div className="flex-1 overflow-y-auto space-y-3 p-4 bg-gray-50 rounded-lg">
                  {chatMessages.map((message, index) => (
                    <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.role === "user" ? "bg-blue-600 text-white" : "bg-white border"
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-4">
                  <input
                    type="text"
                    placeholder="Ask about this question..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1 px-3 py-2 border rounded-lg"
                  />
                  <Button onClick={handleSendMessage}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={reportOpen} onOpenChange={setReportOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Flag className="w-4 h-4 mr-2" />
                Report Issue
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Report Issue - Question {question.id}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Describe the issue:</Label>
                  <Textarea
                    placeholder="Please describe the issue with this question or its marking..."
                    value={reportText}
                    onChange={(e) => setReportText(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setReportOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleReportSubmit}>Submit Report</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  )
}
