"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Medal, Award, Crown } from "lucide-react"

interface LeaderboardUser {
  id: string
  name: string
  avatar: string
  credits: number
  rank: number
  change: number
  tier: "standard" | "contributor" | "vip"
  coursesCompleted: number
  streak: number
}

const mockLeaderboardData: LeaderboardUser[] = [
  {
    id: "1",
    name: "Sarah Chen",
    avatar: "SC",
    credits: 15420,
    rank: 1,
    change: 0,
    tier: "vip",
    coursesCompleted: 24,
    streak: 45,
  },
  {
    id: "2",
    name: "Alex Rodriguez",
    avatar: "AR",
    credits: 14890,
    rank: 2,
    change: 1,
    tier: "contributor",
    coursesCompleted: 22,
    streak: 38,
  },
  {
    id: "3",
    name: "Emily Watson",
    avatar: "EW",
    credits: 13750,
    rank: 3,
    change: -1,
    tier: "contributor",
    coursesCompleted: 19,
    streak: 29,
  },
  {
    id: "4",
    name: "Michael Kim",
    avatar: "MK",
    credits: 12340,
    rank: 4,
    change: 2,
    tier: "standard",
    coursesCompleted: 18,
    streak: 22,
  },
  {
    id: "5",
    name: "John Doe",
    avatar: "JD",
    credits: 11890,
    rank: 5,
    change: -1,
    tier: "standard",
    coursesCompleted: 16,
    streak: 15,
  },
  {
    id: "6",
    name: "Lisa Park",
    avatar: "LP",
    credits: 10560,
    rank: 6,
    change: 0,
    tier: "standard",
    coursesCompleted: 14,
    streak: 31,
  },
  {
    id: "7",
    name: "David Wilson",
    avatar: "DW",
    credits: 9870,
    rank: 7,
    change: 3,
    tier: "standard",
    coursesCompleted: 13,
    streak: 18,
  },
  {
    id: "8",
    name: "Anna Martinez",
    avatar: "AM",
    credits: 9340,
    rank: 8,
    change: -2,
    tier: "standard",
    coursesCompleted: 12,
    streak: 25,
  },
]

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className="w-5 h-5 text-yellow-500" />
    case 2:
      return <Medal className="w-5 h-5 text-gray-400" />
    case 3:
      return <Award className="w-5 h-5 text-amber-600" />
    default:
      return (
        <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-muted-foreground">
          #{rank}
        </span>
      )
  }
}

const getTierColor = (tier: string) => {
  switch (tier) {
    case "vip":
      return "bg-purple-500"
    case "contributor":
      return "bg-blue-500"
    default:
      return "bg-gray-500"
  }
}

const getChangeIndicator = (change: number) => {
  if (change > 0) {
    return <span className="text-green-500 text-xs">↑{change}</span>
  } else if (change < 0) {
    return <span className="text-red-500 text-xs">↓{Math.abs(change)}</span>
  }
  return <span className="text-muted-foreground text-xs">-</span>
}

export default function LeaderboardPage() {
  const [timeframe, setTimeframe] = useState<"weekly" | "monthly" | "alltime">("weekly")
  const currentUserId = "5" // Mock current user

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Trophy className="w-8 h-8 text-yellow-500" />
          Leaderboard
        </h1>
        <p className="text-muted-foreground">See how you rank against other learners in the community</p>
      </div>

      <Tabs value={timeframe} onValueChange={(value) => setTimeframe(value as any)} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
          <TabsTrigger value="weekly">This Week</TabsTrigger>
          <TabsTrigger value="monthly">This Month</TabsTrigger>
          <TabsTrigger value="alltime">All Time</TabsTrigger>
        </TabsList>

        <TabsContent value={timeframe} className="space-y-6">
          {/* Top 3 Podium */}
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Top Performers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-center gap-8">
                {/* 2nd Place */}
                <div className="text-center">
                  <div className="relative mb-4">
                    <Avatar className="w-16 h-16 mx-auto border-4 border-gray-300">
                      <AvatarFallback className="text-lg font-bold">{mockLeaderboardData[1].avatar}</AvatarFallback>
                    </Avatar>
                    <Badge
                      className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 ${getTierColor(mockLeaderboardData[1].tier)} text-white`}
                    >
                      {mockLeaderboardData[1].tier}
                    </Badge>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-t-lg p-4 h-20 flex flex-col justify-end">
                    <Medal className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                    <p className="font-semibold text-sm">{mockLeaderboardData[1].name}</p>
                    <p className="text-xs text-muted-foreground">
                      {mockLeaderboardData[1].credits.toLocaleString()} credits
                    </p>
                  </div>
                </div>

                {/* 1st Place */}
                <div className="text-center">
                  <div className="relative mb-4">
                    <Avatar className="w-20 h-20 mx-auto border-4 border-yellow-400">
                      <AvatarFallback className="text-xl font-bold">{mockLeaderboardData[0].avatar}</AvatarFallback>
                    </Avatar>
                    <Badge
                      className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 ${getTierColor(mockLeaderboardData[0].tier)} text-white`}
                    >
                      {mockLeaderboardData[0].tier}
                    </Badge>
                  </div>
                  <div className="bg-yellow-100 dark:bg-yellow-900/20 rounded-t-lg p-4 h-24 flex flex-col justify-end">
                    <Crown className="w-8 h-8 text-yellow-500 mx-auto mb-1" />
                    <p className="font-bold">{mockLeaderboardData[0].name}</p>
                    <p className="text-sm text-muted-foreground">
                      {mockLeaderboardData[0].credits.toLocaleString()} credits
                    </p>
                  </div>
                </div>

                {/* 3rd Place */}
                <div className="text-center">
                  <div className="relative mb-4">
                    <Avatar className="w-16 h-16 mx-auto border-4 border-amber-600">
                      <AvatarFallback className="text-lg font-bold">{mockLeaderboardData[2].avatar}</AvatarFallback>
                    </Avatar>
                    <Badge
                      className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 ${getTierColor(mockLeaderboardData[2].tier)} text-white`}
                    >
                      {mockLeaderboardData[2].tier}
                    </Badge>
                  </div>
                  <div className="bg-amber-100 dark:bg-amber-900/20 rounded-t-lg p-4 h-16 flex flex-col justify-end">
                    <Award className="w-6 h-6 text-amber-600 mx-auto mb-1" />
                    <p className="font-semibold text-sm">{mockLeaderboardData[2].name}</p>
                    <p className="text-xs text-muted-foreground">
                      {mockLeaderboardData[2].credits.toLocaleString()} credits
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Full Leaderboard */}
          <Card>
            <CardHeader>
              <CardTitle>Full Rankings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {mockLeaderboardData.map((user) => (
                  <div
                    key={user.id}
                    className={`flex items-center gap-4 p-4 rounded-lg border transition-colors ${
                      user.id === currentUserId ? "bg-primary/10 border-primary/20" : "hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        {getRankIcon(user.rank)}
                        {getChangeIndicator(user.change)}
                      </div>

                      <div className="relative">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback>{user.avatar}</AvatarFallback>
                        </Avatar>
                        <Badge
                          className={`absolute -bottom-1 -right-1 text-xs px-1 ${getTierColor(user.tier)} text-white`}
                        >
                          {user.tier[0].toUpperCase()}
                        </Badge>
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">
                          {user.name}
                          {user.id === currentUserId && (
                            <Badge variant="outline" className="ml-2 text-xs">
                              You
                            </Badge>
                          )}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{user.coursesCompleted} courses</span>
                          <span>{user.streak} day streak</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-lg">{user.credits.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">credits</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
