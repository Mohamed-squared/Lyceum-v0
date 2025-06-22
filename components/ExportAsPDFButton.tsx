"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FileDown } from "lucide-react"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

interface ExportAsPDFButtonProps {
  targetRef: React.RefObject<HTMLElement>
  filename: string
  buttonText?: string
  variant?: "default" | "outline" | "secondary" | "ghost"
  size?: "default" | "sm" | "lg"
}

export function ExportAsPDFButton({
  targetRef,
  filename,
  buttonText = "Export as PDF",
  variant = "outline",
  size = "sm",
}: ExportAsPDFButtonProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    if (!targetRef.current) return

    setIsExporting(true)
    try {
      const canvas = await html2canvas(targetRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
      })

      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? "landscape" : "portrait",
        unit: "px",
        format: [canvas.width, canvas.height],
      })

      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height)
      pdf.save(`${filename}.pdf`)
    } catch (error) {
      console.error("Error exporting PDF:", error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Button
      onClick={handleExport}
      disabled={isExporting}
      variant={variant}
      size={size}
      className="flex items-center gap-2"
    >
      <FileDown className="w-4 h-4" />
      {isExporting ? "Exporting..." : buttonText}
    </Button>
  )
}
