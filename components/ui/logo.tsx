"use client"

import Image from "next/image"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

interface LogoProps {
  variant?: "default" | "premium" | "icon-only"
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
}

const sizeClasses = {
  sm: "h-6 w-auto",
  md: "h-8 w-auto",
  lg: "h-12 w-auto",
  xl: "h-16 w-auto",
}

export function Logo({ variant = "default", size = "md", className }: LogoProps) {
  const { theme } = useTheme()

  const getLogoSrc = () => {
    if (variant === "premium") {
      return "/logo-premium.png"
    }

    // Use appropriate logo based on theme
    return theme === "dark" ? "/logo-light.png" : "/logo-dark.png"
  }

  const getAltText = () => {
    return variant === "icon-only" ? "Lyceum" : "Lyceum - AI-Powered Learning Platform"
  }

  return (
    <Image
      src={getLogoSrc() || "/placeholder.svg"}
      alt={getAltText()}
      width={200}
      height={60}
      className={cn(sizeClasses[size], className)}
      priority
    />
  )
}
