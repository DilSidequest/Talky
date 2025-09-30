'use client'

import { useRef, useCallback, TouchEvent } from 'react'

interface PinchZoomOptions {
  onPinchStart?: (scale: number) => void
  onPinchMove?: (scale: number) => void
  onPinchEnd?: (scale: number) => void
  minScale?: number
  maxScale?: number
}

export function usePinchZoom(options: PinchZoomOptions = {}) {
  const {
    onPinchStart,
    onPinchMove,
    onPinchEnd,
    minScale = 0.5,
    maxScale = 3,
  } = options

  const initialDistance = useRef<number>(0)
  const currentScale = useRef<number>(1)
  const isPinching = useRef<boolean>(false)

  const getDistance = (touch1: Touch, touch2: Touch): number => {
    const dx = touch1.clientX - touch2.clientX
    const dy = touch1.clientY - touch2.clientY
    return Math.sqrt(dx * dx + dy * dy)
  }

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (e.touches.length === 2) {
        isPinching.current = true
        initialDistance.current = getDistance(e.touches[0], e.touches[1])
        onPinchStart?.(currentScale.current)
      }
    },
    [onPinchStart]
  )

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (e.touches.length === 2 && isPinching.current) {
        e.preventDefault()

        const distance = getDistance(e.touches[0], e.touches[1])
        const scale = distance / initialDistance.current

        // Apply min/max constraints
        const newScale = Math.min(Math.max(scale, minScale), maxScale)
        currentScale.current = newScale

        onPinchMove?.(newScale)
      }
    },
    [onPinchMove, minScale, maxScale]
  )

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (isPinching.current && e.touches.length < 2) {
        isPinching.current = false
        onPinchEnd?.(currentScale.current)
        initialDistance.current = 0
      }
    },
    [onPinchEnd]
  )

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
    currentScale: currentScale.current,
  }
}

