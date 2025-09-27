'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Languages, 
  Globe, 
  Volume2, 
  VolumeX, 
  Settings, 
  Check,
  ChevronDown,
  Zap,
  Eye,
  EyeOff
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface TranslationControlsProps {
  showTranslations: boolean
  onToggleTranslations: (show: boolean) => void
  sourceLanguage: string
  targetLanguage: string
  onLanguageChange?: (source: string, target: string) => void
  translationMode: 'auto' | 'manual'
  onModeChange?: (mode: 'auto' | 'manual') => void
  autoSpeak?: boolean
  onAutoSpeakChange?: (enabled: boolean) => void
  className?: string
}

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' }
]

export function TranslationControls({
  showTranslations,
  onToggleTranslations,
  sourceLanguage,
  targetLanguage,
  onLanguageChange,
  translationMode,
  onModeChange,
  autoSpeak = false,
  onAutoSpeakChange,
  className
}: TranslationControlsProps) {
  const [showLanguageSelector, setShowLanguageSelector] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  const getLanguageInfo = (code: string) => {
    return languages.find(lang => lang.code === code) || languages[0]
  }

  const sourceInfo = getLanguageInfo(sourceLanguage)
  const targetInfo = getLanguageInfo(targetLanguage)

  return (
    <div className={cn("space-y-3", className)}>
      {/* Main Translation Toggle */}
      <div className="flex items-center justify-between p-3 bg-white border border-border-light rounded-lg">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleTranslations(!showTranslations)}
            className={cn(
              "p-2",
              showTranslations 
                ? "bg-electric-blue-light text-electric-blue" 
                : "text-text-muted"
            )}
          >
            {showTranslations ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </Button>
          
          <div className="flex items-center space-x-2">
            <Languages className="w-4 h-4 text-electric-blue" />
            <span className="text-sm font-medium">
              {showTranslations ? 'Translations On' : 'Translations Off'}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Badge 
            variant={translationMode === 'auto' ? 'default' : 'secondary'}
            className={cn(
              "text-xs",
              translationMode === 'auto' && "bg-electric-blue text-white"
            )}
          >
            {translationMode === 'auto' ? (
              <>
                <Zap className="w-3 h-3 mr-1" />
                Auto
              </>
            ) : (
              'Manual'
            )}
          </Badge>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Language Selection */}
      {showTranslations && (
        <div className="flex items-center justify-between p-3 bg-electric-blue-light/50 border border-electric-blue/20 rounded-lg">
          <div className="flex items-center space-x-4">
            {/* Source Language */}
            <div className="flex items-center space-x-2">
              <span className="text-lg">{sourceInfo.flag}</span>
              <span className="text-sm font-medium">{sourceInfo.name}</span>
            </div>
            
            <div className="flex items-center space-x-2 text-text-muted">
              <div className="w-4 h-0.5 bg-text-muted rounded"></div>
              <Languages className="w-4 h-4" />
              <div className="w-4 h-0.5 bg-text-muted rounded"></div>
            </div>
            
            {/* Target Language */}
            <div className="flex items-center space-x-2">
              <span className="text-lg">{targetInfo.flag}</span>
              <span className="text-sm font-medium">{targetInfo.name}</span>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowLanguageSelector(!showLanguageSelector)}
          >
            <ChevronDown className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Language Selector */}
      {showLanguageSelector && (
        <Card className="border-border-light">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-center">Select Languages</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-text-muted mb-2 block">
                  From (Source)
                </label>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {languages.map((lang) => (
                    <Button
                      key={lang.code}
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "w-full justify-start text-xs",
                        sourceLanguage === lang.code && "bg-electric-blue-light text-electric-blue"
                      )}
                      onClick={() => onLanguageChange?.(lang.code, targetLanguage)}
                    >
                      <span className="mr-2">{lang.flag}</span>
                      {lang.name}
                      {sourceLanguage === lang.code && <Check className="w-3 h-3 ml-auto" />}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-xs font-medium text-text-muted mb-2 block">
                  To (Target)
                </label>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {languages.map((lang) => (
                    <Button
                      key={lang.code}
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "w-full justify-start text-xs",
                        targetLanguage === lang.code && "bg-electric-blue-light text-electric-blue"
                      )}
                      onClick={() => onLanguageChange?.(sourceLanguage, lang.code)}
                    >
                      <span className="mr-2">{lang.flag}</span>
                      {lang.name}
                      {targetLanguage === lang.code && <Check className="w-3 h-3 ml-auto" />}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Translation Settings */}
      {showSettings && (
        <Card className="border-border-light">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-center">Translation Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Translation Mode */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-center">Translation Mode</p>
              </div>
              <div className="flex space-x-1">
                <Button
                  variant={translationMode === 'auto' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onModeChange?.('auto')}
                  className={cn(
                    "text-xs",
                    translationMode === 'auto' && "bg-electric-blue hover:bg-electric-blue-hover"
                  )}
                >
                  <Zap className="w-3 h-3 mr-1" />
                  Auto
                </Button>
                <Button
                  variant={translationMode === 'manual' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onModeChange?.('manual')}
                  className={cn(
                    "text-xs",
                    translationMode === 'manual' && "bg-electric-blue hover:bg-electric-blue-hover"
                  )}
                >
                  Manual
                </Button>
              </div>
            </div>

            {/* Auto Speak */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-center">Auto Speak Translations</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onAutoSpeakChange?.(!autoSpeak)}
                className={cn(
                  "p-2",
                  autoSpeak 
                    ? "bg-electric-blue-light text-electric-blue" 
                    : "text-text-muted"
                )}
              >
                {autoSpeak ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Translation Status Indicator
export function TranslationStatus({ 
  isTranslating, 
  confidence, 
  error 
}: { 
  isTranslating: boolean
  confidence?: number
  error?: string 
}) {
  if (error) {
    return (
      <div className="flex items-center space-x-2 text-red-600">
        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
        <span className="text-xs">Translation failed</span>
      </div>
    )
  }

  if (isTranslating) {
    return (
      <div className="flex items-center space-x-2 text-electric-blue">
        <div className="w-2 h-2 bg-electric-blue rounded-full animate-pulse"></div>
        <span className="text-xs">Translating...</span>
      </div>
    )
  }

  if (confidence !== undefined) {
    return (
      <div className="flex items-center space-x-2 text-green-600">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <span className="text-xs">
          Translated ({Math.round(confidence * 100)}% confidence)
        </span>
      </div>
    )
  }

  return null
}
