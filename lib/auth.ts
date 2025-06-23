// File: lib/auth.ts
import { createServerClient } from '@supabase/ssr';
import type { NextRequest } from 'next/server'; // Keep for type checking if needed elsewhere

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Extracts user ID from Next.js request by validating Supabase auth cookie session.
 * Returns `userId` string or null if not authenticated.
 */
export async function getUserIdFromReq(req: Request | NextRequest): Promise<string | null> {
  // Ensure URL and Key are defined, otherwise Supabase client will error
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase URL or Anon Key is not defined. Check environment variables.");
    return null;
  }

  try {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get(name: string) {
          if ('cookies' in req && typeof req.cookies.get === 'function') {
            // Standard NextRequest object with a 'cookies' object having 'get' method
            return (req as NextRequest).cookies.get(name)?.value ?? undefined; // Return undefined if null
          } else if (req.headers && typeof req.headers.get === 'function') {
            // Standard Request object with a 'headers' object
            const cookieHeader = req.headers.get('cookie');
            if (!cookieHeader) return undefined; // Return undefined if no cookie header
            const cookie = cookieHeader
              .split(';')
              .map((c) => c.trim())
              .find((c) => c.startsWith(name + '='));
            if (!cookie) return undefined; // Return undefined if cookie not found
            return decodeURIComponent(cookie.split('=')[1]);
          }
          return undefined; // Default to undefined if no way to get cookies
        },
        set() {
          // This function is only for reading cookies on the server-side for auth.
          // Setting cookies should be handled by Supabase middleware or client-side.
          // console.warn('set cookie called in getUserIdFromReq - this should not happen');
        },
        remove() {
          // Similar to set, not expected to be called here.
          // console.warn('remove cookie called in getUserIdFromReq - this should not happen');
        },
      },
    });

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      // console.error('Error getting user from Supabase:', error.message); // Optional: log specific error
      return null;
    }

    return user?.id || null;
  } catch (e) {
    console.error('Exception in getUserIdFromReq:', (e as Error).message);
    return null;
  }
}
