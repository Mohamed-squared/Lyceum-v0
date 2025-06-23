"use client"

import { useEffect, useState } from "react" // useState for Google error
import { useFormState, useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, Lock, User, ArrowLeft, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Logo } from "@/components/ui/logo"
import { signInWithEmail, signUpWithEmail, signInWithGoogle } from "@/lib/auth-actions"

// Component for Submit Button to use useFormStatus
function SubmitButton({ children, pendingText }: { children: React.ReactNode; pendingText: string }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? pendingText : children}
    </Button>
  )
}

// Component for Google Sign In Button to handle its own pending state if needed
function GoogleSignInButton() {
  const [isGooglePending, setIsGooglePending] = useState(false)
  const [googleError, setGoogleError] = useState<string | null>(null)

  const handleGoogleSignIn = async () => {
    setIsGooglePending(true)
    setGoogleError(null)
    try {
      // signInWithGoogle is a server action that redirects.
      // It might return an error object if redirect isn't possible or an error occurs before redirect.
      const result = await signInWithGoogle()
      if (result?.error) {
        setGoogleError(result.error)
      }
    } catch (error) {
      setGoogleError(error instanceof Error ? error.message : "Google sign in failed")
    } finally {
      setIsGooglePending(false)
    }
  }

  return (
    <>
      {googleError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{googleError}</AlertDescription>
        </Alert>
      )}
      <Button variant="outline" className="w-full mt-4" onClick={handleGoogleSignIn} disabled={isGooglePending}>
        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        {isGooglePending ? "Connecting..." : "Continue with Google"}
      </Button>
    </>
  )
}


export default function AuthPage() {
  // For Sign In form
  const [signInState, signInAction] = useFormState(signInWithEmail, undefined)

  // For Sign Up form
  const [signUpState, signUpAction] = useFormState(signUpWithEmail, undefined)

  // General error display (could be from either form or Google sign-in)
  const [currentError, setCurrentError] = useState<string | null>(null);

  useEffect(() => {
    if (signInState?.error) {
      setCurrentError(signInState.error);
    } else if (signUpState?.error) {
      setCurrentError(signUpState.error);
    } else {
      setCurrentError(null);
    }
  }, [signInState, signUpState]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center justify-center mb-4">
            <Logo size="lg" />
          </div>
          <p className="text-muted-foreground">Join the future of learning</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome</CardTitle>
            <CardDescription>Sign in to your account or create a new one</CardDescription>
          </CardHeader>
          <CardContent>
            {currentError && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{currentError}</AlertDescription>
              </Alert>
            )}

            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <form action={signInAction} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Enter your password"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="text-right">
                    <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:text-blue-700">
                      Forgot your password?
                    </Link>
                  </div>
                  <SubmitButton pendingText="Signing in...">Sign In</SubmitButton>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form action={signUpAction} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Enter your full name"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-password"
                        name="password"
                        type="password"
                        placeholder="Create a password"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <SubmitButton pendingText="Creating account...">Create Account</SubmitButton>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>
              <GoogleSignInButton />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
