import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/dashboard"

  if (code) {
    const supabase = createClient()

    if (supabase) {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)

      if (!error && data.user) {
        // Check if this is a new user (first time signing in)
        const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

        if (!profile) {
          // New user - redirect to onboarding
          return NextResponse.redirect(`${origin}/onboarding`)
        }

        // Existing user - redirect to dashboard or next page
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth?error=Could not authenticate user`)
}
