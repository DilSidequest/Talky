'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
  Chip,
  Divider
} from '@heroui/react'
import {
  Languages,
  Globe,
  Volume2,
  VolumeX,
  Settings,
  Zap,
  Eye,
  EyeOff,
  Download,
  Trash2,
  RefreshCw
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Language {
  code: string
  name: string
  nativeName: string
  flag: string
}

const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' }
]

interface TranslationSettings {
  enabled: boolean
  sourceLanguage: string
  targetLanguage: string
  autoDetectSource: boolean
  showOriginal: boolean
  autoSpeak: boolean
  speakingSpeed: number
  confidence: number
  saveTranslations: boolean
  realTimeMode: boolean
}

interface TranslationSettingsModalProps {
  isOpen: boolean
  onClose: () => void
  settings: TranslationSettings
  onSettingsChange: (settings: TranslationSettings) => void
  onClearHistory?: () => void
  onExportHistory?: () => void
  messageCount?: number
}

export function TranslationSettingsModal({
  isOpen,
  onClose,
  settings,
  onSettingsChange,
  onClearHistory,
  onExportHistory,
  messageCount = 0
}: TranslationSettingsModalProps) {
  const [localSettings, setLocalSettings] = useState<TranslationSettings>(settings)

  const handleSave = () => {
    onSettingsChange(localSettings)
    onClose()
  }

  const handleReset = () => {
    const defaultSettings: TranslationSettings = {
      enabled: true,
      sourceLanguage: 'en',
      targetLanguage: 'es',
      autoDetectSource: true,
      showOriginal: true,
      autoSpeak: false,
      speakingSpeed: 1,
      confidence: 0.7,
      saveTranslations: true,
      realTimeMode: true
    }
    setLocalSettings(defaultSettings)
  }

  const updateSetting = <K extends keyof TranslationSettings>(
    key: K, 
    value: TranslationSettings[K]
  ) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }))
  }

  const getLanguageInfo = (code: string) => {
    return languages.find(lang => lang.code === code) || languages[0]
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="2xl"
      scrollBehavior="inside"
      classNames={{
        base: "max-h-[90vh]",
        body: "py-0"
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-electric-blue-light">
              <Settings className="w-5 h-5 text-electric-blue" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Translation Settings</h2>
              <p className="text-sm text-text-muted">Configure your translation preferences</p>
            </div>
          </div>
        </ModalHeader>

        <ModalBody className="space-y-6">
          {/* Main Toggle */}
          <Card className="border-border-light">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Languages className="w-5 h-5 text-electric-blue" />
                  <div>
                    <h3 className="font-medium">Enable Translation</h3>
                    <p className="text-sm text-text-muted">Turn on real-time translation</p>
                  </div>
                </div>
                <Switch
                  isSelected={localSettings.enabled}
                  onValueChange={(value) => updateSetting('enabled', value)}
                  color="primary"
                />
              </div>
            </CardContent>
          </Card>

          {/* Language Settings */}
          {localSettings.enabled && (
            <Card className="border-border-light">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Language Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Auto-detect source */}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-sm">Auto-detect source language</h4>
                    <p className="text-xs text-text-muted">Automatically detect the spoken language</p>
                  </div>
                  <Switch
                    isSelected={localSettings.autoDetectSource}
                    onValueChange={(value) => updateSetting('autoDetectSource', value)}
                    size="sm"
                    color="primary"
                  />
                </div>

                <Divider />

                {/* Source Language */}
                {!localSettings.autoDetectSource && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Source Language</label>
                    <Select
                      selectedKeys={[localSettings.sourceLanguage]}
                      onSelectionChange={(keys) => {
                        const key = Array.from(keys)[0] as string
                        updateSetting('sourceLanguage', key)
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
                )}

                {/* Target Language */}
                <div>
                  <label className="block text-sm font-medium mb-2">Target Language</label>
                  <Select
                    selectedKeys={[localSettings.targetLanguage]}
                    onSelectionChange={(keys) => {
                      const key = Array.from(keys)[0] as string
                      updateSetting('targetLanguage', key)
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
              </CardContent>
            </Card>
          )}

          {/* Display Settings */}
          {localSettings.enabled && (
            <Card className="border-border-light">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Display Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-sm">Show original text</h4>
                    <p className="text-xs text-text-muted">Display both original and translated text</p>
                  </div>
                  <Switch
                    isSelected={localSettings.showOriginal}
                    onValueChange={(value) => updateSetting('showOriginal', value)}
                    size="sm"
                    color="primary"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-sm">Real-time mode</h4>
                    <p className="text-xs text-text-muted">Translate as you speak</p>
                  </div>
                  <Switch
                    isSelected={localSettings.realTimeMode}
                    onValueChange={(value) => updateSetting('realTimeMode', value)}
                    size="sm"
                    color="primary"
                  />
                </div>

                <Divider />

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Confidence Threshold: {Math.round(localSettings.confidence * 100)}%
                  </label>
                  <Slider
                    size="sm"
                    step={0.1}
                    minValue={0.1}
                    maxValue={1}
                    value={localSettings.confidence}
                    onChange={(value) => updateSetting('confidence', Array.isArray(value) ? value[0] : value)}
                    className="w-full"
                    classNames={{
                      track: "bg-gray-200",
                      filler: "bg-electric-blue",
                      thumb: "bg-electric-blue"
                    }}
                  />
                  <p className="text-xs text-text-muted mt-1">
                    Only show translations above this confidence level
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Audio Settings */}
          {localSettings.enabled && (
            <Card className="border-border-light">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Volume2 className="w-4 h-4" />
                  Audio Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-sm">Auto-speak translations</h4>
                    <p className="text-xs text-text-muted">Automatically read translated text aloud</p>
                  </div>
                  <Switch
                    isSelected={localSettings.autoSpeak}
                    onValueChange={(value) => updateSetting('autoSpeak', value)}
                    size="sm"
                    color="primary"
                  />
                </div>

                {localSettings.autoSpeak && (
                  <>
                    <Divider />
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Speaking Speed: {localSettings.speakingSpeed}x
                      </label>
                      <Slider
                        size="sm"
                        step={0.1}
                        minValue={0.5}
                        maxValue={2}
                        value={localSettings.speakingSpeed}
                        onChange={(value) => updateSetting('speakingSpeed', Array.isArray(value) ? value[0] : value)}
                        className="w-full"
                        classNames={{
                          track: "bg-gray-200",
                          filler: "bg-electric-blue",
                          thumb: "bg-electric-blue"
                        }}
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* Data Management */}
          <Card className="border-border-light">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Download className="w-4 h-4" />
                Data Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-sm">Save translation history</h4>
                  <p className="text-xs text-text-muted">Keep a record of all translations</p>
                </div>
                <Switch
                  isSelected={localSettings.saveTranslations}
                  onValueChange={(value) => updateSetting('saveTranslations', value)}
                  size="sm"
                  color="primary"
                />
              </div>

              {messageCount > 0 && (
                <>
                  <Divider />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm">Translation History</p>
                      <p className="text-xs text-text-muted">{messageCount} messages saved</p>
                    </div>
                    <div className="flex gap-2">
                      <HeroButton
                        size="sm"
                        variant="bordered"
                        onPress={onExportHistory}
                        startContent={<Download className="w-3 h-3" />}
                      >
                        Export
                      </HeroButton>
                      <HeroButton
                        size="sm"
                        color="danger"
                        variant="bordered"
                        onPress={onClearHistory}
                        startContent={<Trash2 className="w-3 h-3" />}
                      >
                        Clear
                      </HeroButton>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </ModalBody>

        <ModalFooter>
          <HeroButton
            variant="bordered"
            onPress={handleReset}
            startContent={<RefreshCw className="w-4 h-4" />}
          >
            Reset
          </HeroButton>
          <HeroButton
            variant="bordered"
            onPress={onClose}
          >
            Cancel
          </HeroButton>
          <HeroButton
            color="primary"
            onPress={handleSave}
          >
            Save Settings
          </HeroButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
