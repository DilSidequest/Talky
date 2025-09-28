'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Languages, 
  Volume2, 
  VolumeX, 
  Settings, 
  Eye, 
  EyeOff,
  ChevronUp,
  ChevronDown,
  Type,
  Move
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { SubtitleData, CallState } from '@/types/call'

interface SubtitleOverlayProps {
  callState: CallState
  subtitles: SubtitleData[]
  onToggleSubtitles?: () => void
  onLanguageChange?: (source: string, target: string) => void
  onPositionChange?: (position: 'top' | 'bottom' | 'center') => void
  onFontSizeChange?: (size: 'small' | 'medium' | 'large') => void
  className?: string
}

interface SubtitleItemProps {
  subtitle: SubtitleData
  fontSize: 'small' | 'medium' | 'large'
  showOriginal: boolean
  participantName?: string
}

function SubtitleItem({ subtitle, fontSize, showOriginal, participantName }: SubtitleItemProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, subtitle.duration)

    return () => clearTimeout(timer)
  }, [subtitle.duration])

  const fontSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  }

  const getConfidenceColor = (confidence?: number) => {
    if (!confidence) return 'text-white'
    if (confidence >= 0.9) return 'text-green-400'
    if (confidence >= 0.7) return 'text-yellow-400'
    return 'text-red-400'
  }

  if (!isVisible) return null

  return (
    <div className="mb-2 animate-in slide-in-from-bottom-2 duration-300">
      <Card className="bg-black/80 backdrop-blur-sm border-none">
        <CardContent className="p-3">
          {/* Participant name */}
          {participantName && (
            <div className="flex items-center space-x-2 mb-1">
              <Badge variant="secondary" className="text-xs bg-electric-blue text-white">
                {participantName}
              </Badge>
              {subtitle.confidence && (
                <div className={cn("text-xs", getConfidenceColor(subtitle.confidence))}>
                  {Math.round(subtitle.confidence * 100)}%
                </div>
              )}
            </div>
          )}

          {/* Original text */}
          {showOriginal && subtitle.text && (
            <p className={cn(
              "text-gray-300 mb-1",
              fontSizeClasses[fontSize]
            )}>
              {subtitle.text}
            </p>
          )}

          {/* Translated text */}
          {subtitle.translation && (
            <p className={cn(
              "text-white font-medium",
              fontSizeClasses[fontSize]
            )}>
              {subtitle.translation}
            </p>
          )}

          {/* Language indicator */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center space-x-2 text-xs text-gray-400">
              <Languages className="w-3 h-3" />
              <span>{subtitle.language}</span>
              {subtitle.targetLanguage && (
                <>
                  <span>→</span>
                  <span>{subtitle.targetLanguage}</span>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function SubtitleOverlay({ 
  callState, 
  subtitles, 
  onToggleSubtitles,
  onLanguageChange,
  onPositionChange,
  onFontSizeChange,
  className 
}: SubtitleOverlayProps) {
  const [showControls, setShowControls] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const { settings } = callState
  const { translation } = settings

  // Get recent subtitles (last 3)
  const recentSubtitles = subtitles.slice(-3)

  const getPositionClasses = () => {
    switch (translation.subtitlePosition) {
      case 'top':
        return 'top-20 left-1/2 transform -translate-x-1/2'
      case 'center':
        return 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
      case 'bottom':
      default:
        return 'bottom-32 left-1/2 transform -translate-x-1/2'
    }
  }

  if (!translation.enabled || !translation.showSubtitles) {
    return null
  }

  return (
    <div className={cn("fixed z-40 max-w-2xl w-full px-4", getPositionClasses(), className)}>
      {/* Subtitles */}
      <div className="space-y-2">
        {recentSubtitles.map((subtitle) => (
          <SubtitleItem
            key={subtitle.id}
            subtitle={subtitle}
            fontSize={translation.fontSize}
            showOriginal={translation.showOriginal}
            participantName={callState.participants.find(p => p.id === subtitle.participantId)?.name}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="mt-4 flex justify-center">
        <Card className="bg-white/95 backdrop-blur-sm border border-border-light">
          <CardContent className="p-2">
            <div className="flex items-center space-x-2">
              {/* Toggle Subtitles */}
              <Button
                size="sm"
                variant="ghost"
                onClick={onToggleSubtitles}
                className="text-forest-green hover:bg-gray-100"
              >
                {translation.showSubtitles ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
              </Button>

              {/* Position Controls */}
              <div className="flex flex-col">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onPositionChange?.('top')}
                  className={cn(
                    "h-4 px-2 text-forest-green hover:bg-gray-100",
                    translation.subtitlePosition === 'top' && "bg-electric-blue-light"
                  )}
                >
                  <ChevronUp className="w-3 h-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onPositionChange?.('bottom')}
                  className={cn(
                    "h-4 px-2 text-forest-green hover:bg-gray-100",
                    translation.subtitlePosition === 'bottom' && "bg-electric-blue-light"
                  )}
                >
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </div>

              {/* Font Size */}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  const sizes: Array<'small' | 'medium' | 'large'> = ['small', 'medium', 'large']
                  const currentIndex = sizes.indexOf(translation.fontSize)
                  const nextSize = sizes[(currentIndex + 1) % sizes.length]
                  onFontSizeChange?.(nextSize)
                }}
                className="text-forest-green hover:bg-gray-100"
              >
                <Type className="w-4 h-4" />
              </Button>

              {/* Language Settings */}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowControls(!showControls)}
                className="text-forest-green hover:bg-gray-100"
              >
                <Languages className="w-4 h-4" />
              </Button>

              {/* Move/Drag Handle */}
              <Button
                size="sm"
                variant="ghost"
                className="text-forest-green hover:bg-gray-100 cursor-move"
                onMouseDown={() => setIsDragging(true)}
                onMouseUp={() => setIsDragging(false)}
              >
                <Move className="w-4 h-4" />
              </Button>
            </div>

            {/* Extended Controls */}
            {showControls && (
              <div className="mt-2 pt-2 border-t border-border-light">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="text-text-muted">Languages:</span>
                    <Badge variant="outline" className="text-xs">
                      {translation.sourceLanguage}
                    </Badge>
                    <span className="text-text-muted">→</span>
                    <Badge variant="outline" className="text-xs">
                      {translation.targetLanguage}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        // Toggle show original
                        // This would be handled by parent component
                      }}
                      className={cn(
                        "text-xs px-2 py-1",
                        translation.showOriginal 
                          ? "bg-electric-blue-light text-electric-blue" 
                          : "text-text-muted"
                      )}
                    >
                      Show Original
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Current Translation Status */}
      {callState.translation?.currentSubtitle && (
        <div className="mt-2 text-center">
          <Badge variant="secondary" className="bg-electric-blue-light text-electric-blue text-xs">
            Translating...
          </Badge>
        </div>
      )}
    </div>
  )
}
