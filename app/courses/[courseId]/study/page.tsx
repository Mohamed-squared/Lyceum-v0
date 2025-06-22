"use client"

import { useState, useEffect, useRef } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { LatexRenderer } from "@/components/LatexRenderer"
import { FloatingAIHelper } from "@/components/FloatingAIHelper"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { getChapter } from "@/lib/api"
import type { Chapter } from "@/lib/mock-data"
import { BookOpen, FileText, Presentation, Clock, Zap, Play, FileDown } from "lucide-react"
import { ExportAsPDFButton } from "@/components/ExportAsPDFButton"

export default function StudyPage() {
  const params = useParams()
  const [chapter, setChapter] = useState<Chapter | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedText, setSelectedText] = useState("")
  const [skipExamOpen, setSkipExamOpen] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [timeLeft, setTimeLeft] = useState(300)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({})

  // Add refs for PDF export
  const textbookRef = useRef<HTMLDivElement>(null)
  const slidesRef = useRef<HTMLDivElement>(null)
  const notesRef = useRef<HTMLDivElement>(null)
  const formulasRef = useRef<HTMLDivElement>(null)
  const summaryRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadChapter = async () => {
      if (params.courseId && params.chapterId) {
        const chapterData = await getChapter(params.courseId as string, params.chapterId as string)
        setChapter(chapterData)
        setLoading(false)
      }
    }
    loadChapter()
  }, [params.courseId, params.chapterId])

  useEffect(() => {
    if (skipExamOpen && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [skipExamOpen, timeLeft])

  const handleTextSelection = () => {
    const selection = window.getSelection()
    if (selection && selection.toString().trim()) {
      setSelectedText(selection.toString())
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading chapter...</div>
  }

  if (!chapter) {
    return <div className="text-center py-8">Chapter not found</div>
  }

  const skipExamQuestions = chapter.resources.mcqQuestions?.slice(0, 3) || []

  return (
    <div className="container mx-auto py-6" onMouseUp={handleTextSelection}>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold">{chapter.title}</h1>
            <p className="text-muted-foreground mt-2">{chapter.description}</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {chapter.duration}
            </Badge>
            <Dialog open={skipExamOpen} onOpenChange={setSkipExamOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Take Skip Exam
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center justify-between">
                    <span>Skip Exam - {chapter.title}</span>
                    <Badge variant="destructive">{formatTime(timeLeft)}</Badge>
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <Progress value={(currentQuestion / skipExamQuestions.length) * 100} />
                  {skipExamQuestions.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Question {currentQuestion + 1} of {skipExamQuestions.length}
                        </span>
                        <Badge variant="outline">{skipExamQuestions[currentQuestion]?.difficulty}</Badge>
                      </div>
                      <div className="space-y-4">
                        <LatexRenderer content={skipExamQuestions[currentQuestion]?.question || ""} />
                        <RadioGroup
                          value={selectedAnswers[currentQuestion]?.toString()}
                          onValueChange={(value) =>
                            setSelectedAnswers((prev) => ({ ...prev, [currentQuestion]: Number.parseInt(value) }))
                          }
                        >
                          {skipExamQuestions[currentQuestion]?.options.map((option, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                              <Label htmlFor={`option-${index}`} className="flex-1">
                                <LatexRenderer content={option} />
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                      <div className="flex justify-between">
                        <Button
                          variant="outline"
                          onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                          disabled={currentQuestion === 0}
                        >
                          Previous
                        </Button>
                        <Button
                          onClick={() => {
                            if (currentQuestion < skipExamQuestions.length - 1) {
                              setCurrentQuestion(currentQuestion + 1)
                            } else {
                              setSkipExamOpen(false)
                              // Handle exam completion
                            }
                          }}
                        >
                          {currentQuestion < skipExamQuestions.length - 1 ? "Next" : "Finish"}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <Tabs defaultValue="lectures" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="lectures" className="flex items-center gap-2">
            <Play className="w-4 h-4" />
            Lectures
          </TabsTrigger>
          <TabsTrigger value="textbook" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Textbook
          </TabsTrigger>
          <TabsTrigger value="powerpoint" className="flex items-center gap-2">
            <Presentation className="w-4 h-4" />
            Slides
          </TabsTrigger>
          <TabsTrigger value="notes" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Notes
          </TabsTrigger>
          <TabsTrigger value="formulas" className="flex items-center gap-2">
            <FileDown className="w-4 h-4" />
            Formulas
          </TabsTrigger>
          <TabsTrigger value="summaries" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Summary
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lectures" className="space-y-6">
          {chapter.resources.lectures?.map((videoId, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>Lecture {index + 1}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="aspect-video">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${videoId}`}
                      title={`Lecture ${index + 1}`}
                      frameBorder="0"
                      allowFullScreen
                      className="rounded-lg"
                    />
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold">Transcript</h4>
                    <div className="bg-muted p-4 rounded-lg max-h-64 overflow-y-auto text-sm">
                      <p className="mb-2">
                        Welcome to today's lecture on quantum mechanics fundamentals. We'll be exploring the concept of
                        wave-particle duality and its implications.
                      </p>
                      <p className="mb-2">
                        The de Broglie wavelength, given by λ = h/p, shows us that all matter has wave-like properties.
                        This was a revolutionary concept that changed our understanding of physics.
                      </p>
                      <p>Let's examine some experimental evidence for this phenomenon...</p>
                    </div>
                    {selectedText && (
                      <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded border-l-4 border-yellow-500">
                        <p className="text-sm font-medium">Selected text:</p>
                        <p className="text-sm">{selectedText}</p>
                        <Button size="sm" className="mt-2" variant="outline">
                          Ask AI about Selection
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="textbook">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Textbook Chapter</CardTitle>
                <ExportAsPDFButton
                  targetRef={textbookRef}
                  filename={`${chapter?.title}-textbook`}
                  buttonText="Export PDF"
                />
              </div>
            </CardHeader>
            <CardContent ref={textbookRef}>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-center text-muted-foreground">PDF Viewer would be embedded here</p>
                <p className="text-center text-sm mt-2">Interactive PDF with text selection and AI help</p>
                <div className="flex justify-center mt-4">
                  <Button variant="outline">Ask AI about this Page</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="powerpoint">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Presentation Slides</CardTitle>
                <ExportAsPDFButton
                  targetRef={slidesRef}
                  filename={`${chapter?.title}-slides`}
                  buttonText="Export PDF"
                />
              </div>
            </CardHeader>
            <CardContent ref={slidesRef}>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-center text-muted-foreground">PowerPoint viewer would be embedded here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Chapter Notes</CardTitle>
                <ExportAsPDFButton targetRef={notesRef} filename={`${chapter?.title}-notes`} buttonText="Export PDF" />
              </div>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none" ref={notesRef}>
              <LatexRenderer content={chapter?.resources.notes || "No notes available"} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="formulas">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Formula Sheet</CardTitle>
                <ExportAsPDFButton
                  targetRef={formulasRef}
                  filename={`${chapter?.title}-formulas`}
                  buttonText="Export PDF"
                />
              </div>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none" ref={formulasRef}>
              <LatexRenderer content={chapter?.resources.formulaSheets || "No formulas available"} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summaries">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Chapter Summary</CardTitle>
                <ExportAsPDFButton
                  targetRef={summaryRef}
                  filename={`${chapter?.title}-summary`}
                  buttonText="Export PDF"
                />
              </div>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none" ref={summaryRef}>
              <LatexRenderer content={chapter?.resources.summaries || "No summary available"} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <FloatingAIHelper context={selectedText} contextType="text" />
    </div>
  )
}
