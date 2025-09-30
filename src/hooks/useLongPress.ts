'use client'

import { useRef, useCallback, MouseEvent, TouchEvent } from 'react'

interface LongPressOptions {
  onLongPress: () => void
  onClick?: () => void
  delay?: number
  shouldPreventDefault?: boolean
}

export function useLongPress(options: LongPressOptions) {
  const {
    onLongPress,
    onClick,
    delay = 500,
    shouldPreventDefault = true,
  } = options

  const timeout = useRef<NodeJS.Timeout>()
  const target = useRef<EventTarget>()

  const start = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (shouldPreventDefault && event.target) {
        event.target.addEventListener('touchend', preventDefault, {
          passive: false,
        })
        target.current = event.target
      }

      timeout.current = setTimeout(() => {
        onLongPress()
      }, delay)
    },
    [onLongPress, delay, shouldPreventDefault]
  )

  const clear = useCallback(
    (event: MouseEvent | TouchEvent, shouldTriggerClick = true) => {
      if (timeout.current) {
        clearTimeout(timeout.current)
      }

      if (shouldTriggerClick && onClick) {
        onClick()
      }

      if (shouldPreventDefault && target.current) {
        target.current.removeEventListener('touchend', preventDefault)
      }
    },
    [onClick, shouldPreventDefault]
  )

  return {
    onMouseDown: (e: MouseEvent) => start(e),
    onTouchStart: (e: TouchEvent) => start(e),
    onMouseUp: (e: MouseEvent) => clear(e),
    onMouseLeave: (e: MouseEvent) => clear(e, false),
    onTouchEnd: (e: TouchEvent) => clear(e),
  }
}

const preventDefault = (event: Event) => {
  if (!isTouchEvent(event)) return

  if (event.touches.length < 2 && event.preventDefault) {
    event.preventDefault()
  }
}

const isTouchEvent = (event: Event): event is TouchEvent => {
  return 'touches' in event
}

