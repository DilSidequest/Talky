'use client'

import { HeroUIProvider } from '@heroui/react'
import { useEffect } from 'react'
import { registerServiceWorker } from '@/lib/pwa'
import { initWebVitals, observePerformance } from '@/lib/web-vitals'
import { InstallPrompt } from './pwa/InstallPrompt'
import { OnlineStatusIndicator } from './pwa/OnlineStatusIndicator'

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Register service worker for PWA functionality
    registerServiceWorker()

    // Initialize Web Vitals monitoring
    initWebVitals()

    // Observe performance metrics
    observePerformance()
  }, [])

  return (
    <HeroUIProvider>
      {children}
      <InstallPrompt />
      <OnlineStatusIndicator />
    </HeroUIProvider>
  )
}
