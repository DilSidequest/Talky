'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Phone, User, MessageSquare, Clock, Volume2, Settings, Play, Save } from 'lucide-react'

interface CallSetupFormProps {
  onSubmit: (callData: CallSetupData) => void
  onCancel: () => void
}

interface CallSetupData {
  phoneNumber: string
  contactName: string
  callPurpose: string
  script: string
  voiceSettings: {
    voice: string
    speed: number
    tone: string
  }
  language: string
  maxDuration: number
  retryAttempts: number
}

export function CallSetupForm({ onSubmit, onCancel }: CallSetupFormProps) {
  const [formData, setFormData] = useState<CallSetupData>({
    phoneNumber: '',
    contactName: '',
    callPurpose: '',
    script: '',
    voiceSettings: {
      voice: 'sarah',
      speed: 1.0,
      tone: 'professional'
    },
    language: 'en-US',
    maxDuration: 5,
    retryAttempts: 2
  })

  const [currentStep, setCurrentStep] = useState(1)
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false)

  const voices = [
    { id: 'sarah', name: 'Sarah', description: 'Professional female voice', accent: 'American' },
    { id: 'james', name: 'James', description: 'Confident male voice', accent: 'British' },
    { id: 'maria', name: 'Maria', description: 'Warm female voice', accent: 'Spanish' },
    { id: 'david', name: 'David', description: 'Friendly male voice', accent: 'Australian' }
  ]

  const tones = [
    { id: 'professional', name: 'Professional', description: 'Business-like and formal' },
    { id: 'friendly', name: 'Friendly', description: 'Warm and approachable' },
    { id: 'casual', name: 'Casual', description: 'Relaxed and informal' },
    { id: 'authoritative', name: 'Authoritative', description: 'Confident and commanding' }
  ]

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof CallSetupData],
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
  }

  const playVoicePreview = () => {
    setIsPreviewPlaying(true)
    // In real app, this would play a voice sample
    setTimeout(() => setIsPreviewPlaying(false), 3000)
  }

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return formData.phoneNumber && formData.contactName && formData.callPurpose
      case 2:
        return formData.script.length > 0
      case 3:
        return true // Voice settings have defaults
      default:
        return true
    }
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3))
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      onSubmit(formData)
    }
  }

  const handleTemplateSelect = (template: string) => {
    const templates = {
      'appointment': 'Hello, this is [Your Name] calling from [Company]. I\'m calling to schedule an appointment for [Service]. Are you available to discuss your availability?',
      'customer-service': 'Hi, this is [Your Name] from [Company] customer service. I\'m following up on your recent inquiry. How can I assist you today?',
      'sales': 'Hello, this is [Your Name] from [Company]. I\'m calling to discuss how our [Product/Service] can benefit your business. Do you have a few minutes to chat?',
      'survey': 'Hi, this is [Your Name] from [Company]. We\'re conducting a brief survey to improve our services. Would you be willing to answer a few quick questions?'
    }
    setFormData(prev => ({ ...prev, script: templates[template as keyof typeof templates] || '' }))
  }

  const handleSaveDraft = () => {
    // In real app, this would save to local storage or backend
    console.log('Saving draft:', formData)
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-4">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep
                    ? 'bg-electric-blue text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step}
              </div>
              {step < 3 && (
                <div
                  className={`w-12 h-0.5 mx-2 ${
                    step < currentStep ? 'bg-electric-blue' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <Card className="p-6">
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-forest-green mb-2">Call Information</h2>
              <p className="text-text-muted">Who are you calling and why?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-forest-green mb-2 block">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <Input
                    placeholder="+1 (555) 123-4567"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-forest-green mb-2 block">
                  Contact Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <Input
                    placeholder="John Smith"
                    value={formData.contactName}
                    onChange={(e) => handleInputChange('contactName', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-forest-green mb-2 block">
                Call Purpose *
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-text-muted" />
                <Textarea
                  placeholder="Describe the purpose of this call (e.g., appointment scheduling, customer service inquiry, sales follow-up)"
                  value={formData.callPurpose}
                  onChange={(e) => handleInputChange('callPurpose', e.target.value)}
                  className="pl-10 min-h-[100px]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-forest-green mb-2 block">
                  Call Language
                </label>
                <select
                  value={formData.language}
                  onChange={(e) => handleInputChange('language', e.target.value)}
                  className="w-full p-2 border border-border-light rounded-md"
                >
                  <option value="en-US">English (US)</option>
                  <option value="en-GB">English (UK)</option>
                  <option value="es-ES">Spanish</option>
                  <option value="fr-FR">French</option>
                  <option value="de-DE">German</option>
                  <option value="ja-JP">Japanese</option>
                  <option value="zh-CN">Chinese</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-forest-green mb-2 block">
                  Max Duration (minutes)
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <Input
                    type="number"
                    min="1"
                    max="30"
                    value={formData.maxDuration}
                    onChange={(e) => handleInputChange('maxDuration', parseInt(e.target.value))}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Script Configuration */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-forest-green mb-2">Conversation Script</h2>
              <p className="text-text-muted">Define what the AI should say and how to handle responses</p>
            </div>

            <div>
              <label className="text-sm font-medium text-forest-green mb-2 block">
                Opening Script *
              </label>
              <Textarea
                placeholder="Hello, this is [AI Name] calling on behalf of [Your Company]. I'm calling to..."
                value={formData.script}
                onChange={(e) => handleInputChange('script', e.target.value)}
                className="min-h-[150px]"
              />
              <p className="text-xs text-text-muted mt-2">
                Use placeholders like [AI Name], [Contact Name], [Your Company] for dynamic content
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4 bg-electric-blue-light">
                <h4 className="font-medium text-forest-green mb-2">Script Templates</h4>
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-xs"
                    onClick={() => handleTemplateSelect('appointment')}
                  >
                    Appointment Scheduling
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-xs"
                    onClick={() => handleTemplateSelect('customer-service')}
                  >
                    Customer Service Follow-up
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-xs"
                    onClick={() => handleTemplateSelect('sales')}
                  >
                    Sales Inquiry
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-xs"
                    onClick={() => handleTemplateSelect('survey')}
                  >
                    Survey Collection
                  </Button>
                </div>
              </Card>

              <Card className="p-4 bg-gray-50">
                <h4 className="font-medium text-forest-green mb-2">Response Handling</h4>
                <div className="space-y-2 text-xs text-text-muted">
                  <p>• AI will adapt responses based on conversation flow</p>
                  <p>• Handles common objections automatically</p>
                  <p>• Escalates complex queries to human</p>
                  <p>• Records all interactions for review</p>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Step 3: Voice Settings */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-forest-green mb-2">Voice Configuration</h2>
              <p className="text-text-muted">Choose how the AI should sound during the call</p>
            </div>

            <div>
              <label className="text-sm font-medium text-forest-green mb-3 block">
                Voice Selection
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {voices.map((voice) => (
                  <Card
                    key={voice.id}
                    className={`p-4 cursor-pointer transition-all ${
                      formData.voiceSettings.voice === voice.id
                        ? 'border-electric-blue bg-electric-blue-light'
                        : 'hover:border-gray-300'
                    }`}
                    onClick={() => handleInputChange('voiceSettings.voice', voice.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-forest-green">{voice.name}</h4>
                      <Badge variant="outline">{voice.accent}</Badge>
                    </div>
                    <p className="text-sm text-text-muted mb-3">{voice.description}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        playVoicePreview()
                      }}
                      disabled={isPreviewPlaying}
                    >
                      <Volume2 className="w-4 h-4 mr-2" />
                      {isPreviewPlaying ? 'Playing...' : 'Preview'}
                    </Button>
                  </Card>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-forest-green mb-3 block">
                  Speaking Speed
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.1"
                    value={formData.voiceSettings.speed}
                    onChange={(e) => handleInputChange('voiceSettings.speed', parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-text-muted">
                    <span>Slow</span>
                    <span>{formData.voiceSettings.speed}x</span>
                    <span>Fast</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-forest-green mb-3 block">
                  Tone Style
                </label>
                <div className="space-y-2">
                  {tones.map((tone) => (
                    <label key={tone.id} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="tone"
                        value={tone.id}
                        checked={formData.voiceSettings.tone === tone.id}
                        onChange={(e) => handleInputChange('voiceSettings.tone', e.target.value)}
                        className="text-electric-blue"
                      />
                      <div>
                        <div className="font-medium text-forest-green text-sm">{tone.name}</div>
                        <div className="text-xs text-text-muted">{tone.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 border-t">
          <div className="flex gap-2">
            {currentStep > 1 && (
              <Button variant="outline" onClick={prevStep}>
                Previous
              </Button>
            )}
            <Button variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          </div>

          <div className="flex gap-2">
            {currentStep < 3 ? (
              <Button
                onClick={nextStep}
                disabled={!validateStep(currentStep)}
                className="bg-electric-blue hover:bg-electric-blue-hover"
              >
                Next Step
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleSaveDraft}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Draft
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="bg-electric-blue hover:bg-electric-blue-hover"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Call
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
