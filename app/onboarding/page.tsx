"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useFormState, useFormStatus } from "react-dom"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { Logo } from "@/components/ui/logo"
import {
  ArrowLeft,
  ArrowRight,
  User,
  GraduationCap,
  Globe,
  BookMarked,
  Target,
  Heart,
  Share2,
  Camera,
  CheckCircle,
  X,
  Twitter,
  Github,
  Linkedin,
  Loader2,
  BookOpen,
} from "lucide-react"
import Link from "next/link"
import { languageLabels, levelOfStudyOptions } from "@/lib/mock-data"
import { ImageCropperModal } from "@/components/ImageCropperModal"
import { ProfilePreviewCard } from "@/components/ProfilePreviewCard"
import { onboardingAction } from "@/app/actions/onboarding";

const TOTAL_STEPS = 11

// Helper function to convert base64 data URI to File object
function dataURItoFile(dataURI: string, filename: string): File {
  const arr = dataURI.split(",")
  if (arr.length < 2) {
    throw new Error("Invalid data URI")
  }
  const mimeMatch = arr[0].match(/:(.*?);/)
  if (!mimeMatch || mimeMatch.length < 2) {
    throw new Error("Could not parse MIME type from data URI")
  }
  const mime = mimeMatch[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, { type: mime })
}

interface ClientOnboardingData {
  displayName: string
  role: "standard" | "educator"
  languagePreferences: {
    interface: string
    explanation: string
    courseMaterial: string
  }
  major: string
  levelOfStudy: string
  studiedSubjects: string[]
  interestedMajors: string[]
  hobbies: string[]
  socialProfiles: {
    twitter?: string
    github?: string
    linkedin?: string
  }
  bio: string
  agreements: {
    termsAndPrivacy: boolean
    personalizedContent: boolean
    newsletter: boolean
  }
  userId?: string
}

const initialState = {
  message: "",
  errors: null,
  redirectUrl: null,
}

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={disabled || pending} className="flex items-center">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Setting up...
        </>
      ) : (
        <>
          Complete Setup & Enter Lyceum <CheckCircle className="h-4 w-4 ml-2" />
        </>
      )}
    </Button>
  )
}

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const router = useRouter()

  const [state, formAction] = useFormState(onboardingAction, initialState as any) // Cast initialState if types mismatch slightly

  const [clientFormData, setClientFormData] = useState<Partial<ClientOnboardingData>>({
    displayName: "",
    role: "standard",
    languagePreferences: {
      interface: "english",
      explanation: "english",
      courseMaterial: "english",
    },
    major: "",
    levelOfStudy: "",
    studiedSubjects: [],
    interestedMajors: [],
    hobbies: [],
    socialProfiles: {},
    bio: "",
    agreements: {
      termsAndPrivacy: false,
      personalizedContent: false,
      newsletter: false,
    },
  })

  const [croppedProfileImage, setCroppedProfileImage] = useState<string>("")
  const [croppedBannerImage, setCroppedBannerImage] = useState<string>("")

  const [cropperModal, setCropperModal] = useState<{
    isOpen: boolean
    imageSrc: string
    aspectRatio: number
    type: "profile" | "banner"
  }>({
    isOpen: false,
    imageSrc: "",
    aspectRatio: 1,
    type: "profile",
  })

  useEffect(() => {
    if (state?.redirectUrl) {
      router.push(state.redirectUrl)
    }
    if (state?.message && !state.errors) {
      toast({ title: "Success", description: state.message })
    }
    if (state?.errors) {
      const errorMessages = Object.values(state.errors).flat().join(", ")
      toast({
        title: "Onboarding Error",
        description: errorMessages || state.message || "An unknown error occurred.",
        variant: "destructive",
      })
    }
  }, [state, router])

  // Store File objects directly
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [bannerFile, setBannerFile] = useState<File | null>(null)

  const updateClientFormData = (field: keyof ClientOnboardingData, value: any) => {
    setClientFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const updateNestedClientFormData = (parent: keyof ClientOnboardingData, field: string, value: any) => {
    setClientFormData((prev) => ({
      ...prev,
      [parent]: {
        ...(prev[parent] as object),
        [field]: value,
      },
    }))
  }

  const addTag = (field: "studiedSubjects" | "interestedMajors" | "hobbies", value: string) => {
    if (value.trim() && !(clientFormData[field] as string[])?.includes(value.trim())) {
      updateClientFormData(field, [...((clientFormData[field] as string[]) || []), value.trim()])
    }
  }

  const removeTag = (field: "studiedSubjects" | "interestedMajors" | "hobbies", value: string) => {
    updateClientFormData(field, (clientFormData[field] as string[])?.filter((item) => item !== value) || [])
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return !!clientFormData.displayName?.trim()
      case 2:
        return !!clientFormData.role
      case 3:
        return !!(
          clientFormData.languagePreferences?.interface &&
          clientFormData.languagePreferences?.explanation &&
          clientFormData.languagePreferences?.courseMaterial
        )
      case 4:
        return !!clientFormData.major?.trim()
      case 5:
        return !!clientFormData.levelOfStudy
      case 6:
        return (clientFormData.studiedSubjects?.length || 0) > 0
      case 7:
        return (clientFormData.interestedMajors?.length || 0) > 0
      case 8:
        return (clientFormData.hobbies?.length || 0) > 0
      case 9:
        return true // Social profiles are optional
      case 10:
        return !!clientFormData.bio?.trim() // Profile Customization (Bio, Images)
      case 11:
        return !!clientFormData.agreements?.termsAndPrivacy
      default:
        return false
    }
  }

  const handleNext = () => {
    if (canProceed() && currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  // This internalSubmit will be called by the form's onSubmit
  const internalSubmit = (payload: FormData) => {
    // Append JSON stringified data
    if (clientFormData.languagePreferences)
      payload.append("languagePreferences", JSON.stringify(clientFormData.languagePreferences))
    if (clientFormData.major) payload.append("major", clientFormData.major) // This is already string
    if (clientFormData.levelOfStudy) payload.append("levelOfStudy", clientFormData.levelOfStudy) // This is already string

    // Consolidate interests from studiedSubjects, interestedMajors, hobbies
    const interests = Array.from(new Set([
        ...(clientFormData.studiedSubjects || []),
        ...(clientFormData.interestedMajors || []),
        ...(clientFormData.hobbies || [])
    ]));
    payload.append("interests", JSON.stringify(interests));

    // The server action expects academicProfile and socialLinks as JSON strings
    // For now, let's assume they are structured correctly in clientFormData or pass empty objects
    // These were not explicitly part of the multi-step UI in the provided code,
    // but the server action expects them. We'll pass them as currently constructed.
    // If these were meant to be separate steps, the UI would need adjustment.
    const academicProfileForPayload = { // Construct based on what server expects
        major: clientFormData.major,
        levelOfStudy: clientFormData.levelOfStudy,
        studiedSubjects: clientFormData.studiedSubjects,
    };
    payload.append("academicProfile", JSON.stringify(academicProfileForPayload));
    payload.append("socialLinks", JSON.stringify(clientFormData.socialProfiles || {}));


    // Append files if they exist
    if (avatarFile) {
      payload.append("avatarFile", avatarFile)
    }
    if (bannerFile) {
      payload.append("bannerFile", bannerFile)
    }

    // agreements is also not directly in the server action's Zod schema,
    // but it's good practice to send it if it's collected.
    // The server action can choose to ignore it or use it.
    if (clientFormData.agreements) {
        payload.append("agreements", JSON.stringify(clientFormData.agreements));
    }


    formAction(payload)
  }

  const TagInput = ({
    field,
    placeholder,
  }: {
    field: "studiedSubjects" | "interestedMajors" | "hobbies"
    placeholder: string
  }) => {
    const [inputValue, setInputValue] = useState("")

    const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault()
        addTag(field, inputValue)
        setInputValue("")
      }
    }

    return (
      <div className="space-y-3">
        <Input
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          // Removed name attribute as this input is for tag creation, not direct submission
        />
        <div className="flex flex-wrap gap-2">
          {(clientFormData[field] as string[])?.map((tag, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              {tag}
              <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(field, tag)} />
            </Badge>
          ))}
        </div>
      </div>
    )
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, type: "profile" | "banner") => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageSrc = e.target?.result as string
        setCropperModal({
          isOpen: true,
          imageSrc,
          aspectRatio: type === "profile" ? 1 : 3,
          type,
        })
      }
      reader.readAsDataURL(file)
      // Clear the input value to allow re-uploading the same file if needed
      event.target.value = ""
    }
  }

  const handleCropComplete = (croppedImageData: string) => {
    const fileType = cropperModal.type === "profile" ? "profile.png" : "banner.png"
    try {
      const imageFile = dataURItoFile(croppedImageData, fileType)
      if (cropperModal.type === "profile") {
        setCroppedProfileImage(croppedImageData) // Keep for preview
        setAvatarFile(imageFile) // Store File object for submission
      } else {
        setCroppedBannerImage(croppedImageData) // Keep for preview
        setBannerFile(imageFile) // Store File object for submission
      }
    } catch (e) {
      console.error("Error converting cropped image to file:", e)
      toast({
        title: "Image Processing Error",
        description: "Could not process the cropped image. Please try again.",
        variant: "destructive",
      })
    }
    setCropperModal((prev) => ({ ...prev, isOpen: false }))
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1: // Display Name
        return (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <User className="h-12 w-12 text-blue-600 mx-auto" />
              <h2 className="text-2xl font-bold">Welcome to Lyceum!</h2>
              <p className="text-muted-foreground">Let's get you set up with a personalized learning experience.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="displayName">What should we call you?</Label>
              <Input
                id="displayName"
                name="displayName" // This will be submitted directly
                placeholder="Enter your display name"
                value={clientFormData.displayName || ""}
                onChange={(e) => updateClientFormData("displayName", e.target.value)}
                required
              />
            </div>
          </div>
        )

      case 2: // Role
        return (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <GraduationCap className="h-12 w-12 text-blue-600 mx-auto" />
              <h2 className="text-2xl font-bold">What's your role?</h2>
              <p className="text-muted-foreground">This helps us customize your experience.</p>
            </div>
            {/* RadioGroup value is for client state, actual value for submission needs hidden input or direct name */}
            <RadioGroup
              value={clientFormData.role}
              onValueChange={(value) => updateClientFormData("role", value as "standard" | "educator")}
              className="grid grid-cols-1 gap-4"
            >
              <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-accent">
                <RadioGroupItem value="standard" id="student" />
                <Label htmlFor="student" className="flex-1 cursor-pointer">
                  <div className="font-semibold">I am a Student</div>
                  <div className="text-sm text-muted-foreground">Learning new subjects and skills</div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-accent">
                <RadioGroupItem value="educator" id="educator" />
                <Label htmlFor="educator" className="flex-1 cursor-pointer">
                  <div className="font-semibold">I am an Educator</div>
                  <div className="text-sm text-muted-foreground">Teaching and creating courses</div>
                </Label>
              </div>
            </RadioGroup>
            {/* Hidden input for role if RadioGroupItem doesn't support name directly for form submission */}
             <input type="hidden" name="role" value={clientFormData.role || "standard"} />
          </div>
        )

      case 3: // Language Preferences
        return (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <Globe className="h-12 w-12 text-blue-600 mx-auto" />
              <h2 className="text-2xl font-bold">Language Preferences</h2>
              <p className="text-muted-foreground">Choose your preferred languages for different aspects.</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Interface Language</Label>
                <Select
                  value={clientFormData.languagePreferences?.interface}
                  onValueChange={(value) => updateNestedClientFormData("languagePreferences", "interface", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select interface language" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(languageLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Explanation Language</Label>
                <Select
                  value={clientFormData.languagePreferences?.explanation}
                  onValueChange={(value) => updateNestedClientFormData("languagePreferences", "explanation", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select explanation language" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(languageLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Course Material Language</Label>
                <Select
                  value={clientFormData.languagePreferences?.courseMaterial}
                  onValueChange={(value) => updateNestedClientFormData("languagePreferences", "courseMaterial", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select course material language" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(languageLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {/* Hidden input for languagePreferences JSON string will be added by internalSubmit */}
          </div>
        )

      case 4: // Field of Study (Major)
        return (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <BookMarked className="h-12 w-12 text-blue-600 mx-auto" />
              <h2 className="text-2xl font-bold">Field of Study</h2>
              <p className="text-muted-foreground">What's your major or primary field of interest?</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="major">Major/Field of Study</Label>
              <Input
                id="major"
                name="major" // This will be submitted directly
                placeholder="e.g., Computer Science, Physics, Literature"
                value={clientFormData.major || ""}
                onChange={(e) => updateClientFormData("major", e.target.value)}
                required
              />
            </div>
          </div>
        )

      case 5: // Level of Study
        return (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <Target className="h-12 w-12 text-blue-600 mx-auto" />
              <h2 className="text-2xl font-bold">Level of Study</h2>
              <p className="text-muted-foreground">What's your current academic level?</p>
            </div>
            <div className="space-y-2">
              <Label>Level of Study</Label>
              <Select
                value={clientFormData.levelOfStudy}
                onValueChange={(value) => updateClientFormData("levelOfStudy", value)}
                // name="levelOfStudy" // Select itself doesn't directly submit, value managed by state
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your level" />
                </SelectTrigger>
                <SelectContent>
                  {levelOfStudyOptions.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
               {/* Hidden input for levelOfStudy string will be added by internalSubmit or can be added here too */}
               {/* <input type="hidden" name="levelOfStudy" value={clientFormData.levelOfStudy || ""} /> */}
            </div>
          </div>
        )

      case 6: // Studied Subjects (part of interests)
        return (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <BookOpen className="h-12 w-12 text-blue-600 mx-auto" />
              <h2 className="text-2xl font-bold">Studied Subjects</h2>
              <p className="text-muted-foreground">What subjects have you studied? Press Enter to add each one.</p>
            </div>
            <TagInput field="studiedSubjects" placeholder="Type a subject and press Enter" />
            {/* Hidden input for interests JSON string will be added by internalSubmit */}
          </div>
        )

      case 7: // Interested Majors (part of interests)
        return (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <Target className="h-12 w-12 text-blue-600 mx-auto" />
              <h2 className="text-2xl font-bold">Interested Majors</h2>
              <p className="text-muted-foreground">What other fields interest you? Press Enter to add each one.</p>
            </div>
            <TagInput field="interestedMajors" placeholder="Type a field and press Enter" />
             {/* Hidden input for interests JSON string will be added by internalSubmit */}
          </div>
        )

      case 8: // Hobbies (part of interests)
        return (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <Heart className="h-12 w-12 text-blue-600 mx-auto" />
              <h2 className="text-2xl font-bold">Hobbies & Interests</h2>
              <p className="text-muted-foreground">
                What do you enjoy doing in your free time? Press Enter to add each one.
              </p>
            </div>
            <TagInput field="hobbies" placeholder="Type a hobby and press Enter" />
             {/* Hidden input for interests JSON string will be added by internalSubmit */}
          </div>
        )

      case 9: // Social Profiles
        return (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <Share2 className="h-12 w-12 text-blue-600 mx-auto" />
              <h2 className="text-2xl font-bold">Social Profiles</h2>
              <p className="text-muted-foreground">Connect your social profiles (optional).</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter</Label>
                <div className="relative">
                  <Twitter className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="twitter"
                    // name="socialProfiles.twitter" // Will be handled by JSON stringification
                    placeholder="@username"
                    className="pl-10"
                    value={clientFormData.socialProfiles?.twitter || ""}
                    onChange={(e) => updateNestedClientFormData("socialProfiles", "twitter", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="github">GitHub</Label>
                <div className="relative">
                  <Github className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="github"
                    // name="socialProfiles.github"
                    placeholder="username"
                    className="pl-10"
                    value={clientFormData.socialProfiles?.github || ""}
                    onChange={(e) => updateNestedClientFormData("socialProfiles", "github", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="linkedin"
                    // name="socialProfiles.linkedin"
                    placeholder="profile-name"
                    className="pl-10"
                    value={clientFormData.socialProfiles?.linkedin || ""}
                    onChange={(e) => updateNestedClientFormData("socialProfiles", "linkedin", e.target.value)}
                  />
                </div>
              </div>
            </div>
            {/* Hidden input for socialLinks JSON string will be added by internalSubmit */}
          </div>
        )

      case 10: // Profile Customization (Bio, Images)
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Camera className="h-12 w-12 text-blue-600 mx-auto" />
              <h2 className="text-2xl font-bold">Profile Customization</h2>
              <p className="text-muted-foreground">Tell us about yourself and customize your profile.</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio" // This will be submitted directly
                    placeholder="Tell us about yourself, your interests, and what you hope to achieve..."
                    value={clientFormData.bio || ""}
                    onChange={(e) => updateClientFormData("bio", e.target.value)}
                    className="min-h-[100px]"
                    maxLength={500}
                  />
                  <div className="text-right text-sm text-muted-foreground">{(clientFormData.bio || "").length}/500</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="avatarFile">Profile Picture</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      {croppedProfileImage ? (
                        <div className="space-y-2">
                          <img
                            src={croppedProfileImage}
                            alt="Profile preview"
                            className="w-16 h-16 rounded-full mx-auto object-cover"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById("avatarFile-input")?.click()}
                          >
                            Change Photo
                          </Button>
                        </div>
                      ) : (
                        <>
                          <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">Upload profile picture</p>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById("avatarFile-input")?.click()}
                          >
                            Choose File
                          </Button>
                        </>
                      )}
                      <input
                        id="avatarFile-input"
                        type="file"
                        name="avatarFile" // Name attribute for form submission
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, "profile")}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bannerFile">Profile Banner</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      {croppedBannerImage ? (
                        <div className="space-y-2">
                          <img
                            src={croppedBannerImage}
                            alt="Banner preview"
                            className="w-full h-8 rounded mx-auto object-cover"
                          />
                           <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById("bannerFile-input")?.click()}
                          >
                            Change Banner
                          </Button>
                        </div>
                      ) : (
                        <>
                          <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">Upload banner image</p>
                           <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById("bannerFile-input")?.click()}
                          >
                            Choose File
                          </Button>
                        </>
                      )}
                      <input
                        id="bannerFile-input"
                        type="file"
                        name="bannerFile" // Name attribute for form submission
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, "banner")}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Live Preview</Label>
                <ProfilePreviewCard
                  displayName={clientFormData.displayName || ""}
                  bio={clientFormData.bio || ""}
                  profileImage={croppedProfileImage}
                  bannerImage={croppedBannerImage}
                  hobbies={clientFormData.hobbies as string[] | undefined}
                />
              </div>
            </div>

            <ImageCropperModal
              isOpen={cropperModal.isOpen}
              onClose={() => setCropperModal((prev) => ({ ...prev, isOpen: false }))}
              imageSrc={cropperModal.imageSrc}
              aspectRatio={cropperModal.aspectRatio}
              onCropComplete={handleCropComplete}
              title={cropperModal.type === "profile" ? "Crop Profile Picture" : "Crop Banner Image"}
            />
          </div>
        )

      case 11: // Agreements
        return (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <CheckCircle className="h-12 w-12 text-blue-600 mx-auto" />
              <h2 className="text-2xl font-bold">Almost Done!</h2>
              <p className="text-muted-foreground">Please review and accept our terms to complete your setup.</p>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  // name="agreements.termsAndPrivacy" // Handled by JSON stringification
                  checked={clientFormData.agreements?.termsAndPrivacy}
                  onCheckedChange={(checked) => updateNestedClientFormData("agreements", "termsAndPrivacy", !!checked)}
                  required
                />
                <Label htmlFor="terms" className="text-sm leading-relaxed">
                  I agree to the{" "}
                  <Link href="/terms" className="text-blue-600 hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </Link>
                  . (Required)
                </Label>
              </div>
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="personalized"
                  // name="agreements.personalizedContent"
                  checked={clientFormData.agreements?.personalizedContent}
                  onCheckedChange={(checked) => updateNestedClientFormData("agreements", "personalizedContent", !!checked)}
                />
                <Label htmlFor="personalized" className="text-sm">
                  I consent to personalized content and recommendations based on my learning activity.
                </Label>
              </div>
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="newsletter"
                  // name="agreements.newsletter"
                  checked={clientFormData.agreements?.newsletter}
                  onCheckedChange={(checked) => updateNestedClientFormData("agreements", "newsletter", !!checked)}
                />
                <Label htmlFor="newsletter" className="text-sm">
                  Subscribe to the Lyceum newsletter for updates and learning tips. (Optional)
                </Label>
              </div>
            </div>
            {/* Hidden input for agreements JSON string will be added by internalSubmit */}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      {/* The form now uses action attribute and internalSubmit to prepare FormData */}
      <form action={internalSubmit} className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Logo size="lg" />
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Step {currentStep} of {TOTAL_STEPS}
            </p>
            <Progress value={(currentStep / TOTAL_STEPS) * 100} className="w-full" />
          </div>
        </div>

        <Card>
          <CardContent className="p-8">{renderStep()}</CardContent>
        </Card>

        <div className="flex justify-between mt-6">
          <Button
            type="button" // Important: This should not submit the form
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          {currentStep === TOTAL_STEPS ? (
            // SubmitButton is now inside the form and will trigger the form's action
            <SubmitButton disabled={!canProceed() || !clientFormData.agreements?.termsAndPrivacy} />
          ) : (
            <Button
              type="button" // Important: This should not submit the form
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex items-center"
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>

        {/* Display global form messages from server action state */}
        {state?.message && !state.redirectUrl && (
          <p className={`mt-4 text-sm ${state.errors ? "text-red-500" : "text-green-500"}`}>{state.message}</p>
        )}
        {/* Display specific field errors (optional, based on server action response structure) */}
        {state?.errors && Object.entries(state.errors).map(([field, messages]) => (
            messages && messages.map((error: string, index: number) => (
                <p key={`${field}-${index}`} className="mt-1 text-sm text-red-500">{field}: {error}</p>
            ))
        ))}
      </form>
    </div>
  )
}
