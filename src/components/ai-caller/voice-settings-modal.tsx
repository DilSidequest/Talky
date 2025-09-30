'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter,
  Button as HeroButton,
  Switch,
  Select,
  SelectItem,
  Slider,
  Divider
} from '@heroui/react'
import {
  Volume2,
  Settings,
  Globe,
  Play,
  Pause,
  RotateCcw
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
  { code: 'zh-CN', name: 'Chinese (Simplified)', nativeName: '中文', flag: '🇨🇳' },
  { code: 'hi-IN', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ar-SA', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' }
]

const voices: Voice[] = [
  { id: 'sarah', name: 'Sarah', description: 'Professional female voice', accent: 'American', gender: 'female', language: 'en-US' },
  { id: 'james', name: 'James', description: 'Confident male voice', accent: 'British', gender: 'male', language: 'en-GB' },
  { id: 'maria', name: 'Maria', description: 'Warm female voice', accent: 'Spanish', gender: 'female', language: 'es-ES' },
  { id: 'david', name: 'David', description: 'Friendly male voice', accent: 'Australian', gender: 'male', language: 'en-US' },
  { id: 'sophie', name: 'Sophie', description: 'Elegant female voice', accent: 'French', gender: 'female', language: 'fr-FR' },
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

interface VoiceSettingsModalProps {
  isOpen: boolean
  onClose: () => void
  settings: VoiceSettings
  onSettingsChange: (settings: VoiceSettings) => void
}

export function VoiceSettingsModal({
  isOpen,
  onClose,
  settings,
  onSettingsChange
}: VoiceSettingsModalProps) {
  const [localSettings, setLocalSettings] = useState<VoiceSettings>(settings)
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false)

  const updateSetting = (key: keyof VoiceSettings, value: any) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    onSettingsChange(localSettings)
    onClose()
  }

  const handleReset = () => {
    const defaultSettings: VoiceSettings = {
      voice: 'sarah',
      speed: 1.0,
      tone: 'professional',
      language: 'en-US',
      pitch: 1.0,
      volume: 0.8
    }
    setLocalSettings(defaultSettings)
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
    return voices.filter(voice => voice.language === localSettings.language)
  }

  const selectedVoice = voices.find(v => v.id === localSettings.voice)
  const selectedLanguage = getLanguageInfo(localSettings.language)

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      scrollBehavior="inside"
      classNames={{
        base: "max-h-[90vh] mx-4 sm:mx-auto",
        header: "border-b border-border-light px-4 sm:px-6",
        body: "py-0",
        footer: "border-t border-border-light px-4 sm:px-6 py-4"
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-electric-blue-light">
              <Settings className="w-5 h-5 text-electric-blue" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-forest-green">Voice & Language Settings</h2>
              <p className="text-sm text-text-muted">Configure AI voice and language preferences</p>
            </div>
          </div>
        </ModalHeader>

        <ModalBody className="space-y-4 px-4 sm:px-6 py-4">
          {/* Language Selection */}
          <Card className="border-border-light">
            <div className="p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                <Globe className="w-5 h-5 text-electric-blue" />
                <div>
                  <h3 className="font-medium text-forest-green">Language</h3>
                  <p className="text-sm text-text-muted">Choose the language for AI calls</p>
                </div>
              </div>
              
              <Select
                selectedKeys={[localSettings.language]}
                onSelectionChange={(keys) => {
                  const key = Array.from(keys)[0] as string
                  updateSetting('language', key)
                  // Reset voice to first available for new language
                  const availableVoices = voices.filter(v => v.language === key)
                  if (availableVoices.length > 0) {
                    updateSetting('voice', availableVoices[0].id)
                  }
                }}
                className="w-full"
                renderValue={(items) => {
                  const item = items[0]
                  const lang = getLanguageInfo(item.key as string)
                  return (
                    <div className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </div>
                  )
                }}
              >
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    <div className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                      <span className="text-text-muted">({lang.nativeName})</span>
                    </div>
                  </SelectItem>
                ))}
              </Select>
            </div>
          </Card>

          {/* Voice Selection */}
          <Card className="border-border-light">
            <div className="p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                <Volume2 className="w-5 h-5 text-electric-blue" />
                <div>
                  <h3 className="font-medium text-forest-green">Voice Selection</h3>
                  <p className="text-sm text-text-muted">Choose an AI voice for {selectedLanguage.name}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {getFilteredVoices().map((voice) => (
                  <Card
                    key={voice.id}
                    className={`p-3 sm:p-4 cursor-pointer transition-all ${
                      localSettings.voice === voice.id
                        ? 'border-electric-blue bg-electric-blue-light'
                        : 'hover:border-border-medium'
                    }`}
                    onClick={() => updateSetting('voice', voice.id)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-forest-green text-sm">{voice.name}</h4>
                      <div className="flex flex-col sm:flex-row gap-1">
                        <Badge variant="outline" className="text-xs">{voice.accent}</Badge>
                        <Badge variant="outline" className="text-xs">{voice.gender}</Badge>
                      </div>
                    </div>
                    <p className="text-xs text-text-muted mb-3">{voice.description}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        playVoicePreview()
                      }}
                      disabled={isPreviewPlaying}
                      className="h-7 text-xs"
                    >
                      {isPreviewPlaying ? <Pause className="w-3 h-3 mr-1" /> : <Play className="w-3 h-3 mr-1" />}
                      {isPreviewPlaying ? 'Playing...' : 'Preview'}
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          </Card>

          {/* Voice Parameters */}
          <Card className="border-border-light">
            <div className="p-4 sm:p-6 space-y-6">
              <h3 className="font-medium text-forest-green">Voice Parameters</h3>
              
              {/* Speaking Speed */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-forest-green">Speaking Speed</label>
                  <span className="text-sm text-text-muted">{localSettings.speed}x</span>
                </div>
                <Slider
                  value={[localSettings.speed]}
                  onValueChange={(value) => updateSetting('speed', value[0])}
                  min={0.5}
                  max={2.0}
                  step={0.1}
                  className="w-full"
                  color="primary"
                />
                <div className="flex justify-between text-xs text-text-muted mt-1">
                  <span>Slow</span>
                  <span>Fast</span>
                </div>
              </div>

              {/* Pitch */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-forest-green">Pitch</label>
                  <span className="text-sm text-text-muted">{localSettings.pitch}x</span>
                </div>
                <Slider
                  value={[localSettings.pitch]}
                  onValueChange={(value) => updateSetting('pitch', value[0])}
                  min={0.7}
                  max={1.3}
                  step={0.1}
                  className="w-full"
                  color="primary"
                />
                <div className="flex justify-between text-xs text-text-muted mt-1">
                  <span>Low</span>
                  <span>High</span>
                </div>
              </div>

              {/* Volume */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-forest-green">Volume</label>
                  <span className="text-sm text-text-muted">{Math.round(localSettings.volume * 100)}%</span>
                </div>
                <Slider
                  value={[localSettings.volume]}
                  onValueChange={(value) => updateSetting('volume', value[0])}
                  min={0.1}
                  max={1.0}
                  step={0.1}
                  className="w-full"
                  color="primary"
                />
                <div className="flex justify-between text-xs text-text-muted mt-1">
                  <span>Quiet</span>
                  <span>Loud</span>
                </div>
              </div>

              {/* Tone Style */}
              <div>
                <label className="text-sm font-medium text-forest-green mb-3 block">Tone Style</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {tones.map((tone) => (
                    <Card
                      key={tone.id}
                      className={`p-3 cursor-pointer transition-all ${
                        localSettings.tone === tone.id
                          ? 'border-electric-blue bg-electric-blue-light'
                          : 'hover:border-border-medium'
                      }`}
                      onClick={() => updateSetting('tone', tone.id)}
                    >
                      <div className="text-sm font-medium text-forest-green">{tone.name}</div>
                      <div className="text-xs text-text-muted">{tone.description}</div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </ModalBody>

        <ModalFooter className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0">
          <Button
            variant="outline"
            onClick={handleReset}
            className="flex items-center justify-center gap-2 min-h-[44px]"
          >
            <RotateCcw className="w-4 h-4" />
            Reset to Default
          </Button>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={onClose}
              className="min-h-[44px] order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-electric-blue hover:bg-electric-blue-hover min-h-[44px] order-1 sm:order-2"
            >
              Save Settings
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
