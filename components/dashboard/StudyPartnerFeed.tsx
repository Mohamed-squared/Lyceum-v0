import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, MessageCircle } from "lucide-react"
import Link from "next/link"

interface Activity {
  id: string
  partnerId?: string
  partnerName?: string
  partnerAvatar?: string
  action: string
  courseTitle?: string
  timestamp: string
}

interface Partner {
  id: string
  name: string
  avatar_url?: string
  status?: string
}

interface StudyPartnerFeedProps {
  activities?: Activity[]
  partners?: Partner[]
}

export function StudyPartnerFeed({ activities = [], partners = [] }: StudyPartnerFeedProps) {
  if (!activities.length && !partners.length) {
    return (
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Study Partners</h2>
          <Button asChild variant="outline">
            <Link href="/community/partners">
              <Users className="h-4 w-4 mr-2" />
              Find Partners
            </Link>
          </Button>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Study Partners Yet</h3>
              <p className="text-muted-foreground mb-4">
                Connect with other learners to enhance your study experience!
              </p>
              <Button asChild>
                <Link href="/community/partners">Find Study Partners</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    )
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Study Partners</h2>
        <Button asChild variant="outline">
          <Link href="/community/partners">
            <Users className="h-4 w-4 mr-2" />
            View All
          </Link>
        </Button>
      </div>

      {/* Partners List */}
      {partners.length > 0 && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-lg">Your Partners</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {partners.slice(0, 3).map((partner) => (
                <div key={partner.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={partner.avatar_url || "/placeholder.svg"} alt={partner.name} />
                      <AvatarFallback>{partner.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{partner.name}</p>
                      <Badge variant={partner.status === "online" ? "default" : "secondary"} className="text-xs">
                        {partner.status || "offline"}
                      </Badge>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost">
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Activity Feed */}
      {activities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={activity.partnerAvatar || "/placeholder.svg"}
                      alt={activity.partnerName || "Partner"}
                    />
                    <AvatarFallback>{(activity.partnerName || "P").charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-medium">{activity.partnerName || "A study partner"}</span> {activity.action}
                      {activity.courseTitle && (
                        <span className="text-muted-foreground"> in {activity.courseTitle}</span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </section>
  )
}
