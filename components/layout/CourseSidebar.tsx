"use client"

import Link from "next/link"
import { usePathname, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Home, BookOpen, StickyNote, ClipboardList, BarChart3, ArrowLeft, Sun, Moon, LogOut, Play } from "lucide-react"
import { useTheme } from "next-themes"
import { useUser } from "@/lib/contexts/UserContext"
import { useNavigation } from "@/lib/contexts/NavigationContext"
import { cn } from "@/lib/utils"

interface CourseSidebarProps {
  course?: {
    id: string
    title: string
    thumbnail: string
  }
}

export function CourseSidebar({ course }: CourseSidebarProps) {
  const pathname = usePathname()
  const params = useParams()
  const { theme, setTheme } = useTheme()
  const { user } = useUser()
  const { setMobileMenuOpen } = useNavigation()

  const courseId = params.courseId as string

  const navigationItems = [
    {
      title: "Course Dashboard",
      href: `/courses/${courseId}/dashboard`,
      icon: Home,
    },
    {
      title: "Next Lesson",
      href: `/courses/${courseId}/study/1`, // Next logical chapter
      icon: Play,
    },
    {
      title: "Study Material",
      href: `/courses/${courseId}/study`,
      icon: BookOpen,
    },
    {
      title: "Notes & Documents",
      href: `/courses/${courseId}/notes`,
      icon: StickyNote,
    },
    {
      title: "Assignments & Exams",
      href: `/courses/${courseId}/assignments`,
      icon: ClipboardList,
    },
    {
      title: "Course Progress",
      href: `/courses/${courseId}/progress`,
      icon: BarChart3,
    },
  ]

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href)
  }

  const handleLinkClick = () => {
    setMobileMenuOpen(false)
  }

  return (
    <div className="flex h-full flex-col bg-card border-r border-border">
      {/* Course Header */}
      <div className="border-b border-border p-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <BookOpen className="h-6 w-6 text-gray-600 dark:text-gray-300" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-semibold truncate">{course?.title || "Course Title"}</h2>
            <p className="text-xs text-muted-foreground">Course Materials</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 p-4 overflow-y-auto">
        {navigationItems.map((item) => (
          <Link key={item.href} href={item.href} onClick={handleLinkClick}>
            <Button
              variant={isActive(item.href) ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start",
                isActive(item.href) && "bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-300",
              )}
            >
              <item.icon className="h-4 w-4 mr-2" />
              {item.title}
            </Button>
          </Link>
        ))}

        {/* Divider */}
        <hr className="my-4 border-border" />

        {/* Exit Button */}
        <Link href="/courses/my" onClick={handleLinkClick}>
          <Button variant="outline" className="w-full justify-start">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to My Courses
          </Button>
        </Link>
      </nav>

      {/* User Menu & Theme Toggle */}
      {user && (
        <div className="border-t border-border p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">{user.avatar}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{user.name}</span>
                <Badge variant="outline" className="text-xs w-fit">
                  {user.credits} credits
                </Badge>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
          <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
            <LogOut className="h-4 w-4 mr-2" />
            Log Out
          </Button>
        </div>
      )}
    </div>
  )
}
