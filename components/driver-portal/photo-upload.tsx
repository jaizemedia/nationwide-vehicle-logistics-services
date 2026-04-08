'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { uploadToCloudinary } from '@/lib/cloudinary'
import { Camera, Check, Loader2, X, Image as ImageIcon } from 'lucide-react'

interface PhotoUploadProps {
  label: string
  photoKey: string
  photoUrl?: string
  confirmed: boolean | null
  onConfirmChange: (value: boolean) => void
  onPhotoUpload: (key: string, url: string) => void
  disabled?: boolean
}

export function PhotoUpload({
  label,
  photoKey,
  photoUrl,
  confirmed,
  onConfirmChange,
  onPhotoUpload,
  disabled,
}: PhotoUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setError('')

    try {
      const url = await uploadToCloudinary(file)
      onPhotoUpload(photoKey, url)
      onConfirmChange(true)
    } catch (err) {
      console.error('Upload error:', err)
      setError('Failed to upload photo. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="flex items-center justify-between py-3 border-b last:border-b-0">
      <div className="flex-1">
        <p className="text-sm text-muted-foreground">{label}</p>
        {error && <p className="text-xs text-destructive mt-1">{error}</p>}
      </div>
      
      <div className="flex items-center gap-2">
        {photoUrl && (
          <a
            href={photoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#1a8a8a] hover:underline"
          >
            <ImageIcon className="h-5 w-5" />
          </a>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled || isUploading}
        />
        
        {isUploading ? (
          <div className="px-4 py-2">
            <Loader2 className="h-5 w-5 animate-spin text-[#1a8a8a]" />
          </div>
        ) : (
          <div className="flex rounded-lg overflow-hidden border">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
              className={`px-3 py-2 text-sm font-medium transition-colors flex items-center gap-1 ${
                confirmed === true
                  ? 'bg-[#1a8a8a] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {confirmed === true ? <Check className="h-4 w-4" /> : <Camera className="h-4 w-4" />}
              Yes
            </button>
            <button
              type="button"
              onClick={() => onConfirmChange(false)}
              disabled={disabled}
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                confirmed === false
                  ? 'bg-gray-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              No
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
