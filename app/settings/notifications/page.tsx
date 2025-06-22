"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Bell, Mail, Smartphone } from "lucide-react"

interface NotificationSettings {
  email: {
    platformNews: boolean
    courseProgress: boolean
  }
  push: {
    newMessages: boolean
    studyPartnerActivity: boolean
    challengeUpdates: boolean
  }
}

export default function NotificationsSettingsPage() {
  const [settings, setSettings] = useState<NotificationSettings>({
    email: {
      platformNews: true,
      courseProgress: true,
    },
    push: {
      newMessages: true,
      studyPartnerActivity: false,
      challengeUpdates: true,
    },
  })

  const updateEmailSetting = (key: keyof NotificationSettings["email"], value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      email: {
        ...prev.email,
        [key]: value,
      },
    }))
  }

  const updatePushSetting = (key: keyof NotificationSettings["push"], value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      push: {
        ...prev.push,
        [key]: value,
      },
    }))
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Notification Settings</h1>
        <p className="text-muted-foreground mt-2">Manage how and when you receive notifications</p>
      </div>

      <div className="space-y-8">
        {/* Email Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="h-5 w-5 mr-2" />
              Email Notifications
            </CardTitle>
            <CardDescription>Choose which email notifications you'd like to receive</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="platform-news" className="text-base font-medium">
                  Platform News & Updates
                </Label>
                <p className="text-sm text-muted-foreground">Receive newsletters and major feature announcements</p>
              </div>
              <Switch
                id="platform-news"
                checked={settings.email.platformNews}
                onCheckedChange={(checked) => updateEmailSetting("platformNews", checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="course-progress" className="text-base font-medium">
                  Course Progress Summaries
                </Label>
                <p className="text-sm text-muted-foreground">Get weekly summaries of your learning activity</p>
              </div>
              <Switch
                id="course-progress"
                checked={settings.email.courseProgress}
                onCheckedChange={(checked) => updateEmailSetting("courseProgress", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Push Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Push Notifications (On-site)
            </CardTitle>
            <CardDescription>Manage in-app notifications and alerts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="new-messages" className="text-base font-medium">
                  New Messages
                </Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when you receive a new message in your inbox
                </p>
              </div>
              <Switch
                id="new-messages"
                checked={settings.push.newMessages}
                onCheckedChange={(checked) => updatePushSetting("newMessages", checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="study-partner" className="text-base font-medium">
                  Study Partner Activity
                </Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when a study partner starts a challenge or completes a course
                </p>
              </div>
              <Switch
                id="study-partner"
                checked={settings.push.studyPartnerActivity}
                onCheckedChange={(checked) => updatePushSetting("studyPartnerActivity", checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="challenge-updates" className="text-base font-medium">
                  Challenge Updates
                </Label>
                <p className="text-sm text-muted-foreground">Get notified about your ongoing challenges</p>
              </div>
              <Switch
                id="challenge-updates"
                checked={settings.push.challengeUpdates}
                onCheckedChange={(checked) => updatePushSetting("challengeUpdates", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Mobile Notifications Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Smartphone className="h-5 w-5 mr-2" />
              Mobile App Notifications
            </CardTitle>
            <CardDescription>Download our mobile app to receive push notifications on your device</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Mobile push notifications are managed through your device settings once you install the Lyceum mobile app.
              Visit your app store to download the app and enable notifications.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
