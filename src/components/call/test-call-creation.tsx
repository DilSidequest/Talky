'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CallCreationModal } from './call-creation-modal'
import { Contact } from '@/components/chat/contacts-list'
import { MeetingRoom } from '@/types/meeting-room'

// Test component to verify call creation modal functionality
export function TestCallCreation() {
  const [showModal, setShowModal] = useState(false)
  
  const mockContacts: Contact[] = [
    {
      id: 1,
      name: 'Maria Garcia',
      lastMessage: 'Hola! ¿Cómo estás?',
      translation: 'Hello! How are you?',
      timestamp: new Date().toISOString(),
      unreadCount: 0,
      language: 'ES',
      avatar: '/avatars/maria.jpg',
      status: 'online',
      isPinned: false
    },
    {
      id: 2,
      name: 'Hiroshi Tanaka',
      lastMessage: 'こんにちは、元気ですか？',
      translation: 'Hello, how are you?',
      timestamp: new Date().toISOString(),
      unreadCount: 0,
      language: 'JA',
      avatar: '/avatars/hiroshi.jpg',
      status: 'online',
      isPinned: false
    }
  ]

  const handleCreateCall = (room: MeetingRoom) => {
    console.log('Test: Created meeting room:', room)
    alert(`Meeting room created!\nID: ${room.id}\nPassword: ${room.password}\nType: ${room.type}`)
  }

  return (
    <div className="p-4">
      <Button onClick={() => setShowModal(true)}>
        Test Call Creation Modal
      </Button>
      
      <CallCreationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onCreateCall={handleCreateCall}
        availableContacts={mockContacts}
        preSelectedContacts={[]}
        defaultCallType="video"
      />
    </div>
  )
}
