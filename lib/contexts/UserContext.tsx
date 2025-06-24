"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { type User } from "@/lib/mock-data" // Removed mockUser import
import { supabase } from "@/lib/supabase/client" // Import client-side Supabase

interface UserContextType {
  user: User | null
  setUser: (user: User | null) => void // This might be removed if auto-managed by auth state
  isLoading: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(null) // Renamed setUser to setUserState to avoid conflict
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      setIsLoading(true);
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

      if (authError) {
        console.error("Error fetching auth user:", authError);
        setUserState(null);
        setIsLoading(false);
        return;
      }

      if (authUser) {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("display_name, avatar_url, credits, role, badges, bio, university, major, graduationYear") // Added more fields based on User type
          .eq("id", authUser.id)
          .single();

        if (profileError) {
          console.error("Error fetching profile:", profileError);
          // Set user with auth data only if profile fetch fails but auth user exists
          setUserState({
            id: authUser.id,
            email: authUser.email,
          });
        } else {
          setUserState({
            id: authUser.id,
            email: authUser.email,
            display_name: profile?.display_name,
            avatar_url: profile?.avatar_url,
            credits: profile?.credits,
            role: profile?.role as User["role"], // Cast role to User["role"]
            badges: profile?.badges || [],
            bio: profile?.bio,
            university: profile?.university,
            major: profile?.major,
            graduationYear: profile?.graduationYear,
          });
        }
      } else {
        setUserState(null);
      }
      setIsLoading(false);
    };

    fetchUserAndProfile();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth event:", event);
      await fetchUserAndProfile(); // Re-fetch user and profile on auth state change
    });

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  // The setUser function from context might not be needed if auth state drives user state
  // Or it could be used for manual override if necessary, but typically not recommended.
  const setUser = (newUser: User | null) => {
    // Potentially, this could be used to manually update user state,
    // but it's generally better to rely on the auth listener.
    // For now, let's keep it as some components might expect it.
    // If direct manipulation is needed, ensure it doesn't conflict with auth state.
    setUserState(newUser);
  };


  return <UserContext.Provider value={{ user, setUser, isLoading }}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
