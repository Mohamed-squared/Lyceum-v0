"use client"

import { Button } from "@/components/ui/button"
import { Menu, BookOpen } from "lucide-react"
import { useSidebar } from "@/lib/contexts/SidebarContext"
import Link from "next/link"

export function Header() {
  const { toggleSidebar } = useSidebar()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="flex h-16 items-center px-4">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-4" aria-label="Toggle sidebar">
          <Menu className="h-6 w-6" />
        </Button>

        <Link href="/dashboard" className="flex items-center space-x-2">
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">Lyceum</span>
        </Link>
      </div>
    </header>
  )
}
