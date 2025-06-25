"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export async function signInWithEmail(prevState: any, formData: FormData) {
  // Add validation to ensure formData exists
  if (!formData || typeof formData.get !== "function") {
    return { error: "Invalid form data received" }
  }

  const supabase = createClient()

  if (!supabase) {
    return { error: "Authentication service not configured" }
  }

  const email = formData.get("email") as string
  const password = formData.get("password") as string

  // Add validation for required fields
  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/", "layout")
  redirect("/dashboard")
}

export async function signUpWithEmail(prevState: any, formData: FormData) {
  // Add validation to ensure formData exists
  if (!formData || typeof formData.get !== "function") {
    return { error: "Invalid form data received" }
  }

  const supabase = createClient()

  if (!supabase) {
    return { error: "Authentication service not configured" }
  }

  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const username = formData.get("username") as string // Changed from name to username

  // Add validation for required fields
  if (!username) { // Changed from name to username
    return { error: "Username is required." } // Changed message
  }
  if (!email) {
    return { error: "Email is required." }
  }
  if (!password) {
    return { error: "Password is required." }
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username: username }, // Pass username for the trigger
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message, success: null }
  }

  // Profile creation and session are now handled by Supabase trigger and settings.
  // No need to manually insert profile or sign in.

  revalidatePath("/", "layout") // Revalidate relevant paths
  redirect("/onboarding")
  // The return statement below will not be reached due to redirect,
  // but as a fallback or if redirect is conditional:
  // return { success: "Sign up successful! Redirecting to onboarding..." };
}

export async function signInWithGoogle() {
  const supabase = createClient()

  if (!supabase) {
    return { error: "Authentication service not configured" }
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  if (data.url) {
    redirect(data.url)
  }
}

export async function signOut() {
  const supabase = createClient()

  if (!supabase) {
    redirect("/auth")
    return
  }

  await supabase.auth.signOut()
  revalidatePath("/", "layout")
  redirect("/auth")
}
