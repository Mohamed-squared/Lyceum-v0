import type React from "react"
import type { Metadata } from "next"
import Client from "./client"

export const metadata: Metadata = {
  title: "Lyceum - AI-Powered Learning Platform",
  description: "The future of collaborative learning with AI-powered course creation and personalized tutoring",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <Client>{children}</Client>
}


import './globals.css'