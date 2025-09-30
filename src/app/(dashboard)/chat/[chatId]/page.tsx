'use client'

import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { MessageBubble, TypingIndicator } from '@/components/chat/message-bubble'
import { MessageInput } from '@/components/chat/message-input'
import { TranslationControls } from '@/components/chat/translation-controls'
import { ContactStatus } from '@/components/chat/contact-status'
import { Message, Contact } from '@/types/chat'
import {
  ArrowLeft,
  Phone,
  Video,
  MoreVertical,
  Languages
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

// Mock data for the conversation
const mockConversation: Contact = {
  id: '1',
  name: 'Maria Garcia',
  avatar: '/avatars/maria.jpg',
  language: 'ES',
  status: 'online',
  lastSeen: 'Active now',
  timestamp: new Date().toISOString(),
  unreadCount: 0
}

const mockMessages: Message[] = [
  {
    id: 1,
    senderId: 'maria',
    content: '¡Hola! ¿Cómo estás hoy?',
    translation: 'Hello! How are you today?',
    timestamp: '10:30 AM',
    isTranslated: true,
    type: 'text',
    language: 'ES',
    confidence: 0.95
  },
  {
    id: 2,
    senderId: 'me',
    content: 'Hi Maria! I\'m doing great, thanks for asking. How about you?',
    timestamp: '10:32 AM',
    isTranslated: false,
    type: 'text'
  },
  {
    id: 3,
    senderId: 'maria',
    content: 'Muy bien, gracias. ¿Te gustaría tomar un café esta tarde?',
    translation: 'Very well, thank you. Would you like to have coffee this afternoon?',
    timestamp: '10:35 AM',
    isTranslated: true,
    type: 'text',
    language: 'ES',
    confidence: 0.92
  },
  {
    id: 4,
    senderId: 'me',
    content: 'That sounds wonderful! What time works best for you?',
    timestamp: '10:36 AM',
    isTranslated: false,
    type: 'text'
  },
  {
    id: 5,
    senderId: 'maria',
    content: 'Audio message',
    timestamp: '10:38 AM',
    isTranslated: true,
    type: 'audio',
    audioUrl: '/audio/sample.mp3',
    translation: 'How about 3 PM at the coffee shop on Main Street?',
    language: 'ES',
    confidence: 0.88
  }
]

interface ChatPageProps {
  params: { chatId: string }
}

export default function ChatConversationPage({ params }: ChatPageProps) {
  const [showTranslations, setShowTranslations] = useState(true)
  const [sourceLanguage, setSourceLanguage] = useState('en')
  const [targetLanguage, setTargetLanguage] = useState('es')
  const [translationMode, setTranslationMode] = useState<'auto' | 'manual'>('auto')
  const [autoSpeak, setAutoSpeak] = useState(false)
  const [isTyping, setIsTyping] = useState(false)

  const handleSendMessage = (content: string, type: 'text' | 'audio' | 'image' | 'file' = 'text') => {
    // TODO: Implement message sending logic
    console.log('Sending message:', { content, type })
  }

  const handleSendFile = (file: File) => {
    // TODO: Implement file sending logic
    console.log('Sending file:', file.name)
  }

  const handleLanguageChange = (source: string, target: string) => {
    setSourceLanguage(source)
    setTargetLanguage(target)
  }

  const handlePlayAudio = (audioUrl: string) => {
    // TODO: Implement audio playback
    console.log('Playing audio:', audioUrl)
  }

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
    // TODO: Show toast notification
  }

  const handleTranslateAudio = (messageId: string | number) => {
    // TODO: Implement audio translation
    console.log('Translating audio message:', messageId)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto">
      {/* Chat Header */}
      <div className="relative flex items-center justify-between p-4 border-b border-border-light bg-white">
        {/* Back Button - Absolute positioned in corner */}
        <Link href="/chat" className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-10">
          <Button variant="ghost" size="sm" className="hover:bg-electric-blue-light">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>

        {/* Centered Content */}
        <div className="flex items-center justify-center space-x-3 flex-1 px-12 sm:px-16">
          <Avatar className="w-10 h-10 shrink-0">
            <AvatarImage src={mockConversation.avatar} alt={mockConversation.name} />
            <AvatarFallback>{mockConversation.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start space-x-2">
              <h2 className="font-semibold text-forest-green truncate">{mockConversation.name}</h2>
              <Badge variant="secondary" className="text-xs shrink-0">
                {mockConversation.language}
              </Badge>
            </div>
            <div className="flex items-center justify-center sm:justify-start space-x-2 mt-1">
              <ContactStatus
                status={mockConversation.status}
                isTyping={isTyping}
                lastSeen={mockConversation.lastSeen}
                showLabel={true}
                showLastSeen={true}
                size="sm"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowTranslations(!showTranslations)}
            className={showTranslations ? 'text-electric-blue' : 'text-text-muted'}
          >
            <Languages className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Phone className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Video className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {mockMessages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isOwn={msg.senderId === 'me'}
            showTranslations={showTranslations}
            onPlayAudio={handlePlayAudio}
            onCopyMessage={handleCopyMessage}
            onTranslateAudio={handleTranslateAudio}
          />
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <TypingIndicator userName={mockConversation.name} />
        )}
      </div>

      {/* Translation Controls */}
      <div className="p-4 border-t border-border-light bg-white">
        <TranslationControls
          showTranslations={showTranslations}
          onToggleTranslations={setShowTranslations}
          sourceLanguage={sourceLanguage}
          targetLanguage={targetLanguage}
          onLanguageChange={handleLanguageChange}
          translationMode={translationMode}
          onModeChange={setTranslationMode}
          autoSpeak={autoSpeak}
          onAutoSpeakChange={setAutoSpeak}
        />
      </div>

      {/* Message Input */}
      <div className="p-4 bg-white">
        <MessageInput
          onSendMessage={handleSendMessage}
          onSendFile={handleSendFile}
          targetLanguage={targetLanguage}
          autoTranslate={translationMode === 'auto'}
        />
      </div>
    </div>
  )
}
