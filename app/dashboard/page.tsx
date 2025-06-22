"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, TrendingUp } from "lucide-react"
import Link from "next/link"
import { getDashboardData, type DashboardData } from "@/lib/api"
import { MyCoursesWidget } from "@/components/dashboard/MyCoursesWidget"
import { MyCreationsWidget } from "@/components/dashboard/MyCreationsWidget"
import { StudyPartnerFeed } from "@/components/dashboard/StudyPartnerFeed"
import { ActiveChallengesWidget } from "@/components/dashboard/ActiveChallengesWidget"

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashboardData = await getDashboardData()
        setData(dashboardData)
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Failed to load dashboard</h2>
          <p className="text-muted-foreground">Please try refreshing the page</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Welcome back, {data.user.name}!</h1>
              <p className="text-muted-foreground mt-1">Ready to continue your learning journey?</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="px-3 py-1">
                <Trophy className="h-4 w-4 mr-1" />
                {data.user.credits.toLocaleString()} Credits
              </Badge>
              <Badge variant="outline" className="px-3 py-1 capitalize">
                {data.user.role} User
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <MyCoursesWidget courses={data.enrolledCourses} />
            <MyCreationsWidget courses={data.createdCourses} />
            <ActiveChallengesWidget challenges={data.challenges} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <StudyPartnerFeed activities={data.activities} />

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Your Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Courses Completed</span>
                    <span className="font-semibold text-foreground">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Study Streak</span>
                    <span className="font-semibold text-foreground">7 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Challenges Won</span>
                    <span className="font-semibold text-foreground">8</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Credits</span>
                    <span className="font-semibold text-foreground">{data.user.credits.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full" size="sm">
                  <Link href="/ai-chat">Start AI Tutoring Session</Link>
                </Button>
                <Button asChild variant="outline" className="w-full" size="sm">
                  <Link href="/testgen">Generate Practice Test</Link>
                </Button>
                <Button asChild variant="outline" className="w-full" size="sm">
                  <Link href="/community/challenges">Challenge a Friend</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
