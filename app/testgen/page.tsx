"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { FileText, Clock, Target, Zap, Settings, ArrowRight } from "lucide-react"
import { useSearchParams, useRouter } from "next/navigation"
import { getAllCourses } from "@/lib/api"
import type { Course } from "@/lib/mock-data"

export default function TestGenPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSource, setSelectedSource] = useState("")
  const [selectedChapters, setSelectedChapters] = useState<string[]>([])
  const [questionCount, setQuestionCount] = useState([20])
  const [mcqRatio, setMcqRatio] = useState([70])
  const [timingMode, setTimingMode] = useState("default")
  const [customDuration, setCustomDuration] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const allCourses = await getAllCourses()
        setCourses(allCourses)

        // Pre-select course if coming from course dashboard
        const courseParam = searchParams.get("course")
        if (courseParam) {
          setSelectedSource(courseParam)
        }
      } catch (error) {
        console.error("Failed to fetch courses:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [searchParams])

  const selectedCourse = courses.find((c) => c.id === selectedSource)

  const mockChapters = [
    { id: "1", title: "Introduction to Quantum Mechanics", completed: true },
    { id: "2", title: "Wave-Particle Duality", completed: true },
    { id: "3", title: "Wave Functions", completed: false },
    { id: "4", title: "Uncertainty Principle", completed: false },
    { id: "5", title: "Schrödinger Equation", completed: false },
    { id: "6", title: "Quantum Tunneling", completed: false },
  ]

  const subjects = [
    "Physics",
    "Mathematics",
    "Computer Science",
    "Chemistry",
    "Biology",
    "Engineering",
    "History",
    "Literature",
  ]

  const handleChapterToggle = (chapterId: string) => {
    setSelectedChapters((prev) =>
      prev.includes(chapterId) ? prev.filter((id) => id !== chapterId) : [...prev, chapterId],
    )
  }

  const getEstimatedDuration = () => {
    const baseTime = questionCount[0] * 1.5 // 1.5 minutes per question
    const mcqTime = ((questionCount[0] * mcqRatio[0]) / 100) * 1.2
    const writtenTime = ((questionCount[0] * (100 - mcqRatio[0])) / 100) * 3

    switch (timingMode) {
      case "default":
        return `${Math.round(baseTime)} minutes`
      case "calculated":
        return `${Math.round(mcqTime + writtenTime)} minutes`
      case "custom":
        return customDuration ? `${customDuration} minutes` : "Not set"
      default:
        return `${Math.round(baseTime)} minutes`
    }
  }

  const handleGenerateTest = async () => {
    setIsGenerating(true)

    // Simulate test generation
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Navigate to test interface
    const testId = `test_${Date.now()}`
    router.push(`/testgen/${testId}`)
  }

  const canGenerate = selectedSource && (selectedSource.startsWith("subject_") || selectedChapters.length > 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">TestGen Suite</h1>
            <p className="text-muted-foreground mt-1">Generate personalized tests and assessments</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Source Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Test Source
              </CardTitle>
              <CardDescription>Choose the source material for your test questions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Select Source</Label>
                <Select value={selectedSource} onValueChange={setSelectedSource}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Choose a course or subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="px-2 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Your Courses
                    </div>
                    {courses
                      .filter((c) => c.progress !== undefined)
                      .map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          <div className="flex items-center space-x-2">
                            <span>{course.title}</span>
                            <Badge variant="outline" className="text-xs">
                              {course.progress}% complete
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    <Separator className="my-2" />
                    <div className="px-2 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      General Subjects
                    </div>
                    {subjects.map((subject) => (
                      <SelectItem key={subject} value={`subject_${subject.toLowerCase()}`}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Chapter Selection for Courses */}
              {selectedCourse && (
                <div className="mt-6">
                  <Label className="text-sm font-medium">Select Chapters/Topics</Label>
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                    {mockChapters.map((chapter) => (
                      <div key={chapter.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={chapter.id}
                          checked={selectedChapters.includes(chapter.id)}
                          onCheckedChange={() => handleChapterToggle(chapter.id)}
                          disabled={!chapter.completed}
                        />
                        <Label
                          htmlFor={chapter.id}
                          className={`text-sm ${!chapter.completed ? "text-muted-foreground" : ""}`}
                        >
                          {chapter.title}
                          {!chapter.completed && (
                            <Badge variant="outline" className="ml-2 text-xs">
                              Locked
                            </Badge>
                          )}
                        </Label>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Only completed chapters are available for testing
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Test Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Test Configuration
              </CardTitle>
              <CardDescription>Customize your test parameters and difficulty</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Question Count */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-sm font-medium">Total Questions</Label>
                  <Badge variant="outline">{questionCount[0]} questions</Badge>
                </div>
                <Slider
                  value={questionCount}
                  onValueChange={setQuestionCount}
                  max={50}
                  min={5}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>5</span>
                  <span>50</span>
                </div>
              </div>

              {/* Question Mix */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-sm font-medium">Question Mix</Label>
                  <div className="text-sm text-muted-foreground">
                    {mcqRatio[0]}% MCQ, {100 - mcqRatio[0]}% Written
                  </div>
                </div>
                <Slider value={mcqRatio} onValueChange={setMcqRatio} max={100} min={0} step={10} className="w-full" />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>All Written</span>
                  <span>All MCQ</span>
                </div>
              </div>

              {/* Timing */}
              <div>
                <Label className="text-sm font-medium">Test Duration</Label>
                <RadioGroup value={timingMode} onValueChange={setTimingMode} className="mt-3">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="default" id="default" />
                    <Label htmlFor="default" className="text-sm">
                      Default (1.5 min per question)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="calculated" id="calculated" />
                    <Label htmlFor="calculated" className="text-sm">
                      Calculated (based on question types)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="custom" id="custom" />
                    <Label htmlFor="custom" className="text-sm">
                      Custom duration
                    </Label>
                  </div>
                </RadioGroup>

                {timingMode === "custom" && (
                  <div className="mt-3">
                    <Input
                      type="number"
                      placeholder="Duration in minutes"
                      value={customDuration}
                      onChange={(e) => setCustomDuration(e.target.value)}
                      className="max-w-xs"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Test Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Test Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-primary/10 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{questionCount[0]}</div>
                    <div className="text-sm text-primary/80">Total Questions</div>
                  </div>
                  <div className="text-center p-4 bg-green-500/10 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {Math.round((questionCount[0] * mcqRatio[0]) / 100)}
                    </div>
                    <div className="text-sm text-green-600/80 dark:text-green-400/80">MCQ Questions</div>
                  </div>
                  <div className="text-center p-4 bg-purple-500/10 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {Math.round((questionCount[0] * (100 - mcqRatio[0])) / 100)}
                    </div>
                    <div className="text-sm text-purple-600/80 dark:text-purple-400/80">Written Problems</div>
                  </div>
                  <div className="text-center p-4 bg-orange-500/10 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      <Clock className="h-6 w-6 mx-auto mb-1" />
                    </div>
                    <div className="text-sm text-orange-600/80 dark:text-orange-400/80">{getEstimatedDuration()}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Source:</span>
                    <span className="font-medium">
                      {selectedCourse
                        ? selectedCourse.title
                        : selectedSource.startsWith("subject_")
                          ? selectedSource.replace("subject_", "").replace(/^\w/, (c) => c.toUpperCase())
                          : "Not selected"}
                    </span>
                  </div>
                  {selectedCourse && selectedChapters.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Chapters:</span>
                      <span className="font-medium">{selectedChapters.length} selected</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Estimated Duration:</span>
                    <span className="font-medium">{getEstimatedDuration()}</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button
                    onClick={handleGenerateTest}
                    disabled={!canGenerate || isGenerating}
                    className="w-full"
                    size="lg"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-current mr-2"></div>
                        Generating Test...
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4 mr-2" />
                        Generate & Start Test
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle>Test Generation Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-foreground mb-2">For Best Results:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Select multiple chapters for comprehensive coverage</li>
                    <li>• Use 70-80% MCQ for quick assessment</li>
                    <li>• Include written problems for deeper understanding</li>
                    <li>• Allow calculated timing for optimal pacing</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">Question Types:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• MCQ: Multiple choice with explanations</li>
                    <li>• Written: Problem-solving and calculations</li>
                    <li>• Difficulty adapts to your progress</li>
                    <li>• AI generates unique questions each time</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
