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
  const name = formData.get("name") as string

  // Add validation for required fields
  if (!name) {
    return { error: "Full name is required." }
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
      // Add name to user_metadata if your Supabase setup supports it
      // data: { full_name: name },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  if (!data.user) {
    return { error: "Sign up successful, but no user data returned. Please try signing in." }
  }

  // If user is created, create profile
  const { error: profileError } = await supabase.from("profiles").insert([
    {
      id: data.user.id,
      display_name: name,
      username: name, // Using name as the default username
      role: "student", // Default role
    },
  ])

  if (profileError) {
    // If profile creation fails, we should ideally roll back user creation or handle this state.
    // For now, return the profile error.
    // Consider what to do if the user exists but profile creation failed.
    // Supabase might also handle this with a trigger.
    console.error("Error creating profile:", profileError)
    return { error: `User signed up but profile creation failed: ${profileError.message}. Please contact support.` }
  }

  // Automatically sign in the user
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (signInError) {
    // It's important to handle this case, though it's unlikely if signUp just succeeded.
    // For example, the user might have been deactivated between signUp and this call.
    console.error("Error signing in after sign up:", signInError)
    return { error: `Account created, but failed to sign in automatically: ${signInError.message}. Please try signing in manually.`, success: null }
  }

  // Instead of returning a success message, redirect to onboarding
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
