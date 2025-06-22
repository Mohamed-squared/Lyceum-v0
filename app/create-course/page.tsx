"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { FileText, Video, Sparkles, Settings, ArrowRight, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { createCourse, type CourseCreationData } from "@/lib/api"
import { mockUser } from "@/lib/mock-data"

export default function CreateCoursePage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [courseData, setCourseData] = useState<CourseCreationData>({
    title: "",
    language: "",
    privacy: "private",
    automationMethod: "ai",
  })

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const result = await createCourse(courseData)
      // Redirect to generation dashboard
      window.location.href = `/courses/${result.courseId}/generation`
    } catch (error) {
      console.error("Failed to create course:", error)
      setIsSubmitting(false)
    }
  }

  const canProceedStep1 = courseData.title && courseData.language && courseData.privacy
  const canProceedStep2 = courseData.automationMethod
  const canProceedStep3 = courseData.automationMethod === "manual" || courseData.textbook || courseData.lectures

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create New Course</h1>
              <p className="text-gray-600 mt-1">Let AI help you build a comprehensive learning experience</p>
            </div>
            <Button asChild variant="outline">
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step <= currentStep ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {step}
                  </div>
                  {step < 4 && (
                    <div className={`w-24 h-1 mx-2 ${step < currentStep ? "bg-blue-600" : "bg-gray-200"}`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Basic Info</span>
              <span>Method</span>
              <span>Resources</span>
              <span>Review</span>
            </div>
          </div>

          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Course Basic Information</CardTitle>
                <CardDescription>Set up the fundamental details of your course</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Course Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Introduction to Quantum Physics"
                    value={courseData.title}
                    onChange={(e) => setCourseData({ ...courseData, title: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Course Language *</Label>
                  <Select
                    value={courseData.language}
                    onValueChange={(value) => setCourseData({ ...courseData, language: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="arabic">Arabic</SelectItem>
                      <SelectItem value="turkish">Turkish</SelectItem>
                      <SelectItem value="german">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>Privacy Setting *</Label>
                  <RadioGroup
                    value={courseData.privacy}
                    onValueChange={(value: "public" | "private") => setCourseData({ ...courseData, privacy: value })}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="public" id="public" />
                      <Label htmlFor="public">Public (Visible to everyone)</Label>
                      {mockUser.role !== "educator" && <Badge variant="outline">Educators Only</Badge>}
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="private" id="private" />
                      <Label htmlFor="private">Private (Invitation only)</Label>
                    </div>
                  </RadioGroup>
                </div>

                {courseData.privacy === "private" && (
                  <div className="space-y-3">
                    <Label>Access Control</Label>
                    <RadioGroup
                      value={courseData.access}
                      onValueChange={(value: "password" | "invite") => setCourseData({ ...courseData, access: value })}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="password" id="password" />
                        <Label htmlFor="password">Password Protected</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="invite" id="invite" />
                        <Label htmlFor="invite">Invite Only</Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}

                {courseData.privacy === "public" && mockUser.role === "educator" && (
                  <div className="space-y-3">
                    <Label>Pricing</Label>
                    <RadioGroup
                      value={courseData.pricing}
                      onValueChange={(value: "free" | "paid") => setCourseData({ ...courseData, pricing: value })}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="free" id="free" />
                        <Label htmlFor="free">Free</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="paid" id="paid" />
                        <Label htmlFor="paid">Paid</Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}

                <div className="flex justify-end">
                  <Button onClick={handleNext} disabled={!canProceedStep1}>
                    Next Step <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Automation Method */}
          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Course Creation Method</CardTitle>
                <CardDescription>Choose how you want to create your course content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <RadioGroup
                  value={courseData.automationMethod}
                  onValueChange={(value: "ai" | "manual") => setCourseData({ ...courseData, automationMethod: value })}
                >
                  <Card
                    className={`cursor-pointer transition-colors ${courseData.automationMethod === "ai" ? "ring-2 ring-blue-500" : ""}`}
                    onClick={() => setCourseData({ ...courseData, automationMethod: "ai" })}
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-center space-x-2 mb-3">
                        <RadioGroupItem value="ai" id="ai" />
                        <Label htmlFor="ai" className="text-lg font-semibold cursor-pointer">
                          Full AI Course Automation
                        </Label>
                        <Badge className="bg-blue-100 text-blue-800">Recommended</Badge>
                      </div>
                      <div className="flex items-start space-x-4">
                        <Sparkles className="h-8 w-8 text-blue-600 mt-1" />
                        <div>
                          <p className="text-gray-600 mb-3">
                            Upload your textbook and/or lecture videos, and our AI will automatically generate:
                          </p>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Comprehensive notes and summaries</li>
                            <li>• Interactive presentations</li>
                            <li>• Practice questions and assessments</li>
                            <li>• Formula sheets and study guides</li>
                            <li>• Structured course chapters</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card
                    className={`cursor-pointer transition-colors ${courseData.automationMethod === "manual" ? "ring-2 ring-blue-500" : ""}`}
                    onClick={() => setCourseData({ ...courseData, automationMethod: "manual" })}
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-center space-x-2 mb-3">
                        <RadioGroupItem value="manual" id="manual" />
                        <Label htmlFor="manual" className="text-lg font-semibold cursor-pointer">
                          Manual Creation
                        </Label>
                      </div>
                      <div className="flex items-start space-x-4">
                        <Settings className="h-8 w-8 text-gray-600 mt-1" />
                        <div>
                          <p className="text-gray-600 mb-3">
                            Create your course content manually with full control over every aspect:
                          </p>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Upload your own materials chapter by chapter</li>
                            <li>• Create custom assessments and quizzes</li>
                            <li>• Design your own presentations</li>
                            <li>• Full creative control over content structure</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </RadioGroup>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={handleBack}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  <Button onClick={handleNext} disabled={!canProceedStep2}>
                    Next Step <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Resource Upload */}
          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {courseData.automationMethod === "ai" ? "Upload Course Resources" : "Manual Course Setup"}
                </CardTitle>
                <CardDescription>
                  {courseData.automationMethod === "ai"
                    ? "Provide the materials for AI to generate your course content"
                    : "Set up your course structure manually"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {courseData.automationMethod === "ai" ? (
                  <Tabs defaultValue="both" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="both">Textbook + Lectures</TabsTrigger>
                      <TabsTrigger value="textbook">Textbook Only</TabsTrigger>
                      <TabsTrigger value="lectures">Lectures Only</TabsTrigger>
                    </TabsList>

                    <TabsContent value="both" className="space-y-6">
                      <div className="space-y-4">
                        <div>
                          <Label className="text-base font-semibold">Course Textbook (PDF)</Label>
                          <p className="text-sm text-gray-600 mb-3">Upload the main textbook for your course</p>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer">
                            <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                            <p className="text-xs text-gray-400">PDF files only, max 50MB</p>
                            <input
                              type="file"
                              accept=".pdf"
                              className="hidden"
                              onChange={(e) => setCourseData({ ...courseData, textbook: e.target.files?.[0] })}
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="firstPage" className="text-base font-semibold">
                            First True Page Number
                          </Label>
                          <p className="text-sm text-gray-600 mb-2">
                            What page number in the PDF corresponds to "Page 1" in the book's table of contents?
                          </p>
                          <Input
                            id="firstPage"
                            type="number"
                            placeholder="e.g., 15"
                            value={courseData.firstPageNumber || ""}
                            onChange={(e) => setCourseData({ ...courseData, firstPageNumber: e.target.value })}
                          />
                        </div>

                        <div>
                          <Label htmlFor="lectures" className="text-base font-semibold">
                            Lecture Videos
                          </Label>
                          <p className="text-sm text-gray-600 mb-2">Provide YouTube playlist URL for course lectures</p>
                          <Input
                            id="lectures"
                            placeholder="https://youtube.com/playlist?list=..."
                            value={courseData.lectures || ""}
                            onChange={(e) => setCourseData({ ...courseData, lectures: e.target.value })}
                          />
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="textbook" className="space-y-6">
                      <div className="space-y-4">
                        <div>
                          <Label className="text-base font-semibold">Course Textbook (PDF)</Label>
                          <p className="text-sm text-gray-600 mb-3">Upload the main textbook for your course</p>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer">
                            <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                            <p className="text-xs text-gray-400">PDF files only, max 50MB</p>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="firstPageTextbook" className="text-base font-semibold">
                            First True Page Number
                          </Label>
                          <p className="text-sm text-gray-600 mb-2">
                            What page number in the PDF corresponds to "Page 1" in the book's table of contents?
                          </p>
                          <Input
                            id="firstPageTextbook"
                            type="number"
                            placeholder="e.g., 15"
                            value={courseData.firstPageNumber || ""}
                            onChange={(e) => setCourseData({ ...courseData, firstPageNumber: e.target.value })}
                          />
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="lectures" className="space-y-6">
                      <div>
                        <Label htmlFor="lecturesOnly" className="text-base font-semibold">
                          Lecture Videos
                        </Label>
                        <p className="text-sm text-gray-600 mb-2">Provide YouTube playlist URL for course lectures</p>
                        <Input
                          id="lecturesOnly"
                          placeholder="https://youtube.com/playlist?list=..."
                          value={courseData.lectures || ""}
                          onChange={(e) => setCourseData({ ...courseData, lectures: e.target.value })}
                        />
                      </div>
                    </TabsContent>
                  </Tabs>
                ) : (
                  <div className="text-center py-8">
                    <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Manual Course Creation</h3>
                    <p className="text-gray-600 mb-4">
                      You'll be able to add chapters, upload materials, and create assessments after the course is
                      created.
                    </p>
                  </div>
                )}

                {courseData.automationMethod === "ai" && (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
                    <p className="text-sm text-blue-800">
                      Our AI will analyze your materials and automatically generate comprehensive course content
                      including notes, presentations, quizzes, and study materials. This process typically takes 15-30
                      minutes depending on the size of your materials.
                    </p>
                  </div>
                )}

                <div className="flex justify-between">
                  <Button variant="outline" onClick={handleBack}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  <Button onClick={handleNext} disabled={!canProceedStep3}>
                    Review & Generate <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Review & Generate */}
          {currentStep === 4 && (
            <Card>
              <CardHeader>
                <CardTitle>Review & Generate Course</CardTitle>
                <CardDescription>Review your course settings before starting the generation process</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Course Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Title:</span>
                        <span>{courseData.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Language:</span>
                        <span className="capitalize">{courseData.language}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Privacy:</span>
                        <span className="capitalize">{courseData.privacy}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Method:</span>
                        <span>{courseData.automationMethod === "ai" ? "AI Automation" : "Manual Creation"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Resources Provided</h3>
                    <div className="space-y-2 text-sm">
                      {courseData.textbook && (
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-blue-600" />
                          <span>Textbook PDF uploaded</span>
                        </div>
                      )}
                      {courseData.lectures && (
                        <div className="flex items-center space-x-2">
                          <Video className="h-4 w-4 text-green-600" />
                          <span>Lecture playlist provided</span>
                        </div>
                      )}
                      {courseData.automationMethod === "manual" && (
                        <div className="flex items-center space-x-2">
                          <Settings className="h-4 w-4 text-gray-600" />
                          <span>Manual creation selected</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {courseData.automationMethod === "ai" && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="font-semibold text-yellow-800 mb-2">Important Notes</h3>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• The generation process will take 15-30 minutes</li>
                      <li>• Please keep this tab open during generation</li>
                      <li>• You'll be notified when your course is ready</li>
                      <li>• You can edit and customize content after generation</li>
                    </ul>
                  </div>
                )}

                <div className="flex justify-between">
                  <Button variant="outline" onClick={handleBack}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        {courseData.automationMethod === "ai" ? "Start AI Generation" : "Create Course"}
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
