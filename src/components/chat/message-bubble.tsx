'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Languages, Volume2, Copy, MoreHorizontal, Play, Check, CheckCheck, Clock, AlertCircle } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Message } from '@/types/chat'

interface MessageBubbleProps {
  message: Message
  isOwn: boolean
  showTranslations: boolean
  onPlayAudio?: (audioUrl: string) => void
  onCopyMessage?: (content: string) => void
  onTranslateAudio?: (messageId: string | number) => void
}

export function MessageBubble({
  message,
  isOwn,
  showTranslations,
  onPlayAudio,
  onCopyMessage,
  onTranslateAudio
}: MessageBubbleProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  const handlePlayAudio = () => {
    if (message.audioUrl && onPlayAudio) {
      setIsPlaying(true)
      onPlayAudio(message.audioUrl)
      // Reset playing state after a delay (would be handled by actual audio player)
      setTimeout(() => setIsPlaying(false), 3000)
    }
  }

  const handleCopy = () => {
    const textToCopy = showTranslations && message.translation 
      ? `${message.content}\n\nTranslation: ${message.translation}`
      : message.content
    
    if (onCopyMessage) {
      onCopyMessage(textToCopy)
    }
  }

  return (
    <div className={cn("flex", isOwn ? "justify-end" : "justify-start")}>
      <div className={cn("max-w-[70%]", isOwn ? "order-2" : "order-1")}>
        {/* Message Bubble */}
        <div
          className={cn(
            "p-3 rounded-2xl relative group",
            isOwn
              ? "bg-electric-blue text-white rounded-br-sm"
              : "bg-white text-forest-green rounded-bl-sm border border-border-light shadow-sm"
          )}
        >
          {/* Text Message */}
          {message.type === 'text' && (
            <p className="text-sm leading-relaxed">{message.content}</p>
          )}

          {/* Audio Message */}
          {message.type === 'audio' && (
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePlayAudio}
                className={cn(
                  "p-2 rounded-full",
                  isOwn 
                    ? "hover:bg-white/20 text-white" 
                    : "hover:bg-gray-100 text-forest-green"
                )}
              >
                <Play className={cn("w-4 h-4", isPlaying && "animate-pulse")} />
              </Button>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 h-1 bg-white/30 rounded-full">
                    <div className="w-1/3 h-1 bg-white rounded-full"></div>
                  </div>
                  <span className="text-xs opacity-75">0:15</span>
                </div>
              </div>
            </div>
          )}

          {/* Image Message */}
          {message.type === 'image' && message.imageUrl && (
            <div className="space-y-2">
              <img
                src={message.imageUrl}
                alt="Shared image"
                className="max-w-full h-auto rounded-lg"
              />
              {message.content && (
                <p className="text-sm">{message.content}</p>
              )}
            </div>
          )}

          {/* File Message */}
          {message.type === 'file' && (
            <div className="flex items-center space-x-3">
              <div className={cn(
                "p-2 rounded-lg",
                isOwn ? "bg-white/20" : "bg-gray-100"
              )}>
                <Copy className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-medium">{message.fileName}</p>
                <p className="text-xs opacity-75">{message.fileSize}</p>
              </div>
            </div>
          )}

          {/* Translation */}
          {message.isTranslated && showTranslations && message.translation && (
            <div className={cn(
              "mt-3 pt-3 border-t",
              isOwn ? "border-white/20" : "border-gray-200"
            )}>
              <div className="flex items-center space-x-2 mb-2">
                <Languages className="w-3 h-3 opacity-70" />
                <span className="text-xs opacity-70">Translation</span>
                {message.confidence && (
                  <Badge 
                    variant="secondary" 
                    className={cn(
                      "text-xs px-1.5 py-0.5",
                      isOwn ? "bg-white/20 text-white" : "bg-gray-100"
                    )}
                  >
                    {Math.round(message.confidence * 100)}%
                  </Badge>
                )}
              </div>
              <p className="text-xs opacity-90 italic leading-relaxed">
                {message.translation}
              </p>
            </div>
          )}

          {/* Language Badge for received messages */}
          {!isOwn && message.language && (
            <Badge 
              variant="secondary" 
              className="absolute -top-2 -left-2 text-xs"
            >
              {message.language}
            </Badge>
          )}
        </div>

        {/* Timestamp and Actions */}
        <div className={cn(
          "flex items-center space-x-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity",
          isOwn ? "justify-end" : "justify-start"
        )}>
          <span className="text-xs text-text-muted">{message.timestamp}</span>
          
          {/* Audio Translation Button */}
          {message.type === 'audio' && onTranslateAudio && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-auto p-1"
              onClick={() => onTranslateAudio(message.id)}
            >
              <Languages className="w-3 h-3 text-text-muted" />
            </Button>
          )}
          
          {/* Text-to-Speech Button */}
          {message.translation && showTranslations && (
            <Button variant="ghost" size="sm" className="h-auto p-1">
              <Volume2 className="w-3 h-3 text-text-muted" />
            </Button>
          )}
          
          {/* Copy Button */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-auto p-1"
            onClick={handleCopy}
          >
            <Copy className="w-3 h-3 text-text-muted" />
          </Button>
          
          {/* More Actions */}
          <Button variant="ghost" size="sm" className="h-auto p-1">
            <MoreHorizontal className="w-3 h-3 text-text-muted" />
          </Button>
        </div>
      </div>
    </div>
  )
}

// Typing Indicator Component
export function TypingIndicator({ userName }: { userName: string }) {
  return (
    <div className="flex justify-start">
      <div className="max-w-[70%]">
        <div className="bg-white text-forest-green rounded-2xl rounded-bl-sm border border-border-light shadow-sm p-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-text-muted">{userName} is typing</span>
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-text-muted rounded-full animate-bounce"></div>
              <div className="w-1 h-1 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-1 h-1 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
