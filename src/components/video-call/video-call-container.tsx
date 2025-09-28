'use client'

import { useState, useEffect } from 'react'
import { ParticipantGrid } from './participant-grid'
import { CallControls } from '../call/call-controls'
import { SimpleChatBox } from '../call/simple-chat-box'
import { TranslationSettingsModal } from '../call/translation-settings-modal'
import { CallSettingsPanel } from '../call/call-settings-panel'
import { MeetingInfoDisplay } from '../call/meeting-info-display'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Chip, Button as HeroButton } from '@heroui/react'
import { useMediaStream } from '@/hooks/useMediaStream'
import {
  X,
  Maximize2,
  Minimize2,
  Wifi,
  Clock,
  MessageCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { CallState, CallControls as CallControlsType, CallLayoutConfig } from '@/types/call'

interface VideoCallContainerProps {
  callId: string
  initialCallState?: Partial<CallState>
  onCallEnd?: () => void
  className?: string
}

// Mock data for demonstration
const mockParticipants = [
  {
    id: 'local',
    name: 'You',
    isLocal: true,
    isMuted: false,
    isCameraOn: true,
    isScreenSharing: false,
    language: 'en',
    status: 'connected' as const,
    joinedAt: new Date().toISOString(),
    networkQuality: 'excellent' as const,
    audioLevel: 0.5
  },
  {
    id: 'participant-1',
    name: 'Alice Johnson',
    isLocal: false,
    isMuted: false,
    isCameraOn: true,
    isScreenSharing: false,
    language: 'es',
    status: 'connected' as const,
    joinedAt: new Date().toISOString(),
    networkQuality: 'good' as const,
    audioLevel: 0.3
  },
  {
    id: 'participant-2',
    name: 'Bob Chen',
    isLocal: false,
    isMuted: true,
    isCameraOn: false,
    isScreenSharing: false,
    language: 'zh',
    status: 'connected' as const,
    joinedAt: new Date().toISOString(),
    networkQuality: 'excellent' as const
  }
]

export function VideoCallContainer({
  callId,
  initialCallState,
  onCallEnd,
  className
}: VideoCallContainerProps) {
  // Initialize media stream with video and audio
  const [mediaState, mediaControls] = useMediaStream({ video: true, audio: true })

  const [callState, setCallState] = useState<CallState>({
    id: callId,
    type: 'video',
    status: 'connected',
    participants: mockParticipants,
    localParticipant: mockParticipants[0],
    settings: {
      video: true,
      audio: true,
      screenShare: false,
      recording: false,
      translation: {
        enabled: true,
        sourceLanguage: 'en',
        targetLanguage: 'es',
        showSubtitles: true,
        autoTranslate: true,
        subtitlePosition: 'bottom',
        fontSize: 'medium',
        showOriginal: false
      },
      quality: {
        video: 'hd',
        audio: 'high'
      },
      layout: 'grid',
      maxParticipants: 50
    },
    startTime: new Date().toISOString(),
    recording: {
      isRecording: false,
      isPaused: false,
      duration: 0
    },
    ...initialCallState
  })

  const [showParticipants, setShowParticipants] = useState(false)

  const [isFullscreen, setIsFullscreen] = useState(false)
  const [callDuration, setCallDuration] = useState(0)

  // Chat system state
  const [showChatSystem, setShowChatSystem] = useState(false)
  const [showTranslationSettings, setShowTranslationSettings] = useState(false)
  const [showCallSettings, setShowCallSettings] = useState(false)
  const [chatMessages, setChatMessages] = useState<any[]>([
    {
      id: 'msg-1',
      participantId: 'participant-2',
      participantName: 'Sarah Wilson',
      text: 'Hey everyone! Can you hear me clearly?',
      timestamp: new Date(Date.now() - 120000).toISOString(),
      isCurrentUser: false
    },
    {
      id: 'msg-2',
      participantId: 'participant-1',
      participantName: 'You',
      text: 'Yes, audio is perfect!',
      timestamp: new Date(Date.now() - 60000).toISOString(),
      isCurrentUser: true
    }
  ])
  const [translationMessages, setTranslationMessages] = useState<any[]>([])
  const [translationSettings, setTranslationSettings] = useState({
    enabled: callState.settings.translation.enabled,
    sourceLanguage: callState.settings.translation.sourceLanguage,
    targetLanguage: callState.settings.translation.targetLanguage,
    autoDetectSource: true,
    showOriginal: true,
    autoSpeak: false,
    speakingSpeed: 1,
    confidence: 0.7,
    saveTranslations: true,
    realTimeMode: true
  })

  // Mock translation data
  useEffect(() => {
    const interval = setInterval(() => {
      if (callState.settings.translation.enabled) {
        // Add to translation messages
        const translationMessage = {
          id: `trans-${Date.now()}`,
          participantId: 'participant-1',
          participantName: 'John Doe',
          originalText: 'Hello, how are you doing today?',
          translatedText: 'Hola, ¿cómo estás hoy?',
          sourceLanguage: 'en',
          targetLanguage: 'es',
          timestamp: new Date().toISOString(),
          confidence: 0.95,
          isCurrentUser: false
        }
        setTranslationMessages(prev => [...prev.slice(-10), translationMessage])
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [callState.settings.translation.enabled])

  // Call duration timer
  useEffect(() => {
    const interval = setInterval(() => {
      setCallDuration(prev => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Sync media state with call state
  useEffect(() => {
    setCallState(prev => ({
      ...prev,
      localParticipant: {
        ...prev.localParticipant,
        isMuted: !mediaState.isAudioEnabled,
        isCameraOn: mediaState.isVideoEnabled,
        isScreenSharing: mediaState.isScreenSharing
      },
      recording: {
        ...prev.recording!,
        isRecording: mediaState.isRecording
      }
    }))
  }, [mediaState.isAudioEnabled, mediaState.isVideoEnabled, mediaState.isScreenSharing, mediaState.isRecording])

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const layoutConfig: CallLayoutConfig = {
    type: callState.settings.layout,
    showParticipantNames: true,
    showNetworkQuality: true,
    showAudioLevels: true
  }

  // Chat system handlers
  const handleSendMessage = (message: string) => {
    const newMessage = {
      id: `msg-${Date.now()}`,
      participantId: callState.localParticipant.id,
      participantName: callState.localParticipant.name,
      text: message,
      timestamp: new Date().toISOString(),
      isCurrentUser: true,
      type: 'text' as const
    }
    setChatMessages(prev => [...prev, newMessage])
  }



  const handleTranslationSettingsChange = (settings: any) => {
    setTranslationSettings(settings)
    setCallState(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        translation: {
          ...prev.settings.translation,
          enabled: settings.enabled,
          sourceLanguage: settings.sourceLanguage,
          targetLanguage: settings.targetLanguage
        }
      }
    }))
  }

  const controls: CallControlsType = {
    mute: async () => {
      if (mediaState.stream) {
        const audioTracks = mediaState.stream.getAudioTracks()
        audioTracks.forEach(track => track.enabled = false)
      }
      setCallState(prev => ({
        ...prev,
        localParticipant: { ...prev.localParticipant, isMuted: true }
      }))
    },
    unmute: async () => {
      if (mediaState.stream) {
        const audioTracks = mediaState.stream.getAudioTracks()
        audioTracks.forEach(track => track.enabled = true)
      }
      setCallState(prev => ({
        ...prev,
        localParticipant: { ...prev.localParticipant, isMuted: false }
      }))
    },
    toggleCamera: async () => {
      try {
        await mediaControls.toggleVideo()
        // Update state based on the actual media state after toggle
        setCallState(prev => ({
          ...prev,
          localParticipant: { ...prev.localParticipant, isCameraOn: !prev.localParticipant.isCameraOn },
          settings: { ...prev.settings, video: !prev.localParticipant.isCameraOn }
        }))
      } catch (error) {
        console.error('Failed to toggle camera:', error)
      }
    },
    toggleScreenShare: async () => {
      if (mediaState.isScreenSharing) {
        mediaControls.stopScreenShare()
      } else {
        await mediaControls.startScreenShare()
      }
      setCallState(prev => ({
        ...prev,
        localParticipant: { ...prev.localParticipant, isScreenSharing: mediaState.isScreenSharing }
      }))
    },
    endCall: () => {
      // Stop all media streams
      if (mediaState.stream) {
        mediaState.stream.getTracks().forEach(track => track.stop())
      }
      setCallState(prev => ({ ...prev, status: 'ended' }))
      onCallEnd?.()
    },
    startRecording: async () => {
      try {
        await mediaControls.startRecording()
        setCallState(prev => ({
          ...prev,
          recording: { ...prev.recording!, isRecording: true, startTime: new Date().toISOString() }
        }))
      } catch (error) {
        console.error('Failed to start recording:', error)
      }
    },
    stopRecording: async () => {
      try {
        const recordedBlob = await mediaControls.stopRecording()
        if (recordedBlob) {
          // Create download link for the recorded video
          const url = URL.createObjectURL(recordedBlob)
          const a = document.createElement('a')
          a.href = url
          a.download = `call-recording-${Date.now()}.webm`
          a.click()
          URL.revokeObjectURL(url)
        }
        setCallState(prev => ({
          ...prev,
          recording: { ...prev.recording!, isRecording: false }
        }))
      } catch (error) {
        console.error('Failed to stop recording:', error)
      }
    },
    pauseRecording: () => {
      mediaControls.pauseRecording()
      setCallState(prev => ({
        ...prev,
        recording: { ...prev.recording!, isPaused: true }
      }))
    },
    resumeRecording: () => {
      mediaControls.resumeRecording()
      setCallState(prev => ({
        ...prev,
        recording: { ...prev.recording!, isPaused: false }
      }))
    },
    changeLayout: (layout) => setCallState(prev => ({
      ...prev,
      settings: { ...prev.settings, layout }
    })),
    toggleTranslation: () => setCallState(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        translation: { ...prev.settings.translation, enabled: !prev.settings.translation.enabled }
      }
    })),
    changeLanguage: (source, target) => setCallState(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        translation: { ...prev.settings.translation, sourceLanguage: source, targetLanguage: target }
      }
    })),
    adjustVolume: (participantId, volume) => {
      console.log(`Adjusting volume for ${participantId} to ${volume}`)
    },
    kickParticipant: (participantId) => {
      console.log(`Kicking participant ${participantId}`)
    },
    inviteParticipant: (email) => {
      console.log(`Inviting participant ${email}`)
    }
  }

  return (
    <div className={cn("h-[100dvh] w-full bg-light-gray relative overflow-hidden", className)}>
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-30 bg-gradient-to-b from-white/95 to-white/80 backdrop-blur-sm p-2 sm:p-3 md:p-4 border-b border-border-light">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4 min-w-0">
            <Chip
              color="success"
              variant="solid"
              size="sm"
              startContent={<div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />}
              className="text-xs"
            >
              Live
            </Chip>
            <div className="flex items-center space-x-1 text-text-primary">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="font-mono text-xs sm:text-sm">{formatDuration(callDuration)}</span>
            </div>
            <div className="hidden sm:flex items-center space-x-1 text-text-primary">
              <Wifi className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm">HD</span>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <HeroButton
              isIconOnly
              size="sm"
              variant="light"
              onPress={() => setIsFullscreen(!isFullscreen)}
              className="text-text-primary min-w-8 w-8 h-8 sm:min-w-9 sm:w-9 sm:h-9"
            >
              {isFullscreen ? <Minimize2 className="w-3 h-3 sm:w-4 sm:h-4" /> : <Maximize2 className="w-3 h-3 sm:w-4 sm:h-4" />}
            </HeroButton>
          </div>
        </div>
      </div>

      {/* Main Video Area */}
      <div className="h-full pt-16 sm:pt-18 md:pt-20 pb-20 sm:pb-24">
        <ParticipantGrid
          participants={callState.participants}
          localParticipantId={callState.localParticipant.id}
          layout={layoutConfig}
          localStream={mediaState.stream}
          onParticipantAction={(participantId, action) => {
            if (action === 'mute') controls.adjustVolume(participantId, 0)
            if (action === 'kick') controls.kickParticipant(participantId)
            if (action === 'pin') console.log(`Pinning participant ${participantId}`)
          }}
          onVolumeChange={controls.adjustVolume}
        />
      </div>



      {/* Call Controls */}
      <CallControls
        callState={callState}
        controls={controls}
        onSettingsClick={() => setShowCallSettings(true)}
        onParticipantsClick={() => setShowParticipants(true)}
        onTranslationClick={controls.toggleTranslation}
        onChatClick={() => setShowChatSystem(!showChatSystem)}
        isChatVisible={showChatSystem}
      />

      {/* Simple Chat Box */}
      <SimpleChatBox
        callState={callState}
        chatMessages={chatMessages}
        translationMessages={translationMessages.map(msg => ({
          id: msg.id,
          participantId: msg.participantId,
          participantName: msg.participantName,
          translatedText: msg.translatedText,
          timestamp: msg.timestamp,
          isCurrentUser: msg.isCurrentUser
        }))}
        isVisible={showChatSystem}
        onToggleVisibility={() => setShowChatSystem(!showChatSystem)}
        onSendMessage={handleSendMessage}
        onTranslationSettingsClick={() => setShowTranslationSettings(true)}
        position="bottom"
      />

      {/* Translation Settings Modal */}
      <TranslationSettingsModal
        isOpen={showTranslationSettings}
        onClose={() => setShowTranslationSettings(false)}
        settings={translationSettings}
        onSettingsChange={handleTranslationSettingsChange}
        messageCount={translationMessages.length}
        onClearHistory={() => setTranslationMessages([])}
        onExportHistory={() => console.log('Export translation history')}
      />

      {/* Participants Panel */}
      {showParticipants && (
        <div className="absolute top-0 right-0 h-full w-80 bg-white shadow-lg z-50">
          <Card className="h-full rounded-none border-l">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-forest-green">
                Participants ({callState.participants.length})
              </CardTitle>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowParticipants(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {callState.participants.map((participant) => (
                <div key={participant.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-2">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      participant.status === 'connected' ? 'bg-green-500' : 'bg-gray-400'
                    )} />
                    <span className="text-sm font-medium">{participant.name}</span>
                    {participant.isLocal && (
                      <Badge variant="secondary" className="text-xs">You</Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    {participant.isMuted && <Badge variant="destructive" className="text-xs">Muted</Badge>}
                    {!participant.isCameraOn && <Badge variant="secondary" className="text-xs">No Video</Badge>}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Call Settings Panel */}
      <CallSettingsPanel
        isOpen={showCallSettings}
        onClose={() => setShowCallSettings(false)}
        callState={callState}
        meetingId={callId}
        onSettingsChange={(settings) => {
          setCallState(prev => ({
            ...prev,
            settings: { ...prev.settings, ...settings }
          }))
        }}
      />

      {/* Meeting Info Display */}
      <MeetingInfoDisplay
        meetingId={callId}
        participantCount={callState.participants.length}
        duration={formatDuration(callDuration)}
        callType={callState.type}
      />
    </div>
  )
}
