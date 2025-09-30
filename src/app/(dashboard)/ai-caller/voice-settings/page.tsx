'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Select } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
  Volume2,
  Settings,
  Globe,
  Play,
  Pause,
  RotateCcw,
  ArrowLeft,
  Save,
  Mic,
  Gauge
} from 'lucide-react'

interface VoiceSettings {
  voice: string
  speed: number
  tone: string
  language: string
  pitch: number
  volume: number
}

interface Language {
  code: string
  name: string
  nativeName: string
  flag: string
}

interface Voice {
  id: string
  name: string
  description: string
  accent: string
  gender: 'male' | 'female'
  language: string
}

const languages: Language[] = [
  { code: 'en-US', name: 'English (US)', nativeName: 'English', flag: '🇺🇸' },
  { code: 'en-GB', name: 'English (UK)', nativeName: 'English', flag: '🇬🇧' },
  { code: 'es-ES', name: 'Spanish (Spain)', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'es-MX', name: 'Spanish (Mexico)', nativeName: 'Español', flag: '🇲🇽' },
  { code: 'fr-FR', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de-DE', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'it-IT', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'pt-BR', name: 'Portuguese (Brazil)', nativeName: 'Português', flag: '🇧🇷' },
  { code: 'ja-JP', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko-KR', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'zh-CN', name: 'Chinese (Simplified)', nativeName: '简体中文', flag: '🇨🇳' },
  { code: 'hi-IN', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ar-SA', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' }
]

const voices: Voice[] = [
  { id: 'sarah', name: 'Sarah', description: 'Professional female voice', accent: 'American', gender: 'female', language: 'en-US' },
  { id: 'james', name: 'James', description: 'Confident male voice', accent: 'American', gender: 'male', language: 'en-US' },
  { id: 'emma', name: 'Emma', description: 'Friendly female voice', accent: 'British', gender: 'female', language: 'en-GB' },
  { id: 'oliver', name: 'Oliver', description: 'Professional male voice', accent: 'British', gender: 'male', language: 'en-GB' },
  { id: 'maria', name: 'Maria', description: 'Warm female voice', accent: 'Spanish', gender: 'female', language: 'es-ES' },
  { id: 'david', name: 'David', description: 'Friendly male voice', accent: 'Spanish', gender: 'male', language: 'es-ES' },
  { id: 'sophie', name: 'Sophie', description: 'Elegant female voice', accent: 'French', gender: 'female', language: 'fr-FR' },
  { id: 'pierre', name: 'Pierre', description: 'Sophisticated male voice', accent: 'French', gender: 'male', language: 'fr-FR' },
  { id: 'hans', name: 'Hans', description: 'Clear male voice', accent: 'German', gender: 'male', language: 'de-DE' },
  { id: 'lucia', name: 'Lucia', description: 'Melodic female voice', accent: 'Italian', gender: 'female', language: 'it-IT' },
  { id: 'carlos', name: 'Carlos', description: 'Energetic male voice', accent: 'Mexican', gender: 'male', language: 'es-MX' }
]

const tones = [
  { id: 'professional', name: 'Professional', description: 'Formal and business-like' },
  { id: 'friendly', name: 'Friendly', description: 'Warm and approachable' },
  { id: 'casual', name: 'Casual', description: 'Relaxed and informal' },
  { id: 'authoritative', name: 'Authoritative', description: 'Confident and commanding' }
]

const defaultSettings: VoiceSettings = {
  voice: 'sarah',
  speed: 1.0,
  tone: 'professional',
  language: 'en-US',
  pitch: 1.0,
  volume: 0.8
}

export default function VoiceSettingsPage() {
  const router = useRouter()
  const [settings, setSettings] = useState<VoiceSettings>(defaultSettings)
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('voiceSettings')
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  const updateSetting = (key: keyof VoiceSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  const handleSave = () => {
    localStorage.setItem('voiceSettings', JSON.stringify(settings))
    setHasChanges(false)
    router.push('/ai-caller')
  }

  const handleReset = () => {
    setSettings(defaultSettings)
    setHasChanges(true)
  }

  const handleBack = () => {
    if (hasChanges) {
      const confirmLeave = window.confirm('You have unsaved changes. Do you want to leave without saving?')
      if (!confirmLeave) return
    }
    router.push('/ai-caller')
  }

  const playVoicePreview = () => {
    setIsPreviewPlaying(true)
    // In real app, this would play a voice sample with current settings
    setTimeout(() => setIsPreviewPlaying(false), 3000)
  }

  const getLanguageInfo = (code: string) => {
    return languages.find(lang => lang.code === code) || languages[0]
  }

  const getFilteredVoices = () => {
    return voices.filter(voice => voice.language === settings.language)
  }

  const selectedVoice = voices.find(v => v.id === settings.voice)
  const selectedLanguage = getLanguageInfo(settings.language)

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-bg-secondary to-electric-blue-light/20">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-border-light sticky top-0 z-50 shadow-sm">
        <div className="relative max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
          {/* Back Button - Absolute positioned in corner */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 flex items-center gap-1 sm:gap-2 shrink-0 hover:bg-electric-blue-light z-10"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm hidden sm:inline">Back</span>
          </Button>

          {/* Centered Header Content */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 px-16 sm:px-20">
            <div className="p-2 rounded-xl bg-gradient-to-br from-electric-blue to-electric-blue-hover shadow-sm shrink-0">
              <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-base sm:text-xl font-semibold text-forest-green">
                Voice & Language Settings
              </h1>
              <p className="text-xs sm:text-sm text-text-muted hidden sm:block">
                Configure AI voice and language preferences
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6 pb-24">
        {/* Language Selection */}
        <Card className="relative z-20 border-border-light shadow-md hover:shadow-lg transition-shadow bg-white/80 backdrop-blur-sm">
          <div className="p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="p-2 rounded-lg bg-electric-blue-light">
                <Globe className="w-5 h-5 text-electric-blue" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-forest-green text-base sm:text-lg">Language</h3>
                <p className="text-xs sm:text-sm text-text-muted">Choose the language for AI calls</p>
              </div>
            </div>

            <Select
              value={settings.language}
              onValueChange={(value) => {
                updateSetting('language', value)
                // Reset voice to first available for new language
                const availableVoices = voices.filter(v => v.language === value)
                if (availableVoices.length > 0 && !availableVoices.find(v => v.id === settings.voice)) {
                  updateSetting('voice', availableVoices[0].id)
                }
              }}
              options={languages.map(lang => ({
                value: lang.code,
                label: lang.name,
                icon: null
              }))}
              placeholder="Select a language"
              label="Select Language"
            />
          </div>
        </Card>

        {/* Voice Selection */}
        <Card className="border-border-light shadow-md hover:shadow-lg transition-shadow bg-white/80 backdrop-blur-sm">
          <div className="p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="p-2 rounded-lg bg-electric-blue-light">
                <Volume2 className="w-5 h-5 text-electric-blue" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-forest-green text-base sm:text-lg">Voice Selection</h3>
                <p className="text-xs sm:text-sm text-text-muted">Choose an AI voice for {selectedLanguage.name}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {getFilteredVoices().map((voice) => (
                <div
                  key={voice.id}
                  className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all group ${
                    settings.voice === voice.id
                      ? 'border-electric-blue bg-gradient-to-br from-electric-blue-light to-white shadow-md'
                      : 'border-border-light hover:border-electric-blue/50 hover:shadow-md bg-white'
                  }`}
                  onClick={() => updateSetting('voice', voice.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Mic className={`w-4 h-4 ${settings.voice === voice.id ? 'text-electric-blue' : 'text-text-muted'}`} />
                      <h4 className="font-semibold text-forest-green text-sm">{voice.name}</h4>
                    </div>
                    <div className="flex gap-1">
                      <Badge variant="outline" className="text-xs">{voice.accent}</Badge>
                    </div>
                  </div>
                  <p className="text-xs text-text-muted mb-3 line-clamp-2">{voice.description}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">{voice.gender}</Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        playVoicePreview()
                      }}
                      disabled={isPreviewPlaying}
                      className="ml-auto text-xs h-7 hover:bg-electric-blue-light"
                    >
                      {isPreviewPlaying ? (
                        <>
                          <Pause className="w-3 h-3 mr-1" />
                          Playing
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3 mr-1" />
                          Preview
                        </>
                      )}
                    </Button>
                  </div>
                  {settings.voice === voice.id && (
                    <div className="absolute top-2 right-2 w-2 h-2 bg-electric-blue rounded-full animate-pulse" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Voice Parameters */}
        <Card className="border-border-light shadow-md hover:shadow-lg transition-shadow bg-white/80 backdrop-blur-sm">
          <div className="p-4 sm:p-6 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-electric-blue-light">
                <Gauge className="w-5 h-5 text-electric-blue" />
              </div>
              <div>
                <h3 className="font-semibold text-forest-green text-base sm:text-lg">Voice Parameters</h3>
                <p className="text-xs sm:text-sm text-text-muted">Fine-tune voice characteristics</p>
              </div>
            </div>

            <Separator />

            {/* Speaking Speed */}
            <div className="space-y-3">
              <Slider
                value={settings.speed}
                onValueChange={(value) => updateSetting('speed', value)}
                min={0.5}
                max={2.0}
                step={0.1}
                label="Speaking Speed"
                showValue
                formatValue={(v) => `${v}x`}
              />
              <div className="flex justify-between text-xs text-text-muted px-1">
                <span>🐌 Slow</span>
                <span>⚡ Fast</span>
              </div>
            </div>

            <Separator />

            {/* Pitch */}
            <div className="space-y-3">
              <Slider
                value={settings.pitch}
                onValueChange={(value) => updateSetting('pitch', value)}
                min={0.5}
                max={2.0}
                step={0.1}
                label="Pitch"
                showValue
                formatValue={(v) => `${v}x`}
              />
              <div className="flex justify-between text-xs text-text-muted px-1">
                <span>🔽 Low</span>
                <span>🔼 High</span>
              </div>
            </div>

            <Separator />

            {/* Volume */}
            <div className="space-y-3">
              <Slider
                value={settings.volume}
                onValueChange={(value) => updateSetting('volume', value)}
                min={0.1}
                max={1.0}
                step={0.1}
                label="Volume"
                showValue
                formatValue={(v) => `${Math.round(v * 100)}%`}
              />
              <div className="flex justify-between text-xs text-text-muted px-1">
                <span>🔇 Quiet</span>
                <span>🔊 Loud</span>
              </div>
            </div>

            <Separator />

            {/* Tone Style */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-forest-green block">Tone Style</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {tones.map((tone) => (
                  <div
                    key={tone.id}
                    className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      settings.tone === tone.id
                        ? 'border-electric-blue bg-gradient-to-br from-electric-blue-light to-white shadow-md'
                        : 'border-border-light hover:border-electric-blue/50 hover:shadow-sm bg-white'
                    }`}
                    onClick={() => updateSetting('tone', tone.id)}
                  >
                    <div className="text-sm font-semibold text-forest-green mb-1">{tone.name}</div>
                    <div className="text-xs text-text-muted">{tone.description}</div>
                    {settings.tone === tone.id && (
                      <div className="absolute top-2 right-2 w-2 h-2 bg-electric-blue rounded-full animate-pulse" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Footer Actions */}
      <div className="bg-white/90 backdrop-blur-md border-t border-border-light sticky bottom-0 z-10 shadow-lg">
        <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
            <Button
              variant="outline"
              onClick={handleReset}
              className="flex items-center justify-center gap-2 min-h-[44px] hover:bg-electric-blue-light hover:border-electric-blue transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="text-sm sm:text-base">Reset to Default</span>
            </Button>

            <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
              <Button
                variant="outline"
                onClick={handleBack}
                className="min-h-[44px] hover:bg-gray-100 transition-all"
              >
                <span className="text-sm sm:text-base">Cancel</span>
              </Button>
              <Button
                onClick={handleSave}
                className="bg-gradient-to-r from-electric-blue to-electric-blue-hover hover:shadow-lg min-h-[44px] flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02]"
              >
                <Save className="w-4 h-4" />
                <span className="text-sm sm:text-base font-medium">Save Settings</span>
              </Button>
            </div>
          </div>

          {hasChanges && (
            <div className="mt-3 text-center">
              <p className="text-xs text-amber-600 bg-amber-50 py-2 px-3 rounded-lg inline-block">
                ⚠️ You have unsaved changes
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

