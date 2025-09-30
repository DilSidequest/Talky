// Web Vitals monitoring for performance tracking

export interface WebVitalsMetric {
  id: string
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  delta: number
  navigationType: string
}

// Thresholds for Web Vitals (in milliseconds or score)
const THRESHOLDS = {
  CLS: { good: 0.1, poor: 0.25 },
  FID: { good: 100, poor: 300 },
  LCP: { good: 2500, poor: 4000 },
  FCP: { good: 1800, poor: 3000 },
  TTFB: { good: 800, poor: 1800 },
  INP: { good: 200, poor: 500 },
}

function getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[name as keyof typeof THRESHOLDS]
  if (!threshold) return 'good'

  if (value <= threshold.good) return 'good'
  if (value <= threshold.poor) return 'needs-improvement'
  return 'poor'
}

export function reportWebVitals(metric: WebVitalsMetric) {
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vitals] ${metric.name}:`, {
      value: metric.value,
      rating: metric.rating,
      id: metric.id,
    })
  }

  // Send to analytics in production
  if (process.env.NODE_ENV === 'production') {
    // Send to your analytics service
    // Example: Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', metric.name, {
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        event_category: 'Web Vitals',
        event_label: metric.id,
        non_interaction: true,
      })
    }

    // Example: Custom analytics endpoint
    fetch('/api/analytics/web-vitals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(metric),
      keepalive: true,
    }).catch((error) => {
      console.error('Failed to send web vitals:', error)
    })
  }
}

// Initialize Web Vitals monitoring
export function initWebVitals() {
  if (typeof window === 'undefined') return

  // Dynamically import web-vitals library
  import('web-vitals').then(({ onCLS, onFID, onLCP, onFCP, onTTFB, onINP }) => {
    onCLS((metric) => {
      reportWebVitals({
        ...metric,
        rating: getRating('CLS', metric.value),
      })
    })

    onFID((metric) => {
      reportWebVitals({
        ...metric,
        rating: getRating('FID', metric.value),
      })
    })

    onLCP((metric) => {
      reportWebVitals({
        ...metric,
        rating: getRating('LCP', metric.value),
      })
    })

    onFCP((metric) => {
      reportWebVitals({
        ...metric,
        rating: getRating('FCP', metric.value),
      })
    })

    onTTFB((metric) => {
      reportWebVitals({
        ...metric,
        rating: getRating('TTFB', metric.value),
      })
    })

    onINP((metric) => {
      reportWebVitals({
        ...metric,
        rating: getRating('INP', metric.value),
      })
    })
  })
}

// Performance observer for custom metrics
export function observePerformance() {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
    return
  }

  // Observe long tasks
  try {
    const longTaskObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 50) {
          console.warn('Long task detected:', {
            duration: entry.duration,
            startTime: entry.startTime,
          })
        }
      }
    })
    longTaskObserver.observe({ entryTypes: ['longtask'] })
  } catch (error) {
    // Long task API not supported
  }

  // Observe layout shifts
  try {
    const layoutShiftObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if ((entry as any).hadRecentInput) continue
        console.log('Layout shift:', {
          value: (entry as any).value,
          sources: (entry as any).sources,
        })
      }
    })
    layoutShiftObserver.observe({ entryTypes: ['layout-shift'] })
  } catch (error) {
    // Layout shift API not supported
  }
}

// Get navigation timing
export function getNavigationTiming() {
  if (typeof window === 'undefined' || !window.performance) {
    return null
  }

  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
  if (!navigation) return null

  return {
    dns: navigation.domainLookupEnd - navigation.domainLookupStart,
    tcp: navigation.connectEnd - navigation.connectStart,
    ttfb: navigation.responseStart - navigation.requestStart,
    download: navigation.responseEnd - navigation.responseStart,
    domInteractive: navigation.domInteractive - navigation.fetchStart,
    domComplete: navigation.domComplete - navigation.fetchStart,
    loadComplete: navigation.loadEventEnd - navigation.fetchStart,
  }
}

// Get resource timing
export function getResourceTiming() {
  if (typeof window === 'undefined' || !window.performance) {
    return []
  }

  const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
  
  return resources.map((resource) => ({
    name: resource.name,
    type: resource.initiatorType,
    duration: resource.duration,
    size: resource.transferSize,
    cached: resource.transferSize === 0,
  }))
}

// Monitor memory usage (if available)
export function getMemoryUsage() {
  if (typeof window === 'undefined') return null

  const memory = (performance as any).memory
  if (!memory) return null

  return {
    usedJSHeapSize: memory.usedJSHeapSize,
    totalJSHeapSize: memory.totalJSHeapSize,
    jsHeapSizeLimit: memory.jsHeapSizeLimit,
    usagePercentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100,
  }
}

// Export performance data
export function exportPerformanceData() {
  return {
    navigation: getNavigationTiming(),
    resources: getResourceTiming(),
    memory: getMemoryUsage(),
    vitals: {
      // These would be collected over time
    },
  }
}

