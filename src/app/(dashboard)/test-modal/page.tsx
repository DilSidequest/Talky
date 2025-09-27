'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { NewChatModal } from '@/components/chat/new-chat-modal'
import { Contact } from '@/types/chat'

const testContacts: Contact[] = [
  {
    id: 1,
    name: 'Test User',
    language: 'EN',
    status: 'online',
    timestamp: new Date().toISOString(),
    unreadCount: 0
  }
]

export default function TestModalPage() {
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Modal Test Page</h1>
      
      <Button 
        onClick={() => {
          console.log('Test button clicked, opening modal...')
          setShowModal(true)
        }}
        className="bg-blue-500 hover:bg-blue-600 text-white"
      >
        Open Test Modal
      </Button>

      <div className="mt-4">
        <p>Modal state: {showModal ? 'OPEN' : 'CLOSED'}</p>
      </div>

      <NewChatModal
        isOpen={showModal}
        onClose={() => {
          console.log('Closing modal...')
          setShowModal(false)
        }}
        onStartChat={(contact) => {
          console.log('Starting chat with:', contact)
          setShowModal(false)
        }}
        onAddContact={(contactInfo) => {
          console.log('Adding contact:', contactInfo)
          setShowModal(false)
        }}
        existingContacts={testContacts}
      />
    </div>
  )
}
