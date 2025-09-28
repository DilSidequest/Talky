'use client'

import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { ContactsList, type Contact } from '@/components/chat/contacts-list'
import { CallSelectionInterface } from '@/components/call/call-selection-interface'
import { CallCreationModal } from '@/components/call/call-creation-modal'
import { MessageCircle, Video, Phone, Plus } from 'lucide-react'
import { useState } from 'react'
import { MeetingRoom } from '@/types/meeting-room'

// Mock data for demonstration - enhanced with new Contact interface
const mockContacts: Contact[] = [
  {
    id: 1,
    name: 'Maria Garcia',
    lastMessage: 'Hola! ¿Cómo estás?',
    translation: 'Hello! How are you?',
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 minutes ago
    unreadCount: 2,
    language: 'ES',
    avatar: '/avatars/maria.jpg',
    status: 'online',
    isPinned: true
  },
  {
    id: 2,
    name: 'Hiroshi Tanaka',
    lastMessage: 'こんにちは、元気ですか？',
    translation: 'Hello, how are you?',
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 1 hour ago
    unreadCount: 0,
    language: 'JA',
    avatar: '/avatars/hiroshi.jpg',
    status: 'away',
    lastSeen: '30 minutes ago'
  },
  {
    id: 3,
    name: 'Pierre Dubois',
    lastMessage: 'Bonjour, comment allez-vous?',
    translation: 'Hello, how are you?',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
    unreadCount: 1,
    language: 'FR',
    avatar: '/avatars/pierre.jpg',
    status: 'offline',
    lastSeen: '2 hours ago'
  },
  {
    id: 4,
    name: 'Anna Schmidt',
    lastMessage: 'Wie geht es dir heute?',
    translation: 'How are you today?',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    unreadCount: 0,
    language: 'DE',
    avatar: '/avatars/anna.jpg',
    status: 'busy',
    isTyping: false
  },
  {
    id: 5,
    name: 'Chen Wei',
    lastMessage: '你好吗？',
    translation: 'How are you?',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    unreadCount: 3,
    language: 'ZH',
    avatar: '/avatars/chen.jpg',
    status: 'online',
    isTyping: true
  }
]

export default function ChatPage() {
  const [showTranslations, setShowTranslations] = useState(true)
  const [showCallModal, setShowCallModal] = useState(false)
  const [preSelectedContacts, setPreSelectedContacts] = useState<Contact[]>([])
  const [defaultCallType, setDefaultCallType] = useState<'video' | 'audio'>('video')

  const handleContactSelect = (contact: Contact) => {
    console.log('Selected contact:', contact)
    // Navigation is handled by the Link in ContactItem
  }

  const handleNewChat = () => {
    console.log('Starting new chat...')
    // TODO: Implement new chat creation flow
  }

  const handleNewContact = () => {
    console.log('Adding new contact...')
    // TODO: Implement new contact creation flow
  }

  const handleArchiveContact = (contact: Contact) => {
    console.log('Archiving contact:', contact.name)
    // TODO: Implement contact archiving
  }

  const handlePinContact = (contact: Contact) => {
    console.log('Toggling pin for contact:', contact.name)
    // TODO: Implement contact pinning
  }

  const handleDeleteContact = (contact: Contact) => {
    console.log('Deleting contact:', contact.name)
    // TODO: Implement contact deletion
  }

  const handleMuteContact = (contact: Contact) => {
    console.log('Toggling mute for contact:', contact.name)
    // TODO: Implement contact muting
  }

  const handleCallContact = (contact: Contact) => {
    console.log('Calling contact:', contact.name)
    setPreSelectedContacts([contact])
    setDefaultCallType('audio')
    setShowCallModal(true)
  }

  const handleVideoCallContact = (contact: Contact) => {
    console.log('Video calling contact:', contact.name)
    setPreSelectedContacts([contact])
    setDefaultCallType('video')
    setShowCallModal(true)
  }

  const handleCreateCall = (room: MeetingRoom) => {
    console.log('Created meeting room:', room)
    // Navigate to the call page
    window.location.href = `/call/${room.id}?type=${room.type}&password=${room.password}`
  }

  return (
    <div className="w-full max-w-none md:max-w-6xl md:mx-auto overflow-hidden">
      {/* Chat/Call Toggle */}
      <Tabs defaultValue="chat" className="w-full mb-4 md:mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            Chat
          </TabsTrigger>
          <TabsTrigger value="call" className="flex items-center gap-2">
            <Video className="w-4 h-4" />
            Call
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-6">
          <ContactsList
            contacts={mockContacts}
            onContactSelect={handleContactSelect}
            onNewChat={handleNewChat}
            onNewContact={handleNewContact}
            onArchiveContact={handleArchiveContact}
            onPinContact={handlePinContact}
            onDeleteContact={handleDeleteContact}
            onMuteContact={handleMuteContact}
            onCallContact={handleCallContact}
            onVideoCallContact={handleVideoCallContact}
            showTranslations={showTranslations}
          />
        </TabsContent>

        <TabsContent value="call" className="space-y-6">
          {/* Call Selection Interface */}
          <CallSelectionInterface />
        </TabsContent>
      </Tabs>

      {/* Call Creation Modal */}
      <CallCreationModal
        isOpen={showCallModal}
        onClose={() => {
          setShowCallModal(false)
          setPreSelectedContacts([])
        }}
        onCreateCall={handleCreateCall}
        availableContacts={mockContacts}
        preSelectedContacts={preSelectedContacts}
        defaultCallType={defaultCallType}
      />
    </div>
  )
}
