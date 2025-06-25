"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Star, Users, Clock, Leaf } from "lucide-react"

interface EnhancedThemePreviewProps {
  cssVariables: Record<string, string>
  themeName: string
}

export function EnhancedThemePreview({ cssVariables, themeName }: EnhancedThemePreviewProps) {
  const previewStyle = Object.entries(cssVariables).reduce(
    (acc, [key, value]) => {
      acc[key] = `hsl(${value})`
      return acc
    },
    {} as Record<string, string>,
  )

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-lg border space-y-6" style={previewStyle}>
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold flex items-center gap-2" style={{ color: previewStyle["--foreground"] }}>
            <Leaf className="w-5 h-5" style={{ color: previewStyle["--primary"] }} />
            {themeName} Preview
          </h3>
          <Badge style={{ backgroundColor: previewStyle["--primary"], color: previewStyle["--primary-foreground"] }}>
            Live Preview
          </Badge>
        </div>

        {/* Sample Dashboard Layout */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Course Card */}
          <Card style={{ backgroundColor: previewStyle["--card"], borderColor: previewStyle["--border"] }}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback style={{ backgroundColor: previewStyle["--muted"] }}>JD</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-sm" style={{ color: previewStyle["--card-foreground"] }}>
                    Advanced Mathematics
                  </CardTitle>
                  <p className="text-xs" style={{ color: previewStyle["--muted-foreground"] }}>
                    by Dr. Smith
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm" style={{ color: previewStyle["--muted-foreground"] }}>
                <BookOpen className="w-4 h-4" />
                <span>12 chapters</span>
                <Users className="w-4 h-4 ml-2" />
                <span>1.2k students</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span style={{ color: previewStyle["--card-foreground"] }}>Progress</span>
                  <span style={{ color: previewStyle["--muted-foreground"] }}>68%</span>
                </div>
                <Progress
                  value={68}
                  className="h-2"
                  style={{
                    backgroundColor: previewStyle["--muted"],
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card style={{ backgroundColor: previewStyle["--card"], borderColor: previewStyle["--border"] }}>
            <CardHeader>
              <CardTitle
                className="text-sm flex items-center gap-2"
                style={{ color: previewStyle["--card-foreground"] }}
              >
                <Star className="w-4 h-4" style={{ color: previewStyle["--primary"] }} />
                Study Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ color: previewStyle["--muted-foreground"] }}>
                  Study Streak
                </span>
                <span className="font-bold" style={{ color: previewStyle["--primary"] }}>
                  15 days
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ color: previewStyle["--muted-foreground"] }}>
                  Hours Today
                </span>
                <span className="font-bold" style={{ color: previewStyle["--card-foreground"] }}>
                  3.5h
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ color: previewStyle["--muted-foreground"] }}>
                  Credits Earned
                </span>
                <span className="font-bold" style={{ color: previewStyle["--accent-foreground"] }}>
                  2,450
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Interactive Elements */}
        <div className="space-y-4">
          <div className="flex gap-3">
            <Button
              style={{
                backgroundColor: previewStyle["--primary"],
                color: previewStyle["--primary-foreground"],
              }}
            >
              Primary Action
            </Button>
            <Button
              variant="outline"
              style={{
                borderColor: previewStyle["--border"],
                color: previewStyle["--foreground"],
              }}
            >
              Secondary
            </Button>
            <Button
              variant="ghost"
              style={{
                color: previewStyle["--muted-foreground"],
              }}
            >
              Ghost Button
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Input
              placeholder="Search courses..."
              style={{
                backgroundColor: previewStyle["--input"],
                borderColor: previewStyle["--border"],
                color: previewStyle["--foreground"],
              }}
            />
            <div
              className="p-3 rounded-md text-sm"
              style={{
                backgroundColor: previewStyle["--secondary"],
                color: previewStyle["--secondary-foreground"],
              }}
            >
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Next class in 2 hours
              </div>
            </div>
          </div>
        </div>

        {/* Sample Content */}
        <Card style={{ backgroundColor: previewStyle["--muted"], borderColor: previewStyle["--border"] }}>
          <CardContent className="p-4">
            <p className="text-sm leading-relaxed" style={{ color: previewStyle["--muted-foreground"] }}>
              This is how your content will look with the {themeName} theme applied. The carefully selected colors
              create a harmonious and comfortable reading experience that's perfect for extended study sessions.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Theme Features */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Theme Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-semibold">Color Palette</h4>
              <div className="flex gap-2">
                {Object.entries(cssVariables)
                  .slice(0, 6)
                  .map(([key, value]) => (
                    <div
                      key={key}
                      className="w-8 h-8 rounded border"
                      style={{ backgroundColor: `hsl(${value})` }}
                      title={key}
                    />
                  ))}
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Benefits</h4>
              <ul className="text-muted-foreground space-y-1">
                <li>• Reduced eye strain</li>
                <li>• Enhanced focus</li>
                <li>• Calming atmosphere</li>
                <li>• Professional appearance</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
