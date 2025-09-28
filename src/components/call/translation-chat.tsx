'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Chip, 
  Button as HeroButton, 
  ScrollShadow,
  Divider 
} from '@heroui/react'
import {
  Languages,
  MessageCircle,
  Volume2,
  VolumeX,
  Settings,
  ChevronDown,
  ChevronUp,
  Copy,
  Download,
  Zap,
  Globe,
  Mic,
  MicOff
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { CallState, Participant } from '@/types/call'

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

interface TranslationChatProps {
  callState: CallState
  messages: TranslationMessage[]
  isVisible: boolean
  onToggleVisibility: () => void
  onLanguageChange?: (source: string, target: string) => void
  onSettingsClick?: () => void
  className?: string
}

function TranslationMessageBubble({ 
  message, 
  participant 
}: { 
  message: TranslationMessage
  participant?: Participant 
}) {
  const [showOriginal, setShowOriginal] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  const handlePlayAudio = () => {
    setIsPlaying(true)
    // Mock audio playback
    setTimeout(() => setIsPlaying(false), 2000)
  }

  const handleCopyText = () => {
    navigator.clipboard.writeText(showOriginal ? message.originalText : message.translatedText)
  }

  return (
    <div className={cn(
      "flex gap-2 sm:gap-3 mb-3 sm:mb-4",
      message.isCurrentUser ? "flex-row-reverse" : "flex-row"
    )}>
      {/* Avatar */}
      <div className="flex-shrink-0">
        <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
          <AvatarImage src={participant?.avatar} alt={message.participantName} />
          <AvatarFallback className="bg-electric-blue text-white text-xs sm:text-sm">
            {message.participantName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Message Content */}
      <div className={cn(
        "flex-1 max-w-[80%] sm:max-w-[70%]",
        message.isCurrentUser ? "items-end" : "items-start"
      )}>
        {/* Header */}
        <div className={cn(
          "flex items-center gap-2 mb-1",
          message.isCurrentUser ? "flex-row-reverse" : "flex-row"
        )}>
          <span className="text-xs sm:text-sm font-medium text-text-primary">
            {message.participantName}
          </span>
          <span className="text-xs text-text-muted">
            {new Date(message.timestamp).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
        </div>

        {/* Message Bubble */}
        <div className={cn(
          "relative p-3 sm:p-4 rounded-2xl shadow-sm",
          message.isCurrentUser 
            ? "bg-electric-blue text-white rounded-br-md" 
            : "bg-white border border-border-light rounded-bl-md"
        )}>
          {/* Language Indicator */}
          <div className={cn(
            "flex items-center gap-1 mb-2",
            message.isCurrentUser ? "justify-end" : "justify-start"
          )}>
            <Chip 
              size="sm" 
              variant="bordered"
              className={cn(
                "text-xs",
                message.isCurrentUser ? "border-white/30 text-white" : "border-border-light"
              )}
            >
              {showOriginal ? message.sourceLanguage : message.targetLanguage}
            </Chip>
            {message.confidence && (
              <Chip 
                size="sm" 
                color={message.confidence > 0.8 ? "success" : message.confidence > 0.6 ? "warning" : "danger"}
                variant="dot"
                className="text-xs"
              >
                {Math.round(message.confidence * 100)}%
              </Chip>
            )}
          </div>

          {/* Message Text */}
          <p className={cn(
            "text-sm sm:text-base leading-relaxed",
            message.isCurrentUser ? "text-white" : "text-text-primary"
          )}>
            {showOriginal ? message.originalText : message.translatedText}
          </p>

          {/* Actions */}
          <div className={cn(
            "flex items-center gap-1 mt-2",
            message.isCurrentUser ? "justify-start" : "justify-end"
          )}>
            <HeroButton
              isIconOnly
              size="sm"
              variant="light"
              onPress={() => setShowOriginal(!showOriginal)}
              className={cn(
                "min-w-6 w-6 h-6",
                message.isCurrentUser ? "text-white hover:bg-white/20" : "text-text-muted hover:bg-gray-100"
              )}
              title={showOriginal ? "Show translation" : "Show original"}
            >
              <Languages className="w-3 h-3" />
            </HeroButton>

            <HeroButton
              isIconOnly
              size="sm"
              variant="light"
              onPress={handlePlayAudio}
              className={cn(
                "min-w-6 w-6 h-6",
                message.isCurrentUser ? "text-white hover:bg-white/20" : "text-text-muted hover:bg-gray-100"
              )}
              title="Play audio"
            >
              {isPlaying ? (
                <VolumeX className="w-3 h-3" />
              ) : (
                <Volume2 className="w-3 h-3" />
              )}
            </HeroButton>

            <HeroButton
              isIconOnly
              size="sm"
              variant="light"
              onPress={handleCopyText}
              className={cn(
                "min-w-6 w-6 h-6",
                message.isCurrentUser ? "text-white hover:bg-white/20" : "text-text-muted hover:bg-gray-100"
              )}
              title="Copy text"
            >
              <Copy className="w-3 h-3" />
            </HeroButton>
          </div>
        </div>
      </div>
    </div>
  )
}

export function TranslationChat({
  callState,
  messages,
  isVisible,
  onToggleVisibility,
  onLanguageChange,
  onSettingsClick,
  className
}: TranslationChatProps) {
  const [isMinimized, setIsMinimized] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const { settings, participants } = callState

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  if (!isVisible) return null

  return (
    <div className={cn(
      "fixed z-40 bg-white border border-border-light rounded-t-xl shadow-lg",
      "w-full max-w-sm sm:max-w-md md:max-w-lg",
      "bottom-20 sm:bottom-24 md:bottom-28 right-3 sm:right-4 md:right-6",
      isMinimized ? "h-14" : "h-80 sm:h-96",
      className
    )}>
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between p-3 sm:p-4 border-b border-border-light">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-full bg-electric-blue-light">
            <MessageCircle className="w-4 h-4 text-electric-blue" />
          </div>
          <div>
            <h3 className="font-semibold text-sm sm:text-base text-text-primary">
              Live Translation
            </h3>
            {settings.translation.enabled && (
              <div className="flex items-center gap-1 text-xs text-text-muted">
                <Zap className="w-3 h-3" />
                <span>{settings.translation.sourceLanguage} → {settings.translation.targetLanguage}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <HeroButton
            isIconOnly
            size="sm"
            variant="light"
            onPress={onSettingsClick}
            className="min-w-8 w-8 h-8"
            title="Translation settings"
          >
            <Settings className="w-4 h-4" />
          </HeroButton>
          
          <HeroButton
            isIconOnly
            size="sm"
            variant="light"
            onPress={() => setIsMinimized(!isMinimized)}
            className="min-w-8 w-8 h-8"
            title={isMinimized ? "Expand" : "Minimize"}
          >
            {isMinimized ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </HeroButton>
        </div>
      </CardHeader>

      {/* Content */}
      {!isMinimized && (
        <CardContent className="p-0 h-full flex flex-col">
          {/* Messages */}
          <ScrollShadow 
            ref={scrollRef}
            className="flex-1 p-3 sm:p-4 overflow-y-auto"
            hideScrollBar
          >
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="p-3 rounded-full bg-electric-blue-light mb-3">
                  <Languages className="w-6 h-6 text-electric-blue" />
                </div>
                <p className="text-sm text-text-muted">
                  Translation messages will appear here
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {messages.map((message) => (
                  <TranslationMessageBubble
                    key={message.id}
                    message={message}
                    participant={participants.find(p => p.id === message.participantId)}
                  />
                ))}
              </div>
            )}
          </ScrollShadow>

          {/* Status Bar */}
          <div className="p-2 sm:p-3 border-t border-border-light bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {settings.translation.enabled ? (
                  <Chip 
                    color="success" 
                    variant="dot" 
                    size="sm"
                    startContent={<Zap className="w-3 h-3" />}
                  >
                    Active
                  </Chip>
                ) : (
                  <Chip 
                    color="default" 
                    variant="bordered" 
                    size="sm"
                  >
                    Inactive
                  </Chip>
                )}
                <span className="text-xs text-text-muted">
                  {messages.length} messages
                </span>
              </div>

              <HeroButton
                size="sm"
                variant="light"
                onPress={onToggleVisibility}
                className="text-xs"
              >
                Close
              </HeroButton>
            </div>
          </div>
        </CardContent>
      )}
    </div>
  )
}
