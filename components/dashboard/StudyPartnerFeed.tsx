import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users } from "lucide-react"
import Link from "next/link"
import type { Activity } from "@/lib/mock-data"

interface StudyPartnerFeedProps {
  activities: Activity[]
}

export function StudyPartnerFeed({ activities }: StudyPartnerFeedProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="h-5 w-5 mr-2" />
          Study Partner Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium text-primary">
                {activity.partnerAvatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{activity.partnerName}</p>
                <p className="text-sm text-muted-foreground truncate">{activity.action}</p>
                <p className="text-xs text-muted-foreground/70">{activity.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
        <Button asChild variant="outline" className="w-full mt-4" size="sm">
          <Link href="/community/partners">
            <Users className="h-4 w-4 mr-2" />
            Find Study Partners
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
