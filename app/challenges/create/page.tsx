"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { mockStudyPartners } from "@/lib/mock-data"
import { Search, Users, Trophy, Zap, Target, Clock, BookOpen, TrendingUp } from "lucide-react"

const challengeTypes = [
  {
    id: "course_race",
    name: "Course Race",
    description: "First to complete a specific course wins",
    icon: BookOpen,
    duration: "1-4 weeks",
    reward: "500-2000 credits",
  },
  {
    id: "mastery_race",
    name: "Mastery Race",
    description: "Achieve the highest mastery score in a subject",
    icon: Target,
    duration: "2 weeks",
    reward: "1000 credits + badge",
  },
  {
    id: "grade_duel",
    name: "Grade Duel",
    description: "Best score on a specific assignment or exam",
    icon: Trophy,
    duration: "1 week",
    reward: "300-800 credits",
  },
  {
    id: "resource_rush",
    name: "Resource Rush",
    description: "Complete the most study resources in a time limit",
    icon: Zap,
    duration: "3 days",
    reward: "400 credits",
  },
  {
    id: "consistency_streak",
    name: "Consistency Streak",
    description: "Maintain the longest daily study streak",
    icon: Clock,
    duration: "2 weeks",
    reward: "600 credits + streak shield",
  },
  {
    id: "credit_sprint",
    name: "Credit Sprint",
    description: "Earn the most credits in a set timeframe",
    icon: TrendingUp,
    duration: "1 week",
    reward: "1000 bonus credits",
  },
]

export default function CreateChallengePage() {
  const [step, setStep] = useState(1)
  const [selectedOpponent, setSelectedOpponent] = useState<string>("")
  const [selectedChallenge, setSelectedChallenge] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredPartners = mockStudyPartners.filter((partner) =>
    partner.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const selectedPartner = mockStudyPartners.find((p) => p.id === selectedOpponent)
  const selectedChallengeType = challengeTypes.find((c) => c.id === selectedChallenge)

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleSendChallenge = () => {
    console.log("Sending challenge:", {
      opponent: selectedOpponent,
      challengeType: selectedChallenge,
    })
    // Redirect or show success message
  }

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Trophy className="w-8 h-8 text-yellow-500" />
          Create a Challenge
        </h1>
        <p className="text-muted-foreground mt-2">Challenge your study partners to friendly competition</p>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-4">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step >= stepNumber ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {stepNumber}
              </div>
              {stepNumber < 3 && <div className={`w-12 h-1 mx-2 ${step > stepNumber ? "bg-primary" : "bg-muted"}`} />}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Select Opponent */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Step 1: Select an Opponent
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="search">Search Study Partners</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-3">
              <RadioGroup value={selectedOpponent} onValueChange={setSelectedOpponent}>
                {filteredPartners.map((partner) => (
                  <div key={partner.id} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50">
                    <RadioGroupItem value={partner.id} id={partner.id} />
                    <Avatar className="w-12 h-12">
                      <AvatarFallback>{partner.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Label htmlFor={partner.id} className="font-medium cursor-pointer">
                          {partner.name}
                        </Label>
                        <Badge
                          variant={partner.status === "online" ? "default" : "secondary"}
                          className={partner.status === "online" ? "bg-green-500" : ""}
                        >
                          {partner.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {partner.mutualCourses} mutual courses • {partner.studyStreak} day streak
                      </div>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleNext} disabled={!selectedOpponent}>
                Next: Choose Challenge
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Choose Challenge Type */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Step 2: Choose Your Challenge
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <RadioGroup value={selectedChallenge} onValueChange={setSelectedChallenge}>
                {challengeTypes.map((challenge) => (
                  <div key={challenge.id} className="relative">
                    <RadioGroupItem value={challenge.id} id={challenge.id} className="peer sr-only" />
                    <Label
                      htmlFor={challenge.id}
                      className="flex flex-col p-4 border rounded-lg cursor-pointer hover:bg-muted/50 peer-checked:border-primary peer-checked:bg-primary/5"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <challenge.icon className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold">{challenge.name}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{challenge.description}</p>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Duration: {challenge.duration}</span>
                        <span>Reward: {challenge.reward}</span>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button onClick={handleNext} disabled={!selectedChallenge}>
                Next: Confirm & Send
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Confirm and Send */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Step 3: Confirm & Send Challenge
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted p-6 rounded-lg space-y-4">
              <h3 className="font-semibold text-lg">Challenge Summary</h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Opponent</h4>
                  {selectedPartner && (
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback>{selectedPartner.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{selectedPartner.name}</p>
                        <p className="text-sm text-muted-foreground">{selectedPartner.mutualCourses} mutual courses</p>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="font-medium mb-2">Challenge Type</h4>
                  {selectedChallengeType && (
                    <div className="flex items-center gap-3">
                      <selectedChallengeType.icon className="w-8 h-8 text-primary" />
                      <div>
                        <p className="font-medium">{selectedChallengeType.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {selectedChallengeType.duration} • {selectedChallengeType.reward}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {selectedChallengeType && (
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground">{selectedChallengeType.description}</p>
                </div>
              )}
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg">
              <p className="text-sm">
                <strong>Note:</strong> Your opponent will receive a notification and can choose to accept or decline
                this challenge. Once accepted, the challenge will begin immediately.
              </p>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button onClick={handleSendChallenge} className="bg-green-600 hover:bg-green-700">
                Send Challenge
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
