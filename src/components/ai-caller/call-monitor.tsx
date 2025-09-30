'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX, MessageSquare, AlertTriangle, User, Clock, Activity } from 'lucide-react'

interface CallMonitorProps {
  callId: string
  onEndCall: () => void
  onTakeOver: () => void
}

interface CallStatus {
  id: string
  status: 'dialing' | 'ringing' | 'connected' | 'on-hold' | 'ended' | 'failed'
  duration: number
  contactName: string
  phoneNumber: string
  currentPhase: string
  transcript: TranscriptEntry[]
  aiConfidence: number
  voiceActivity: boolean
  backgroundNoise: number
}

interface TranscriptEntry {
  id: string
  timestamp: Date
  speaker: 'ai' | 'human'
  text: string
  confidence: number
  emotion?: string
}

export function CallMonitor({ callId, onEndCall, onTakeOver }: CallMonitorProps) {
  const [callStatus, setCallStatus] = useState<CallStatus>({
    id: callId,
    status: 'dialing',
    duration: 0,
    contactName: 'John Smith',
    phoneNumber: '+1 (555) 123-4567',
    currentPhase: 'Initiating call...',
    transcript: [],
    aiConfidence: 95,
    voiceActivity: false,
    backgroundNoise: 15
  })

  const [isAudioMuted, setIsAudioMuted] = useState(false)
  const [showTranscript, setShowTranscript] = useState(true)
  const [interventionMode, setInterventionMode] = useState(false)

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCallStatus(prev => {
        const newDuration = prev.duration + 1
        let newStatus = prev.status
        let newPhase = prev.currentPhase
        let newTranscript = [...prev.transcript]

        // Simulate call progression
        if (newDuration === 3 && prev.status === 'dialing') {
          newStatus = 'ringing'
          newPhase = 'Ringing...'
        } else if (newDuration === 8 && prev.status === 'ringing') {
          newStatus = 'connected'
          newPhase = 'Opening greeting'
          newTranscript.push({
            id: Date.now().toString(),
            timestamp: new Date(),
            speaker: 'ai',
            text: 'Hello, this is Sarah calling on behalf of TechCorp. Is this John Smith?',
            confidence: 0.98
          })
        } else if (newDuration === 15 && prev.status === 'connected') {
          newPhase = 'Waiting for response'
          newTranscript.push({
            id: (Date.now() + 1).toString(),
            timestamp: new Date(),
            speaker: 'human',
            text: 'Yes, this is John. What can I help you with?',
            confidence: 0.92,
            emotion: 'neutral'
          })
        } else if (newDuration === 20 && prev.status === 'connected') {
          newPhase = 'Explaining purpose'
          newTranscript.push({
            id: (Date.now() + 2).toString(),
            timestamp: new Date(),
            speaker: 'ai',
            text: 'Thank you, John. I\'m calling to follow up on your recent inquiry about our software solutions.',
            confidence: 0.96
          })
        }

        return {
          ...prev,
          duration: newDuration,
          status: newStatus,
          currentPhase: newPhase,
          transcript: newTranscript,
          voiceActivity: Math.random() > 0.7,
          aiConfidence: Math.max(85, Math.min(99, prev.aiConfidence + (Math.random() - 0.5) * 5)),
          backgroundNoise: Math.max(5, Math.min(30, prev.backgroundNoise + (Math.random() - 0.5) * 10))
        }
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'dialing':
      case 'ringing':
        return 'bg-yellow-100 text-yellow-800'
      case 'connected':
        return 'bg-green-100 text-green-800'
      case 'on-hold':
        return 'bg-blue-100 text-blue-800'
      case 'ended':
        return 'bg-gray-100 text-gray-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600'
    if (confidence >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const handleSendPrompt = () => {
    // In real app, this would send a prompt to guide the AI
    console.log('Sending prompt to AI')
  }

  const handleFlagIssue = () => {
    // In real app, this would flag an issue for review
    console.log('Flagging issue for review')
  }

  const handleTransferToHuman = () => {
    // In real app, this would transfer the call to a human agent
    console.log('Transferring call to human agent')
  }

  const handleSendMessage = () => {
    // In real app, this would send a message to guide the AI
    console.log('Sending message to AI')
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Call Status Header */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-electric-blue-light rounded-full flex items-center justify-center">
              <Phone className="w-6 h-6 text-electric-blue" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-forest-green">{callStatus.contactName}</h1>
              <p className="text-text-muted">{callStatus.phoneNumber}</p>
            </div>
            <Badge className={getStatusColor(callStatus.status)}>
              {callStatus.status.charAt(0).toUpperCase() + callStatus.status.slice(1)}
            </Badge>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-2xl font-bold text-forest-green">
                {formatDuration(callStatus.duration)}
              </div>
              <div className="text-sm text-text-muted">Call Duration</div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAudioMuted(!isAudioMuted)}
              >
                {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
              
              <Button
                variant="outline"
                onClick={onTakeOver}
                className="text-yellow-600 hover:text-yellow-700"
              >
                Take Over
              </Button>
              
              <Button
                variant="destructive"
                onClick={onEndCall}
              >
                <PhoneOff className="w-4 h-4 mr-2" />
                End Call
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real-time Metrics */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="p-4">
            <h3 className="font-semibold text-forest-green mb-4">Call Metrics</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-text-muted">AI Confidence</span>
                  <span className={`text-sm font-medium ${getConfidenceColor(callStatus.aiConfidence)}`}>
                    {Math.round(callStatus.aiConfidence)}%
                  </span>
                </div>
                <Progress value={callStatus.aiConfidence} className="h-2" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-text-muted">Background Noise</span>
                  <span className="text-sm font-medium text-forest-green">
                    {Math.round(callStatus.backgroundNoise)}dB
                  </span>
                </div>
                <Progress value={callStatus.backgroundNoise} max={50} className="h-2" />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-text-muted">Voice Activity</span>
                <div className={`w-3 h-3 rounded-full ${callStatus.voiceActivity ? 'bg-green-500' : 'bg-gray-300'}`} />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold text-forest-green mb-4">Current Phase</h3>
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-electric-blue" />
              <span className="text-sm text-forest-green">{callStatus.currentPhase}</span>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold text-forest-green mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={handleSendPrompt}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Send Prompt
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={handleFlagIssue}
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Flag Issue
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={handleTransferToHuman}
              >
                <User className="w-4 h-4 mr-2" />
                Transfer to Human
              </Button>
            </div>
          </Card>
        </div>

        {/* Live Transcript */}
        <div className="lg:col-span-2">
          <Card className="p-4 h-[600px] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-forest-green">Live Transcript</h3>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowTranscript(!showTranscript)}
                >
                  {showTranscript ? 'Hide' : 'Show'} Transcript
                </Button>
              </div>
            </div>

            {showTranscript && (
              <div className="flex-1 overflow-y-auto space-y-3">
                {callStatus.transcript.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-text-muted">
                    <div className="text-center">
                      <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Waiting for conversation to begin...</p>
                    </div>
                  </div>
                ) : (
                  callStatus.transcript.map((entry) => (
                    <div
                      key={entry.id}
                      className={`flex gap-3 ${
                        entry.speaker === 'ai' ? 'justify-start' : 'justify-end'
                      }`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          entry.speaker === 'ai'
                            ? 'bg-electric-blue-light text-forest-green'
                            : 'bg-gray-100 text-forest-green'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium">
                            {entry.speaker === 'ai' ? 'AI Assistant' : callStatus.contactName}
                          </span>
                          <span className="text-xs text-text-muted">
                            {entry.timestamp.toLocaleTimeString()}
                          </span>
                          {entry.confidence && (
                            <Badge variant="outline" className="text-xs">
                              {Math.round(entry.confidence * 100)}%
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm">{entry.text}</p>
                        {entry.emotion && (
                          <div className="mt-1">
                            <Badge variant="outline" className="text-xs">
                              {entry.emotion}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Intervention Mode */}
            {interventionMode && (
              <div className="border-t pt-4 mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-600">Intervention Mode Active</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type message to guide AI..."
                    className="flex-1 px-3 py-2 border border-border-light rounded-md text-sm"
                  />
                  <Button
                    size="sm"
                    className="bg-electric-blue hover:bg-electric-blue-hover"
                    onClick={handleSendMessage}
                  >
                    Send
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
