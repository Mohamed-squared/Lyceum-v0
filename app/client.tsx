"use client"

import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { UserProvider } from "@/lib/contexts/UserContext"
import { NavigationProvider } from "@/lib/contexts/NavigationContext"
import { SidebarProvider } from "@/lib/contexts/SidebarContext"
import { ThemeProvider as CustomThemeProvider } from "@/lib/contexts/ThemeContext"
import { DynamicLayout } from "@/components/layout/DynamicLayout"
import { Header } from "@/components/layout/Header"
import { FloatingAIHelper } from "@/components/FloatingAIHelper"
import { usePathname } from "next/navigation"

const inter = Inter({ subsets: ["latin"] })

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLandingPage = pathname === "/"
  const isAdminPage = pathname?.startsWith("/admin")
  const isAuthPage = pathname?.startsWith("/auth")

  if (isLandingPage || isAuthPage) {
    return <>{children}</>
  }

  if (isAdminPage) {
    return <>{children}</>
  }

  return (
    <>
      <Header />
      <div className="pt-16">
        <DynamicLayout>{children}</DynamicLayout>
      </div>
      <FloatingAIHelper />
    </>
  )
}

export default function Client({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <UserProvider>
            <CustomThemeProvider>
              <NavigationProvider>
                <SidebarProvider>
                  <div className="min-h-screen bg-background">
                    <LayoutContent>{children}</LayoutContent>
                  </div>
                </SidebarProvider>
              </NavigationProvider>
            </CustomThemeProvider>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
