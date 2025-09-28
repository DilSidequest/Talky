'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Button as HeroButton, 
  ScrollShadow,
  Textarea,
  Chip
} from '@heroui/react'
import {
  MessageCircle,
  Languages,
  Send,
  X,
  Settings,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { CallState, Participant } from '@/types/call'

interface ChatMessage {
  id: string
  participantId: string
  participantName: string
  text: string
  timestamp: string
  isCurrentUser: boolean
}

interface TranslationMessage {
  id: string
  participantId: string
  participantName: string
  translatedText: string
  timestamp: string
  isCurrentUser: boolean
}

interface SimpleChatBoxProps {
  callState: CallState
  chatMessages: ChatMessage[]
  translationMessages: TranslationMessage[]
  isVisible: boolean
  onToggleVisibility: () => void
  onSendMessage: (message: string) => void
  onTranslationSettingsClick?: () => void
  position?: 'bottom' | 'side'
  className?: string
}

export function SimpleChatBox({
  callState,
  chatMessages,
  translationMessages,
  isVisible,
  onToggleVisibility,
  onSendMessage,
  onTranslationSettingsClick,
  position = 'bottom',
  className
}: SimpleChatBoxProps) {
  const [mode, setMode] = useState<'chat' | 'translation'>('chat')
  const [messageText, setMessageText] = useState('')
  const [isMinimized, setIsMinimized] = useState(false)
  
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const { participants } = callState

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [chatMessages, translationMessages, mode])

  const handleSendMessage = () => {
    if (messageText.trim() && mode === 'chat') {
      onSendMessage(messageText.trim())
      setMessageText('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isVisible) return null

  const isBottomPosition = position === 'bottom'
  const currentMessages = mode === 'chat' ? chatMessages : translationMessages

  return (
    <div className={cn(
      "fixed z-40 bg-white border border-border-light shadow-xl",
      isBottomPosition 
        ? "bottom-20 sm:bottom-24 left-4 right-4 rounded-t-xl" 
        : "top-4 bottom-4 right-4 w-80 sm:w-96 rounded-xl",
      isMinimized 
        ? (isBottomPosition ? "h-14" : "h-14") 
        : (isBottomPosition ? "h-80 sm:h-96" : "h-auto"),
      className
    )}>
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between p-3 border-b border-border-light bg-gray-50">
        <div className="flex items-center gap-2">
          {/* Mode Toggle Buttons */}
          <div className="flex bg-white rounded-lg p-1 border border-gray-200">
            <HeroButton
              size="sm"
              variant={mode === 'chat' ? 'solid' : 'light'}
              color={mode === 'chat' ? 'primary' : 'default'}
              onPress={() => setMode('chat')}
              startContent={<MessageCircle className="w-3 h-3" />}
              className="text-xs font-medium"
            >
              Chat
            </HeroButton>
            <HeroButton
              size="sm"
              variant={mode === 'translation' ? 'solid' : 'light'}
              color={mode === 'translation' ? 'primary' : 'default'}
              onPress={() => setMode('translation')}
              startContent={<Languages className="w-3 h-3" />}
              className="text-xs font-medium"
            >
              Translation
            </HeroButton>
          </div>

          {/* Status */}
          {mode === 'translation' && (
            <Chip 
              size="sm" 
              color={callState.settings.translation.enabled ? "success" : "default"}
              variant="flat"
              className="text-xs"
            >
              {callState.settings.translation.enabled ? "Active" : "Inactive"}
            </Chip>
          )}
        </div>

        <div className="flex items-center gap-1">
          {mode === 'translation' && (
            <HeroButton
              isIconOnly
              size="sm"
              variant="light"
              onPress={onTranslationSettingsClick}
              className="min-w-7 w-7 h-7"
              title="Translation settings"
            >
              <Settings className="w-3 h-3" />
            </HeroButton>
          )}
          
          <HeroButton
            isIconOnly
            size="sm"
            variant="light"
            onPress={() => setIsMinimized(!isMinimized)}
            className="min-w-7 w-7 h-7"
            title={isMinimized ? "Expand" : "Minimize"}
          >
            {isMinimized ? (
              <ChevronUp className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
          </HeroButton>
          
          <HeroButton
            isIconOnly
            size="sm"
            variant="light"
            onPress={onToggleVisibility}
            className="min-w-7 w-7 h-7"
            title="Close"
          >
            <X className="w-3 h-3" />
          </HeroButton>
        </div>
      </CardHeader>

      {/* Content */}
      {!isMinimized && (
        <CardContent className="p-0 h-full flex flex-col">
          {/* Messages Area */}
          <ScrollShadow 
            ref={scrollRef}
            className="flex-1 p-3 overflow-y-auto bg-white"
            hideScrollBar
          >
            {currentMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-8">
                <div className="p-3 rounded-full bg-gray-100 mb-3">
                  {mode === 'chat' ? (
                    <MessageCircle className="w-6 h-6 text-gray-500" />
                  ) : (
                    <Languages className="w-6 h-6 text-electric-blue" />
                  )}
                </div>
                <p className="text-sm text-text-muted">
                  {mode === 'chat' 
                    ? "No messages yet. Start a conversation!" 
                    : "Translations will appear here when participants speak"
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {mode === 'chat' ? (
                  // Chat Messages
                  chatMessages.map((message) => {
                    const participant = participants.find(p => p.id === message.participantId)
                    return (
                      <div key={message.id} className="flex gap-2">
                        <Avatar className="w-6 h-6 flex-shrink-0">
                          <AvatarImage src={participant?.avatar} alt={message.participantName} />
                          <AvatarFallback className="bg-gray-200 text-xs">
                            {message.participantName.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-text-primary">
                              {message.participantName}
                            </span>
                            <span className="text-xs text-text-muted">
                              {new Date(message.timestamp).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </span>
                          </div>
                          <p className="text-sm text-text-primary leading-relaxed">
                            {message.text}
                          </p>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  // Translation Messages
                  translationMessages.map((message) => {
                    const participant = participants.find(p => p.id === message.participantId)
                    return (
                      <div key={message.id} className="border-l-3 border-electric-blue pl-3 py-2 bg-electric-blue-light/5">
                        <div className="flex items-center gap-2 mb-1">
                          <Avatar className="w-6 h-6">
                            <AvatarImage src={participant?.avatar} alt={message.participantName} />
                            <AvatarFallback className="bg-electric-blue text-white text-xs">
                              {message.participantName.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-semibold text-electric-blue">
                            {message.participantName}:
                          </span>
                          <span className="text-xs text-text-muted">
                            {new Date(message.timestamp).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                        <p className="text-base font-medium text-text-primary leading-relaxed ml-8">
                          {message.translatedText}
                        </p>
                      </div>
                    )
                  })
                )}
              </div>
            )}
          </ScrollShadow>

          {/* Input Area - Only for Chat Mode */}
          {mode === 'chat' && (
            <div className="p-3 border-t border-border-light bg-gray-50">
              <div className="flex items-end gap-2">
                <Textarea
                  ref={inputRef}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type a message..."
                  minRows={1}
                  maxRows={3}
                  className="flex-1"
                  classNames={{
                    input: "text-sm bg-white"
                  }}
                />
                <HeroButton
                  isIconOnly
                  color="primary"
                  onPress={handleSendMessage}
                  isDisabled={!messageText.trim()}
                  className="min-w-9 w-9 h-9"
                >
                  <Send className="w-4 h-4" />
                </HeroButton>
              </div>
            </div>
          )}

          {/* Translation Info - Only for Translation Mode */}
          {mode === 'translation' && (
            <div className="p-3 border-t border-border-light bg-electric-blue-light/5">
              <div className="flex items-center justify-between text-xs text-text-muted">
                <span>
                  {callState.settings.translation.enabled 
                    ? `Translating to ${callState.settings.translation.targetLanguage.toUpperCase()}`
                    : "Translation is disabled"
                  }
                </span>
                <HeroButton
                  size="sm"
                  variant="light"
                  onPress={onTranslationSettingsClick}
                  className="text-xs text-electric-blue"
                >
                  Configure
                </HeroButton>
              </div>
            </div>
          )}
        </CardContent>
      )}
    </div>
  )
}
