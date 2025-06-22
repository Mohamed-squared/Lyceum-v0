"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Home,
  BookOpen,
  FileText,
  MessageSquare,
  Users,
  Trophy,
  Plus,
  ShoppingBag,
  ChevronDown,
  ChevronRight,
  Settings,
  User,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react"
import { useTheme } from "next-themes"
import { useUser } from "@/lib/contexts/UserContext"
import { useSidebar } from "@/lib/contexts/SidebarContext"
import { cn } from "@/lib/utils"

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const [isCommunityOpen, setIsCommunityOpen] = useState(false)
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { user } = useUser()
  const { isCollapsed, isMobileOpen, toggleCollapsed, toggleMobile, setMobileOpen } = useSidebar()

  const navigationItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Home,
    },
    {
      title: "Browse Courses",
      href: "/courses",
      icon: BookOpen,
    },
    {
      title: "TestGen Suite",
      href: "/testgen",
      icon: FileText,
    },
    {
      title: "AI Chat Studio",
      href: "/ai-chat",
      icon: MessageSquare,
    },
  ]

  const communityItems = [
    {
      title: "Study Partners",
      href: "/community/partners",
      icon: Users,
    },
    {
      title: "Leaderboard",
      href: "/leaderboard",
      icon: Trophy,
    },
    {
      title: "Create Challenge",
      href: "/challenges/create",
      icon: Plus,
    },
  ]

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex h-16 items-center border-b px-4">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <BookOpen className="h-6 w-6 text-blue-600" />
          {!isCollapsed && <span className="text-xl font-bold">Lyceum</span>}
        </Link>
        <Button variant="ghost" size="sm" className="ml-auto hidden lg:flex" onClick={toggleCollapsed}>
          {isCollapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 p-4">
        {navigationItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Button
              variant={isActive(item.href) ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start",
                isCollapsed && "px-2",
                isActive(item.href) &&
                  "bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-300 dark:hover:bg-blue-900",
              )}
            >
              <item.icon className="h-4 w-4" />
              {!isCollapsed && <span className="ml-2">{item.title}</span>}
            </Button>
          </Link>
        ))}

        {/* Divider */}
        <div className="my-4 border-t" />

        {/* Community Section */}
        <Collapsible open={isCommunityOpen} onOpenChange={setIsCommunityOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className={cn("w-full justify-start", isCollapsed && "px-2")}>
              <Users className="h-4 w-4" />
              {!isCollapsed && (
                <>
                  <span className="ml-2">Community</span>
                  <ChevronDown
                    className={cn("ml-auto h-4 w-4 transition-transform", isCommunityOpen && "rotate-180")}
                  />
                </>
              )}
            </Button>
          </CollapsibleTrigger>
          {!isCollapsed && (
            <CollapsibleContent className="space-y-1">
              {communityItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive(item.href) ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start pl-8",
                      isActive(item.href) &&
                        "bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-300 dark:hover:bg-blue-900",
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="ml-2">{item.title}</span>
                  </Button>
                </Link>
              ))}
            </CollapsibleContent>
          )}
        </Collapsible>

        <Link href="/marketplace">
          <Button
            variant={isActive("/marketplace") ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start",
              isCollapsed && "px-2",
              isActive("/marketplace") &&
                "bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-300 dark:hover:bg-blue-900",
            )}
          >
            <ShoppingBag className="h-4 w-4" />
            {!isCollapsed && <span className="ml-2">Marketplace</span>}
          </Button>
        </Link>
      </nav>

      {/* User Menu */}
      {user && (
        <div className="border-t p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className={cn("w-full justify-start", isCollapsed && "px-2")}>
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">{user.avatar}</AvatarFallback>
                </Avatar>
                {!isCollapsed && (
                  <>
                    <div className="ml-2 flex flex-col items-start">
                      <span className="text-sm font-medium">{user.name}</span>
                      <div className="flex items-center space-x-1">
                        <Badge variant="outline" className="text-xs">
                          {user.credits} credits
                        </Badge>
                      </div>
                    </div>
                    <ChevronRight className="ml-auto h-4 w-4" />
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link href={`/profile/${user.name.toLowerCase().replace(" ", "")}`}>
                  <User className="mr-2 h-4 w-4" />
                  My Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                {theme === "dark" ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  )

  return (
    <>
      {/* Mobile Header */}
      <div className="flex h-16 items-center justify-between border-b bg-background px-4 lg:hidden">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <BookOpen className="h-6 w-6 text-blue-600" />
          <span className="text-xl font-bold">Lyceum</span>
        </Link>
        <Button variant="ghost" size="sm" onClick={toggleMobile}>
          {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex h-screen flex-col border-r bg-background transition-all duration-300",
          isCollapsed ? "w-16" : "w-64",
          className,
        )}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="fixed left-0 top-0 h-full w-64 bg-background">
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  )
}
