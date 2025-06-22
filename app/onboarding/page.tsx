"use client"

import type React from "react"

import { useState } from "react"
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
import {
  BookOpen,
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
} from "lucide-react"
import Link from "next/link"
import { completeOnboarding, type OnboardingData } from "@/lib/api"
import { languageLabels, levelOfStudyOptions } from "@/lib/mock-data"
import { ImageCropperModal } from "@/components/ImageCropperModal"
import { ProfilePreviewCard } from "@/components/ProfilePreviewCard"

const TOTAL_STEPS = 11

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<OnboardingData>>({
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

  const [profileImageFile, setProfileImageFile] = useState<string>("")
  const [bannerImageFile, setBannerImageFile] = useState<string>("")
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

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const updateNestedFormData = (parent: string, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof OnboardingData],
        [field]: value,
      },
    }))
  }

  const addTag = (field: "studiedSubjects" | "interestedMajors" | "hobbies", value: string) => {
    if (value.trim() && !formData[field]?.includes(value.trim())) {
      updateFormData(field, [...(formData[field] || []), value.trim()])
    }
  }

  const removeTag = (field: "studiedSubjects" | "interestedMajors" | "hobbies", value: string) => {
    updateFormData(field, formData[field]?.filter((item) => item !== value) || [])
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.displayName?.trim()
      case 2:
        return formData.role
      case 3:
        return (
          formData.languagePreferences?.interface &&
          formData.languagePreferences?.explanation &&
          formData.languagePreferences?.courseMaterial
        )
      case 4:
        return formData.major?.trim()
      case 5:
        return formData.levelOfStudy
      case 6:
        return (formData.studiedSubjects?.length || 0) > 0
      case 7:
        return (formData.interestedMajors?.length || 0) > 0
      case 8:
        return (formData.hobbies?.length || 0) > 0
      case 9:
        return true // Social profiles are optional
      case 10:
        return formData.bio?.trim()
      case 11:
        return formData.agreements?.termsAndPrivacy
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

  const handleComplete = async () => {
    if (!canProceed()) return

    setIsLoading(true)
    try {
      await completeOnboarding(formData as OnboardingData)
      window.location.href = "/dashboard"
    } catch (error) {
      console.error("Failed to complete onboarding:", error)
    } finally {
      setIsLoading(false)
    }
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
        />
        <div className="flex flex-wrap gap-2">
          {formData[field]?.map((tag, index) => (
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
    }
  }

  const handleCropComplete = (croppedImageData: string) => {
    if (cropperModal.type === "profile") {
      setCroppedProfileImage(croppedImageData)
    } else {
      setCroppedBannerImage(croppedImageData)
    }
    setCropperModal((prev) => ({ ...prev, isOpen: false }))
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
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
                placeholder="Enter your display name"
                value={formData.displayName || ""}
                onChange={(e) => updateFormData("displayName", e.target.value)}
              />
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <GraduationCap className="h-12 w-12 text-blue-600 mx-auto" />
              <h2 className="text-2xl font-bold">What's your role?</h2>
              <p className="text-muted-foreground">This helps us customize your experience.</p>
            </div>
            <RadioGroup
              value={formData.role}
              onValueChange={(value) => updateFormData("role", value)}
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
          </div>
        )

      case 3:
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
                  value={formData.languagePreferences?.interface}
                  onValueChange={(value) => updateNestedFormData("languagePreferences", "interface", value)}
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
                  value={formData.languagePreferences?.explanation}
                  onValueChange={(value) => updateNestedFormData("languagePreferences", "explanation", value)}
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
                  value={formData.languagePreferences?.courseMaterial}
                  onValueChange={(value) => updateNestedFormData("languagePreferences", "courseMaterial", value)}
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
          </div>
        )

      case 4:
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
                placeholder="e.g., Computer Science, Physics, Literature"
                value={formData.major || ""}
                onChange={(e) => updateFormData("major", e.target.value)}
              />
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <Target className="h-12 w-12 text-blue-600 mx-auto" />
              <h2 className="text-2xl font-bold">Level of Study</h2>
              <p className="text-muted-foreground">What's your current academic level?</p>
            </div>
            <div className="space-y-2">
              <Label>Level of Study</Label>
              <Select value={formData.levelOfStudy} onValueChange={(value) => updateFormData("levelOfStudy", value)}>
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
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <BookOpen className="h-12 w-12 text-blue-600 mx-auto" />
              <h2 className="text-2xl font-bold">Studied Subjects</h2>
              <p className="text-muted-foreground">What subjects have you studied? Press Enter to add each one.</p>
            </div>
            <TagInput field="studiedSubjects" placeholder="Type a subject and press Enter" />
          </div>
        )

      case 7:
        return (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <Target className="h-12 w-12 text-blue-600 mx-auto" />
              <h2 className="text-2xl font-bold">Interested Majors</h2>
              <p className="text-muted-foreground">What other fields interest you? Press Enter to add each one.</p>
            </div>
            <TagInput field="interestedMajors" placeholder="Type a field and press Enter" />
          </div>
        )

      case 8:
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
          </div>
        )

      case 9:
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
                    placeholder="@username"
                    className="pl-10"
                    value={formData.socialProfiles?.twitter || ""}
                    onChange={(e) => updateNestedFormData("socialProfiles", "twitter", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="github">GitHub</Label>
                <div className="relative">
                  <Github className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="github"
                    placeholder="username"
                    className="pl-10"
                    value={formData.socialProfiles?.github || ""}
                    onChange={(e) => updateNestedFormData("socialProfiles", "github", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="linkedin"
                    placeholder="profile-name"
                    className="pl-10"
                    value={formData.socialProfiles?.linkedin || ""}
                    onChange={(e) => updateNestedFormData("socialProfiles", "linkedin", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case 10:
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
                    placeholder="Tell us about yourself, your interests, and what you hope to achieve..."
                    value={formData.bio || ""}
                    onChange={(e) => updateFormData("bio", e.target.value)}
                    className="min-h-[100px]"
                  />
                  <div className="text-right text-sm text-muted-foreground">{(formData.bio || "").length}/500</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Profile Picture</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      {croppedProfileImage ? (
                        <div className="space-y-2">
                          <img
                            src={croppedProfileImage || "/placeholder.svg"}
                            alt="Profile preview"
                            className="w-16 h-16 rounded-full mx-auto object-cover"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById("profile-upload")?.click()}
                          >
                            Change Photo
                          </Button>
                        </div>
                      ) : (
                        <>
                          <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">Upload profile picture</p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById("profile-upload")?.click()}
                          >
                            Choose File
                          </Button>
                        </>
                      )}
                      <input
                        id="profile-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, "profile")}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Profile Banner</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      {croppedBannerImage ? (
                        <div className="space-y-2">
                          <img
                            src={croppedBannerImage || "/placeholder.svg"}
                            alt="Banner preview"
                            className="w-full h-8 rounded mx-auto object-cover"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById("banner-upload")?.click()}
                          >
                            Change Banner
                          </Button>
                        </div>
                      ) : (
                        <>
                          <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">Upload banner image</p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById("banner-upload")?.click()}
                          >
                            Choose File
                          </Button>
                        </>
                      )}
                      <input
                        id="banner-upload"
                        type="file"
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
                  displayName={formData.displayName || ""}
                  bio={formData.bio || ""}
                  profileImage={croppedProfileImage}
                  bannerImage={croppedBannerImage}
                  hobbies={formData.hobbies}
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

      case 11:
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
                  checked={formData.agreements?.termsAndPrivacy}
                  onCheckedChange={(checked) => updateNestedFormData("agreements", "termsAndPrivacy", checked)}
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
                  checked={formData.agreements?.personalizedContent}
                  onCheckedChange={(checked) => updateNestedFormData("agreements", "personalizedContent", checked)}
                />
                <Label htmlFor="personalized" className="text-sm">
                  I consent to personalized content and recommendations based on my learning activity.
                </Label>
              </div>
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="newsletter"
                  checked={formData.agreements?.newsletter}
                  onCheckedChange={(checked) => updateNestedFormData("agreements", "newsletter", checked)}
                />
                <Label htmlFor="newsletter" className="text-sm">
                  Subscribe to the Lyceum newsletter for updates and learning tips. (Optional)
                </Label>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="h-8 w-8 text-blue-600 mr-2" />
            <h1 className="text-2xl font-bold">Lyceum</h1>
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
          <Button variant="outline" onClick={handleBack} disabled={currentStep === 1} className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          {currentStep === TOTAL_STEPS ? (
            <Button onClick={handleComplete} disabled={!canProceed() || isLoading} className="flex items-center">
              {isLoading ? "Setting up..." : "Complete Setup & Enter Lyceum"}
              <CheckCircle className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleNext} disabled={!canProceed()} className="flex items-center">
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
