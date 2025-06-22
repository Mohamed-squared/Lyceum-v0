"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { mockUser, type User } from "@/lib/mock-data"

interface UserContextType {
  user: User | null
  setUser: (user: User | null) => void
  isLoading: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading user data
    const loadUser = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setUser(mockUser)
      setIsLoading(false)
    }

    loadUser()
  }, [])

  return <UserContext.Provider value={{ user, setUser, isLoading }}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
