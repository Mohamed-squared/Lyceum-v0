"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Shield, Palette, Bell } from "lucide-react"

const settingsNavigation = [
  {
    title: "Profile",
    href: "/settings/profile",
    icon: User,
    description: "Manage your personal information and academic profile",
  },
  {
    title: "Account",
    href: "/settings/account",
    icon: Shield,
    description: "Security settings, password, and account preferences",
  },
  {
    title: "Appearance",
    href: "/settings/appearance",
    icon: Palette,
    description: "Theme, language, and display preferences",
  },
  {
    title: "Notifications",
    href: "/settings/notifications",
    icon: Bell,
    description: "Email and push notification settings",
  },
]

export default function SettingsPage() {
  const pathname = usePathname()

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your account settings and preferences</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {settingsNavigation.map((item) => (
          <Link key={item.href} href={item.href}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <item.icon className="w-5 h-5 text-blue-600" />
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
