'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Search,
  Plus,
  Languages,
  MessageCircle,
  Video,
  Phone,
  MoreVertical,
  UserPlus,
  Filter,
  SortAsc,
  Clock,
  CheckCircle2,
  Circle,
  Mic
} from 'lucide-react'
import { useState, useMemo } from 'react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { ContactStatus, PresenceIndicator, StatusBadge } from './contact-status'
import { NewChatModal } from './new-chat-modal'
import { SwipeableContactItem } from './swipeable-contact-item'

export interface Contact {
  id: string | number
  name: string
  lastMessage?: string
  translation?: string
  timestamp: string
  unreadCount: number
  language: string
  avatar?: string
  status: 'online' | 'offline' | 'away' | 'busy'
  isTyping?: boolean
  lastSeen?: string
  isPinned?: boolean
}

interface ContactsListProps {
  contacts: Contact[]
  onContactSelect?: (contact: Contact) => void
  onNewChat?: () => void
  onNewContact?: () => void
  onArchiveContact?: (contact: Contact) => void
  onPinContact?: (contact: Contact) => void
  onDeleteContact?: (contact: Contact) => void
  onMuteContact?: (contact: Contact) => void
  onCallContact?: (contact: Contact) => void
  onVideoCallContact?: (contact: Contact) => void
  searchPlaceholder?: string
  showTranslations?: boolean
  className?: string
}



export function ContactsList({
  contacts,
  onContactSelect,
  onNewChat,
  onNewContact,
  onArchiveContact,
  onPinContact,
  onDeleteContact,
  onMuteContact,
  onCallContact,
  onVideoCallContact,
  searchPlaceholder = "Search conversations...",
  showTranslations = true,
  className
}: ContactsListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'recent' | 'name' | 'unread'>('recent')
  const [filterStatus, setFilterStatus] = useState<'all' | 'online' | 'unread'>('all')
  const [showFilters, setShowFilters] = useState(false)
  const [showNewChatModal, setShowNewChatModal] = useState(false)

  // Filter and sort contacts
  const filteredAndSortedContacts = useMemo(() => {
    let filtered = contacts.filter(contact => {
      const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           contact.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesFilter = filterStatus === 'all' || 
                           (filterStatus === 'online' && contact.status === 'online') ||
                           (filterStatus === 'unread' && contact.unreadCount > 0)
      
      return matchesSearch && matchesFilter
    })

    // Sort contacts
    filtered.sort((a, b) => {
      // Always show pinned contacts first
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'unread':
          return b.unreadCount - a.unreadCount
        case 'recent':
        default:
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      }
    })

    return filtered
  }, [contacts, searchQuery, sortBy, filterStatus])

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

  return (
    <div className={cn("space-y-4 w-full overflow-x-hidden", className)}>
      {/* Header */}
      <div className="flex items-center justify-between gap-2 min-w-0">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-forest-green truncate">Conversations</h1>
          <p className="text-text-muted text-sm mt-1 truncate">
            {filteredAndSortedContacts.length} conversation{filteredAndSortedContacts.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={onNewContact}
            className="hidden sm:flex whitespace-nowrap"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add Contact
          </Button>
          <Button
            onClick={() => {
              console.log('Opening new chat modal...')
              setShowNewChatModal(true)
            }}
            className="bg-electric-blue hover:bg-electric-blue-hover whitespace-nowrap"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">New Chat</span>
            <span className="sm:hidden">New</span>
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-3 w-full">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted w-4 h-4 z-10" />
          <Input
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-12 w-full"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 p-2 z-10"
          >
            <Filter className="w-4 h-4" />
          </Button>
        </div>

        {/* Filter Controls */}
        {showFilters && (
          <div className="flex flex-col sm:flex-row gap-3 p-3 bg-gray-50 rounded-lg w-full overflow-x-hidden">
            <div className="flex flex-wrap items-center gap-2 min-w-0">
              <span className="text-sm font-medium text-text-secondary flex-shrink-0">Sort:</span>
              <div className="flex gap-1 flex-wrap">
                <Button
                  variant={sortBy === 'recent' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSortBy('recent')}
                  className="text-xs whitespace-nowrap"
                >
                  <Clock className="w-3 h-3 mr-1" />
                  Recent
                </Button>
                <Button
                  variant={sortBy === 'name' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSortBy('name')}
                  className="text-xs whitespace-nowrap"
                >
                  <SortAsc className="w-3 h-3 mr-1" />
                  Name
                </Button>
                <Button
                  variant={sortBy === 'unread' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSortBy('unread')}
                  className="text-xs whitespace-nowrap"
                >
                  <MessageCircle className="w-3 h-3 mr-1" />
                  Unread
                </Button>
              </div>
            </div>

            <div className="hidden sm:block h-4 w-px bg-border-light" />

            <div className="flex flex-wrap items-center gap-2 min-w-0">
              <span className="text-sm font-medium text-text-secondary flex-shrink-0">Filter:</span>
              <div className="flex gap-1 flex-wrap">
                <Button
                  variant={filterStatus === 'all' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setFilterStatus('all')}
                  className="text-xs whitespace-nowrap"
                >
                  All
                </Button>
                <Button
                  variant={filterStatus === 'online' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setFilterStatus('online')}
                  className="text-xs whitespace-nowrap"
                >
                  <Circle className="w-3 h-3 mr-1 fill-green-500 text-green-500" />
                  Online
                </Button>
                <Button
                  variant={filterStatus === 'unread' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setFilterStatus('unread')}
                  className="text-xs whitespace-nowrap"
                >
                  Unread
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Contacts List */}
      <div className="space-y-2">
        {filteredAndSortedContacts.map((contact) => (
          <SwipeableContactItem
            key={contact.id}
            contact={contact}
            onSelect={onContactSelect}
            showTranslations={showTranslations}
            onArchive={onArchiveContact}
            onPin={onPinContact}
            onDelete={onDeleteContact}
            onMute={onMuteContact}
            onCall={onCallContact}
            onVideoCall={onVideoCallContact}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredAndSortedContacts.length === 0 && (
        <div className="text-center py-12">
          {searchQuery ? (
            <>
              <Search className="w-16 h-16 text-text-muted mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-forest-green mb-2">
                No conversations found
              </h3>
              <p className="text-text-muted mb-6">
                Try adjusting your search or filters
              </p>
              <Button 
                variant="outline"
                onClick={() => {
                  setSearchQuery('')
                  setFilterStatus('all')
                }}
              >
                Clear Search
              </Button>
            </>
          ) : (
            <>
              <MessageCircle className="w-16 h-16 text-text-muted mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-forest-green mb-2">
                No conversations yet
              </h3>
              <p className="text-text-muted mb-6">
                Start chatting with friends and colleagues
              </p>
              <div className="flex items-center justify-center gap-3">
                <Button
                  onClick={() => setShowNewChatModal(true)}
                  className="bg-electric-blue hover:bg-electric-blue-hover"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Start Chatting
                </Button>
                <Button variant="outline" onClick={() => setShowNewChatModal(true)}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Contact
                </Button>
              </div>
            </>
          )}
        </div>
      )}

      {/* New Chat Modal */}
      <NewChatModal
        isOpen={showNewChatModal}
        onClose={() => setShowNewChatModal(false)}
        onStartChat={(contact) => {
          if (onContactSelect) {
            onContactSelect(contact)
          }
          setShowNewChatModal(false)
        }}
        onAddContact={(contactInfo) => {
          if (onNewContact) {
            onNewContact()
          }
          console.log('Adding new contact:', contactInfo)
          setShowNewChatModal(false)
        }}
        existingContacts={contacts}
      />
    </div>
  )
}


