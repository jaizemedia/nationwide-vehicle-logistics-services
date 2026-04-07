'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { ChevronLeft, LogOut, Truck } from 'lucide-react'
import type { Job } from '@/lib/types'

interface PortalHeaderProps {
  title?: string
  showBack?: boolean
  backHref?: string
  job?: Job | null
}

export function PortalHeader({ title, showBack, backHref, job }: PortalHeaderProps) {
  const { signOut } = useAuth()
  const router = useRouter()

  const handleBack = () => {
    if (backHref) {
      router.push(backHref)
    } else {
      router.back()
    }
  }

  const handleLogout = async () => {
    await signOut()
    router.push('/driver-portal')
  }

  return (
    <header className="bg-black text-white border-b border-white/10">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          {showBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="text-white hover:bg-white/10"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          )}
          <span className="text-lg font-medium">{title || 'Driver Portal'}</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          className="text-white hover:bg-white/10"
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>

      {/* Vehicle info bar (if job is provided) */}
      {job && (
        <div className="px-4 pb-4 space-y-1">
          <div className="flex items-center gap-3">
            <Truck className="h-8 w-8 text-white/80" />
            <span className="px-3 py-1 bg-white text-black font-bold rounded text-sm">
              {job.vehicleRegistration}
            </span>
            <div className="text-sm">
              <div className="text-white/80">Order:</div>
              <div className="font-mono">{job.jobReference}</div>
            </div>
          </div>
          <div className="text-white font-medium">
            {job.vehicleMake} {job.vehicleModel} {job.vehicleColor}
          </div>
          <div className="text-white/90 text-sm">
            Required Delivery Date: {job.requiredDeliveryDate}
          </div>
        </div>
      )}
    </header>
  )
}
