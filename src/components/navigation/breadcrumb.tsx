'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BreadcrumbItem {
  label: string
  href: string
  isCurrentPage?: boolean
}

const routeLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  chat: 'Chat',
  call: 'Call',
  ocr: 'OCR Scanner',
  'ai-caller': 'AI Caller',
  settings: 'Settings',
  profile: 'Profile',
  preferences: 'Preferences',
  new: 'New',
  history: 'History'
}

function formatSegment(segment: string): string {
  // Handle dynamic routes (IDs)
  if (segment.match(/^[a-f0-9-]{36}$/i) || segment.match(/^\d+$/)) {
    return 'Details'
  }
  
  return routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)
}

function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean)
  const breadcrumbs: BreadcrumbItem[] = []

  // Always start with Dashboard for authenticated routes, unless we're already on dashboard
  if (segments.length > 0 && !['sign-in', 'sign-up'].includes(segments[0]) && segments[0] !== 'dashboard') {
    breadcrumbs.push({
      label: 'Dashboard',
      href: '/dashboard'
    })
  }

  // Build breadcrumbs from path segments
  let currentPath = ''
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`
    const isCurrentPage = index === segments.length - 1
    
    breadcrumbs.push({
      label: formatSegment(segment),
      href: currentPath,
      isCurrentPage
    })
  })

  return breadcrumbs
}

export function Breadcrumb() {
  const pathname = usePathname()
  const breadcrumbs = generateBreadcrumbs(pathname)

  // Don't show breadcrumbs on landing page or auth pages
  if (pathname === '/' || pathname.startsWith('/sign-')) {
    return null
  }

  // Don't show if only one item (just Dashboard)
  if (breadcrumbs.length <= 1) {
    return null
  }

  return (
    <nav className="flex items-center space-x-1 text-sm text-text-muted mb-6" aria-label="Breadcrumb">
      <Home className="w-4 h-4" />
      <ol className="flex items-center space-x-1">
        {breadcrumbs.map((item, index) => (
          <li key={item.href} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="w-4 h-4 mx-1 text-text-muted" />
            )}
            {item.isCurrentPage ? (
              <span className="font-medium text-forest-green">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className={cn(
                  "hover:text-electric-blue transition-colors",
                  index === 0 ? "font-medium" : ""
                )}
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
