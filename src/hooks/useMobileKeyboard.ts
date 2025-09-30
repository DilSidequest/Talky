'use client'

import { useEffect, useState } from 'react'

interface MobileKeyboardState {
  isOpen: boolean
  height: number
}

export function useMobileKeyboard() {
  const [keyboardState, setKeyboardState] = useState<MobileKeyboardState>({
    isOpen: false,
    height: 0,
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const initialHeight = window.visualViewport?.height || window.innerHeight

    const handleResize = () => {
      const currentHeight = window.visualViewport?.height || window.innerHeight
      const heightDifference = initialHeight - currentHeight

      // Keyboard is considered open if viewport height decreased by more than 150px
      const isKeyboardOpen = heightDifference > 150

      setKeyboardState({
        isOpen: isKeyboardOpen,
        height: isKeyboardOpen ? heightDifference : 0,
      })
    }

    // Listen to visualViewport resize for better keyboard detection
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize)
    } else {
      window.addEventListener('resize', handleResize)
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize)
      } else {
        window.removeEventListener('resize', handleResize)
      }
    }
  }, [])

  return keyboardState
}

// Hook to scroll element into view when keyboard opens
export function useScrollIntoViewOnKeyboard(elementRef: React.RefObject<HTMLElement>) {
  const { isOpen } = useMobileKeyboard()

  useEffect(() => {
    if (isOpen && elementRef.current) {
      // Small delay to ensure keyboard is fully open
      setTimeout(() => {
        elementRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
      }, 300)
    }
  }, [isOpen, elementRef])
}

