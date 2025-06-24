import { createClient } from "@/lib/supabase/server"
import type { NextRequest } from "next/server"

export async function getUserIdFromReq(req: Request | NextRequest): Promise<string | null> {
  try {
    const supabase = createClient()

    // If supabase is not properly configured, return null
    if (!supabase) {
      console.warn("Supabase client not available")
      return null
    }

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error) {
      console.warn("Auth error:", error.message)
      return null
    }

    return user?.id || null
  } catch (error) {
    console.error("Error getting user from request:", error)
    return null
  }
}

export async function getCurrentUser() {
  try {
    const supabase = createClient()

    if (!supabase) {
      return null
    }

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error) {
      console.warn("Auth error:", error.message)
      return null
    }

    return user
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error("Authentication required")
  }
  return user
}
