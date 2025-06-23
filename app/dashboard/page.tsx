"use client"

import useSWR from 'swr'
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, TrendingUp, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { getDashboardData, type DashboardData } from "@/lib/api" // Assuming DashboardData type is exported from api.ts or a types file
import { MyCoursesWidget } from "@/components/dashboard/MyCoursesWidget"
import { MyCreationsWidget } from "@/components/dashboard/MyCreationsWidget"
import { StudyPartnerFeed } from "@/components/dashboard/StudyPartnerFeed"
import { ActiveChallengesWidget } from "@/components/dashboard/ActiveChallengesWidget"
import { Skeleton } from "@/components/ui/skeleton"

// Define a specific type for dashboard data if not already available globally
// For now, using DashboardData from lib/api, assuming it's defined there or imported.

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Skeleton */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-9 w-72 mb-2" /> {/* Welcome message */}
              <Skeleton className="h-5 w-96" /> {/* Subtitle */}
            </div>
            <div className="flex items-center space-x-4">
              <Skeleton className="h-8 w-24" /> {/* Credits Badge */}
              <Skeleton className="h-8 w-20" /> {/* Role Badge */}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content Skeleton */}
          <div className="lg:col-span-2 space-y-8">
            {/* MyCoursesWidget Skeleton */}
            <div>
              <Skeleton className="h-8 w-48 mb-4" /> {/* Widget Title */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-36 w-full" />
                <Skeleton className="h-36 w-full" />
              </div>
            </div>
            {/* MyCreationsWidget Skeleton */}
            <div>
              <Skeleton className="h-8 w-48 mb-4" /> {/* Widget Title */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-36 w-full" />
              </div>
            </div>
            {/* ActiveChallengesWidget Skeleton */}
            <div>
              <Skeleton className="h-8 w-52 mb-4" /> {/* Widget Title */}
              <Skeleton className="h-24 w-full" />
            </div>
          </div>

          {/* Sidebar Skeleton */}
          <div className="space-y-6">
            {/* StudyPartnerFeed Skeleton */}
            <div>
              <Skeleton className="h-8 w-40 mb-4" /> {/* Widget Title */}
              <Skeleton className="h-48 w-full" />
            </div>
            {/* Quick Stats Skeleton */}
            <Card>
              <CardHeader>
                <Skeleton className="h-7 w-32" /> {/* Card Title */}
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
              </CardContent>
            </Card>
            {/* Quick Actions Skeleton */}
            <Card>
              <CardHeader>
                <Skeleton className="h-7 w-36" /> {/* Card Title */}
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-9 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  // SWR key can be a string, typically the API endpoint.
  // The fetcher function (getDashboardData) will be called with this key.
  const { data, error, isLoading } = useSWR<DashboardData>('/api/dashboard', getDashboardData)

  if (isLoading) {
    return <DashboardSkeleton />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center px-4">
        <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">Failed to Load Dashboard</h2>
        <p className="text-muted-foreground mb-6">
          We couldn't fetch your dashboard data. It might be a temporary issue.
        </p>
        <p className="text-sm text-muted-foreground mb-4">Error: {error.message}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    )
  }

  if (!data) {
    // This case might occur if SWR hasn't fetched yet but isn't loading, or if API returned null/undefined
    // For robust UI, consider what to show. A skeleton or a specific "No data available" message.
    // Given SWR's behavior, `isLoading` should cover the initial fetch.
    // If `data` is null post-loading and post-error check, it implies an unexpected API response.
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center px-4">
            <TrendingUp className="h-16 w-16 text-muted-foreground mb-4" /> {/* Or a more relevant icon */}
            <h2 className="text-2xl font-bold text-foreground mb-2">No Dashboard Data</h2>
            <p className="text-muted-foreground mb-6">
                There's currently no data to display on your dashboard.
            </p>
            <Button asChild>
                <Link href="/courses">Explore Courses</Link>
            </Button>
        </div>
    );
  }

  // TODO: Add specific empty state checks for child components if necessary
  // e.g., if data.enrolledCourses is empty, MyCoursesWidget should render an empty state.

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
                  {/* These stats seem to be hardcoded in the original example.
                      If they are part of dashboardData, they should be mapped from data.user.stats or similar.
                      For now, keeping them as they were, assuming they might be static or placeholders.
                  */}
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Courses Completed</span>
                    <span className="font-semibold text-foreground">{data.stats?.coursesCompleted || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Study Streak</span>
                    <span className="font-semibold text-foreground">{data.stats?.studyStreak || 0} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Challenges Won</span>
                    <span className="font-semibold text-foreground">{data.stats?.challengesWon || 0}</span>
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
