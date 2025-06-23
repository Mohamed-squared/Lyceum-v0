"use client"

import { useState, useEffect } from "react"
import { useFormState, useFormStatus } from "react-dom"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { FileText, Video, Sparkles, Settings, ArrowRight, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
// REMOVE: import { createCourse, type CourseCreationData } from "@/lib/api"
import { createCourseAction } from "@/app/actions/course" // Import Server Action
import { toast } from "@/components/ui/use-toast"
import { useUser } from "@/lib/contexts/UserContext" // To check educator role for public/pricing

// Client-side state for the form
interface ClientCourseCreationData {
  title: string;
  language: string;
  privacy: "public" | "private";
  automationMethod: "ai" | "manual";
  access?: "password" | "invite";
  pricing?: "free" | "paid";
  textbook?: File | null; // Store the File object directly
  firstPageNumber?: string; // Keep as string for input, parse in action
  lectures?: string; // YouTube playlist URL
}

const initialFormActionState = {
  message: "",
  errors: null,
  success: false,
  courseId: undefined,
  redirectUrl: undefined,
};

function SubmitButton({ disabled, automationMethod }: { disabled: boolean, automationMethod: "ai" | "manual" }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={disabled || pending} className="bg-blue-600 hover:bg-blue-700">
      {pending ? (
        <>
          <Loader2 className="animate-spin h-4 w-4 mr-2" />
          Creating...
        </>
      ) : (
        <>
          <Sparkles className="h-4 w-4 mr-2" />
          {automationMethod === "ai" ? "Start AI Generation" : "Create Course"}
        </>
      )}
    </Button>
  );
}


export default function CreateCoursePage() {
  const { user } = useUser(); // Get user role
  const router = useRouter();
  const [state, formAction] = useFormState(createCourseAction, initialFormActionState);

  const [currentStep, setCurrentStep] = useState(1);
  const [courseData, setCourseData] = useState<ClientCourseCreationData>({
    title: "",
    language: "", // Default or require selection
    privacy: "private",
    automationMethod: "ai",
    textbook: null,
  });

  useEffect(() => {
    if (state.success && state.redirectUrl) {
      toast({ title: "Success!", description: state.message });
      router.push(state.redirectUrl);
    } else if (!state.success && state.message) {
      const errorMessages = state.errors ? Object.entries(state.errors).map(([key, valArr]) => `${key}: ${(valArr as string[]).join(', ')}`).join('\n') : '';
      toast({ title: "Error Creating Course", description: state.message + (errorMessages ? `\nDetails: ${errorMessages}` : ''), variant: "destructive" });
    }
  }, [state, router]);


  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };
  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleDataChange = (field: keyof ClientCourseCreationData, value: any) => {
    setCourseData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        handleDataChange("textbook", file);
    } else {
        handleDataChange("textbook", null);
    }
  };

  // Form submission logic
  const processFormSubmission = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formDataForAction = new FormData(event.currentTarget); // Gets named inputs from the current step

    // Explicitly set all known fields on FormData from client state to ensure everything is included
    formDataForAction.set('title', courseData.title);
    formDataForAction.set('language', courseData.language);
    formDataForAction.set('privacy', courseData.privacy);
    formDataForAction.set('automationMethod', courseData.automationMethod);
    if(courseData.access) formDataForAction.set('access', courseData.access);
    if(courseData.pricing) formDataForAction.set('pricing', courseData.pricing);
    if(courseData.firstPageNumber) formDataForAction.set('firstPageNumber', courseData.firstPageNumber);
    if(courseData.lectures) formDataForAction.set('lectures', courseData.lectures);

    if (courseData.textbook) {
      formDataForAction.set('textbookFile', courseData.textbook);
    }

    formAction(formDataForAction);
  };


  const canProceedStep1 = !!(courseData.title && courseData.language && courseData.privacy);
  const canProceedStep2 = !!courseData.automationMethod;
  const canProceedStep3 = courseData.automationMethod === "manual" || !!courseData.textbook || !!courseData.lectures?.trim();

  return (
    <form onSubmit={processFormSubmission} className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create New Course</h1>
              <p className="text-gray-600 mt-1">Let AI help you build a comprehensive learning experience</p>
            </div>
            <Button type="button" asChild variant="outline">
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
          {/* Progress Indicator (remains client-side) */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step <= currentStep ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"}`}>
                    {step}
                  </div>
                  {step < 4 && (<div className={`w-24 h-1 mx-2 ${step < currentStep ? "bg-blue-600" : "bg-gray-200"}`} />)}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Basic Info</span><span>Method</span><span>Resources</span><span>Review</span>
            </div>
          </div>

          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <Card>
              <CardHeader><CardTitle>Course Basic Information</CardTitle><CardDescription>Set up the fundamental details of your course</CardDescription></CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title_step1">Course Title *</Label>
                  <Input id="title_step1" name="title" placeholder="e.g., Introduction to Quantum Physics" value={courseData.title} onChange={(e) => handleDataChange("title", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Course Language *</Label>
                  <Select name="language" value={courseData.language} onValueChange={(value) => handleDataChange("language", value)}>
                    <SelectTrigger><SelectValue placeholder="Select language" /></SelectTrigger>
                    <SelectContent><SelectItem value="english">English</SelectItem><SelectItem value="arabic">Arabic</SelectItem><SelectItem value="turkish">Turkish</SelectItem><SelectItem value="german">German</SelectItem></SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label>Privacy Setting *</Label>
                  <RadioGroup name="privacy" value={courseData.privacy} onValueChange={(value: "public" | "private") => handleDataChange("privacy", value)}>
                    <div className="flex items-center space-x-2"><RadioGroupItem value="public" id="public_step1" /><Label htmlFor="public_step1">Public (Visible to everyone)</Label>{user?.role !== "educator" && <Badge variant="outline">Educators Only</Badge>}</div>
                    <div className="flex items-center space-x-2"><RadioGroupItem value="private" id="private_step1" /><Label htmlFor="private_step1">Private (Invitation only)</Label></div>
                  </RadioGroup>
                </div>
                {courseData.privacy === "private" && (
                  <div className="space-y-3">
                    <Label>Access Control</Label>
                    <RadioGroup name="access" value={courseData.access} onValueChange={(value: "password" | "invite") => handleDataChange("access", value)}>
                      <div className="flex items-center space-x-2"><RadioGroupItem value="password" id="password_step1" /><Label htmlFor="password_step1">Password Protected</Label></div>
                      <div className="flex items-center space-x-2"><RadioGroupItem value="invite" id="invite_step1" /><Label htmlFor="invite_step1">Invite Only</Label></div>
                    </RadioGroup>
                  </div>
                )}
                {courseData.privacy === "public" && user?.role === "educator" && (
                  <div className="space-y-3">
                    <Label>Pricing</Label>
                    <RadioGroup name="pricing" value={courseData.pricing} onValueChange={(value: "free" | "paid") => handleDataChange("pricing", value)}>
                      <div className="flex items-center space-x-2"><RadioGroupItem value="free" id="free_step1" /><Label htmlFor="free_step1">Free</Label></div>
                      <div className="flex items-center space-x-2"><RadioGroupItem value="paid" id="paid_step1" /><Label htmlFor="paid_step1">Paid</Label></div>
                    </RadioGroup>
                  </div>
                )}
                <div className="flex justify-end"><Button type="button" onClick={handleNext} disabled={!canProceedStep1}>Next Step <ArrowRight className="h-4 w-4 ml-2" /></Button></div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Automation Method */}
          {currentStep === 2 && (
            <Card>
              <CardHeader><CardTitle>Course Creation Method</CardTitle><CardDescription>Choose how you want to create your course content</CardDescription></CardHeader>
              <CardContent className="space-y-6">
                <RadioGroup name="automationMethod" value={courseData.automationMethod} onValueChange={(value: "ai" | "manual") => handleDataChange("automationMethod", value)}>
                  <Card className={`cursor-pointer transition-colors ${courseData.automationMethod === "ai" ? "ring-2 ring-blue-500" : ""}`} onClick={() => handleDataChange("automationMethod", "ai")}>
                    <CardContent className="pt-6"><div className="flex items-center space-x-2 mb-3"><RadioGroupItem value="ai" id="ai_step2" /><Label htmlFor="ai_step2" className="text-lg font-semibold cursor-pointer">Full AI Course Automation</Label><Badge className="bg-blue-100 text-blue-800">Recommended</Badge></div><div className="flex items-start space-x-4"><Sparkles className="h-8 w-8 text-blue-600 mt-1" /><div><p className="text-gray-600 mb-3">Upload your textbook and/or lecture videos, and our AI will automatically generate:</p><ul className="text-sm text-gray-600 space-y-1"><li>• Comprehensive notes and summaries</li><li>• Interactive presentations</li><li>• Practice questions and assessments</li><li>• Formula sheets and study guides</li><li>• Structured course chapters</li></ul></div></div></CardContent>
                  </Card>
                  <Card className={`cursor-pointer transition-colors ${courseData.automationMethod === "manual" ? "ring-2 ring-blue-500" : ""}`} onClick={() => handleDataChange("automationMethod", "manual")}>
                    <CardContent className="pt-6"><div className="flex items-center space-x-2 mb-3"><RadioGroupItem value="manual" id="manual_step2" /><Label htmlFor="manual_step2" className="text-lg font-semibold cursor-pointer">Manual Creation</Label></div><div className="flex items-start space-x-4"><Settings className="h-8 w-8 text-gray-600 mt-1" /><div><p className="text-gray-600 mb-3">Create your course content manually with full control over every aspect:</p><ul className="text-sm text-gray-600 space-y-1"><li>• Upload your own materials chapter by chapter</li><li>• Create custom assessments and quizzes</li><li>• Design your own presentations</li><li>• Full creative control over content structure</li></ul></div></div></CardContent>
                  </Card>
                </RadioGroup>
                <div className="flex justify-between"><Button type="button" variant="outline" onClick={handleBack}><ArrowLeft className="h-4 w-4 mr-2" />Previous</Button><Button type="button" onClick={handleNext} disabled={!canProceedStep2}>Next Step <ArrowRight className="h-4 w-4 ml-2" /></Button></div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Resource Upload */}
          {currentStep === 3 && (
            <Card>
              <CardHeader><CardTitle>{courseData.automationMethod === "ai" ? "Upload Course Resources" : "Manual Course Setup"}</CardTitle><CardDescription>{courseData.automationMethod === "ai" ? "Provide the materials for AI to generate your course content" : "Set up your course structure manually"}</CardDescription></CardHeader>
              <CardContent className="space-y-6">
                {courseData.automationMethod === "ai" ? (
                  <Tabs defaultValue="both" className="w-full">
                    <TabsList className="grid w-full grid-cols-3"><TabsTrigger value="both">Textbook + Lectures</TabsTrigger><TabsTrigger value="textbook">Textbook Only</TabsTrigger><TabsTrigger value="lectures">Lectures Only</TabsTrigger></TabsList>
                    <TabsContent value="both" className="space-y-6">
                      <div className="space-y-4">
                        <div><Label htmlFor="textbookFile_both_display">Course Textbook (PDF)</Label><p className="text-sm text-gray-600 mb-3">Upload the main textbook for your course</p>
                          <Input id="textbookFile_both_display" name="textbookFile_display_only_both" type="file" accept=".pdf" onChange={handleFileChange} className="border-2 border-dashed border-gray-300 p-6 text-center file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
                          {courseData.textbook && <p className="text-sm text-green-600 mt-2">Selected: {courseData.textbook.name}</p>}
                        </div>
                        <div><Label htmlFor="firstPage_both">First True Page Number</Label><p className="text-sm text-gray-600 mb-2">What page number in the PDF corresponds to "Page 1" in the book's table of contents?</p><Input id="firstPage_both" name="firstPageNumber" type="number" placeholder="e.g., 15" value={courseData.firstPageNumber || ""} onChange={(e) => handleDataChange("firstPageNumber", e.target.value)} /></div>
                        <div><Label htmlFor="lectures_both">Lecture Videos</Label><p className="text-sm text-gray-600 mb-2">Provide YouTube playlist URL for course lectures</p><Input id="lectures_both" name="lectures" placeholder="https://youtube.com/playlist?list=..." value={courseData.lectures || ""} onChange={(e) => handleDataChange("lectures", e.target.value)} /></div>
                      </div>
                    </TabsContent>
                    <TabsContent value="textbook" className="space-y-6">
                        <div><Label htmlFor="textbookFile_textbook_display">Course Textbook (PDF)</Label><p className="text-sm text-gray-600 mb-3">Upload the main textbook for your course</p>
                           <Input id="textbookFile_textbook_display" name="textbookFile_display_only_textbook" type="file" accept=".pdf" onChange={handleFileChange} className="border-2 border-dashed border-gray-300 p-6 text-center file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
                           {courseData.textbook && <p className="text-sm text-green-600 mt-2">Selected: {courseData.textbook.name}</p>}
                        </div>
                        <div><Label htmlFor="firstPage_textbook">First True Page Number</Label><p className="text-sm text-gray-600 mb-2">What page number in the PDF corresponds to "Page 1" in the book's table of contents?</p><Input id="firstPage_textbook" name="firstPageNumber_textbook_display_only" type="number" placeholder="e.g., 15" value={courseData.firstPageNumber || ""} onChange={(e) => handleDataChange("firstPageNumber", e.target.value)} /></div>
                    </TabsContent>
                    <TabsContent value="lectures" className="space-y-6">
                      <div><Label htmlFor="lectures_only">Lecture Videos</Label><p className="text-sm text-gray-600 mb-2">Provide YouTube playlist URL for course lectures</p><Input id="lectures_only" name="lectures_lectures_display_only" placeholder="https://youtube.com/playlist?list=..." value={courseData.lectures || ""} onChange={(e) => handleDataChange("lectures", e.target.value)} /></div>
                    </TabsContent>
                  </Tabs>
                ) : ( <div className="text-center py-8"><Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" /><h3 className="text-lg font-semibold text-gray-900 mb-2">Manual Course Creation</h3><p className="text-gray-600 mb-4">You'll be able to add chapters, upload materials, and create assessments after the course is created.</p></div>)}
                {courseData.automationMethod === "ai" && (<div className="bg-blue-50 rounded-lg p-4"><h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3><p className="text-sm text-blue-800">Our AI will analyze your materials and automatically generate comprehensive course content including notes, presentations, quizzes, and study materials. This process typically takes 15-30 minutes depending on the size of your materials.</p></div>)}
                <div className="flex justify-between"><Button type="button" variant="outline" onClick={handleBack}><ArrowLeft className="h-4 w-4 mr-2" />Previous</Button><Button type="button" onClick={handleNext} disabled={!canProceedStep3}>Review & Generate <ArrowRight className="h-4 w-4 ml-2" /></Button></div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Review & Generate */}
          {currentStep === 4 && (
            <Card>
              <CardHeader><CardTitle>Review & Generate Course</CardTitle><CardDescription>Review your course settings before starting the generation process</CardDescription></CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4"><h3 className="font-semibold">Course Details</h3><div className="space-y-2 text-sm"><div className="flex justify-between"><span className="text-gray-600">Title:</span><span>{courseData.title}</span></div><div className="flex justify-between"><span className="text-gray-600">Language:</span><span className="capitalize">{courseData.language}</span></div><div className="flex justify-between"><span className="text-gray-600">Privacy:</span><span className="capitalize">{courseData.privacy}</span></div><div className="flex justify-between"><span className="text-gray-600">Method:</span><span>{courseData.automationMethod === "ai" ? "AI Automation" : "Manual Creation"}</span></div></div></div>
                  <div className="space-y-4"><h3 className="font-semibold">Resources Provided</h3><div className="space-y-2 text-sm">{courseData.textbook && (<div className="flex items-center space-x-2"><FileText className="h-4 w-4 text-blue-600" /><span>Textbook: {courseData.textbook.name}</span></div>)}{courseData.lectures && (<div className="flex items-center space-x-2"><Video className="h-4 w-4 text-green-600" /><span>Lecture playlist provided</span></div>)}{courseData.automationMethod === "manual" && !courseData.textbook && !courseData.lectures && (<div className="flex items-center space-x-2"><Settings className="h-4 w-4 text-gray-600" /><span>Manual creation selected</span></div>)}</div></div>
                </div>
                {courseData.automationMethod === "ai" && (<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"><h3 className="font-semibold text-yellow-800 mb-2">Important Notes</h3><ul className="text-sm text-yellow-700 space-y-1"><li>• The generation process will take 15-30 minutes</li><li>• Please keep this tab open during generation</li><li>• You'll be notified when your course is ready</li><li>• You can edit and customize content after generation</li></ul></div>)}
                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={handleBack}><ArrowLeft className="h-4 w-4 mr-2" />Previous</Button>
                  <SubmitButton disabled={false} automationMethod={courseData.automationMethod} />
                </div>
              </CardContent>
            </Card>
          )}
          {/* Display Server Action Messages/Errors */}
          {state?.message && !state.success && (
            <div className="mt-4 p-4 border rounded-md bg-destructive/10 text-destructive">
                <p className="font-semibold mb-1">{state.message}</p>
                {state.errors && <ul className="list-disc list-inside text-sm">
                {Object.entries(state.errors).map(([key, valArr]) => typeof valArr === 'string' ? <li key={key}>{valArr}</li> : (valArr as string[]).map((msg: string, i: number) => <li key={`${key}-${i}`}>{msg}</li>))}
                </ul>}
            </div>
           )}
        </div>
      </div>
    </form>
  )
}
