import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  // Check if environment variables are available
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase environment variables not configured. Using mock mode.")
    return null
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

// Export a safe client that won't throw errors
export const supabase = createClient()
