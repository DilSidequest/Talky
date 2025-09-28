'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Chip, 
  Button as HeroButton, 
  ScrollShadow
} from '@heroui/react'
import {
  Languages,
  Settings,
  ChevronDown,
  ChevronUp,
  X,
  Zap,
  Volume2,
  VolumeX
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

interface TranslationDisplayProps {
  callState: CallState
  messages: TranslationMessage[]
  isVisible: boolean
  onToggleVisibility: () => void
  onSettingsClick?: () => void
  className?: string
}

function ReadableTranslationMessage({ 
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
    setTimeout(() => setIsPlaying(false), 2000)
  }

  return (
    <div className="mb-6">
      {/* Speaker Info */}
      <div className="flex items-center gap-3 mb-3">
        <Avatar className="w-9 h-9">
          <AvatarImage src={participant?.avatar} alt={message.participantName} />
          <AvatarFallback className="bg-electric-blue text-white text-sm font-medium">
            {message.participantName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-base text-text-primary">
              {message.participantName}
            </span>
            <span className="text-sm text-text-muted">
              {new Date(message.timestamp).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Chip 
              size="sm" 
              variant="flat"
              className="text-xs bg-electric-blue-light/20 text-electric-blue font-medium"
            >
              {message.sourceLanguage.toUpperCase()} → {message.targetLanguage.toUpperCase()}
            </Chip>
            <Chip 
              size="sm" 
              color={message.confidence > 0.8 ? "success" : message.confidence > 0.6 ? "warning" : "danger"}
              variant="flat"
              className="text-xs"
            >
              {Math.round(message.confidence * 100)}% accurate
            </Chip>
          </div>
        </div>
      </div>

      {/* Translation Content */}
      <div className="bg-gradient-to-br from-white to-gray-50/50 border border-gray-200/50 rounded-2xl p-5 shadow-sm">
        {/* Main Translation - Large and prominent */}
        <div className="mb-4">
          <p className="text-xl sm:text-2xl font-medium text-text-primary leading-relaxed tracking-wide">
            "{showOriginal ? message.originalText : message.translatedText}"
          </p>
        </div>

        {/* Secondary text when showing original */}
        {showOriginal && (
          <div className="mb-4 p-3 bg-electric-blue-light/10 rounded-lg border border-electric-blue/20">
            <p className="text-base text-text-muted leading-relaxed">
              <span className="font-medium text-electric-blue">Translation:</span> "{message.translatedText}"
            </p>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-between">
          <HeroButton
            size="sm"
            variant="bordered"
            onPress={() => setShowOriginal(!showOriginal)}
            startContent={<Languages className="w-4 h-4" />}
            className="border-electric-blue/30 text-electric-blue hover:bg-electric-blue/10"
          >
            {showOriginal ? "Show Translation" : "Show Original"}
          </HeroButton>

          <HeroButton
            size="sm"
            variant="light"
            onPress={handlePlayAudio}
            startContent={isPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            className="text-text-muted hover:text-electric-blue hover:bg-electric-blue/10"
          >
            {isPlaying ? "Playing..." : "Listen"}
          </HeroButton>
        </div>
      </div>
    </div>
  )
}

export function TranslationDisplay({
  callState,
  messages,
  isVisible,
  onToggleVisibility,
  onSettingsClick,
  className
}: TranslationDisplayProps) {
  const [isMinimized, setIsMinimized] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const { participants } = callState

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  if (!isVisible) return null

  return (
    <div className={cn(
      "fixed z-40 bg-white border border-border-light rounded-t-2xl shadow-2xl",
      "w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl",
      "bottom-20 sm:bottom-24 md:bottom-28 right-3 sm:right-4 md:right-6",
      isMinimized ? "h-16" : "h-[32rem] sm:h-[36rem] md:h-[40rem]",
      className
    )}>
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between p-4 sm:p-5 border-b border-border-light bg-gradient-to-r from-electric-blue-light/15 to-white">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-electric-blue-light">
            <Languages className="w-6 h-6 text-electric-blue" />
          </div>
          <div>
            <h3 className="font-bold text-lg sm:text-xl text-text-primary">
              Live Translation
            </h3>
            <div className="flex items-center gap-3 text-sm text-text-muted mt-1">
              {callState.settings.translation.enabled ? (
                <div className="flex items-center gap-2 text-electric-blue">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="font-medium">
                    {callState.settings.translation.sourceLanguage.toUpperCase()} → {callState.settings.translation.targetLanguage.toUpperCase()}
                  </span>
                </div>
              ) : (
                <span className="text-text-muted">Translation inactive</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <HeroButton
            size="sm"
            variant="bordered"
            onPress={onSettingsClick}
            className="border-electric-blue/30 text-electric-blue hover:bg-electric-blue/10"
            startContent={<Settings className="w-4 h-4" />}
          >
            Settings
          </HeroButton>
          
          <HeroButton
            isIconOnly
            size="sm"
            variant="light"
            onPress={() => setIsMinimized(!isMinimized)}
            className="min-w-9 w-9 h-9 hover:bg-electric-blue/10"
            title={isMinimized ? "Expand" : "Minimize"}
          >
            {isMinimized ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </HeroButton>
          
          <HeroButton
            isIconOnly
            size="sm"
            variant="light"
            onPress={onToggleVisibility}
            className="min-w-9 w-9 h-9 hover:bg-red-100 hover:text-red-600"
            title="Close translation"
          >
            <X className="w-5 h-5" />
          </HeroButton>
        </div>
      </CardHeader>

      {/* Content */}
      {!isMinimized && (
        <CardContent className="p-0 h-full flex flex-col">
          <ScrollShadow 
            ref={scrollRef}
            className="flex-1 p-4 sm:p-6 overflow-y-auto bg-gradient-to-b from-white via-gray-50/20 to-gray-50/40"
            hideScrollBar
          >
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="p-6 rounded-full bg-electric-blue-light mb-6">
                  <Languages className="w-12 h-12 text-electric-blue" />
                </div>
                <h3 className="text-2xl font-bold text-text-primary mb-3">
                  Ready for Translation
                </h3>
                <p className="text-base text-text-muted mb-6 max-w-md leading-relaxed">
                  AI-powered real-time translations will appear here as participants speak in different languages.
                </p>
                {!callState.settings.translation.enabled && (
                  <HeroButton
                    size="lg"
                    color="primary"
                    onPress={onSettingsClick}
                    className="font-semibold"
                    startContent={<Zap className="w-5 h-5" />}
                  >
                    Enable Translation
                  </HeroButton>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <ReadableTranslationMessage
                    key={message.id}
                    message={message}
                    participant={participants.find(p => p.id === message.participantId)}
                  />
                ))}
              </div>
            )}
          </ScrollShadow>
        </CardContent>
      )}
    </div>
  )
}
