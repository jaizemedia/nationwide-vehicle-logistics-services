import type { Metadata } from 'next'
import { AuthProvider } from '@/lib/auth-context'

export const metadata: Metadata = {
  title: 'Driver Portal | Continental Vehicle Logistics',
  description: 'Driver portal for vehicle collection and delivery forms',
}

export default function DriverPortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#1a8a8a]">
        {children}
      </div>
    </AuthProvider>
  )
}
