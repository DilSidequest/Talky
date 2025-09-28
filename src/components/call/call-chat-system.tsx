'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Chip,
  Button as HeroButton,
  ScrollShadow,
  Textarea,
  Divider
} from '@heroui/react'
import {
  MessageCircle,
  Languages,
  Send,
  Smile,
  Paperclip,
  Volume2,
  VolumeX,
  Copy,
  Reply,
  MoreVertical,
  X,
  ChevronDown,
  ChevronUp,
  Settings,
  Users,
  Zap
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
  type: 'text' | 'emoji' | 'file'
  replyTo?: string
  edited?: boolean
  reactions?: { emoji: string; count: number; users: string[] }[]
}

interface TranslationMessage {
  id: string
  participantId: string
  participantName: string
  originalText: string
  translatedText: string
  sourceLanguage: string
  targetLanguage: string
  timestamp: string
  confidence: number
  isCurrentUser: boolean
}

interface CallChatSystemProps {
  callState: CallState
  chatMessages: ChatMessage[]
  translationMessages: TranslationMessage[]
  isVisible: boolean
  onToggleVisibility: () => void
  onSendMessage: (message: string) => void
  onSendReaction: (messageId: string, emoji: string) => void
  onTranslationSettingsClick?: () => void
  className?: string
}

function ChatMessageBubble({ 
  message, 
  participant,
  onReply,
  onReact,
  onCopy
}: { 
  message: ChatMessage
  participant?: Participant
  onReply: (messageId: string) => void
  onReact: (messageId: string, emoji: string) => void
  onCopy: (text: string) => void
}) {
  const [showActions, setShowActions] = useState(false)

  return (
    <div 
      className={cn(
        "flex gap-2 sm:gap-3 mb-3 group",
        message.isCurrentUser ? "flex-row-reverse" : "flex-row"
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        <Avatar className="w-8 h-8">
          <AvatarImage src={participant?.avatar} alt={message.participantName} />
          <AvatarFallback className="bg-electric-blue text-white text-xs">
            {message.participantName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Message Content */}
      <div className={cn(
        "flex-1 max-w-[75%]",
        message.isCurrentUser ? "items-end" : "items-start"
      )}>
        {/* Header */}
        <div className={cn(
          "flex items-center gap-2 mb-1",
          message.isCurrentUser ? "flex-row-reverse" : "flex-row"
        )}>
          <span className="text-xs font-medium text-text-primary">
            {message.participantName}
          </span>
          <span className="text-xs text-text-muted">
            {new Date(message.timestamp).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
          {message.edited && (
            <span className="text-xs text-text-muted">(edited)</span>
          )}
        </div>

        {/* Message Bubble */}
        <div className={cn(
          "relative p-3 rounded-2xl shadow-sm",
          message.isCurrentUser 
            ? "bg-electric-blue text-white rounded-br-md" 
            : "bg-white border border-border-light rounded-bl-md"
        )}>
          <p className={cn(
            "text-sm leading-relaxed",
            message.isCurrentUser ? "text-white" : "text-text-primary"
          )}>
            {message.text}
          </p>

          {/* Reactions */}
          {message.reactions && message.reactions.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {message.reactions.map((reaction, index) => (
                <Chip
                  key={index}
                  size="sm"
                  variant="bordered"
                  className="text-xs cursor-pointer hover:bg-gray-100"
                  onClick={() => onReact(message.id, reaction.emoji)}
                >
                  {reaction.emoji} {reaction.count}
                </Chip>
              ))}
            </div>
          )}

          {/* Quick Actions */}
          {showActions && (
            <div className={cn(
              "absolute -top-8 flex items-center gap-1 bg-white border border-border-light rounded-lg shadow-lg p-1",
              message.isCurrentUser ? "right-0" : "left-0"
            )}>
              <HeroButton
                isIconOnly
                size="sm"
                variant="light"
                onPress={() => onReact(message.id, '👍')}
                className="min-w-6 w-6 h-6"
              >
                👍
              </HeroButton>
              <HeroButton
                isIconOnly
                size="sm"
                variant="light"
                onPress={() => onReact(message.id, '❤️')}
                className="min-w-6 w-6 h-6"
              >
                ❤️
              </HeroButton>
              <HeroButton
                isIconOnly
                size="sm"
                variant="light"
                onPress={() => onReply(message.id)}
                className="min-w-6 w-6 h-6"
              >
                <Reply className="w-3 h-3" />
              </HeroButton>
              <HeroButton
                isIconOnly
                size="sm"
                variant="light"
                onPress={() => onCopy(message.text)}
                className="min-w-6 w-6 h-6"
              >
                <Copy className="w-3 h-3" />
              </HeroButton>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function TranslationMessageBubble({
  message,
  participant
}: {
  message: TranslationMessage
  participant?: Participant
}) {
  const [showOriginal, setShowOriginal] = useState(false)

  return (
    <div className="mb-4 sm:mb-5">
      {/* Header - Simplified */}
      <div className="flex items-center gap-2 mb-2">
        <Avatar className="w-7 h-7 sm:w-8 sm:h-8">
          <AvatarImage src={participant?.avatar} alt={message.participantName} />
          <AvatarFallback className="bg-electric-blue text-white text-xs">
            {message.participantName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium text-text-primary">
          {message.participantName}
        </span>
        <Chip
          size="sm"
          color="primary"
          variant="flat"
          className="text-xs"
        >
          AI Translation
        </Chip>
        <span className="text-xs text-text-muted ml-auto">
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </span>
      </div>

      {/* Translation Content - Optimized for readability */}
      <div className="bg-gradient-to-r from-electric-blue-light/10 to-electric-blue-light/5 border border-electric-blue/20 rounded-xl p-4 sm:p-5">
        {/* Language Direction */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Chip
              size="sm"
              variant="bordered"
              className="text-xs font-medium border-electric-blue/30"
            >
              {message.sourceLanguage.toUpperCase()}
            </Chip>
            <div className="text-electric-blue">→</div>
            <Chip
              size="sm"
              variant="solid"
              color="primary"
              className="text-xs font-medium"
            >
              {message.targetLanguage.toUpperCase()}
            </Chip>
          </div>
          <Chip
            size="sm"
            color={message.confidence > 0.8 ? "success" : message.confidence > 0.6 ? "warning" : "danger"}
            variant="flat"
            className="text-xs"
          >
            {Math.round(message.confidence * 100)}% confident
          </Chip>
        </div>

        {/* Main Translation Text - Large and readable */}
        <div className="space-y-3">
          {/* Translated Text - Primary display */}
          <div className="bg-white/80 rounded-lg p-3 sm:p-4 border border-white/50">
            <p className="text-base sm:text-lg font-medium text-text-primary leading-relaxed">
              {showOriginal ? message.originalText : message.translatedText}
            </p>
          </div>

          {/* Original Text - Secondary display when toggled */}
          {showOriginal && (
            <div className="bg-gray-50/80 rounded-lg p-3 border border-gray-200/50">
              <p className="text-sm sm:text-base text-text-muted leading-relaxed italic">
                Original: "{message.originalText}"
              </p>
            </div>
          )}
        </div>

        {/* Simple Toggle */}
        <div className="flex justify-center mt-4">
          <HeroButton
            size="sm"
            variant="bordered"
            onPress={() => setShowOriginal(!showOriginal)}
            startContent={<Languages className="w-4 h-4" />}
            className="text-sm border-electric-blue/30 text-electric-blue hover:bg-electric-blue/10"
          >
            {showOriginal ? "Show Translation" : "Show Original"}
          </HeroButton>
        </div>
      </div>
    </div>
  )
}

export function CallChatSystem({
  callState,
  chatMessages,
  translationMessages,
  isVisible,
  onToggleVisibility,
  onSendMessage,
  onSendReaction,
  onTranslationSettingsClick,
  className
}: CallChatSystemProps) {
  const [isMinimized, setIsMinimized] = useState(false)
  const [activeTab, setActiveTab] = useState('chat')
  const [messageText, setMessageText] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  
  const chatScrollRef = useRef<HTMLDivElement>(null)
  const translationScrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const { participants } = callState

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (activeTab === 'chat' && chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight
    }
  }, [chatMessages, activeTab])

  useEffect(() => {
    if (activeTab === 'translation' && translationScrollRef.current) {
      translationScrollRef.current.scrollTop = translationScrollRef.current.scrollHeight
    }
  }, [translationMessages, activeTab])

  const handleSendMessage = () => {
    if (messageText.trim()) {
      onSendMessage(messageText.trim())
      setMessageText('')
      setReplyingTo(null)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleReply = (messageId: string) => {
    setReplyingTo(messageId)
    inputRef.current?.focus()
  }

  const handleReact = (messageId: string, emoji: string) => {
    onSendReaction(messageId, emoji)
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  if (!isVisible) return null

  const unreadChatCount = chatMessages.filter(m => !m.isCurrentUser).length
  const unreadTranslationCount = translationMessages.filter(m => !m.isCurrentUser).length

  return (
    <div className={cn(
      "fixed z-40 bg-white border border-border-light rounded-t-xl shadow-xl",
      "w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl",
      "bottom-20 sm:bottom-24 md:bottom-28 right-3 sm:right-4 md:right-6",
      isMinimized ? "h-16" : "h-[28rem] sm:h-[32rem] md:h-[36rem]",
      className
    )}>
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between p-3 sm:p-4 border-b border-border-light bg-gradient-to-r from-electric-blue-light/10 to-white">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-electric-blue-light">
            <MessageCircle className="w-5 h-5 text-electric-blue" />
          </div>
          <div>
            <h3 className="font-bold text-base sm:text-lg text-text-primary">
              Communication Hub
            </h3>
            <div className="flex items-center gap-3 text-xs text-text-muted">
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{participants.length} participants</span>
              </div>
              {callState.settings.translation.enabled && (
                <div className="flex items-center gap-1 text-electric-blue">
                  <Zap className="w-3 h-3" />
                  <span className="font-medium">AI Translation Active</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <HeroButton
            isIconOnly
            size="sm"
            variant="light"
            onPress={() => setIsMinimized(!isMinimized)}
            className="min-w-8 w-8 h-8 hover:bg-electric-blue/10"
            title={isMinimized ? "Expand" : "Minimize"}
          >
            {isMinimized ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </HeroButton>

          <HeroButton
            isIconOnly
            size="sm"
            variant="light"
            onPress={onToggleVisibility}
            className="min-w-8 w-8 h-8 hover:bg-red-100 hover:text-red-600"
            title="Close chat"
          >
            <X className="w-4 h-4" />
          </HeroButton>
        </div>
      </CardHeader>

      {/* Content */}
      {!isMinimized && (
        <CardContent className="p-0 h-full flex flex-col">
          {/* Tabs */}
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="flex-1 flex flex-col"
          >
            <TabsList className="grid w-full grid-cols-2 m-2 bg-gray-100">
              <TabsTrigger value="chat" className="relative data-[state=active]:bg-white">
                <MessageCircle className="w-4 h-4 mr-2" />
                <span className="font-medium">Chat</span>
                {unreadChatCount > 0 && (
                  <Chip
                    size="sm"
                    color="danger"
                    className="absolute -top-1 -right-1 min-w-5 h-5 text-xs"
                  >
                    {unreadChatCount}
                  </Chip>
                )}
              </TabsTrigger>
              <TabsTrigger value="translation" className="relative data-[state=active]:bg-electric-blue data-[state=active]:text-white">
                <Languages className="w-4 h-4 mr-2" />
                <span className="font-medium">AI Translation</span>
                {unreadTranslationCount > 0 && (
                  <Chip
                    size="sm"
                    color="warning"
                    className="absolute -top-1 -right-1 min-w-5 h-5 text-xs"
                  >
                    {unreadTranslationCount}
                  </Chip>
                )}
                {callState.settings.translation.enabled && (
                  <div className="absolute -top-1 -left-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                )}
              </TabsTrigger>
            </TabsList>

            {/* Chat Tab */}
            <TabsContent value="chat" className="flex-1 flex flex-col m-0">
              <ScrollShadow 
                ref={chatScrollRef}
                className="flex-1 p-3 sm:p-4 overflow-y-auto"
                hideScrollBar
              >
                {chatMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="p-3 rounded-full bg-electric-blue-light mb-3">
                      <MessageCircle className="w-6 h-6 text-electric-blue" />
                    </div>
                    <p className="text-sm text-text-muted">
                      Start a conversation with other participants
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {chatMessages.map((message) => (
                      <ChatMessageBubble
                        key={message.id}
                        message={message}
                        participant={participants.find(p => p.id === message.participantId)}
                        onReply={handleReply}
                        onReact={handleReact}
                        onCopy={handleCopy}
                      />
                    ))}
                  </div>
                )}
              </ScrollShadow>

              {/* Message Input */}
              <div className="p-3 border-t border-border-light">
                {replyingTo && (
                  <div className="flex items-center justify-between mb-2 p-2 bg-gray-50 rounded-lg">
                    <span className="text-xs text-text-muted">
                      Replying to message
                    </span>
                    <HeroButton
                      isIconOnly
                      size="sm"
                      variant="light"
                      onPress={() => setReplyingTo(null)}
                      className="min-w-5 w-5 h-5"
                    >
                      <X className="w-3 h-3" />
                    </HeroButton>
                  </div>
                )}
                
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
                      input: "text-sm"
                    }}
                  />
                  <HeroButton
                    isIconOnly
                    color="primary"
                    onPress={handleSendMessage}
                    isDisabled={!messageText.trim()}
                    className="min-w-10 w-10 h-10"
                  >
                    <Send className="w-4 h-4" />
                  </HeroButton>
                </div>
              </div>
            </TabsContent>

            {/* Translation Tab */}
            <TabsContent value="translation" className="flex-1 flex flex-col m-0">
              <div className="flex items-center justify-between p-3 sm:p-4 border-b border-border-light bg-electric-blue-light/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-electric-blue-light">
                    <Languages className="w-4 h-4 text-electric-blue" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <Chip
                        color={callState.settings.translation.enabled ? "success" : "default"}
                        variant="flat"
                        size="sm"
                        startContent={<Zap className="w-3 h-3" />}
                        className="font-medium"
                      >
                        {callState.settings.translation.enabled ? "Live Translation Active" : "Translation Inactive"}
                      </Chip>
                    </div>
                    {callState.settings.translation.enabled && (
                      <p className="text-xs text-text-muted mt-1">
                        {callState.settings.translation.sourceLanguage.toUpperCase()} → {callState.settings.translation.targetLanguage.toUpperCase()}
                      </p>
                    )}
                  </div>
                </div>

                <HeroButton
                  size="sm"
                  variant="bordered"
                  onPress={onTranslationSettingsClick}
                  className="border-electric-blue/30 text-electric-blue hover:bg-electric-blue/10"
                  startContent={<Settings className="w-3 h-3" />}
                >
                  Settings
                </HeroButton>
              </div>

              <ScrollShadow
                ref={translationScrollRef}
                className="flex-1 p-3 sm:p-4 overflow-y-auto bg-gradient-to-b from-white to-gray-50/30"
                hideScrollBar
              >
                {translationMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-8">
                    <div className="p-4 rounded-full bg-electric-blue-light mb-4">
                      <Languages className="w-8 h-8 text-electric-blue" />
                    </div>
                    <h3 className="text-lg font-semibold text-text-primary mb-2">
                      Real-time Translation
                    </h3>
                    <p className="text-sm text-text-muted mb-4 max-w-xs">
                      AI-powered translations will appear here as participants speak
                    </p>
                    {!callState.settings.translation.enabled && (
                      <HeroButton
                        size="md"
                        color="primary"
                        onPress={onTranslationSettingsClick}
                        className="font-medium"
                        startContent={<Zap className="w-4 h-4" />}
                      >
                        Enable Translation
                      </HeroButton>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {translationMessages.map((message) => (
                      <TranslationMessageBubble
                        key={message.id}
                        message={message}
                        participant={participants.find(p => p.id === message.participantId)}
                      />
                    ))}
                  </div>
                )}
              </ScrollShadow>
            </TabsContent>
          </Tabs>
        </CardContent>
      )}
    </div>
  )
}
