import {
  mockUser,
  mockEnrolledCourses,
  mockCreatedCourses,
  mockActivities,
  mockActiveChallenges,
  mockAllCourses,
  mockGenerationSteps,
  mockChapterData,
  mockStudyPartners,
  mockPartnerRequests,
  mockAllChallenges,
  type User,
  type Course,
  type Activity,
  type Challenge,
  type GenerationStep,
  type Chapter,
  type StudyPartner,
  type PartnerRequest,
} from "./mock-data"

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export interface DashboardData {
  user: User
  enrolledCourses: Course[]
  createdCourses: Course[]
  activities: Activity[]
  challenges: Challenge[]
}

export interface CourseCreationData {
  title: string
  language: string
  privacy: "public" | "private"
  access?: "password" | "invite"
  pricing?: "free" | "paid"
  automationMethod: "ai" | "manual"
  textbook?: File
  lectures?: string
  firstPageNumber?: string
}

export interface OnboardingData {
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
  profilePicture?: File
  profileBanner?: File
  agreements: {
    termsAndPrivacy: boolean
    personalizedContent: boolean
    newsletter: boolean
  }
}

export async function getDashboardData(): Promise<DashboardData> {
  await delay(800)
  return {
    user: mockUser,
    enrolledCourses: mockEnrolledCourses,
    createdCourses: mockCreatedCourses,
    activities: mockActivities,
    challenges: mockActiveChallenges,
  }
}

export async function getAllCourses(): Promise<Course[]> {
  await delay(600)
  return mockAllCourses
}

export async function getCourse(courseId: string): Promise<Course | null> {
  await delay(400)
  const course = mockAllCourses.find((c) => c.id === courseId)
  return course || null
}

export async function getChapter(courseId: string, chapterId: string): Promise<Chapter | null> {
  await delay(300)
  return mockChapterData
}

export async function createCourse(data: CourseCreationData): Promise<{ courseId: string }> {
  await delay(1000)
  console.log("Creating course with data:", data)
  const courseId = `course_${Date.now()}`
  return { courseId }
}

export async function getGenerationProgress(courseId: string): Promise<{
  progress: number
  currentStep: string
  steps: GenerationStep[]
  estimatedTimeRemaining: string
}> {
  await delay(500)

  const completedSteps = mockGenerationSteps.filter((s) => s.status === "completed").length
  const inProgressSteps = mockGenerationSteps.filter((s) => s.status === "in-progress").length
  const totalSteps = mockGenerationSteps.length

  const progress = Math.round(((completedSteps + inProgressSteps * 0.5) / totalSteps) * 100)
  const currentStep = mockGenerationSteps.find((s) => s.status === "in-progress")?.title || "Initializing..."

  return {
    progress,
    currentStep,
    steps: mockGenerationSteps,
    estimatedTimeRemaining: "12 minutes",
  }
}

export async function getStudyPartners(): Promise<{
  partners: StudyPartner[]
  requests: PartnerRequest[]
}> {
  await delay(400)
  return {
    partners: mockStudyPartners,
    requests: mockPartnerRequests,
  }
}

export async function searchUsers(query: string): Promise<User[]> {
  await delay(300)
  return [
    {
      id: "2",
      name: "Sarah Chen",
      email: "sarah@example.com",
      role: "educator",
      tier: "contributor",
      credits: 3200,
      avatar: "SC",
    },
    {
      id: "3",
      name: "Mike Johnson",
      email: "mike@example.com",
      role: "standard",
      tier: "standard",
      credits: 1800,
      avatar: "MJ",
    },
  ].filter((user) => user.name.toLowerCase().includes(query.toLowerCase()))
}

export async function getChallenges(): Promise<{
  active: Challenge[]
  past: Challenge[]
}> {
  await delay(400)
  return {
    active: mockActiveChallenges,
    past: mockAllChallenges.filter((c) => c.status === "completed"),
  }
}

export async function sendPartnerRequest(userId: string, message: string): Promise<void> {
  await delay(500)
  console.log(`Sending partner request to user ${userId} with message: ${message}`)
}

export async function acceptPartnerRequest(requestId: string): Promise<void> {
  await delay(300)
  console.log(`Accepting partner request ${requestId}`)
}

export async function declinePartnerRequest(requestId: string): Promise<void> {
  await delay(300)
  console.log(`Declining partner request ${requestId}`)
}

export async function createChallenge(opponentId: string, challengeType: string): Promise<void> {
  await delay(500)
  console.log(`Creating ${challengeType} challenge with opponent ${opponentId}`)
}

// Authentication API functions
export async function sendPasswordResetEmail(email: string): Promise<void> {
  await delay(1000)
  console.log(`Sending password reset email to: ${email}`)
  // Simulate API call
}

export async function resetPassword(token: string, newPassword: string): Promise<void> {
  await delay(800)
  console.log(`Resetting password with token: ${token}`)
  // Simulate API call
}

export async function signUp(email: string, password: string, name: string): Promise<{ userId: string }> {
  await delay(1200)
  console.log(`Creating account for: ${email}`)
  return { userId: `user_${Date.now()}` }
}

export async function signIn(email: string, password: string): Promise<{ user: User }> {
  await delay(800)
  console.log(`Signing in user: ${email}`)
  return { user: mockUser }
}

export async function signOut(): Promise<void> {
  await delay(500)
  console.log("Signing out user")
  // Clear any stored user data
  if (typeof window !== "undefined") {
    localStorage.removeItem("user")
    sessionStorage.clear()
  }
}

// Onboarding API functions
export async function completeOnboarding(data: OnboardingData): Promise<void> {
  await delay(1500)
  console.log("Completing onboarding with data:", data)
  // Simulate saving onboarding data
}

export async function checkOnboardingStatus(userId: string): Promise<{ completed: boolean }> {
  await delay(300)
  return { completed: mockUser.onboardingCompleted || false }
}

// Account management functions
export async function changeEmail(currentPassword: string, newEmail: string): Promise<void> {
  await delay(1000)
  console.log(`Changing email to: ${newEmail}`)
  // Simulate email change verification
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  await delay(800)
  console.log("Changing password")
  // Simulate password change
}

export async function deleteAccount(confirmationPhrase: string): Promise<void> {
  await delay(1500)
  if (confirmationPhrase !== "DELETE MY ACCOUNT") {
    throw new Error("Invalid confirmation phrase")
  }
  console.log("Deleting account")
  // Simulate account deletion
}
