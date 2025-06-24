"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BookOpen, Trophy, Users, TrendingUp, Plus } from "lucide-react"
import { MyCoursesWidget } from "@/components/dashboard/MyCoursesWidget"
import { MyCreationsWidget } from "@/components/dashboard/MyCreationsWidget"
import { ActiveChallengesWidget } from "@/components/dashboard/ActiveChallengesWidget"
import { StudyPartnerFeed } from "@/components/dashboard/StudyPartnerFeed"
import { FloatingAIHelper } from "@/components/FloatingAIHelper"

interface DashboardData {
  enrolledCourses: any[]
  createdCourses: any[]
  challenges: any[]
  activities: any[]
  partners: any[]
  user: {
    name: string
    role: string
    credits: number
    avatar_url?: string
    badges: string[]
  }
  stats: {
    coursesCompleted?: number
    studyStreak?: number
    challengesWon?: number
  }
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch("/api/dashboard", {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const dashboardData = await response.json()
        setData(dashboardData)
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err)
        setError(err instanceof Error ? err.message : "Failed to load dashboard")

        // Set fallback data so the dashboard still works
        setData({
          enrolledCourses: [],
          createdCourses: [],
          challenges: [],
          activities: [],
          partners: [],
          user: {
            name: "Demo User",
            role: "student",
            credits: 1000,
            avatar_url: "/placeholder-user.jpg",
            badges: [],
          },
          stats: {
            coursesCompleted: 0,
            studyStreak: 0,
            challengesWon: 0,
          },
        })
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Dashboard Unavailable</h1>
          <p className="text-muted-foreground mb-4">{error || "Unable to load dashboard data"}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    )
  }

  const { user, stats, enrolledCourses, createdCourses, challenges, activities, partners } = data

  return (
    <>
      <div className="container mx-auto p-6 space-y-6">
        {error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 text-sm">
              <strong>Note:</strong> Some features may be limited. {error}
            </p>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.avatar_url || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">Welcome back, {user.name}!</h1>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">{user.role}</Badge>
                <span className="text-sm text-muted-foreground">{user.credits} credits</span>
              </div>
            </div>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Course
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Courses Completed</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.coursesCompleted || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.studyStreak || 0} days</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Challenges Won</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.challengesWon || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Study Partners</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{partners.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <MyCoursesWidget courses={enrolledCourses} />
            <ActiveChallengesWidget challenges={challenges} />
          </div>

          <div className="space-y-6">
            <MyCreationsWidget courses={createdCourses} />
            <StudyPartnerFeed activities={activities} partners={partners} />
          </div>
        </div>
      </div>
    </>
  )
}
