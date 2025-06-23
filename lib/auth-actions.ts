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
    return { error: "Authentication service not configured" }
  }

  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  // If user is created, create profile
  if (data.user) {
    const { error: profileError } = await supabase.from("profiles").insert([
      {
        id: data.user.id,
        email: data.user.email,
        username: data.user.email?.split("@")[0] || "",
        role: "student",
      },
    ])

    if (profileError) {
      console.error("Error creating profile:", profileError)
    }
  }

  return { success: "Check your email to confirm your account" }
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
