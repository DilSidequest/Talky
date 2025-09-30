# Talky Utilities Reference

## Overview
This document provides a comprehensive reference for all utility functions and libraries available in the Talky application.

---

## Table of Contents
1. [PWA Utilities](#pwa-utilities)
2. [Performance Utilities](#performance-utilities)
3. [Mobile Animations](#mobile-animations)
4. [Web Vitals](#web-vitals)
5. [SEO Utilities](#seo-utilities)

---

## PWA Utilities

**Location:** `src/lib/pwa.ts`

### registerServiceWorker()
Registers the service worker for PWA functionality.

```typescript
registerServiceWorker(): void
```

**Usage:**
```typescript
import { registerServiceWorker } from '@/lib/pwa'

// In app initialization
useEffect(() => {
  registerServiceWorker()
}, [])
```

---

### isPWA()
Checks if the app is running as an installed PWA.

```typescript
isPWA(): boolean
```

**Usage:**
```typescript
import { isPWA } from '@/lib/pwa'

if (isPWA()) {
  console.log('Running as PWA')
}
```

---

### requestNotificationPermission()
Requests permission for push notifications.

```typescript
requestNotificationPermission(): Promise<NotificationPermission>
```

**Returns:** `'granted'`, `'denied'`, or `'default'`

**Usage:**
```typescript
import { requestNotificationPermission } from '@/lib/pwa'

const permission = await requestNotificationPermission()
if (permission === 'granted') {
  // Subscribe to notifications
}
```

---

### showNotification()
Displays a notification to the user.

```typescript
showNotification(title: string, options?: NotificationOptions): void
```

**Usage:**
```typescript
import { showNotification } from '@/lib/pwa'

showNotification('New Message', {
  body: 'You have a new message from John',
  icon: '/icons/message-icon.png',
  badge: '/icons/badge.png',
})
```

---

### subscribeToPushNotifications()
Subscribes to push notifications.

```typescript
subscribeToPushNotifications(): Promise<PushSubscription | null>
```

**Usage:**
```typescript
import { subscribeToPushNotifications } from '@/lib/pwa'

const subscription = await subscribeToPushNotifications()
if (subscription) {
  // Send subscription to server
}
```

---

### isOnline()
Checks current network status.

```typescript
isOnline(): boolean
```

---

### onOnlineStatusChange()
Listens for online/offline status changes.

```typescript
onOnlineStatusChange(callback: (isOnline: boolean) => void): () => void
```

**Returns:** Cleanup function

**Usage:**
```typescript
import { onOnlineStatusChange } from '@/lib/pwa'

useEffect(() => {
  const cleanup = onOnlineStatusChange((online) => {
    console.log('Online status:', online)
  })
  
  return cleanup
}, [])
```

---

## Performance Utilities

**Location:** `src/lib/performance.ts`

### debounce()
Debounces a function to limit execution rate.

```typescript
debounce<T>(func: T, wait: number): (...args: Parameters<T>) => void
```

**Usage:**
```typescript
import { debounce } from '@/lib/performance'

const handleSearch = debounce((query: string) => {
  // Expensive search operation
  searchAPI(query)
}, 300)
```

---

### throttle()
Throttles a function to execute at most once per interval.

```typescript
throttle<T>(func: T, limit: number): (...args: Parameters<T>) => void
```

**Usage:**
```typescript
import { throttle } from '@/lib/performance'

const handleScroll = throttle(() => {
  // Scroll handler
  updateScrollPosition()
}, 100)
```

---

### isLowEndDevice()
Detects if the device is low-end based on hardware capabilities.

```typescript
isLowEndDevice(): boolean
```

**Checks:**
- CPU cores < 4
- Device memory < 4GB
- Slow network connection (2G/3G)

**Usage:**
```typescript
import { isLowEndDevice } from '@/lib/performance'

if (isLowEndDevice()) {
  // Use lower quality assets
  videoQuality = '480p'
} else {
  videoQuality = '1080p'
}
```

---

### getOptimizedImageQuality()
Returns optimal image quality based on device capabilities.

```typescript
getOptimizedImageQuality(): number
```

**Returns:** 60 for low-end devices, 80 otherwise

---

### getOptimizedImageSize()
Calculates optimal image size based on viewport and DPR.

```typescript
getOptimizedImageSize(maxWidth: number): number
```

**Usage:**
```typescript
import { getOptimizedImageSize } from '@/lib/performance'

const imageWidth = getOptimizedImageSize(800)
// Returns optimized width considering viewport and device pixel ratio
```

---

### lazyLoadImage()
Lazy loads an image using Intersection Observer.

```typescript
lazyLoadImage(
  img: HTMLImageElement, 
  src: string, 
  options?: IntersectionObserverInit
): void
```

**Usage:**
```typescript
import { lazyLoadImage } from '@/lib/performance'

const img = document.querySelector('img')
lazyLoadImage(img, '/path/to/image.jpg', {
  rootMargin: '50px',
})
```

---

### getDeviceType()
Determines device type based on viewport width.

```typescript
getDeviceType(): 'mobile' | 'tablet' | 'desktop'
```

**Breakpoints:**
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

---

### isTouchDevice()
Checks if the device supports touch input.

```typescript
isTouchDevice(): boolean
```

---

### shouldReduceAnimations()
Determines if animations should be reduced.

```typescript
shouldReduceAnimations(): Promise<boolean>
```

**Checks:**
- User prefers reduced motion
- Low battery (< 20% and not charging)
- Low-end device

**Usage:**
```typescript
import { shouldReduceAnimations } from '@/lib/performance'

const reduceAnimations = await shouldReduceAnimations()
if (reduceAnimations) {
  // Disable or simplify animations
}
```

---

## Mobile Animations

**Location:** `src/lib/mobile-animations.ts`

### Animation Presets

All animations are optimized for mobile performance and respect user preferences.

#### pageTransition
```typescript
mobileAnimations.pageTransition
```
Smooth page navigation animation.

#### slideUp
```typescript
mobileAnimations.slideUp
```
Bottom sheet / modal animation.

#### slideInRight
```typescript
mobileAnimations.slideInRight
```
Side panel animation.

#### fade
```typescript
mobileAnimations.fade
```
Simple fade in/out.

#### scale
```typescript
mobileAnimations.scale
```
Scale animation for buttons and cards.

#### bounce
```typescript
mobileAnimations.bounce
```
Bouncy animation for notifications.

#### toastAnimation
```typescript
mobileAnimations.toastAnimation
```
Toast notification animation.

#### bottomSheet
```typescript
mobileAnimations.bottomSheet
```
Bottom sheet with spring physics.

**Usage:**
```typescript
import { motion } from 'framer-motion'
import { mobileAnimations } from '@/lib/mobile-animations'

function Modal() {
  return (
    <motion.div {...mobileAnimations.slideUp}>
      Modal content
    </motion.div>
  )
}
```

---

### Helper Functions

#### prefersReducedMotion()
```typescript
prefersReducedMotion(): boolean
```

Checks if user prefers reduced motion.

#### getAnimation()
```typescript
getAnimation(animation: any): any
```

Returns animation config respecting user preferences. Falls back to simple fade if reduced motion is preferred.

**Usage:**
```typescript
import { getAnimation, mobileAnimations } from '@/lib/mobile-animations'

const animation = getAnimation(mobileAnimations.slideUp)
// Returns simple fade if user prefers reduced motion
```

---

## Web Vitals

**Location:** `src/lib/web-vitals.ts`

### initWebVitals()
Initializes Web Vitals monitoring.

```typescript
initWebVitals(): void
```

**Tracks:**
- CLS (Cumulative Layout Shift)
- FID (First Input Delay)
- LCP (Largest Contentful Paint)
- FCP (First Contentful Paint)
- TTFB (Time to First Byte)
- INP (Interaction to Next Paint)

**Usage:**
```typescript
import { initWebVitals } from '@/lib/web-vitals'

// In app initialization
useEffect(() => {
  initWebVitals()
}, [])
```

---

### reportWebVitals()
Reports a Web Vitals metric.

```typescript
reportWebVitals(metric: WebVitalsMetric): void
```

Automatically called by `initWebVitals()`. Logs to console in development and sends to analytics in production.

---

### getNavigationTiming()
Gets navigation timing metrics.

```typescript
getNavigationTiming(): NavigationTimingMetrics | null
```

**Returns:**
```typescript
{
  dns: number
  tcp: number
  ttfb: number
  download: number
  domInteractive: number
  domComplete: number
  loadComplete: number
}
```

---

### getMemoryUsage()
Gets current memory usage (if available).

```typescript
getMemoryUsage(): MemoryUsage | null
```

**Returns:**
```typescript
{
  usedJSHeapSize: number
  totalJSHeapSize: number
  jsHeapSizeLimit: number
  usagePercentage: number
}
```

---

## SEO Utilities

**Location:** `src/lib/seo.ts`

### generateMetadata()
Generates comprehensive metadata for a page.

```typescript
generateMetadata(config: SEOConfig): Metadata
```

**Parameters:**
```typescript
interface SEOConfig {
  title: string
  description: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article' | 'profile'
  author?: string
  publishedTime?: string
  modifiedTime?: string
}
```

**Usage:**
```typescript
import { generateMetadata } from '@/lib/seo'

export const metadata = generateMetadata({
  title: 'Chat - Talky',
  description: 'Send messages with real-time translation',
  keywords: ['chat', 'translation', 'messaging'],
  url: '/chat',
})
```

---

### generateStructuredData()
Generates JSON-LD structured data.

```typescript
generateStructuredData(
  type: 'Organization' | 'WebApplication' | 'Article',
  data: any
): object
```

**Usage:**
```typescript
import { generateStructuredData } from '@/lib/seo'

const schema = generateStructuredData('WebApplication', {})

// Add to page
<script type="application/ld+json">
  {JSON.stringify(schema)}
</script>
```

---

### Pre-configured Metadata

```typescript
import { commonMetadata } from '@/lib/seo'

// Available metadata
commonMetadata.home
commonMetadata.chat
commonMetadata.call
commonMetadata.ocr
commonMetadata.aiCaller
```

---

## Best Practices

### 1. Performance
```typescript
// Use debounce for expensive operations
const handleSearch = debounce(searchFunction, 300)

// Check device capabilities
if (isLowEndDevice()) {
  // Reduce quality/features
}
```

### 2. Animations
```typescript
// Respect user preferences
const animation = getAnimation(mobileAnimations.slideUp)

// Check before animating
if (await shouldReduceAnimations()) {
  // Skip or simplify animations
}
```

### 3. PWA
```typescript
// Check PWA status
if (isPWA()) {
  // Hide install prompt
}

// Handle offline gracefully
if (!isOnline()) {
  // Show offline UI
}
```

### 4. SEO
```typescript
// Use pre-configured metadata
export const metadata = commonMetadata.chat

// Or generate custom
export const metadata = generateMetadata({
  title: 'Custom Page',
  description: 'Description',
})
```

---

## Common Patterns

### Optimized Image Loading
```typescript
import { getOptimizedImageSize, lazyLoadImage } from '@/lib/performance'

const size = getOptimizedImageSize(800)
const img = new Image()
lazyLoadImage(img, `/images/photo-${size}.jpg`)
```

### Responsive Animations
```typescript
import { getAnimation, mobileAnimations } from '@/lib/mobile-animations'

const animation = getAnimation(
  isMobile ? mobileAnimations.slideUp : mobileAnimations.fade
)
```

### Performance Monitoring
```typescript
import { initWebVitals, getNavigationTiming } from '@/lib/web-vitals'

useEffect(() => {
  initWebVitals()
  
  const timing = getNavigationTiming()
  console.log('Page load time:', timing?.loadComplete)
}, [])
```

---

## Additional Resources

- [Web Performance](https://web.dev/performance/)
- [PWA Best Practices](https://web.dev/pwa/)
- [Framer Motion](https://www.framer.com/motion/)
- [Web Vitals](https://web.dev/vitals/)

