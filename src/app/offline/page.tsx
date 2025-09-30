'use client'

import { Button } from '@/components/ui/button'
import { Logo } from '@/components/ui/logo'
import { WifiOff, RefreshCw } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function OfflinePage() {
  const router = useRouter()

  const handleRetry = () => {
    if (navigator.onLine) {
      router.refresh()
    } else {
      alert('Still offline. Please check your internet connection.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-electric-blue-light flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <Logo size="xl" />
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="w-20 h-20 bg-electric-blue-light rounded-full flex items-center justify-center mx-auto mb-6">
            <WifiOff className="w-10 h-10 text-electric-blue" />
          </div>

          <h1 className="text-2xl font-bold text-forest-green mb-4">
            You're Offline
          </h1>

          <p className="text-text-secondary mb-6">
            It looks like you've lost your internet connection. Some features may not be available until you're back online.
          </p>

          <Button
            onClick={handleRetry}
            className="w-full bg-electric-blue hover:bg-electric-blue-hover interactive-element"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-semibold text-forest-green mb-3">
            What you can do offline:
          </h2>
          <ul className="text-sm text-text-secondary space-y-2 text-left">
            <li className="flex items-start">
              <span className="text-electric-blue mr-2">•</span>
              <span>View previously loaded chats and messages</span>
            </li>
            <li className="flex items-start">
              <span className="text-electric-blue mr-2">•</span>
              <span>Access your profile and settings</span>
            </li>
            <li className="flex items-start">
              <span className="text-electric-blue mr-2">•</span>
              <span>Browse cached content</span>
            </li>
          </ul>
        </div>

        <p className="text-xs text-text-muted mt-6">
          Your messages will be sent automatically when you're back online
        </p>
      </div>
    </div>
  )
}

