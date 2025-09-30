'use client'

import { useState, useEffect } from 'react'
import { isOnline, onOnlineStatusChange } from '@/lib/pwa'

export function useOnlineStatus() {
  const [online, setOnline] = useState(true)

  useEffect(() => {
    // Set initial status
    setOnline(isOnline())

    // Listen for changes
    const cleanup = onOnlineStatusChange((status) => {
      setOnline(status)
    })

    return cleanup
  }, [])

  return online
}

