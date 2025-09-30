// Performance optimization utilities for mobile devices

// Debounce function for expensive operations
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

// Throttle function for scroll/resize handlers
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}

// Request idle callback wrapper with fallback
export function requestIdleCallback(callback: () => void, options?: { timeout?: number }) {
  if (typeof window === 'undefined') return

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(callback, options)
  } else {
    setTimeout(callback, 1)
  }
}

// Check if device is low-end
export function isLowEndDevice(): boolean {
  if (typeof window === 'undefined') return false

  // Check for hardware concurrency (number of CPU cores)
  const cores = navigator.hardwareConcurrency || 1
  if (cores < 4) return true

  // Check for device memory (if available)
  const memory = (navigator as any).deviceMemory
  if (memory && memory < 4) return true

  // Check for connection type (if available)
  const connection = (navigator as any).connection
  if (connection) {
    const slowConnections = ['slow-2g', '2g', '3g']
    if (slowConnections.includes(connection.effectiveType)) return true
  }

  return false
}

// Optimize images based on device capabilities
export function getOptimizedImageQuality(): number {
  if (isLowEndDevice()) return 60
  return 80
}

// Get optimal image size based on viewport
export function getOptimizedImageSize(maxWidth: number): number {
  if (typeof window === 'undefined') return maxWidth

  const dpr = window.devicePixelRatio || 1
  const viewportWidth = window.innerWidth

  // Don't exceed viewport width
  const targetWidth = Math.min(maxWidth, viewportWidth)

  // Adjust for device pixel ratio, but cap at 2x for performance
  return Math.round(targetWidth * Math.min(dpr, 2))
}

// Lazy load images with Intersection Observer
export function lazyLoadImage(
  img: HTMLImageElement,
  src: string,
  options?: IntersectionObserverInit
) {
  if (typeof window === 'undefined') return

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          img.src = src
          observer.unobserve(img)
        }
      })
    }, options)

    observer.observe(img)
  } else {
    // Fallback for browsers without Intersection Observer
    img.src = src
  }
}

// Preload critical resources
export function preloadResource(href: string, as: string) {
  if (typeof document === 'undefined') return

  const link = document.createElement('link')
  link.rel = 'preload'
  link.href = href
  link.as = as
  document.head.appendChild(link)
}

// Prefetch next page
export function prefetchPage(href: string) {
  if (typeof document === 'undefined') return

  const link = document.createElement('link')
  link.rel = 'prefetch'
  link.href = href
  document.head.appendChild(link)
}

// Measure performance
export function measurePerformance(name: string, callback: () => void) {
  if (typeof window === 'undefined' || !('performance' in window)) {
    callback()
    return
  }

  const startMark = `${name}-start`
  const endMark = `${name}-end`

  performance.mark(startMark)
  callback()
  performance.mark(endMark)

  try {
    performance.measure(name, startMark, endMark)
    const measure = performance.getEntriesByName(name)[0]
    console.log(`${name}: ${measure.duration.toFixed(2)}ms`)
  } catch (error) {
    console.error('Performance measurement failed:', error)
  }
}

// Get device type
export function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop'

  const width = window.innerWidth

  if (width < 768) return 'mobile'
  if (width < 1024) return 'tablet'
  return 'desktop'
}

// Check if touch device
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false

  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    (navigator as any).msMaxTouchPoints > 0
  )
}

// Optimize video playback
export function getOptimizedVideoSettings() {
  const isLowEnd = isLowEndDevice()

  return {
    quality: isLowEnd ? '480p' : '720p',
    fps: isLowEnd ? 24 : 30,
    bitrate: isLowEnd ? 500000 : 1500000, // bits per second
  }
}

// Battery status (if available)
export async function getBatteryStatus() {
  if (typeof navigator === 'undefined' || !('getBattery' in navigator)) {
    return null
  }

  try {
    const battery = await (navigator as any).getBattery()
    return {
      level: battery.level,
      charging: battery.charging,
      chargingTime: battery.chargingTime,
      dischargingTime: battery.dischargingTime,
    }
  } catch (error) {
    return null
  }
}

// Reduce animations on low battery
export async function shouldReduceAnimations(): Promise<boolean> {
  // Check for reduced motion preference
  if (typeof window !== 'undefined') {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return true
    }
  }

  // Check battery level
  const battery = await getBatteryStatus()
  if (battery && !battery.charging && battery.level < 0.2) {
    return true
  }

  // Check if low-end device
  if (isLowEndDevice()) {
    return true
  }

  return false
}

// Virtual scrolling helper
export function calculateVisibleRange(
  scrollTop: number,
  containerHeight: number,
  itemHeight: number,
  totalItems: number,
  overscan: number = 3
) {
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  const endIndex = Math.min(
    totalItems - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  )

  return { startIndex, endIndex }
}

