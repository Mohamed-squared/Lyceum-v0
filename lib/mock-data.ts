export interface User {
  id: string; // From Supabase auth
  email?: string; // From Supabase auth
  display_name?: string; // From profiles
  avatar_url?: string; // From profiles
  credits?: number; // From profiles
  role?: "user" | "admin" | "primary-admin"; // From profiles
  badges?: any[]; // From profiles
  // Optional fields from the previous User type, if they are still relevant
  // and present in the 'profiles' table.
  bio?: string;
  university?: string;
  major?: string;
  graduationYear?: number;
  // profileImage?: string; // if different from avatar_url
  // bannerImage?: string;
  // enrollmentMode?: "full" | "viewer";
}

export interface UserProfile {
  displayName: string
  bio: string
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
  profilePicture?: string
  profileBanner?: string
  languagePreferences: {
    interface: string
    explanation: string
    courseMaterial: string
  }
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  earnedAt: string
  courseId?: string
}

export interface Course {
  id: string
  title: string
  description: string
  instructor: string
  duration: string
  level: string
  enrolled: number
  rating: number
  image: string
  category: string
  chapters: Chapter[]
  isEnrolled?: boolean
  progress?: number
  status?: "pending" | "active" | "reported"
}

export interface Chapter {
  id: string
  title: string
  duration: string
  completed: boolean
  content?: string
}

export interface MCQQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: "easy" | "medium" | "hard"
  topic: string
}

export interface ProblemQuestion {
  id: string
  question: string
  solution: string
  difficulty: "easy" | "medium" | "hard"
  topic: string
}

export interface StudyPartner {
  id: string
  name: string
  avatar: string
  status: "online" | "offline"
  mutualCourses: number
  studyStreak: number
}

export interface Activity {
  id: string
  partnerId: string
  partnerName: string
  partnerAvatar: string
  action: string
  courseTitle?: string
  timestamp: string
}

export interface Challenge {
  id: string
  title: string
  type: "course_race" | "mastery_race" | "grade_duel" | "resource_rush" | "consistency_streak" | "credit_sprint"
  opponent: {
    id: string
    name: string
    avatar: string
  }
  progress: {
    user: number
    opponent: number
  }
  timeLeft: string
  status: "active" | "completed" | "pending"
  description: string
  reward: string
}

export interface GenerationStep {
  id: string
  title: string
  status: "pending" | "in-progress" | "completed" | "failed"
  description: string
}

export interface PartnerRequest {
  id: string
  from: StudyPartner
  message: string
  timestamp: string
}

export interface AdminStats {
  totalUsers: number
  pendingCourses: number
  activeCourses: number
  totalRevenue: number
  activeReports: number
  systemHealth: number
}

export interface AdminUser {
  id: string
  name: string
  email: string
  role: string
  joinDate: string
  lastActive: string
  coursesEnrolled: number
  creditsEarned: number
}

export interface AdminCourse {
  id: string
  title: string
  instructor: string
  status: "pending" | "active" | "reported"
  enrollments: number
  createdDate: string
  reportCount?: number
}

export interface ModerationReport {
  id: string
  user: string
  context: string
  message: string
  timestamp: string
  status: "pending" | "resolved"
}

export interface Message {
  id: string
  text: string
  sender: "me" | "them"
  timestamp: string
}

export interface Conversation {
  id: string
  participant: {
    id: string
    name: string
    avatar: string
    isOnline: boolean
  }
  lastMessage: {
    text: string
    timestamp: string
    sender: "me" | "them"
  }
  unreadCount: number
  messages: Message[]
}

// Mock Data
export const mockUser: User = {
  id: "1",
  username: "johndoe",
  email: "john@example.com",
  avatar: "JD",
  credits: 1250,
  role: "primary-admin",
  displayName: "John Doe",
  bio: "Computer Science student passionate about AI and machine learning.",
  university: "MIT",
  major: "Computer Science",
  graduationYear: 2025,
  enrollmentMode: "full",
}

export const mockCourses: Course[] = [
  {
    id: "1",
    title: "Introduction to Machine Learning",
    description: "Learn the fundamentals of machine learning with hands-on projects.",
    instructor: "Dr. Sarah Johnson",
    duration: "8 weeks",
    level: "Beginner",
    enrolled: 1234,
    rating: 4.8,
    image: "/placeholder.svg?height=200&width=300",
    category: "Computer Science",
    isEnrolled: true,
    progress: 65,
    chapters: [
      { id: "1", title: "Introduction to ML", duration: "45 min", completed: true },
      { id: "2", title: "Linear Regression", duration: "60 min", completed: true },
      { id: "3", title: "Classification", duration: "55 min", completed: false },
    ],
  },
  {
    id: "2",
    title: "Advanced React Development",
    description: "Master advanced React patterns and best practices.",
    instructor: "Mike Chen",
    duration: "6 weeks",
    level: "Advanced",
    enrolled: 892,
    rating: 4.9,
    image: "/placeholder.svg?height=200&width=300",
    category: "Web Development",
    isEnrolled: true,
    progress: 30,
    chapters: [
      { id: "1", title: "React Hooks Deep Dive", duration: "50 min", completed: true },
      { id: "2", title: "Context API", duration: "40 min", completed: false },
    ],
  },
]

export const mockConversations: Conversation[] = [
  {
    id: "1",
    participant: {
      id: "2",
      name: "Sarah Wilson",
      avatar: "SW",
      isOnline: true,
    },
    lastMessage: {
      text: "Thanks for the study notes!",
      timestamp: "2 min ago",
      sender: "them",
    },
    unreadCount: 2,
    messages: [
      {
        id: "1",
        text: "Hey! How are you doing with the ML course?",
        sender: "them",
        timestamp: "10:30 AM",
      },
      {
        id: "2",
        text: "Going well! Just finished the linear regression chapter.",
        sender: "me",
        timestamp: "10:32 AM",
      },
      {
        id: "3",
        text: "That's great! Could you share your notes?",
        sender: "them",
        timestamp: "10:35 AM",
      },
      {
        id: "4",
        text: "I'll send them over.",
        sender: "me",
        timestamp: "10:36 AM",
      },
      {
        id: "5",
        text: "Thanks for the study notes!",
        sender: "them",
        timestamp: "10:45 AM",
      },
    ],
  },
  {
    id: "2",
    participant: {
      id: "3",
      name: "Alex Rodriguez",
      avatar: "AR",
      isOnline: false,
    },
    lastMessage: {
      text: "See you in the study group tomorrow",
      timestamp: "1 hour ago",
      sender: "me",
    },
    unreadCount: 0,
    messages: [
      {
        id: "1",
        text: "Are we still meeting for the study group?",
        sender: "them",
        timestamp: "9:00 AM",
      },
      {
        id: "2",
        text: "Yes, tomorrow at 3 PM in the library",
        sender: "me",
        timestamp: "9:15 AM",
      },
      {
        id: "3",
        text: "Perfect! I'll bring my notes on algorithms.",
        sender: "them",
        timestamp: "9:20 AM",
      },
      {
        id: "4",
        text: "See you in the study group tomorrow",
        sender: "me",
        timestamp: "9:25 AM",
      },
    ],
  },
]

export const mockAdminStats = {
  totalUsers: 15420,
  pendingCourses: 23,
  activeCourses: 156,
  totalRevenue: 89750,
  activeReports: 7,
  systemHealth: 98.5,
}

export const mockAdminUsers: AdminUser[] = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice@example.com",
    role: "standard",
    joinDate: "2024-01-15",
    lastActive: "2 hours ago",
    coursesEnrolled: 5,
    creditsEarned: 2340,
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob@example.com",
    role: "educator",
    joinDate: "2024-02-20",
    lastActive: "1 day ago",
    coursesEnrolled: 3,
    creditsEarned: 1890,
  },
  {
    id: "3",
    name: "Carol Davis",
    email: "carol@example.com",
    role: "admin",
    joinDate: "2024-01-10",
    lastActive: "30 minutes ago",
    coursesEnrolled: 8,
    creditsEarned: 4560,
  },
]

export const mockAdminCourses: AdminCourse[] = [
  {
    id: "1",
    title: "Advanced Quantum Physics",
    instructor: "Dr. Sarah Chen",
    status: "pending",
    enrollments: 0,
    createdDate: "2024-03-15",
  },
  {
    id: "2",
    title: "Machine Learning Fundamentals",
    instructor: "Prof. Michael Rodriguez",
    status: "active",
    enrollments: 1234,
    createdDate: "2024-02-10",
  },
  {
    id: "3",
    title: "Controversial History Topics",
    instructor: "Dr. Anonymous",
    status: "reported",
    enrollments: 45,
    createdDate: "2024-03-01",
    reportCount: 3,
  },
]

export const mockModerationReports: ModerationReport[] = [
  {
    id: "1",
    user: "student123",
    context: "Course: Advanced Physics - Chapter 5",
    message: "The explanation for quantum entanglement seems incorrect and misleading.",
    timestamp: "2 hours ago",
    status: "pending",
  },
  {
    id: "2",
    user: "learner456",
    context: "TestGen - Mathematics",
    message: "Question about derivatives has wrong answer marked as correct.",
    timestamp: "1 day ago",
    status: "pending",
  },
]

export const mockChapterData: Chapter = {
  id: "1",
  title: "Introduction to Quantum Mechanics",
  duration: "45 min",
  completed: true,
  content: "Fundamental concepts and wave-particle duality",
}

export const mockEnrolledCourses: Course[] = [
  {
    id: "1",
    title: "Quantum Mechanics Fundamentals",
    description: "Comprehensive introduction to quantum mechanics",
    instructor: "Dr. Sarah Chen",
    duration: "12 weeks",
    level: "intermediate",
    enrolled: 1234,
    rating: 4.8,
    image: "/placeholder.svg?height=200&width=300",
    category: "Physics",
    isEnrolled: true,
    progress: 65,
    chapters: [mockChapterData],
    status: "active",
  },
  {
    id: "2",
    title: "Advanced Calculus",
    description: "Deep dive into multivariable calculus",
    instructor: "Prof. Michael Rodriguez",
    duration: "10 weeks",
    level: "advanced",
    enrolled: 892,
    rating: 4.6,
    image: "/placeholder.svg?height=200&width=300",
    category: "Mathematics",
    isEnrolled: true,
    progress: 40,
    chapters: [],
    status: "active",
  },
  {
    id: "3",
    title: "Machine Learning Basics",
    description: "Introduction to ML algorithms and applications",
    instructor: "Dr. Emily Watson",
    duration: "8 weeks",
    level: "beginner",
    enrolled: 2156,
    rating: 4.9,
    image: "/placeholder.svg?height=200&width=300",
    category: "Computer Science",
    isEnrolled: true,
    progress: 85,
    chapters: [],
    status: "active",
  },
]

export const mockCreatedCourses: Course[] = [
  {
    id: "4",
    title: "Introduction to React",
    description: "Learn React from the ground up",
    instructor: "John Doe",
    duration: "6 weeks",
    level: "beginner",
    enrolled: 234,
    rating: 4.8,
    image: "/placeholder.svg?height=200&width=300",
    category: "Computer Science",
    isEnrolled: true,
    status: "active",
    chapters: [],
  },
  {
    id: "5",
    title: "Data Structures in Python",
    description: "Comprehensive guide to data structures",
    instructor: "John Doe",
    duration: "8 weeks",
    level: "intermediate",
    enrolled: 0,
    rating: 0,
    image: "/placeholder.svg?height=200&width=300",
    category: "Computer Science",
    isEnrolled: false,
    status: "generating",
    chapters: [],
  },
]

export const mockStudyPartners: StudyPartner[] = [
  {
    id: "1",
    name: "Alex Johnson",
    avatar: "AJ",
    status: "online",
    mutualCourses: 3,
    studyStreak: 12,
  },
  {
    id: "2",
    name: "Maria Garcia",
    avatar: "MG",
    status: "offline",
    mutualCourses: 2,
    studyStreak: 8,
  },
  {
    id: "3",
    name: "David Kim",
    avatar: "DK",
    status: "online",
    mutualCourses: 1,
    studyStreak: 15,
  },
]

export const mockPartnerRequests: PartnerRequest[] = [
  {
    id: "1",
    from: {
      id: "4",
      name: "Sarah Chen",
      avatar: "SC",
      status: "online",
      mutualCourses: 2,
      studyStreak: 20,
    },
    message: "Hi! I noticed we're both taking Quantum Mechanics. Would you like to study together?",
    timestamp: "2 hours ago",
  },
  {
    id: "2",
    from: {
      id: "5",
      name: "Mike Johnson",
      avatar: "MJ",
      status: "offline",
      mutualCourses: 1,
      studyStreak: 5,
    },
    message: "Let's be study partners for the Machine Learning course!",
    timestamp: "1 day ago",
  },
]

export const mockActivities: Activity[] = [
  {
    id: "1",
    partnerId: "1",
    partnerName: "Alex Johnson",
    partnerAvatar: "AJ",
    action: "completed Chapter 5 of Quantum Mechanics",
    courseTitle: "Quantum Mechanics Fundamentals",
    timestamp: "2 hours ago",
  },
  {
    id: "2",
    partnerId: "2",
    partnerName: "Maria Garcia",
    partnerAvatar: "MG",
    action: "started Advanced Calculus course",
    timestamp: "4 hours ago",
  },
  {
    id: "3",
    partnerId: "3",
    partnerName: "David Kim",
    partnerAvatar: "DK",
    action: "earned 150 credits in ML challenge",
    timestamp: "1 day ago",
  },
]

export const mockActiveChallenges: Challenge[] = [
  {
    id: "1",
    title: "Course Race: Quantum Mechanics",
    type: "course_race",
    opponent: {
      id: "1",
      name: "Alex Johnson",
      avatar: "AJ",
    },
    progress: {
      user: 65,
      opponent: 58,
    },
    timeLeft: "3 days",
    status: "active",
    description: "First to complete the course wins!",
    reward: "500 credits + Winner badge",
  },
  {
    id: "2",
    title: "Credit Sprint",
    type: "credit_sprint",
    opponent: {
      id: "2",
      name: "Maria Garcia",
      avatar: "MG",
    },
    progress: {
      user: 1250,
      opponent: 1180,
    },
    timeLeft: "2 days",
    status: "active",
    description: "Earn the most credits in 7 days",
    reward: "1000 bonus credits",
  },
]

export const mockAllChallenges: Challenge[] = [
  ...mockActiveChallenges,
  {
    id: "3",
    title: "Mastery Race: Physics",
    type: "mastery_race",
    opponent: {
      id: "3",
      name: "David Kim",
      avatar: "DK",
    },
    progress: {
      user: 85,
      opponent: 92,
    },
    timeLeft: "Completed",
    status: "completed",
    description: "Achieve highest mastery score in Physics",
    reward: "Physics Master badge",
  },
  {
    id: "4",
    title: "Grade Duel: Calculus Quiz",
    type: "grade_duel",
    opponent: {
      id: "1",
      name: "Alex Johnson",
      avatar: "AJ",
    },
    progress: {
      user: 0,
      opponent: 0,
    },
    timeLeft: "5 days",
    status: "pending",
    description: "Best score on the final calculus quiz",
    reward: "300 credits",
  },
]

export const mockAllCourses: Course[] = [
  ...mockEnrolledCourses,
  {
    id: "6",
    title: "Organic Chemistry Essentials",
    description: "Complete guide to organic chemistry reactions",
    instructor: "Dr. Ahmed Hassan",
    duration: "14 weeks",
    level: "intermediate",
    enrolled: 756,
    rating: 4.7,
    image: "/placeholder.svg?height=200&width=300",
    category: "Chemistry",
    isEnrolled: false,
    chapters: [],
    status: "active",
  },
  {
    id: "7",
    title: "European History: Renaissance to Modern",
    description: "Comprehensive study of European history",
    instructor: "Prof. Hans Mueller",
    duration: "16 weeks",
    level: "beginner",
    enrolled: 643,
    rating: 4.5,
    image: "/placeholder.svg?height=200&width=300",
    category: "History",
    isEnrolled: false,
    chapters: [],
    status: "active",
  },
  {
    id: "8",
    title: "Turkish Literature Classics",
    description: "Exploration of Turkish literary masterpieces",
    instructor: "Dr. Ayşe Demir",
    duration: "12 weeks",
    level: "intermediate",
    enrolled: 321,
    rating: 4.4,
    image: "/placeholder.svg?height=200&width=300",
    category: "Literature",
    isEnrolled: false,
    chapters: [],
    status: "active",
  },
]

export const mockGenerationSteps: GenerationStep[] = [
  {
    id: "1",
    title: "Analyzing textbook structure",
    status: "completed",
    description: "Parsing table of contents and identifying chapters",
  },
  {
    id: "2",
    title: "Transcribing lecture videos",
    status: "completed",
    description: "Converting audio to text using AssemblyAI",
  },
  {
    id: "3",
    title: "Generating Chapter 1 content",
    status: "in-progress",
    description: "Creating notes, questions, and summaries",
  },
  {
    id: "4",
    title: "Generating Chapter 2 content",
    status: "pending",
    description: "Creating notes, questions, and summaries",
  },
  {
    id: "5",
    title: "Creating presentations",
    status: "pending",
    description: "Generating PowerPoint slides for each chapter",
  },
  {
    id: "6",
    title: "Mapping lectures to chapters",
    status: "pending",
    description: "Associating lecture content with textbook chapters",
  },
  {
    id: "7",
    title: "Finalizing course structure",
    status: "pending",
    description: "Organizing all resources and completing setup",
  },
]

export const subjects = [
  "Physics",
  "Mathematics",
  "Computer Science",
  "Chemistry",
  "History",
  "Literature",
  "Biology",
  "Engineering",
]

export const languages = ["english", "arabic", "turkish", "german"]

export const languageLabels = {
  english: "English",
  arabic: "Arabic",
  turkish: "Turkish",
  german: "German",
}

export const levelOfStudyOptions = ["High School", "Bachelor's", "Master's", "PhD", "Professional", "Lifelong Learner"]
