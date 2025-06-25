"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useUser } from "./UserContext"

interface ThemeContextType {
  currentTheme: string | null
  applyTheme: (themeId: string, cssVariables: Record<string, string>) => void
  resetTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser()
  const [currentTheme, setCurrentTheme] = useState<string | null>(null)

  // Apply theme CSS variables to the document root
  const applyTheme = (themeId: string, cssVariables: Record<string, string>) => {
    const root = document.documentElement

    // Apply each CSS variable
    Object.entries(cssVariables).forEach(([property, value]) => {
      root.style.setProperty(property, `hsl(${value})`)
    })

    setCurrentTheme(themeId)

    // Store the applied theme in localStorage
    localStorage.setItem("applied-theme", themeId)
    localStorage.setItem("theme-variables", JSON.stringify(cssVariables))
  }

  // Reset to default theme
  const resetTheme = () => {
    const root = document.documentElement

    // Remove custom CSS variables (this will fall back to the default CSS)
    const defaultVariables = [
      "--background",
      "--foreground",
      "--primary",
      "--primary-foreground",
      "--secondary",
      "--secondary-foreground",
      "--accent",
      "--accent-foreground",
      "--muted",
      "--muted-foreground",
    ]

    defaultVariables.forEach((property) => {
      root.style.removeProperty(property)
    })

    setCurrentTheme(null)
    localStorage.removeItem("applied-theme")
    localStorage.removeItem("theme-variables")
  }

  // Load saved theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("applied-theme")
    const savedVariables = localStorage.getItem("theme-variables")

    if (savedTheme && savedVariables) {
      try {
        const variables = JSON.parse(savedVariables)
        applyTheme(savedTheme, variables)
      } catch (error) {
        console.error("Failed to load saved theme:", error)
      }
    }
  }, [])

  // TODO: Load user's equipped theme from backend when user data is available
  useEffect(() => {
    if (user?.user_metadata?.equipped_theme) {
      // This would fetch the theme data from your backend
      // For now, we'll just use the saved theme from localStorage
    }
  }, [user])

  return <ThemeContext.Provider value={{ currentTheme, applyTheme, resetTheme }}>{children}</ThemeContext.Provider>
}
