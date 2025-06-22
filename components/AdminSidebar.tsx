"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { BarChart3, Users, BookOpen, Shield, Settings, TestTube, Database, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function AdminSidebar() {
  const pathname = usePathname()

  const navItems = [
    { href: "/admin", label: "Overview", icon: BarChart3 },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/courses", label: "Courses", icon: BookOpen },
    { href: "/admin/moderation", label: "Moderation", icon: Shield },
    { href: "/admin/system", label: "System", icon: Settings },
    {
      href: "/admin/testing-aids",
      label: "Testing Aids",
      icon: TestTube,
      warning: true,
    },
    {
      href: "/admin/database",
      label: "Database Browser",
      icon: Database,
      danger: true,
    },
  ]

  return (
    <div className="w-64 bg-background border-r h-full">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-foreground">Admin Panel</h2>
      </div>

      <nav className="px-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={`w-full justify-start ${
                  item.warning
                    ? "text-yellow-600 hover:text-yellow-700"
                    : item.danger
                      ? "text-red-600 hover:text-red-700"
                      : ""
                }`}
              >
                <Icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          )
        })}
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <Separator className="mb-4" />
        <Link href="/dashboard">
          <Button variant="outline" className="w-full justify-start">
            <LogOut className="mr-2 h-4 w-4" />
            Exit Admin View
          </Button>
        </Link>
      </div>
    </div>
  )
}
