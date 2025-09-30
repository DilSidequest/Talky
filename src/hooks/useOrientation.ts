'use client'

import { useState, useEffect } from 'react'

export type OrientationType = 'portrait' | 'landscape'

export function useOrientation() {
  const [orientation, setOrientation] = useState<OrientationType>('portrait')

  useEffect(() => {
    if (typeof window === 'undefined') return

    const getOrientation = (): OrientationType => {
      // Try to use screen.orientation API first
      if (window.screen?.orientation) {
        return window.screen.orientation.type.includes('portrait')
          ? 'portrait'
          : 'landscape'
      }

      // Fallback to window dimensions
      return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
    }

    // Set initial orientation
    setOrientation(getOrientation())

    const handleOrientationChange = () => {
      setOrientation(getOrientation())
    }

    // Listen for orientation changes
    if (window.screen?.orientation) {
      window.screen.orientation.addEventListener('change', handleOrientationChange)
    } else {
      // Fallback to resize event
      window.addEventListener('resize', handleOrientationChange)
    }

    return () => {
      if (window.screen?.orientation) {
        window.screen.orientation.removeEventListener('change', handleOrientationChange)
      } else {
        window.removeEventListener('resize', handleOrientationChange)
      }
    }
  }, [])

  return orientation
}

// Hook to lock orientation (requires fullscreen mode)
export function useOrientationLock() {
  const lockOrientation = async (type: OrientationLockType) => {
    if (typeof window === 'undefined' || !window.screen?.orientation) {
      console.warn('Screen Orientation API not supported')
      return false
    }

    try {
      await window.screen.orientation.lock(type)
      return true
    } catch (error) {
      console.error('Failed to lock orientation:', error)
      return false
    }
  }

  const unlockOrientation = () => {
    if (typeof window === 'undefined' || !window.screen?.orientation) {
      return
    }

    try {
      window.screen.orientation.unlock()
    } catch (error) {
      console.error('Failed to unlock orientation:', error)
    }
  }

  return {
    lockOrientation,
    unlockOrientation,
  }
}

