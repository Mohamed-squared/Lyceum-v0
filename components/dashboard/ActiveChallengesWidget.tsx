import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trophy } from "lucide-react"
import Link from "next/link"
import type { Challenge } from "@/lib/mock-data"

interface ActiveChallengesWidgetProps {
  challenges: Challenge[]
}

export function ActiveChallengesWidget({ challenges }: ActiveChallengesWidgetProps) {
  const formatProgress = (challenge: Challenge) => {
    if (challenge.type === "credit_sprint") {
      return {
        user: challenge.progress.user,
        opponent: challenge.progress.opponent,
        isPercentage: false,
      }
    }
    return {
      user: challenge.progress.user,
      opponent: challenge.progress.opponent,
      isPercentage: true,
    }
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Active Challenges</h2>
        <Button asChild variant="outline">
          <Link href="/community/challenges">
            <Trophy className="h-4 w-4 mr-2" />
            View All
          </Link>
        </Button>
      </div>
      <div className="space-y-4">
        {challenges.map((challenge) => {
          const progress = formatProgress(challenge)
          return (
            <Card key={challenge.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">{challenge.title}</h3>
                    <p className="text-sm text-gray-600">vs {challenge.opponent.name}</p>
                  </div>
                  <Badge variant="outline">{challenge.timeLeft} left</Badge>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>You</span>
                    <span>{progress.isPercentage ? `${progress.user}%` : progress.user}</span>
                  </div>
                  <Progress
                    value={progress.isPercentage ? progress.user : Math.min((progress.user / 2000) * 100, 100)}
                    className="h-2"
                  />
                  <div className="flex justify-between text-sm">
                    <span>{challenge.opponent.name}</span>
                    <span>{progress.isPercentage ? `${progress.opponent}%` : progress.opponent}</span>
                  </div>
                  <Progress
                    value={progress.isPercentage ? progress.opponent : Math.min((progress.opponent / 2000) * 100, 100)}
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
