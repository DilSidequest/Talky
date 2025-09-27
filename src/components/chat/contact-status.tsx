'use client'

import { Badge } from '@/components/ui/badge'
import { 
  Circle, 
  Mic, 
  Clock, 
  Wifi, 
  WifiOff,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react'
import { cn } from '@/lib/utils'

export type ContactStatus = 'online' | 'offline' | 'away' | 'busy' | 'invisible'
export type DeviceType = 'mobile' | 'desktop' | 'tablet' | 'web'

interface ContactStatusProps {
  status: ContactStatus
  isTyping?: boolean
  lastSeen?: string
  deviceType?: DeviceType
  showLabel?: boolean
  showLastSeen?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const statusConfig = {
  online: {
    color: 'bg-green-500',
    textColor: 'text-green-600',
    label: 'Online',
    description: 'Active now'
  },
  offline: {
    color: 'bg-gray-400',
    textColor: 'text-gray-600',
    label: 'Offline',
    description: 'Last seen'
  },
  away: {
    color: 'bg-yellow-500',
    textColor: 'text-yellow-600',
    label: 'Away',
    description: 'Away'
  },
  busy: {
    color: 'bg-red-500',
    textColor: 'text-red-600',
    label: 'Busy',
    description: 'Do not disturb'
  },
  invisible: {
    color: 'bg-gray-300',
    textColor: 'text-gray-500',
    label: 'Invisible',
    description: 'Appears offline'
  }
}

const sizeConfig = {
  sm: {
    dot: 'w-2 h-2',
    text: 'text-xs',
    icon: 'w-3 h-3'
  },
  md: {
    dot: 'w-3 h-3',
    text: 'text-sm',
    icon: 'w-4 h-4'
  },
  lg: {
    dot: 'w-4 h-4',
    text: 'text-base',
    icon: 'w-5 h-5'
  }
}

const deviceIcons = {
  mobile: Smartphone,
  desktop: Monitor,
  tablet: Tablet,
  web: Wifi
}

export function ContactStatus({
  status,
  isTyping = false,
  lastSeen,
  deviceType,
  showLabel = false,
  showLastSeen = false,
  size = 'md',
  className
}: ContactStatusProps) {
  const config = statusConfig[status]
  const sizeStyles = sizeConfig[size]
  const DeviceIcon = deviceType ? deviceIcons[deviceType] : null

  const formatLastSeen = (lastSeenTime: string) => {
    const date = new Date(lastSeenTime)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    
    return date.toLocaleDateString()
  }

  if (isTyping) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div className="flex items-center gap-1 text-electric-blue">
          <Mic className={cn(sizeStyles.icon, "animate-pulse")} />
          {showLabel && (
            <span className={cn(sizeStyles.text, "font-medium")}>
              typing...
            </span>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Status Indicator */}
      <div className="relative flex items-center">
        <div 
          className={cn(
            "rounded-full border-2 border-white",
            config.color,
            sizeStyles.dot
          )}
          title={`${config.label}${lastSeen && status === 'offline' ? ` - ${formatLastSeen(lastSeen)}` : ''}`}
        />
        
        {/* Device Type Indicator */}
        {DeviceIcon && status === 'online' && (
          <DeviceIcon 
            className={cn(
              "absolute -bottom-0.5 -right-0.5 bg-white rounded-full p-0.5",
              sizeStyles.icon,
              config.textColor
            )}
          />
        )}
      </div>

      {/* Status Label and Last Seen */}
      {(showLabel || showLastSeen) && (
        <div className="flex flex-col">
          {showLabel && (
            <span className={cn(sizeStyles.text, "font-medium", config.textColor)}>
              {config.label}
            </span>
          )}
          
          {showLastSeen && lastSeen && status === 'offline' && (
            <span className={cn(sizeStyles.text, "text-text-muted")}>
              {formatLastSeen(lastSeen)}
            </span>
          )}
          
          {showLastSeen && status === 'online' && (
            <span className={cn(sizeStyles.text, "text-text-muted")}>
              {config.description}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

interface StatusBadgeProps {
  status: ContactStatus
  isTyping?: boolean
  size?: 'sm' | 'md'
  className?: string
}

export function StatusBadge({ 
  status, 
  isTyping = false, 
  size = 'sm',
  className 
}: StatusBadgeProps) {
  const config = statusConfig[status]
  
  if (isTyping) {
    return (
      <Badge 
        variant="secondary" 
        className={cn(
          "bg-electric-blue-light text-electric-blue border-electric-blue/20",
          size === 'sm' ? 'text-xs px-1.5 py-0.5' : 'text-sm px-2 py-1',
          className
        )}
      >
        <Mic className="w-3 h-3 mr-1 animate-pulse" />
        typing
      </Badge>
    )
  }

  return (
    <Badge 
      variant="secondary"
      className={cn(
        "border",
        size === 'sm' ? 'text-xs px-1.5 py-0.5' : 'text-sm px-2 py-1',
        className
      )}
      style={{
        backgroundColor: `${config.color.replace('bg-', '')}10`,
        borderColor: `${config.color.replace('bg-', '')}30`,
        color: config.textColor.replace('text-', '')
      }}
    >
      <Circle className={cn("mr-1 fill-current", size === 'sm' ? 'w-2 h-2' : 'w-3 h-3')} />
      {config.label}
    </Badge>
  )
}

interface PresenceIndicatorProps {
  status: ContactStatus
  isTyping?: boolean
  showPulse?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function PresenceIndicator({
  status,
  isTyping = false,
  showPulse = false,
  size = 'md',
  className
}: PresenceIndicatorProps) {
  const config = statusConfig[status]
  const sizeStyles = sizeConfig[size]

  if (isTyping) {
    return (
      <div className={cn("relative", className)}>
        <div className={cn(
          "rounded-full bg-electric-blue animate-pulse",
          sizeStyles.dot
        )} />
        <div className={cn(
          "absolute inset-0 rounded-full bg-electric-blue animate-ping opacity-75",
          sizeStyles.dot
        )} />
      </div>
    )
  }

  return (
    <div className={cn("relative", className)}>
      <div className={cn(
        "rounded-full border-2 border-white",
        config.color,
        sizeStyles.dot,
        showPulse && status === 'online' && "animate-pulse"
      )} />
      
      {showPulse && status === 'online' && (
        <div className={cn(
          "absolute inset-0 rounded-full animate-ping opacity-75",
          config.color,
          sizeStyles.dot
        )} />
      )}
    </div>
  )
}

// Hook for real-time status updates (placeholder for future implementation)
export function useContactPresence(contactId: string) {
  // TODO: Implement real-time presence updates
  // This would connect to WebSocket or Server-Sent Events
  // to get real-time status updates
  
  return {
    status: 'online' as ContactStatus,
    isTyping: false,
    lastSeen: new Date().toISOString(),
    deviceType: 'web' as DeviceType
  }
}
