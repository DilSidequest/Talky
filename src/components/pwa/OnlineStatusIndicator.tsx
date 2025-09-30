'use client'

import { useOnlineStatus } from '@/hooks/useOnlineStatus'
import { WifiOff, Wifi } from 'lucide-react'
import { useEffect, useState } from 'react'

export function OnlineStatusIndicator() {
  const isOnline = useOnlineStatus()
  const [showIndicator, setShowIndicator] = useState(false)
  const [justWentOnline, setJustWentOnline] = useState(false)

  useEffect(() => {
    if (!isOnline) {
      // Show offline indicator immediately
      setShowIndicator(true)
      setJustWentOnline(false)
    } else if (showIndicator) {
      // User just came back online
      setJustWentOnline(true)
      // Hide the indicator after 3 seconds
      const timer = setTimeout(() => {
        setShowIndicator(false)
        setJustWentOnline(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isOnline, showIndicator])

  if (!showIndicator) {
    return null
  }

  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full shadow-lg flex items-center gap-2 transition-all duration-300 ${
        isOnline
          ? 'bg-success text-white'
          : 'bg-error text-white'
      }`}
    >
      {isOnline ? (
        <>
          <Wifi className="w-4 h-4" />
          <span className="text-sm font-medium">Back Online</span>
        </>
      ) : (
        <>
          <WifiOff className="w-4 h-4" />
          <span className="text-sm font-medium">You're Offline</span>
        </>
      )}
    </div>
  )
}

