'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Plus, 
  X, 
  MessageCircle, 
  UserPlus,
  Mail,
  Phone,
  Globe,
  Check,
  ArrowRight
} from 'lucide-react'
import { useState, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { Contact } from '@/types/chat'
import { ContactStatus } from './contact-status'
import { useRouter } from 'next/navigation'

interface NewChatModalProps {
  isOpen: boolean
  onClose: () => void
  onStartChat: (contact: Contact) => void
  onAddContact: (contactInfo: NewContactInfo) => void
  existingContacts: Contact[]
  className?: string
}

interface NewContactInfo {
  name: string
  email?: string
  phone?: string
  language: string
}

const suggestedContacts: Contact[] = [
  {
    id: 'suggested-1',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    language: 'EN',
    status: 'online',
    timestamp: new Date().toISOString(),
    unreadCount: 0,
    avatar: '/avatars/sarah.jpg'
  },
  {
    id: 'suggested-2', 
    name: 'Carlos Rodriguez',
    email: 'carlos.r@example.com',
    language: 'ES',
    status: 'offline',
    timestamp: new Date().toISOString(),
    unreadCount: 0,
    avatar: '/avatars/carlos.jpg'
  }
]

const languages = [
  { code: 'EN', name: 'English', flag: '🇺🇸' },
  { code: 'ES', name: 'Spanish', flag: '🇪🇸' },
  { code: 'FR', name: 'French', flag: '🇫🇷' },
  { code: 'DE', name: 'German', flag: '🇩🇪' },
  { code: 'IT', name: 'Italian', flag: '🇮🇹' },
  { code: 'PT', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'RU', name: 'Russian', flag: '🇷🇺' },
  { code: 'JA', name: 'Japanese', flag: '🇯🇵' },
  { code: 'KO', name: 'Korean', flag: '🇰🇷' },
  { code: 'ZH', name: 'Chinese', flag: '🇨🇳' }
]

export function NewChatModal({
  isOpen,
  onClose,
  onStartChat,
  onAddContact,
  existingContacts,
  className
}: NewChatModalProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'existing' | 'new'>('existing')
  const [searchQuery, setSearchQuery] = useState('')
  const [newContactInfo, setNewContactInfo] = useState<NewContactInfo>({
    name: '',
    email: '',
    phone: '',
    language: 'EN'
  })
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([])

  // Filter existing contacts based on search
  const filteredContacts = useMemo(() => {
    const query = searchQuery.toLowerCase()
    return existingContacts.filter(contact =>
      contact.name.toLowerCase().includes(query) ||
      contact.email?.toLowerCase().includes(query)
    )
  }, [existingContacts, searchQuery])

  // Filter suggested contacts (exclude existing ones)
  const filteredSuggested = useMemo(() => {
    const existingIds = new Set(existingContacts.map(c => c.id))
    return suggestedContacts.filter(contact => 
      !existingIds.has(contact.id) &&
      contact.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [existingContacts, searchQuery])

  const handleContactSelect = (contact: Contact) => {
    if (selectedContacts.find(c => c.id === contact.id)) {
      setSelectedContacts(prev => prev.filter(c => c.id !== contact.id))
    } else {
      setSelectedContacts(prev => [...prev, contact])
    }
  }

  const handleStartChat = () => {
    if (selectedContacts.length === 1) {
      const contact = selectedContacts[0]
      onStartChat(contact)
      // Navigate to the chat page
      router.push(`/chat/${contact.id}`)
    } else if (selectedContacts.length > 1) {
      // TODO: Handle group chat creation
      console.log('Creating group chat with:', selectedContacts)
      // For now, just navigate to the first contact
      const contact = selectedContacts[0]
      router.push(`/chat/${contact.id}`)
    }
    onClose()
  }

  const handleAddContact = () => {
    if (newContactInfo.name.trim()) {
      onAddContact(newContactInfo)
      setNewContactInfo({ name: '', email: '', phone: '', language: 'EN' })
      onClose()
    }
  }

  const resetModal = () => {
    setActiveTab('existing')
    setSearchQuery('')
    setSelectedContacts([])
    setNewContactInfo({ name: '', email: '', phone: '', language: 'EN' })
  }

  const handleClose = () => {
    resetModal()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          console.log('Backdrop clicked, closing modal')
          handleClose()
        }
      }}
    >
      <div className={cn(
        "bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden",
        className
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border-light">
          <h2 className="text-xl font-semibold text-forest-green">
            {activeTab === 'existing' ? 'Start New Chat' : 'Add New Contact'}
          </h2>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-border-light">
          <button
            onClick={() => setActiveTab('existing')}
            className={cn(
              "flex-1 px-6 py-3 text-sm font-medium transition-colors",
              activeTab === 'existing'
                ? "text-electric-blue border-b-2 border-electric-blue bg-electric-blue-light/20"
                : "text-text-secondary hover:text-forest-green"
            )}
          >
            <MessageCircle className="w-4 h-4 mr-2 inline" />
            Existing Contacts
          </button>
          <button
            onClick={() => setActiveTab('new')}
            className={cn(
              "flex-1 px-6 py-3 text-sm font-medium transition-colors",
              activeTab === 'new'
                ? "text-electric-blue border-b-2 border-electric-blue bg-electric-blue-light/20"
                : "text-text-secondary hover:text-forest-green"
            )}
          >
            <UserPlus className="w-4 h-4 mr-2 inline" />
            Add New Contact
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[50vh]">
          {activeTab === 'existing' ? (
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted w-4 h-4" />
                <Input
                  placeholder="Search contacts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Selected Contacts */}
              {selectedContacts.length > 0 && (
                <div className="p-3 bg-electric-blue-light/20 rounded-lg">
                  <p className="text-sm font-medium text-electric-blue mb-2">
                    Selected ({selectedContacts.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedContacts.map(contact => (
                      <Badge
                        key={contact.id}
                        variant="secondary"
                        className="bg-electric-blue text-white cursor-pointer"
                        onClick={() => handleContactSelect(contact)}
                      >
                        {contact.name}
                        <X className="w-3 h-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Existing Contacts */}
              {filteredContacts.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-text-secondary">Your Contacts</h3>
                    <p className="text-xs text-text-muted">Click to select • Hover for quick chat</p>
                  </div>
                  {filteredContacts.map(contact => (
                    <ContactItem
                      key={contact.id}
                      contact={contact}
                      isSelected={selectedContacts.some(c => c.id === contact.id)}
                      onSelect={() => handleContactSelect(contact)}
                      onQuickStart={(contact) => {
                        onStartChat(contact)
                        router.push(`/chat/${contact.id}`)
                        onClose()
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Suggested Contacts */}
              {filteredSuggested.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-text-secondary">Suggested</h3>
                  {filteredSuggested.map(contact => (
                    <ContactItem
                      key={contact.id}
                      contact={contact}
                      isSelected={selectedContacts.some(c => c.id === contact.id)}
                      onSelect={() => handleContactSelect(contact)}
                      onQuickStart={(contact) => {
                        onStartChat(contact)
                        router.push(`/chat/${contact.id}`)
                        onClose()
                      }}
                      isSuggested={true}
                    />
                  ))}
                </div>
              )}

              {/* Empty State */}
              {filteredContacts.length === 0 && filteredSuggested.length === 0 && (
                <div className="text-center py-8">
                  <Search className="w-12 h-12 text-text-muted mx-auto mb-3" />
                  <p className="text-text-muted">
                    {searchQuery ? 'No contacts found' : 'No contacts available'}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Add New Contact Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-forest-green mb-2">
                    Name *
                  </label>
                  <Input
                    placeholder="Enter contact name"
                    value={newContactInfo.name}
                    onChange={(e) => setNewContactInfo(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-forest-green mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted w-4 h-4" />
                    <Input
                      type="email"
                      placeholder="contact@example.com"
                      value={newContactInfo.email}
                      onChange={(e) => setNewContactInfo(prev => ({ ...prev, email: e.target.value }))}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-forest-green mb-2">
                    Phone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted w-4 h-4" />
                    <Input
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={newContactInfo.phone}
                      onChange={(e) => setNewContactInfo(prev => ({ ...prev, phone: e.target.value }))}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-forest-green mb-2">
                    Primary Language
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted w-4 h-4" />
                    <select
                      value={newContactInfo.language}
                      onChange={(e) => setNewContactInfo(prev => ({ ...prev, language: e.target.value }))}
                      className="w-full pl-10 pr-4 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-electric-blue"
                    >
                      {languages.map(lang => (
                        <option key={lang.code} value={lang.code}>
                          {lang.flag} {lang.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border-light bg-gray-50">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          
          {activeTab === 'existing' ? (
            <Button
              onClick={handleStartChat}
              disabled={selectedContacts.length === 0}
              className="bg-electric-blue hover:bg-electric-blue-hover"
            >
              Start Chat
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleAddContact}
              disabled={!newContactInfo.name.trim()}
              className="bg-electric-blue hover:bg-electric-blue-hover"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Add Contact
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

interface ContactItemProps {
  contact: Contact
  isSelected: boolean
  onSelect: () => void
  onQuickStart?: (contact: Contact) => void
  isSuggested?: boolean
}

function ContactItem({ contact, isSelected, onSelect, onQuickStart, isSuggested = false }: ContactItemProps) {
  return (
    <Card
      className={cn(
        "p-3 cursor-pointer transition-all duration-200 hover:shadow-md group",
        isSelected ? "ring-2 ring-electric-blue bg-electric-blue-light/20" : "hover:bg-gray-50"
      )}
      onClick={onSelect}
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar className="w-10 h-10">
            <AvatarImage src={contact.avatar} alt={contact.name} />
            <AvatarFallback className="bg-electric-blue-light text-electric-blue text-sm">
              {contact.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-0.5 -right-0.5">
            <ContactStatus
              status={contact.status}
              size="sm"
            />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-forest-green truncate">
              {contact.name}
            </h4>
            <Badge variant="secondary" className="text-xs">
              {contact.language}
            </Badge>
            {isSuggested && (
              <Badge variant="outline" className="text-xs text-electric-blue border-electric-blue">
                Suggested
              </Badge>
            )}
          </div>
          {contact.email && (
            <p className="text-xs text-text-muted truncate">{contact.email}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isSelected && (
            <div className="text-electric-blue">
              <Check className="w-5 h-5" />
            </div>
          )}

          {/* Quick Start Button */}
          {onQuickStart && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onQuickStart(contact)
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-electric-blue hover:bg-electric-blue-light"
            >
              <MessageCircle className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}
