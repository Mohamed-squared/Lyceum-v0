"use client"

import { Button } from "@/components/ui/button"
import { useTheme } from "@/lib/contexts/ThemeContext"
import { Palette, RotateCcw } from "lucide-react"
import { useState } from "react"

interface ThemeApplyButtonProps {
  themeId: string
  themeName: string
  cssVariables: Record<string, string>
  isOwned?: boolean
}

export function ThemeApplyButton({ themeId, themeName, cssVariables, isOwned = false }: ThemeApplyButtonProps) {
  const { currentTheme, applyTheme, resetTheme } = useTheme()
  const [isApplying, setIsApplying] = useState(false)
  const isCurrentTheme = currentTheme === themeId

  const handleApplyTheme = async () => {
    setIsApplying(true)
    try {
      if (isCurrentTheme) {
        resetTheme()
      } else {
        applyTheme(themeId, cssVariables)
      }
    } catch (error) {
      console.error("Failed to apply theme:", error)
    } finally {
      setIsApplying(false)
    }
  }

  if (!isOwned) {
    return null
  }

  return (
    <Button
      onClick={handleApplyTheme}
      disabled={isApplying}
      variant={isCurrentTheme ? "outline" : "default"}
      className="w-full"
    >
      {isApplying ? (
        "Applying..."
      ) : isCurrentTheme ? (
        <>
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset to Default
        </>
      ) : (
        <>
          <Palette className="w-4 h-4 mr-2" />
          Apply {themeName}
        </>
      )}
    </Button>
  )
}
