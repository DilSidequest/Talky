'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { 
  Languages, 
  Video, 
  Phone,
  MoreVertical,
  Archive,
  Pin,
  Trash2,
  MessageCircle,
  Bell,
  BellOff
} from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { Contact } from '@/types/chat'
import { PresenceIndicator, StatusBadge } from './contact-status'

interface SwipeableContactItemProps {
  contact: Contact
  onSelect?: (contact: Contact) => void
  showTranslations: boolean
  onArchive?: (contact: Contact) => void
  onPin?: (contact: Contact) => void
  onDelete?: (contact: Contact) => void
  onMute?: (contact: Contact) => void
  onCall?: (contact: Contact) => void
  onVideoCall?: (contact: Contact) => void
  className?: string
}

interface SwipeAction {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  bgColor: string
  action: () => void
}

export function SwipeableContactItem({
  contact,
  onSelect,
  showTranslations,
  onArchive,
  onPin,
  onDelete,
  onMute,
  onCall,
  onVideoCall,
  className
}: SwipeableContactItemProps) {
  const [swipeOffset, setSwipeOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [currentX, setCurrentX] = useState(0)
  const [showActions, setShowActions] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const maxSwipeDistance = 200

  // Define swipe actions
  const leftActions: SwipeAction[] = [
    {
      id: 'pin',
      label: contact.isPinned ? 'Unpin' : 'Pin',
      icon: Pin,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-500',
      action: () => onPin?.(contact)
    },
    {
      id: 'archive',
      label: 'Archive',
      icon: Archive,
      color: 'text-gray-600',
      bgColor: 'bg-gray-500',
      action: () => onArchive?.(contact)
    }
  ]

  const rightActions: SwipeAction[] = [
    {
      id: 'call',
      label: 'Call',
      icon: Phone,
      color: 'text-green-600',
      bgColor: 'bg-green-500',
      action: () => onCall?.(contact)
    },
    {
      id: 'video',
      label: 'Video',
      icon: Video,
      color: 'text-blue-600',
      bgColor: 'bg-blue-500',
      action: () => onVideoCall?.(contact)
    },
    {
      id: 'mute',
      label: 'Mute',
      icon: contact.unreadCount > 0 ? BellOff : Bell,
      color: 'text-orange-600',
      bgColor: 'bg-orange-500',
      action: () => onMute?.(contact)
    }
  ]

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60)
      return `${diffInMinutes}m ago`
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    setStartX(e.touches[0].clientX)
    setCurrentX(e.touches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    
    const touchX = e.touches[0].clientX
    setCurrentX(touchX)
    
    const deltaX = touchX - startX
    const clampedDelta = Math.max(-maxSwipeDistance, Math.min(maxSwipeDistance, deltaX))
    setSwipeOffset(clampedDelta)
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
    
    const threshold = 60
    const absOffset = Math.abs(swipeOffset)
    
    if (absOffset > threshold) {
      setShowActions(true)
      // Snap to action position
      setSwipeOffset(swipeOffset > 0 ? maxSwipeDistance / 2 : -maxSwipeDistance / 2)
    } else {
      // Snap back to center
      setSwipeOffset(0)
      setShowActions(false)
    }
  }

  // Mouse event handlers for desktop testing
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setStartX(e.clientX)
    setCurrentX(e.clientX)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    
    const mouseX = e.clientX
    setCurrentX(mouseX)
    
    const deltaX = mouseX - startX
    const clampedDelta = Math.max(-maxSwipeDistance, Math.min(maxSwipeDistance, deltaX))
    setSwipeOffset(clampedDelta)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    
    const threshold = 60
    const absOffset = Math.abs(swipeOffset)
    
    if (absOffset > threshold) {
      setShowActions(true)
      setSwipeOffset(swipeOffset > 0 ? maxSwipeDistance / 2 : -maxSwipeDistance / 2)
    } else {
      setSwipeOffset(0)
      setShowActions(false)
    }
  }

  // Reset swipe when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setSwipeOffset(0)
        setShowActions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const executeAction = (action: SwipeAction) => {
    action.action()
    setSwipeOffset(0)
    setShowActions(false)
  }

  return (
    <div className={cn("relative overflow-hidden w-full", className)} ref={cardRef}>
      {/* Left Actions */}
      {swipeOffset > 0 && (
        <div className="absolute left-0 top-0 h-full flex items-center">
          {leftActions.map((action, index) => (
            <Button
              key={action.id}
              variant="ghost"
              size="sm"
              onClick={() => executeAction(action)}
              className={cn(
                "h-full px-4 rounded-none transition-all duration-200",
                action.bgColor,
                "text-white hover:opacity-80"
              )}
              style={{
                opacity: Math.min(1, swipeOffset / 100),
                transform: `translateX(${Math.max(0, swipeOffset - 100)}px)`
              }}
            >
              <action.icon className="w-5 h-5" />
            </Button>
          ))}
        </div>
      )}

      {/* Right Actions */}
      {swipeOffset < 0 && (
        <div className="absolute right-0 top-0 h-full flex items-center">
          {rightActions.map((action, index) => (
            <Button
              key={action.id}
              variant="ghost"
              size="sm"
              onClick={() => executeAction(action)}
              className={cn(
                "h-full px-4 rounded-none transition-all duration-200",
                action.bgColor,
                "text-white hover:opacity-80"
              )}
              style={{
                opacity: Math.min(1, Math.abs(swipeOffset) / 100),
                transform: `translateX(${Math.min(0, swipeOffset + 100)}px)`
              }}
            >
              <action.icon className="w-5 h-5" />
            </Button>
          ))}
        </div>
      )}

      {/* Main Contact Card */}
      <div
        className="relative z-10 transition-transform duration-200 ease-out"
        style={{
          transform: `translateX(${swipeOffset}px)`,
          transition: isDragging ? 'none' : 'transform 0.2s ease-out'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Link href={`/chat/${contact.id}`}>
          <Card className="p-3 sm:p-4 hover:shadow-md transition-all duration-200 cursor-pointer hover:bg-gray-50 group w-full">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              {/* Avatar with Status */}
              <div className="relative flex-shrink-0">
                <Avatar className="w-10 h-10 sm:w-12 sm:h-12">
                  <AvatarImage src={contact.avatar} alt={contact.name} />
                  <AvatarFallback className="bg-electric-blue-light text-electric-blue font-semibold text-sm">
                    {contact.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="absolute -bottom-0.5 -right-0.5">
                  <PresenceIndicator
                    status={contact.status}
                    isTyping={contact.isTyping}
                    showPulse={contact.status === 'online'}
                    size="md"
                  />
                </div>
                
                {contact.isPinned && (
                  <div className="absolute -top-1 -left-1 w-3 h-3 bg-electric-blue rounded-full" />
                )}
              </div>
              
              {/* Contact Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-forest-green truncate">
                    {contact.name}
                  </h3>
                  <Badge variant="secondary" className="text-xs shrink-0">
                    {contact.language}
                  </Badge>
                  {contact.isTyping && (
                    <StatusBadge 
                      status={contact.status}
                      isTyping={contact.isTyping}
                      size="sm"
                    />
                  )}
                </div>
                
                {contact.lastMessage && (
                  <div className="space-y-1">
                    <p className="text-sm text-text-secondary truncate">
                      {contact.lastMessage}
                    </p>
                    {showTranslations && contact.translation && (
                      <div className="flex items-center gap-2">
                        <Languages className="w-3 h-3 text-electric-blue shrink-0" />
                        <p className="text-xs text-text-muted truncate">
                          {contact.translation}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Time and Actions */}
              <div className="flex flex-col items-end gap-2 shrink-0">
                <span className="text-xs text-text-muted">
                  {formatTimestamp(contact.timestamp)}
                </span>
                
                <div className="flex items-center gap-2">
                  {contact.unreadCount > 0 && (
                    <Badge className="bg-electric-blue text-white text-xs min-w-[20px] h-5 flex items-center justify-center">
                      {contact.unreadCount > 99 ? '99+' : contact.unreadCount}
                    </Badge>
                  )}
                  
                  {/* Desktop Quick Actions */}
                  <div className="hidden md:flex opacity-0 group-hover:opacity-100 transition-opacity items-center gap-1">
                    <Button variant="ghost" size="sm" className="p-1 h-6 w-6">
                      <Video className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="p-1 h-6 w-6">
                      <Phone className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="p-1 h-6 w-6">
                      <MoreVertical className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </Link>
      </div>

      {/* Swipe Hint (show on first render for mobile) */}
      {typeof window !== 'undefined' && window.innerWidth < 768 && !showActions && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-0 group-hover:opacity-20 transition-opacity">
          <div className="text-xs text-text-muted bg-white/80 px-2 py-1 rounded">
            Swipe for actions
          </div>
        </div>
      )}
    </div>
  )
}
