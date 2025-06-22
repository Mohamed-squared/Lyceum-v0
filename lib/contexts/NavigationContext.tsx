"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface NavigationContextType {
  isMobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
  toggleMobileMenu: () => void
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined)

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const setMobileMenuOpen = (open: boolean) => setIsMobileMenuOpen(open)
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)

  return (
    <NavigationContext.Provider
      value={{
        isMobileMenuOpen,
        setMobileMenuOpen,
        toggleMobileMenu,
      }}
    >
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation() {
  const context = useContext(NavigationContext)
  if (context === undefined) {
    throw new Error("useNavigation must be used within a NavigationProvider")
  }
  return context
}
