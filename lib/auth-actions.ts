"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { headers } from "next/headers"

export async function signInWithEmail(email: string, password: string) {
  const supabase = createClient()

  if (!supabase) {
    throw new Error("Supabase not configured")
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw new Error(error.message)
  }

  redirect("/dashboard")
}

export async function signUpWithEmail(email: string, password: string, fullName: string) {
  const supabase = createClient()

  if (!supabase) {
    throw new Error("Supabase not configured")
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  })

  if (error) {
    throw new Error(error.message)
  }

  redirect("/onboarding")
}

export async function signInWithGoogle() {
  const supabase = createClient()

  if (!supabase) {
    throw new Error("Supabase not configured")
  }

  const origin = headers().get("origin")

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) {
    throw new Error(error.message)
  }

  if (data.url) {
    redirect(data.url)
  }
}

export async function signOut() {
  const supabase = createClient()

  if (!supabase) {
    throw new Error("Supabase not configured")
  }

  const { error } = await supabase.auth.signOut()

  if (error) {
    throw new Error(error.message)
  }

  redirect("/auth")
}
