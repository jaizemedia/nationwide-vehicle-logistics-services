'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Loader2 } from 'lucide-react'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !loading && !user) {
      router.push('/driver-portal')
    }
  }, [user, loading, router, mounted])

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a7a7a]">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a7a7a]">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    )
  }

  return <>{children}</>
}
