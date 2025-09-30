'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { CallSetupForm } from '@/components/ai-caller/call-setup-form'
import { CallMonitor } from '@/components/ai-caller/call-monitor'
import { Phone, Plus, History, Settings, Play, Pause, PhoneCall, TrendingUp, CheckCircle, XCircle, AlertCircle, Clock, Calendar, MessageSquare, User } from 'lucide-react'

interface CallHistoryItem {
  id: string
  contactName: string
  phoneNumber: string
  purpose: string
  status: 'completed' | 'failed' | 'in-progress' | 'scheduled'
  duration: number
  timestamp: Date
  outcome: string
  transcript?: string
  aiConfidence: number
}

interface VoiceSettings {
  voice: string
  speed: number
  tone: string
  language: string
  pitch: number
  volume: number
}

const getLanguageDisplay = (code: string) => {
  const languages: { [key: string]: string } = {
    'en-US': '🇺🇸 English (US)',
    'en-GB': '🇬🇧 English (UK)',
    'es-ES': '🇪🇸 Spanish (Spain)',
    'es-MX': '🇲🇽 Spanish (Mexico)',
    'fr-FR': '🇫🇷 French',
    'de-DE': '🇩🇪 German',
    'it-IT': '🇮🇹 Italian',
    'pt-BR': '🇧🇷 Portuguese (Brazil)',
    'ja-JP': '🇯🇵 Japanese',
    'ko-KR': '🇰🇷 Korean',
    'zh-CN': '🇨🇳 Chinese (Simplified)',
    'hi-IN': '🇮🇳 Hindi',
    'ar-SA': '🇸🇦 Arabic'
  }
  return languages[code] || code
}

const getVoiceDisplay = (voiceId: string) => {
  const voices: { [key: string]: string } = {
    'sarah': 'Sarah (Professional Female)',
    'james': 'James (Confident Male)',
    'maria': 'Maria (Warm Female)',
    'david': 'David (Friendly Male)',
    'sophie': 'Sophie (Elegant Female)',
    'hans': 'Hans (Clear Male)',
    'lucia': 'Lucia (Melodic Female)',
    'carlos': 'Carlos (Energetic Male)'
  }
  return voices[voiceId] || voiceId.charAt(0).toUpperCase() + voiceId.slice(1)
}

export default function AICallerPage() {
  const router = useRouter()
  const [showCallSetup, setShowCallSetup] = useState(false)
  const [activeCallId, setActiveCallId] = useState<string | null>(null)
  const [selectedCallForDetails, setSelectedCallForDetails] = useState<CallHistoryItem | null>(null)
  const [selectedCallForTranscript, setSelectedCallForTranscript] = useState<CallHistoryItem | null>(null)
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    voice: 'sarah',
    speed: 1.0,
    tone: 'professional',
    language: 'en-US',
    pitch: 1.0,
    volume: 0.8
  })

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('voiceSettings')
    if (savedSettings) {
      setVoiceSettings(JSON.parse(savedSettings))
    }
  }, [])
  const [callHistory, setCallHistory] = useState<CallHistoryItem[]>([
    {
      id: '1',
      contactName: 'John Smith',
      phoneNumber: '+1 (555) 123-4567',
      purpose: 'Appointment scheduling follow-up',
      status: 'completed',
      duration: 180,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      outcome: 'Appointment scheduled for next Tuesday',
      transcript: `AI: Hello, this is calling on behalf of Dr. Martinez's office. May I speak with John Smith?

John: Yes, this is John speaking.

AI: Hi John! I'm calling to follow up on your recent appointment request. We have availability next Tuesday at 2 PM or Thursday at 10 AM. Which time works better for you?

John: Tuesday at 2 PM would be perfect.

AI: Excellent! I've scheduled your appointment for Tuesday, March 19th at 2:00 PM with Dr. Martinez. You'll receive a confirmation email shortly. Is there anything else I can help you with?

John: No, that's all. Thank you!

AI: You're welcome, John. Have a great day!`,
      aiConfidence: 94
    },
    {
      id: '2',
      contactName: 'Sarah Johnson',
      phoneNumber: '+1 (555) 987-6543',
      purpose: 'Customer satisfaction survey',
      status: 'completed',
      duration: 240,
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      outcome: 'Survey completed, positive feedback received',
      transcript: `AI: Good afternoon! This is an automated call from TechCorp. We're conducting a brief customer satisfaction survey. Do you have 2-3 minutes to share your feedback?

Sarah: Sure, I can do that.

AI: Great! On a scale of 1 to 10, how satisfied are you with our recent service?

Sarah: I'd say an 8.

AI: Thank you! What did you like most about our service?

Sarah: The response time was excellent, and the support team was very knowledgeable.

AI: That's wonderful to hear! Is there anything we could improve?

Sarah: Maybe extend your support hours to weekends.

AI: Thank you for that valuable feedback. We'll share this with our team. Have a great day!

Sarah: You too, thanks!`,
      aiConfidence: 89
    },
    {
      id: '3',
      contactName: 'Mike Wilson',
      phoneNumber: '+1 (555) 456-7890',
      purpose: 'Product demo scheduling',
      status: 'failed',
      duration: 45,
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      outcome: 'No answer, voicemail left',
      aiConfidence: 0
    }
  ])

  const handleStartCall = (callData: any) => {
    const newCallId = Date.now().toString()
    setActiveCallId(newCallId)
    setShowCallSetup(false)

    // Add to history as in-progress
    const newCall: CallHistoryItem = {
      id: newCallId,
      contactName: callData.contactName,
      phoneNumber: callData.phoneNumber,
      purpose: callData.callPurpose,
      status: 'in-progress',
      duration: 0,
      timestamp: new Date(),
      outcome: 'Call in progress...',
      aiConfidence: 95
    }
    setCallHistory(prev => [newCall, ...prev])
  }

  const handleEndCall = () => {
    if (activeCallId) {
      setCallHistory(prev =>
        prev.map(call =>
          call.id === activeCallId
            ? { ...call, status: 'completed' as const, outcome: 'Call completed successfully' }
            : call
        )
      )
      setActiveCallId(null)
    }
  }

  const handleTakeOver = () => {
    // Handle human takeover
    console.log('Taking over call...')
  }



  const handleConfigureVoice = () => {
    router.push('/ai-caller/voice-settings')
  }

  const handleViewAllCalls = () => {
    // In real app, this would show all call history
    console.log('Viewing all calls...')
  }

  const handleViewCallDetails = (callId: string) => {
    const call = callHistory.find(c => c.id === callId)
    if (call) {
      setSelectedCallForDetails(call)
    }
  }

  const handleViewTranscript = (callId: string) => {
    const call = callHistory.find(c => c.id === callId)
    if (call) {
      setSelectedCallForTranscript(call)
    }
  }

  const handleUseTemplate = (templateId: string) => {
    // In real app, this would load template into call setup
    console.log('Using template:', templateId)
    setShowCallSetup(true)
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />
      case 'in-progress':
        return <Play className="w-4 h-4 text-blue-600" />
      case 'scheduled':
        return <Clock className="w-4 h-4 text-yellow-600" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      case 'in-progress':
        return 'bg-blue-100 text-blue-800'
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // If there's an active call, show the monitor
  if (activeCallId) {
    return (
      <CallMonitor
        callId={activeCallId}
        onEndCall={handleEndCall}
        onTakeOver={handleTakeOver}
      />
    )
  }

  // If showing call setup, render the form
  if (showCallSetup) {
    return (
      <CallSetupForm
        onSubmit={handleStartCall}
        onCancel={() => setShowCallSetup(false)}
      />
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-forest-green">AI Phone Caller</h1>
          <p className="text-text-secondary">Let AI make calls in any language for you</p>
        </div>
        <Button
          onClick={() => setShowCallSetup(true)}
          className="bg-electric-blue hover:bg-electric-blue-hover"
        >
          <Plus className="w-4 h-4 mr-2" />
          New AI Call
        </Button>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 h-auto">
          <TabsTrigger value="dashboard" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 px-1 sm:px-3 text-xs sm:text-sm">
            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="truncate">Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 px-1 sm:px-3 text-xs sm:text-sm">
            <History className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="truncate">History</span>
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 px-1 sm:px-3 text-xs sm:text-sm">
            <Phone className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="truncate">Templates</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 px-1 sm:px-3 text-xs sm:text-sm">
            <Settings className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="truncate">Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card
              className="p-6 text-center hover:shadow-md transition-all cursor-pointer hover:border-electric-blue"
              onClick={() => setShowCallSetup(true)}
            >
              <div className="w-12 h-12 bg-electric-blue-light rounded-lg flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-electric-blue" />
              </div>
              <h3 className="font-semibold text-forest-green mb-2">Make AI Call</h3>
              <p className="text-text-muted text-sm mb-4">Configure and start a new AI-powered call</p>
              <Button
                className="w-full bg-electric-blue hover:bg-electric-blue-hover"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowCallSetup(true)
                }}
              >
                Start New Call
              </Button>
            </Card>

            <Card className="p-6 text-center hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-electric-blue-light rounded-lg flex items-center justify-center mx-auto mb-4">
                <Settings className="w-6 h-6 text-electric-blue" />
              </div>
              <h3 className="font-semibold text-forest-green mb-2">Voice Settings</h3>
              <p className="text-text-muted text-sm mb-4">Customize AI voice and behavior preferences</p>
              <Button variant="outline" className="w-full" onClick={handleConfigureVoice}>
                Configure Voice
              </Button>
            </Card>
          </div>

          {/* Recent Calls */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-forest-green">Recent AI Calls</h2>
              <Button variant="ghost" size="sm" onClick={handleViewAllCalls}>
                View All
              </Button>
            </div>

            {callHistory.length === 0 ? (
              <Card className="p-12 text-center">
                <Phone className="w-16 h-16 text-text-muted mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-forest-green mb-2">
                  No AI calls yet
                </h3>
                <p className="text-text-secondary mb-6">
                  Configure your first AI call to get started
                </p>
                <Button
                  onClick={() => setShowCallSetup(true)}
                  className="bg-electric-blue hover:bg-electric-blue-hover"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create AI Call
                </Button>
              </Card>
            ) : (
              <div className="space-y-3">
                {callHistory.slice(0, 5).map((call) => (
                  <Card key={call.id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-electric-blue-light rounded-full flex items-center justify-center">
                          <PhoneCall className="w-5 h-5 text-electric-blue" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-forest-green">{call.contactName}</h4>
                            <Badge className={getStatusColor(call.status)}>
                              {call.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-text-muted">{call.phoneNumber}</p>
                          <p className="text-sm text-forest-green">{call.purpose}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-1">
                          {getStatusIcon(call.status)}
                          <span className="text-sm font-medium text-forest-green">
                            {formatDuration(call.duration)}
                          </span>
                        </div>
                        <p className="text-xs text-text-muted">
                          {call.timestamp.toLocaleDateString()} {call.timestamp.toLocaleTimeString()}
                        </p>
                        {call.aiConfidence > 0 && (
                          <p className="text-xs text-text-muted">
                            AI Confidence: {call.aiConfidence}%
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-border-light">
                      <p className="text-sm text-forest-green">{call.outcome}</p>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="history">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-forest-green">Call History</h2>
              <div className="flex gap-2">
                <select className="px-3 py-2 border border-border-light rounded-md text-sm">
                  <option>All Status</option>
                  <option>Completed</option>
                  <option>Failed</option>
                  <option>In Progress</option>
                </select>
                <select className="px-3 py-2 border border-border-light rounded-md text-sm">
                  <option>Last 30 days</option>
                  <option>Last 7 days</option>
                  <option>Today</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              {callHistory.map((call) => (
                <Card key={call.id} className="p-4 sm:p-5 hover:shadow-md transition-shadow">
                  {/* Mobile Layout */}
                  <div className="flex flex-col gap-4 md:hidden">
                    {/* Header with Icon and Title */}
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-electric-blue-light rounded-lg flex items-center justify-center">
                          <PhoneCall className="w-6 h-6 text-electric-blue" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-forest-green text-lg mb-2">{call.contactName}</h4>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge className={getStatusColor(call.status)}>
                            {call.status}
                          </Badge>
                          {call.aiConfidence > 0 && (
                            <Badge variant="outline" className="text-xs">
                              {call.aiConfidence}% confidence
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Call Details */}
                    <div className="space-y-3 pl-0">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-text-muted">
                          <Phone className="w-4 h-4 flex-shrink-0" />
                          <span>{call.phoneNumber}</span>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                          <p className="text-sm">
                            <strong className="text-forest-green">Purpose:</strong>
                            <span className="text-text-muted block mt-1">{call.purpose}</span>
                          </p>
                          <p className="text-sm">
                            <strong className="text-forest-green">Outcome:</strong>
                            <span className="text-text-muted block mt-1">{call.outcome}</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 text-xs text-text-muted">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>Duration: {formatDuration(call.duration)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{call.timestamp.toLocaleDateString()} at {call.timestamp.toLocaleTimeString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewCallDetails(call.id)}
                      className="w-full text-electric-blue hover:text-electric-blue-hover border-electric-blue hover:bg-electric-blue-light"
                    >
                      View Details
                    </Button>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden md:flex items-start justify-between gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-electric-blue-light rounded-lg flex items-center justify-center">
                        <PhoneCall className="w-6 h-6 text-electric-blue" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-semibold text-forest-green">{call.contactName}</h4>
                          <Badge className={getStatusColor(call.status)}>
                            {call.status}
                          </Badge>
                          {call.aiConfidence > 0 && (
                            <Badge variant="outline" className="text-xs">
                              {call.aiConfidence}% confidence
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Call Details */}
                      <div className="space-y-2">
                        <div className="text-sm text-text-muted">
                          <p className="mb-1">{call.phoneNumber}</p>
                          <p className="mb-1"><strong className="text-forest-green">Purpose:</strong> {call.purpose}</p>
                          <p className="mb-1"><strong className="text-forest-green">Outcome:</strong> {call.outcome}</p>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-text-muted">
                          <span><Clock className="w-3 h-3 inline mr-1" />{formatDuration(call.duration)}</span>
                          <span><Calendar className="w-3 h-3 inline mr-1" />{call.timestamp.toLocaleDateString()} at {call.timestamp.toLocaleTimeString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewCallDetails(call.id)}
                        className="text-electric-blue hover:text-electric-blue-hover"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="templates">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-forest-green mb-2">Call Templates</h2>
              <p className="text-text-muted">Pre-configured templates for common call scenarios</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  id: 'appointment-scheduling',
                  name: 'Appointment Scheduling',
                  description: 'Schedule appointments and follow up on bookings',
                  category: 'Business'
                },
                {
                  id: 'customer-survey',
                  name: 'Customer Survey',
                  description: 'Collect customer feedback and satisfaction ratings',
                  category: 'Research'
                },
                {
                  id: 'sales-followup',
                  name: 'Sales Follow-up',
                  description: 'Follow up on leads and sales inquiries',
                  category: 'Sales'
                },
                {
                  id: 'payment-reminder',
                  name: 'Payment Reminder',
                  description: 'Gentle reminders for overdue payments',
                  category: 'Finance'
                },
                {
                  id: 'event-invitation',
                  name: 'Event Invitation',
                  description: 'Invite contacts to events and gatherings',
                  category: 'Marketing'
                },
                {
                  id: 'support-checkin',
                  name: 'Support Check-in',
                  description: 'Check in with customers after support interactions',
                  category: 'Support'
                }
              ].map((template, index) => (
                <Card key={index} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="mb-3">
                    <Badge variant="outline" className="mb-2">{template.category}</Badge>
                    <h3 className="font-semibold text-forest-green">{template.name}</h3>
                  </div>
                  <p className="text-sm text-text-muted mb-4">{template.description}</p>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => handleUseTemplate(template.id)}>
                    Use Template
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-forest-green">Voice & Language Settings</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleConfigureVoice}
                  className="flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Configure
                </Button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-forest-green mb-2 block">
                      Current Language
                    </label>
                    <div className="p-2 bg-gray-50 rounded-md text-sm">
                      {getLanguageDisplay(voiceSettings.language)}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-forest-green mb-2 block">
                      Current Voice
                    </label>
                    <div className="p-2 bg-gray-50 rounded-md text-sm">
                      {getVoiceDisplay(voiceSettings.voice)}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-forest-green mb-2 block">
                      Speaking Speed
                    </label>
                    <div className="p-2 bg-gray-50 rounded-md text-sm">
                      {voiceSettings.speed}x
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-forest-green mb-2 block">
                      Tone Style
                    </label>
                    <div className="p-2 bg-gray-50 rounded-md text-sm capitalize">
                      {voiceSettings.tone}
                    </div>
                  </div>
                </div>
                <div className="pt-2">
                  <Button
                    onClick={handleConfigureVoice}
                    className="w-full bg-electric-blue hover:bg-electric-blue-hover"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Open Voice & Language Settings
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-forest-green mb-4">Call Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-forest-green">Auto-retry failed calls</span>
                  <input type="checkbox" className="rounded" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-forest-green">Record all calls</span>
                  <input type="checkbox" className="rounded" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-forest-green">Send call summaries</span>
                  <input type="checkbox" className="rounded" defaultChecked />
                </div>
                <div>
                  <label className="text-sm font-medium text-forest-green mb-2 block">
                    Max call duration (minutes)
                  </label>
                  <input type="number" min="1" max="30" defaultValue="10" className="w-full p-2 border border-border-light rounded-md" />
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      {showCallSetup && (
        <CallSetupForm
          onSubmit={(data) => {
            console.log('Call setup data:', data)
            setShowCallSetup(false)
            // In real app, this would start the call
          }}
          onCancel={() => setShowCallSetup(false)}
        />
      )}

      {/* Call Details Modal */}
      <Dialog open={!!selectedCallForDetails} onOpenChange={(open) => !open && setSelectedCallForDetails(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="w-10 h-10 bg-electric-blue-light rounded-lg flex items-center justify-center">
                <PhoneCall className="w-5 h-5 text-electric-blue" />
              </div>
              <div>
                <div className="text-xl font-semibold text-forest-green">Call Details</div>
                <div className="text-sm text-text-muted font-normal">{selectedCallForDetails?.contactName}</div>
              </div>
            </DialogTitle>
          </DialogHeader>

          {selectedCallForDetails && (
            <div className="space-y-6 py-4">
              {/* Status Badge */}
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(selectedCallForDetails.status)}>
                  {selectedCallForDetails.status}
                </Badge>
                {selectedCallForDetails.aiConfidence > 0 && (
                  <Badge variant="outline">
                    {selectedCallForDetails.aiConfidence}% AI Confidence
                  </Badge>
                )}
              </div>

              {/* Contact Information */}
              <Card className="p-4">
                <h3 className="font-semibold text-forest-green mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Contact Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-muted">Name:</span>
                    <span className="font-medium text-forest-green">{selectedCallForDetails.contactName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Phone Number:</span>
                    <span className="font-medium text-forest-green">{selectedCallForDetails.phoneNumber}</span>
                  </div>
                </div>
              </Card>

              {/* Call Information */}
              <Card className="p-4">
                <h3 className="font-semibold text-forest-green mb-3 flex items-center gap-2">
                  <PhoneCall className="w-4 h-4" />
                  Call Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-muted">Purpose:</span>
                    <span className="font-medium text-forest-green text-right max-w-[60%]">{selectedCallForDetails.purpose}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Duration:</span>
                    <span className="font-medium text-forest-green">{formatDuration(selectedCallForDetails.duration)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Date & Time:</span>
                    <span className="font-medium text-forest-green">
                      {selectedCallForDetails.timestamp.toLocaleDateString()} at {selectedCallForDetails.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Outcome */}
              <Card className="p-4">
                <h3 className="font-semibold text-forest-green mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Call Outcome
                </h3>
                <p className="text-sm text-forest-green">{selectedCallForDetails.outcome}</p>
              </Card>

              {/* Transcript Link */}
              {selectedCallForDetails.transcript && (
                <Button
                  className="w-full bg-electric-blue hover:bg-electric-blue-hover"
                  onClick={() => {
                    setSelectedCallForDetails(null)
                    setSelectedCallForTranscript(selectedCallForDetails)
                  }}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  View Full Transcript
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Transcript Modal */}
      <Dialog open={!!selectedCallForTranscript} onOpenChange={(open) => !open && setSelectedCallForTranscript(null)}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="w-10 h-10 bg-electric-blue-light rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-electric-blue" />
              </div>
              <div>
                <div className="text-xl font-semibold text-forest-green">Call Transcript</div>
                <div className="text-sm text-text-muted font-normal">{selectedCallForTranscript?.contactName}</div>
              </div>
            </DialogTitle>
            <DialogDescription>
              {selectedCallForTranscript && (
                <div className="flex items-center gap-2 text-xs mt-2">
                  <span>{selectedCallForTranscript.timestamp.toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{formatDuration(selectedCallForTranscript.duration)}</span>
                  <span>•</span>
                  <Badge className={getStatusColor(selectedCallForTranscript.status)} variant="outline">
                    {selectedCallForTranscript.status}
                  </Badge>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>

          {selectedCallForTranscript && (
            <div className="flex-1 overflow-y-auto py-4">
              <Card className="p-4">
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap text-sm text-forest-green">
                    {selectedCallForTranscript.transcript || 'No transcript available for this call.'}
                  </div>
                </div>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
