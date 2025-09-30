# Talky Hooks Reference

## Overview
This document provides a comprehensive reference for all custom React hooks available in the Talky application.

---

## Touch & Gesture Hooks

### useSwipeGesture
Detects swipe gestures in all four directions.

**Location:** `src/hooks/useSwipeGesture.ts`

**Parameters:**
```typescript
interface SwipeGestureOptions {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  minSwipeDistance?: number  // Default: 50px
  maxSwipeTime?: number      // Default: 300ms
}
```

**Returns:**
```typescript
{
  onTouchStart: (e: TouchEvent) => void
  onTouchMove: (e: TouchEvent) => void
  onTouchEnd: () => void
}
```

**Example:**
```typescript
function ChatList() {
  const swipeHandlers = useSwipeGesture({
    onSwipeLeft: () => archiveChat(),
    onSwipeRight: () => deleteChat(),
    minSwipeDistance: 100,
  })

  return (
    <div {...swipeHandlers}>
      Chat content
    </div>
  )
}
```

---

### useLongPress
Detects long press gestures with optional click handling.

**Location:** `src/hooks/useLongPress.ts`

**Parameters:**
```typescript
interface LongPressOptions {
  onLongPress: () => void
  onClick?: () => void
  delay?: number                    // Default: 500ms
  shouldPreventDefault?: boolean    // Default: true
}
```

**Returns:**
```typescript
{
  onMouseDown: (e: MouseEvent) => void
  onTouchStart: (e: TouchEvent) => void
  onMouseUp: (e: MouseEvent) => void
  onMouseLeave: (e: MouseEvent) => void
  onTouchEnd: (e: TouchEvent) => void
}
```

**Example:**
```typescript
function MessageBubble() {
  const longPressHandlers = useLongPress({
    onLongPress: () => showContextMenu(),
    onClick: () => selectMessage(),
    delay: 700,
  })

  return (
    <div {...longPressHandlers}>
      Message content
    </div>
  )
}
```

---

### usePinchZoom
Handles pinch-to-zoom gestures for images and videos.

**Location:** `src/hooks/usePinchZoom.ts`

**Parameters:**
```typescript
interface PinchZoomOptions {
  onPinchStart?: (scale: number) => void
  onPinchMove?: (scale: number) => void
  onPinchEnd?: (scale: number) => void
  minScale?: number    // Default: 0.5
  maxScale?: number    // Default: 3
}
```

**Returns:**
```typescript
{
  onTouchStart: (e: TouchEvent) => void
  onTouchMove: (e: TouchEvent) => void
  onTouchEnd: (e: TouchEvent) => void
  currentScale: number
}
```

**Example:**
```typescript
function ImageViewer({ src }: { src: string }) {
  const [scale, setScale] = useState(1)
  
  const pinchHandlers = usePinchZoom({
    onPinchMove: (newScale) => setScale(newScale),
    minScale: 1,
    maxScale: 5,
  })

  return (
    <div {...pinchHandlers}>
      <img 
        src={src} 
        style={{ transform: `scale(${scale})` }}
      />
    </div>
  )
}
```

---

## Mobile Device Hooks

### useMobileKeyboard
Detects mobile keyboard state and height.

**Location:** `src/hooks/useMobileKeyboard.ts`

**Returns:**
```typescript
{
  isOpen: boolean
  height: number
}
```

**Example:**
```typescript
function ChatInput() {
  const { isOpen, height } = useMobileKeyboard()

  return (
    <div 
      className="fixed bottom-0"
      style={{ 
        marginBottom: isOpen ? height : 0,
        transition: 'margin-bottom 0.3s'
      }}
    >
      <input type="text" placeholder="Type a message..." />
    </div>
  )
}
```

---

### useScrollIntoViewOnKeyboard
Automatically scrolls element into view when keyboard opens.

**Location:** `src/hooks/useMobileKeyboard.ts`

**Parameters:**
```typescript
elementRef: React.RefObject<HTMLElement>
```

**Example:**
```typescript
function MessageInput() {
  const inputRef = useRef<HTMLInputElement>(null)
  useScrollIntoViewOnKeyboard(inputRef)

  return (
    <input 
      ref={inputRef}
      type="text"
      placeholder="Type a message..."
    />
  )
}
```

---

### useOrientation
Detects current device orientation.

**Location:** `src/hooks/useOrientation.ts`

**Returns:**
```typescript
'portrait' | 'landscape'
```

**Example:**
```typescript
function VideoCall() {
  const orientation = useOrientation()

  return (
    <div className={`video-container ${orientation}`}>
      {orientation === 'landscape' ? (
        <LandscapeLayout />
      ) : (
        <PortraitLayout />
      )}
    </div>
  )
}
```

---

### useOrientationLock
Locks device orientation (requires fullscreen mode).

**Location:** `src/hooks/useOrientation.ts`

**Returns:**
```typescript
{
  lockOrientation: (type: OrientationLockType) => Promise<boolean>
  unlockOrientation: () => void
}
```

**Example:**
```typescript
function VideoPlayer() {
  const { lockOrientation, unlockOrientation } = useOrientationLock()

  const enterFullscreen = async () => {
    await document.documentElement.requestFullscreen()
    await lockOrientation('landscape')
  }

  const exitFullscreen = () => {
    unlockOrientation()
    document.exitFullscreen()
  }

  return (
    <div>
      <button onClick={enterFullscreen}>Fullscreen</button>
      <button onClick={exitFullscreen}>Exit</button>
    </div>
  )
}
```

---

## Network & PWA Hooks

### useOnlineStatus
Monitors online/offline status.

**Location:** `src/hooks/useOnlineStatus.ts`

**Returns:**
```typescript
boolean  // true if online, false if offline
```

**Example:**
```typescript
function ChatInterface() {
  const isOnline = useOnlineStatus()

  return (
    <div>
      {!isOnline && (
        <div className="offline-banner">
          You're offline. Messages will be sent when you reconnect.
        </div>
      )}
      <ChatMessages />
    </div>
  )
}
```

---

## Media Hooks

### useMediaStream
Manages media stream for video/audio calls.

**Location:** `src/hooks/useMediaStream.ts`

**Parameters:**
```typescript
constraints?: MediaStreamConstraints
```

**Returns:**
```typescript
{
  stream: MediaStream | null
  error: Error | null
  isLoading: boolean
  startStream: () => Promise<void>
  stopStream: () => void
}
```

**Example:**
```typescript
function VideoCall() {
  const { stream, error, startStream, stopStream } = useMediaStream({
    video: true,
    audio: true,
  })

  useEffect(() => {
    startStream()
    return () => stopStream()
  }, [])

  if (error) return <div>Error: {error.message}</div>

  return (
    <video 
      ref={(video) => {
        if (video && stream) {
          video.srcObject = stream
        }
      }}
      autoPlay
      muted
    />
  )
}
```

---

## Best Practices

### 1. Cleanup
Always clean up event listeners and subscriptions:

```typescript
useEffect(() => {
  const cleanup = onOnlineStatusChange((status) => {
    setOnline(status)
  })
  
  return cleanup  // Important!
}, [])
```

### 2. Conditional Usage
Check for browser support before using advanced features:

```typescript
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  // Use service worker features
}
```

### 3. Performance
Use debounce/throttle for expensive operations:

```typescript
import { debounce } from '@/lib/performance'

const handleScroll = debounce(() => {
  // Expensive scroll handler
}, 100)
```

### 4. Error Handling
Always handle errors gracefully:

```typescript
const { stream, error } = useMediaStream()

if (error) {
  return <ErrorMessage error={error} />
}
```

### 5. TypeScript
Use proper types for better IDE support:

```typescript
const swipeHandlers = useSwipeGesture({
  onSwipeLeft: () => void,  // Type-safe callbacks
  minSwipeDistance: 100,    // Type-safe options
})
```

---

## Common Patterns

### Combining Hooks
```typescript
function ChatMessage() {
  const swipeHandlers = useSwipeGesture({
    onSwipeLeft: () => archiveMessage(),
  })
  
  const longPressHandlers = useLongPress({
    onLongPress: () => showOptions(),
  })

  return (
    <div {...swipeHandlers} {...longPressHandlers}>
      Message content
    </div>
  )
}
```

### Conditional Hook Usage
```typescript
function ResponsiveComponent() {
  const isMobile = useMediaQuery('(max-width: 768px)')
  
  const swipeHandlers = isMobile 
    ? useSwipeGesture({ onSwipeLeft: handleSwipe })
    : {}

  return <div {...swipeHandlers}>Content</div>
}
```

### Custom Hook Composition
```typescript
function useChat() {
  const isOnline = useOnlineStatus()
  const { isOpen: keyboardOpen } = useMobileKeyboard()
  
  return {
    isOnline,
    keyboardOpen,
    canSendMessage: isOnline && !keyboardOpen,
  }
}
```

---

## Troubleshooting

### Touch Events Not Working
- Ensure `touch-action: none` is not set on parent elements
- Check if event.preventDefault() is being called inappropriately
- Verify touch events are supported: `'ontouchstart' in window`

### Keyboard Detection Issues
- iOS Safari may not trigger resize events reliably
- Use `visualViewport` API when available
- Test on actual devices, not just browser DevTools

### Orientation Lock Fails
- Orientation lock requires fullscreen mode
- Not all browsers support orientation lock
- Check for `screen.orientation` API support

---

## Additional Resources

- [MDN Touch Events](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events)
- [MDN Screen Orientation API](https://developer.mozilla.org/en-US/docs/Web/API/Screen_Orientation_API)
- [React Hooks Documentation](https://react.dev/reference/react)

