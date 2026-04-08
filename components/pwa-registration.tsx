"use client"

import { useEffect } from 'react'

export function PWARegistration() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      return
    }

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service worker registered:', registration.scope)
        })
        .catch((error) => {
          console.error('Service worker registration failed:', error)
        })
    }
  }, [])

  return null
}
