"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Trophy, ArrowLeft, Plus, Target, Zap, BookOpen, Clock, Medal, Flame } from "lucide-react"
import Link from "next/link"
import { getChallenges, createChallenge, getStudyPartners } from "@/lib/api"
import type { Challenge, StudyPartner } from "@/lib/mock-data"

export default function ChallengesPage() {
  const [activeChallenges, setActiveChallenges] = useState<Challenge[]>([])
  const [pastChallenges, setPastChallenges] = useState<Challenge[]>([])
  const [partners, setPartners] = useState<StudyPartner[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedOpponent, setSelectedOpponent] = useState("")
  const [selectedChallengeType, setSelectedChallengeType] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [challengesData, partnersData] = await Promise.all([getChallenges(), getStudyPartners()])
        setActiveChallenges(challengesData.active)
        setPastChallenges(challengesData.past)
        setPartners(partnersData.partners)
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleCreateChallenge = async () => {
    if (!selectedOpponent || !selectedChallengeType) return

    try {
      await createChallenge(selectedOpponent, selectedChallengeType)
      setIsDialogOpen(false)
      setSelectedOpponent("")
      setSelectedChallengeType("")
      // Refresh challenges in real implementation
    } catch (error) {
      console.error("Failed to create challenge:", error)
    }
  }

  const getChallengeIcon = (type: Challenge["type"]) => {
    switch (type) {
      case "course_race":
        return <BookOpen className="h-5 w-5" />
      case "mastery_race":
        return <Target className="h-5 w-5" />
      case "grade_duel":
        return <Medal className="h-5 w-5" />
      case "resource_rush":
        return <Zap className="h-5 w-5" />
      case "consistency_streak":
        return <Flame className="h-5 w-5" />
      case "credit_sprint":
        return <Trophy className="h-5 w-5" />
      default:
        return <Trophy className="h-5 w-5" />
    }
  }

  const getChallengeColor = (type: Challenge["type"]) => {
    switch (type) {
      case "course_race":
        return "text-blue-600"
      case "mastery_race":
        return "text-green-600"
      case "grade_duel":
        return "text-purple-600"
      case "resource_rush":
        return "text-yellow-600"
      case "consistency_streak":
        return "text-orange-600"
      case "credit_sprint":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const formatProgress = (challenge: Challenge) => {
    if (challenge.type === "credit_sprint") {
      return {
        user: challenge.progress.user,
        opponent: challenge.progress.opponent,
        isPercentage: false,
        max: 2000,
      }
    }
    return {
      user: challenge.progress.user,
      opponent: challenge.progress.opponent,
      isPercentage: true,
      max: 100,
    }
  }

  const challengeTypes = [
    { value: "course_race", label: "Course Race", description: "First to complete a course" },
    { value: "mastery_race", label: "Mastery Race", description: "Highest mastery score" },
    { value: "grade_duel", label: "Grade Duel", description: "Best quiz/test score" },
    { value: "resource_rush", label: "Resource Rush", description: "Most resources completed" },
    { value: "consistency_streak", label: "Consistency Streak", description: "Longest study streak" },
    { value: "credit_sprint", label: "Credit Sprint", description: "Most credits earned" },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button asChild variant="outline" size="sm">
                <Link href="/dashboard">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Challenges</h1>
                <p className="text-gray-600">Compete with study partners and earn rewards</p>
              </div>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Challenge
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Challenge</DialogTitle>
                  <DialogDescription>Challenge a study partner to a friendly competition</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Select Opponent</label>
                    <Select value={selectedOpponent} onValueChange={setSelectedOpponent}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a study partner" />
                      </SelectTrigger>
                      <SelectContent>
                        {partners.map((partner) => (
                          <SelectItem key={partner.id} value={partner.id}>
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600">
                                {partner.avatar}
                              </div>
                              <span>{partner.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Challenge Type</label>
                    <Select value={selectedChallengeType} onValueChange={setSelectedChallengeType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose challenge type" />
                      </SelectTrigger>
                      <SelectContent>
                        {challengeTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div>
                              <div className="font-medium">{type.label}</div>
                              <div className="text-xs text-gray-500">{type.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateChallenge} disabled={!selectedOpponent || !selectedChallengeType}>
                      Create Challenge
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">Active Challenges ({activeChallenges.length})</TabsTrigger>
            <TabsTrigger value="past">Past Challenges ({pastChallenges.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Active Challenges</h2>
                <Badge variant="outline">{activeChallenges.length} ongoing</Badge>
              </div>

              {activeChallenges.length > 0 ? (
                <div className="space-y-4">
                  {activeChallenges.map((challenge) => {
                    const progress = formatProgress(challenge)
                    return (
                      <Card key={challenge.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`p-2 rounded-lg bg-gray-100 ${getChallengeColor(challenge.type)}`}>
                                {getChallengeIcon(challenge.type)}
                              </div>
                              <div>
                                <CardTitle className="text-xl">{challenge.title}</CardTitle>
                                <CardDescription>{challenge.description}</CardDescription>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge variant="outline" className="mb-2">
                                <Clock className="h-3 w-3 mr-1" />
                                {challenge.timeLeft}
                              </Badge>
                              <p className="text-sm text-gray-600">vs {challenge.opponent.name}</p>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="text-center p-4 bg-blue-50 rounded-lg">
                                <div className="text-2xl font-bold text-blue-600">
                                  {progress.isPercentage ? `${progress.user}%` : progress.user}
                                </div>
                                <div className="text-sm text-blue-700">You</div>
                              </div>
                              <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <div className="text-2xl font-bold text-gray-600">
                                  {progress.isPercentage ? `${progress.opponent}%` : progress.opponent}
                                </div>
                                <div className="text-sm text-gray-700">{challenge.opponent.name}</div>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Your Progress</span>
                                <span>
                                  {progress.isPercentage ? `${progress.user}%` : `${progress.user}/${progress.max}`}
                                </span>
                              </div>
                              <Progress
                                value={progress.isPercentage ? progress.user : (progress.user / progress.max) * 100}
                                className="h-2"
                              />
                              <div className="flex justify-between text-sm">
                                <span>{challenge.opponent.name}'s Progress</span>
                                <span>
                                  {progress.isPercentage
                                    ? `${progress.opponent}%`
                                    : `${progress.opponent}/${progress.max}`}
                                </span>
                              </div>
                              <Progress
                                value={
                                  progress.isPercentage ? progress.opponent : (progress.opponent / progress.max) * 100
                                }
                                className="h-2"
                              />
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t">
                              <div className="flex items-center space-x-2">
                                <Trophy className="h-4 w-4 text-yellow-500" />
                                <span className="text-sm font-medium">Reward: {challenge.reward}</span>
                              </div>
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No active challenges</h3>
                    <p className="text-gray-600 mb-4">Create a challenge to compete with your study partners</p>
                    <Button onClick={() => setIsDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Challenge
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="past" className="mt-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Past Challenges</h2>
                <Badge variant="outline">{pastChallenges.length} completed</Badge>
              </div>

              {pastChallenges.length > 0 ? (
                <div className="space-y-4">
                  {pastChallenges.map((challenge) => {
                    const progress = formatProgress(challenge)
                    const userWon = progress.user > progress.opponent
                    return (
                      <Card key={challenge.id} className="opacity-75">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`p-2 rounded-lg bg-gray-100 ${getChallengeColor(challenge.type)}`}>
                                {getChallengeIcon(challenge.type)}
                              </div>
                              <div>
                                <CardTitle className="text-xl">{challenge.title}</CardTitle>
                                <CardDescription>{challenge.description}</CardDescription>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge variant={userWon ? "default" : "secondary"}>{userWon ? "Won" : "Lost"}</Badge>
                              <p className="text-sm text-gray-600 mt-1">vs {challenge.opponent.name}</p>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-4">
                            <div className={`text-center p-4 rounded-lg ${userWon ? "bg-green-50" : "bg-red-50"}`}>
                              <div className={`text-2xl font-bold ${userWon ? "text-green-600" : "text-red-600"}`}>
                                {progress.isPercentage ? `${progress.user}%` : progress.user}
                              </div>
                              <div className={`text-sm ${userWon ? "text-green-700" : "text-red-700"}`}>
                                You {userWon ? "(Winner)" : "(Lost)"}
                              </div>
                            </div>
                            <div className={`text-center p-4 rounded-lg ${!userWon ? "bg-green-50" : "bg-red-50"}`}>
                              <div className={`text-2xl font-bold ${!userWon ? "text-green-600" : "text-red-600"}`}>
                                {progress.isPercentage ? `${progress.opponent}%` : progress.opponent}
                              </div>
                              <div className={`text-sm ${!userWon ? "text-green-700" : "text-red-700"}`}>
                                {challenge.opponent.name} {!userWon ? "(Winner)" : "(Lost)"}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <Medal className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No completed challenges</h3>
                    <p className="text-gray-600">Your completed challenges will appear here</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
