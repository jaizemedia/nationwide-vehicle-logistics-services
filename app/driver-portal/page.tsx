'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Truck, Loader2 } from 'lucide-react'

export default function DriverPortalLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState('login')
  const { signIn, signUp, user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Redirect if already logged in
  useEffect(() => {
    if (mounted && !loading && user) {
      router.push('/driver-portal/lookup')
    }
  }, [mounted, loading, user, router])

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await signIn(email, password)
      router.push('/driver-portal/lookup')
    } catch (err) {
      setError('Invalid email or password. Please try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setIsLoading(true)

    try {
      await signUp(email, password, displayName)
      router.push('/driver-portal/lookup')
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes('email-already-in-use')) {
        setError('An account with this email already exists.')
      } else {
        setError('Failed to create account. Please try again.')
      }
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setDisplayName('')
    setError('')
  }

  if (!mounted || loading || user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a7a7a]">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-[#1a8a8a] rounded-full flex items-center justify-center">
            <Truck className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-[#1a8a8a]">
            Driver Portal
          </CardTitle>
          <p className="text-muted-foreground">
            Continental Vehicle Logistics Services
          </p>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); resetForm() }}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="driver@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                {error && (
                  <p className="text-sm text-destructive text-center">{error}</p>
                )}
                <Button
                  type="submit"
                  className="w-full bg-[#1a8a8a] hover:bg-[#157070] text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="John Smith"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="driver@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-confirm">Confirm Password</Label>
                  <Input
                    id="signup-confirm"
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                {error && (
                  <p className="text-sm text-destructive text-center">{error}</p>
                )}
                <Button
                  type="submit"
                  className="w-full bg-[#1a8a8a] hover:bg-[#157070] text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
