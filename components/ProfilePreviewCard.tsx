"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ProfilePreviewCardProps {
  displayName: string
  bio: string
  profileImage?: string
  bannerImage?: string
  hobbies?: string[]
}

export function ProfilePreviewCard({
  displayName,
  bio,
  profileImage,
  bannerImage,
  hobbies = [],
}: ProfilePreviewCardProps) {
  return (
    <Card className="w-full max-w-md">
      <div className="relative">
        {/* Banner */}
        <div
          className="h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-lg"
          style={
            bannerImage
              ? { backgroundImage: `url(${bannerImage})`, backgroundSize: "cover", backgroundPosition: "center" }
              : {}
          }
        />

        {/* Profile Picture */}
        <div className="absolute -bottom-8 left-4">
          <Avatar className="w-16 h-16 border-4 border-white">
            {profileImage ? (
              <AvatarImage src={profileImage || "/placeholder.svg"} alt={displayName} />
            ) : (
              <AvatarFallback className="text-lg font-bold">
                {displayName ? displayName.charAt(0).toUpperCase() : "?"}
              </AvatarFallback>
            )}
          </Avatar>
        </div>
      </div>

      <CardContent className="pt-12 pb-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-bold text-lg">{displayName || "Your Name"}</h3>
            <p className="text-sm text-muted-foreground">@username</p>
          </div>

          <p className="text-sm text-gray-700">{bio || "Your bio will appear here..."}</p>

          {hobbies.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {hobbies.slice(0, 3).map((hobby, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {hobby}
                </Badge>
              ))}
              {hobbies.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{hobbies.length - 3} more
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
