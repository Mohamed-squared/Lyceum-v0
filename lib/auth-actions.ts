"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export async function signInWithEmail(formData: FormData) {
  const supabase = createClient()

  if (!supabase) {
    return { error: "Authentication service not configured" }
  }

  const email = formData.get("email") as string
  const password = formData.get("password") as string

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

export async function signUpWithEmail(formData: FormData) {
  const supabase = createClient()

  if (!supabase) {
    // In server actions, it's common to throw an error or redirect
    // For simplicity here, returning an error object that page.tsx might handle
    // However, the goal is to use these actions directly in form actions,
    // and form actions handle pending/error states often via useFormState.
    // For now, let's make it return an error that the original page.tsx was designed for.
    // throw new Error("Authentication service not configured");
    return { error: "Authentication service not configured" };
  }

  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const name = formData.get("name") as string // Extract name

  if (!name) {
    return { error: "Full name is required." };
  }
  if (!email) {
    return { error: "Email is required." };
  }
  if (!password) {
    return { error: "Password is required." };
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
      email: data.user.email,
      // Use the extracted name for the username field, or a dedicated 'full_name' field
      username: name,
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
