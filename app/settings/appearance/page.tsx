"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTheme } from "next-themes"
import { Sun, Moon, Monitor } from "lucide-react"

export default function AppearanceSettingsPage() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Appearance Settings</h1>
        <p className="text-muted-foreground mt-2">Customize how Lyceum looks and feels</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Theme Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Theme</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <Button
                variant={theme === "light" ? "default" : "outline"}
                onClick={() => setTheme("light")}
                className="flex flex-col items-center gap-2 h-auto py-4"
              >
                <Sun className="w-6 h-6" />
                <span>Light</span>
              </Button>
              <Button
                variant={theme === "dark" ? "default" : "outline"}
                onClick={() => setTheme("dark")}
                className="flex flex-col items-center gap-2 h-auto py-4"
              >
                <Moon className="w-6 h-6" />
                <span>Dark</span>
              </Button>
              <Button
                variant={theme === "system" ? "default" : "outline"}
                onClick={() => setTheme("system")}
                className="flex flex-col items-center gap-2 h-auto py-4"
              >
                <Monitor className="w-6 h-6" />
                <span>System</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Language Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Language</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="language">Interface Language</Label>
              <Select defaultValue="en">
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="ar">العربية (Arabic)</SelectItem>
                  <SelectItem value="tr">Türkçe (Turkish)</SelectItem>
                  <SelectItem value="de">Deutsch (German)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Display Preferences */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Display Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sidebar">Sidebar Behavior</Label>
                <Select defaultValue="auto">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto-collapse on mobile</SelectItem>
                    <SelectItem value="always">Always expanded</SelectItem>
                    <SelectItem value="collapsed">Always collapsed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="density">Content Density</Label>
                <Select defaultValue="comfortable">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="compact">Compact</SelectItem>
                    <SelectItem value="comfortable">Comfortable</SelectItem>
                    <SelectItem value="spacious">Spacious</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
