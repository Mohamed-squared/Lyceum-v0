"use client"

import { useEffect, useState } from "react"

interface LatexRendererProps {
  children: string
  className?: string
  inline?: boolean
}

export function LatexRenderer({ children, className = "", inline = false }: LatexRendererProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Handle undefined/null children
  if (!children || typeof children !== "string") {
    return null
  }

  if (!isClient) {
    // Return a placeholder during SSR
    return <span className={`bg-gray-100 px-2 py-1 rounded font-mono text-sm ${className}`}>{children}</span>
  }

  // In a real implementation, this would use react-katex
  // For now, we'll render a styled placeholder that looks like LaTeX
  const formatLatex = (text: string) => {
    // Ensure text is a string and not undefined/null
    if (!text || typeof text !== "string") {
      return ""
    }

    // Simple formatting for common LaTeX patterns
    return text
      .replace(/\$\$(.*?)\$\$/g, '<div class="text-center my-2 font-serif text-lg">$1</div>')
      .replace(/\$(.*?)\$/g, '<span class="font-serif">$1</span>')
      .replace(
        /\\frac\{(.*?)\}\{(.*?)\}/g,
        '<span class="inline-block"><span class="block text-sm border-b border-black">$1</span><span class="block text-sm">$2</span></span>',
      )
      .replace(/\\sqrt\{(.*?)\}/g, "√($1)")
      .replace(/\\Delta/g, "Δ")
      .replace(/\\hbar/g, "ℏ")
      .replace(/\\pi/g, "π")
      .replace(/\\times/g, "×")
      .replace(/\\partial/g, "∂")
      .replace(/\\infty/g, "∞")
  }

  if (inline) {
    return <span className={`font-serif ${className}`} dangerouslySetInnerHTML={{ __html: formatLatex(children) }} />
  }

  return (
    <div
      className={`bg-gray-50 p-4 rounded-lg border ${className}`}
      dangerouslySetInnerHTML={{ __html: formatLatex(children) }}
    />
  )
}
