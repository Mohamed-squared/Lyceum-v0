"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useSidebar } from "@/lib/contexts/SidebarContext"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Home,
  BookOpen,
  Zap,
  Users,
  Trophy,
  UserPlus,
  Settings,
  Inbox,
  Star,
  Shield,
  Sun,
  Moon,
  LogOut,
  X,
  ChevronDown,
} from "lucide-react"
import { signOut } from "@/lib/api"
import { useUser } from "@/lib/contexts/UserContext"

const navigationItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "My Courses", href: "/my-courses", icon: BookOpen },
  { name: "TestGen", href: "/testgen", icon: Zap },
  { name: "Inbox", href: "/inbox", icon: Inbox },
]

const settingsItems = [
  { name: "Membership", href: "/settings/membership", icon: Star },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function StandardSidebar() {
  const { isOpen, closeSidebar } = useSidebar()
  const { user } = useUser()
  const pathname = usePathname()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [isCommunityOpen, setIsCommunityOpen] = useState(false)

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push("/auth")
    } catch (error) {
      console.error("Sign out failed:", error)
    }
  }

  const handleLinkClick = () => {
    closeSidebar()
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={closeSidebar} />

      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-80 bg-background border-r z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">L</span>
            </div>
            <span className="font-bold text-lg">Lyceum</span>
          </div>
          <Button variant="ghost" size="sm" onClick={closeSidebar}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-4">
          <nav className="space-y-2">
            {/* Main Navigation */}
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={handleLinkClick}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}

            {/* Community Dropdown */}
            <Collapsible open={isCommunityOpen} onOpenChange={setIsCommunityOpen}>
              <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                <div className="flex items-center space-x-3">
                  <Users className="h-4 w-4" />
                  <span>Community</span>
                </div>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${isCommunityOpen ? "rotate-180" : ""}`}
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-1">
                <div className="ml-7 space-y-1">
                  <Link
                    href="/community/leaderboard"
                    onClick={handleLinkClick}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      pathname === "/community/leaderboard"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                  >
                    <Trophy className="h-4 w-4" />
                    <span>Leaderboard</span>
                  </Link>
                  <Link
                    href="/community/partners"
                    onClick={handleLinkClick}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      pathname === "/community/partners"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>Find a Partner</span>
                  </Link>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Settings */}
            <div className="pt-4 border-t">
              {settingsItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname.startsWith(item.href)
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={handleLinkClick}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}

              {/* Admin Panel (only for admins) */}
              {(user?.role === "admin" || user?.role === "primary-admin") && (
                <Link
                  href="/admin"
                  onClick={handleLinkClick}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname.startsWith("/admin")
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  <Shield className="h-4 w-4" />
                  <span>Admin Panel</span>
                </Link>
              )}
            </div>
          </nav>
        </div>

        {/* User Menu */}
        <div className="p-4 border-t">
          <div className="flex items-center space-x-3 mb-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar || "/placeholder.svg"} />
              <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name || "User"}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email || "user@example.com"}</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={toggleTheme}>
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
              <span className="ml-2">Sign Out</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
