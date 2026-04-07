'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Home, ChevronLeft, ChevronRight, X, Check } from 'lucide-react'

interface FormNavigationProps {
  currentStep: number
  totalSteps: number
  onPrevious: () => void
  onNext: () => void
  onCancel: () => void
  onSubmit?: () => void
  isSubmitting?: boolean
  canGoNext?: boolean
  jobId: string
}

export function FormNavigation({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onCancel,
  onSubmit,
  isSubmitting,
  canGoNext = true,
  jobId,
}: FormNavigationProps) {
  const router = useRouter()
  const isFirstStep = currentStep === 1
  const isLastStep = currentStep === totalSteps

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#1a8a8a] p-4">
      <div className="flex items-center justify-between max-w-lg mx-auto">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(`/driver-portal/job/${jobId}`)}
          className="bg-white/10 hover:bg-white/20 text-white rounded-xl"
        >
          <Home className="h-5 w-5" />
        </Button>

        <div className="flex gap-2">
          {isFirstStep ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={onCancel}
              className="bg-[#4a9a9a] hover:bg-[#5aaaaa] text-white rounded-xl"
            >
              <X className="h-5 w-5" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={onPrevious}
              className="bg-[#4a9a9a] hover:bg-[#5aaaaa] text-white rounded-xl"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}

          {isLastStep ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={onSubmit}
              disabled={isSubmitting || !canGoNext}
              className="bg-[#4a9a9a] hover:bg-[#5aaaaa] text-white rounded-xl disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="animate-spin">...</span>
              ) : (
                <Check className="h-5 w-5" />
              )}
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={onNext}
              disabled={!canGoNext}
              className="bg-[#4a9a9a] hover:bg-[#5aaaaa] text-white rounded-xl disabled:opacity-50"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
