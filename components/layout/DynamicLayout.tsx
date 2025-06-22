"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import { StandardSidebar } from "./StandardSidebar"

export function DynamicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Don't render sidebar for landing page or admin pages
  if (pathname === "/" || pathname?.startsWith("/admin")) {
    return <>{children}</>
  }

  return (
    <>
      <StandardSidebar />
      <main className="min-h-screen bg-background">{children}</main>
    </>
  )
}
