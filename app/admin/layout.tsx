'use client'

import { AuthProvider } from '@/lib/auth-context'
import { Navbar } from '@/components/navbar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-white text-black pt-16">
        <Navbar />
        {children}
      </div>
    </AuthProvider>
  )
}
