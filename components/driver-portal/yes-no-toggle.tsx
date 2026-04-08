'use client'

import { cn } from '@/lib/utils'

interface YesNoToggleProps {
  value: boolean | null
  onChange: (value: boolean) => void
  disabled?: boolean
}

export function YesNoToggle({ value, onChange, disabled }: YesNoToggleProps) {
  return (
    <div className="flex rounded-lg overflow-hidden border">
      <button
        type="button"
        onClick={() => !disabled && onChange(true)}
        disabled={disabled}
        className={cn(
          'px-4 py-2 text-sm font-medium transition-colors',
          value === true
            ? 'bg-[#1a8a8a] text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        Yes
      </button>
      <button
        type="button"
        onClick={() => !disabled && onChange(false)}
        disabled={disabled}
        className={cn(
          'px-4 py-2 text-sm font-medium transition-colors',
          value === false
            ? 'bg-gray-600 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        No
      </button>
    </div>
  )
}
