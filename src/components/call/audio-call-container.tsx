'use client'

import { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar as HeroAvatar, Chip, Button as HeroButton, Slider } from '@heroui/react'
import { useMediaStream } from '@/hooks/useMediaStream'
import { SimpleChatBox } from './simple-chat-box'
import { TranslationSettingsModal } from './translation-settings-modal'
import { VideoPlayer } from '../video-call/video-player'
import { CallSettingsPanel } from './call-settings-panel'
import { MeetingInfoDisplay } from './meeting-info-display'
import {
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Languages,
  Volume2,
  VolumeX,
  Settings,
  Users,
  Clock,
  Wifi,
  Zap,
  Globe,
  MessageCircle,
  Video,
  VideoOff,
  Monitor,
  Maximize2,
  Minimize2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { CallState, CallControls as CallControlsType, Participant } from '@/types/call'

interface AudioCallContainerProps {
  callId: string
  initialCallState?: Partial<CallState>
  onCallEnd?: () => void
  className?: string
}

interface AudioParticipantProps {
  participant: Participant
  isLocal: boolean
  isActive: boolean
  onVolumeChange?: (volume: number) => void
  videoStream?: MediaStream | null
  showVideo?: boolean
}

function AudioParticipant({ participant, isLocal, isActive, onVolumeChange, videoStream, showVideo }: AudioParticipantProps) {
  const [volume, setVolume] = useState(100)

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume)
    onVolumeChange?.(newVolume)
  }

  return (
    <div className={cn(
      "flex flex-col items-center space-y-2 sm:space-y-3 p-3 sm:p-4 md:p-6 rounded-2xl transition-all duration-300 border",
      isActive ? "bg-electric-blue-light scale-105 border-electric-blue" : "bg-white border-border-light",
      isLocal && "ring-2 ring-electric-blue"
    )}>
      {/* Video or Avatar */}
      <div className="relative">
        {showVideo && participant.isCameraOn && videoStream ? (
          <div className={cn(
            "rounded-2xl overflow-hidden transition-all duration-300",
            isActive ? "w-32 h-24 sm:w-40 sm:h-30 md:w-48 md:h-36" : "w-24 h-18 sm:w-32 sm:h-24 md:w-40 md:h-30"
          )}>
            <VideoPlayer
              stream={isLocal ? videoStream : null}
              muted={isLocal}
              className="w-full h-full object-cover"
            />
            {/* Video overlay indicators */}
            <div className="absolute top-2 right-2 flex space-x-1">
              {participant.isCameraOn && (
                <div className="p-1 bg-green-500 rounded-full">
                  <Video className="w-2 h-2 text-white" />
                </div>
              )}
            </div>
          </div>
        ) : (
          <HeroAvatar
            src={participant.avatar}
            name={participant.name}
            size={isActive ? "lg" : "md"}
            className={cn(
              "transition-all duration-300",
              isActive ? "w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24" : "w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20"
            )}
            classNames={{
              base: "bg-electric-blue text-white",
              name: "text-white font-semibold text-sm sm:text-lg md:text-xl"
            }}
          />
        )}

        {/* Audio level indicator */}
        {!participant.isMuted && participant.audioLevel && participant.audioLevel > 0.1 && (
          <div className="absolute inset-0 rounded-full border-4 border-green-400 animate-pulse" />
        )}

        {/* Status indicators */}
        <div className="absolute -bottom-1 -right-1 flex space-x-1">
          {/* Microphone status */}
          <div className={cn(
            "p-1 md:p-1.5 rounded-full",
            participant.isMuted ? 'bg-red-500' : 'bg-green-500'
          )}>
            {participant.isMuted ? (
              <MicOff className="w-2.5 h-2.5 md:w-3 md:h-3 text-white" />
            ) : (
              <Mic className="w-2.5 h-2.5 md:w-3 md:h-3 text-white" />
            )}
          </div>

          {/* Network quality */}
          <div className={cn(
            "p-1 md:p-1.5 rounded-full",
            participant.networkQuality === 'excellent' ? 'bg-green-500' :
            participant.networkQuality === 'good' ? 'bg-yellow-500' :
            participant.networkQuality === 'poor' ? 'bg-red-500' : 'bg-gray-500'
          )}>
            <Wifi className="w-2.5 h-2.5 md:w-3 md:h-3 text-white" />
          </div>
        </div>
      </div>

      {/* Participant info */}
      <div className="text-center space-y-1">
        <h3 className="font-semibold text-text-primary text-xs sm:text-sm">
          {participant.name}
          {isLocal && <span className="text-electric-blue ml-1">(You)</span>}
        </h3>
        <div className="flex items-center justify-center space-x-1 sm:space-x-2">
          <Chip size="sm" variant="bordered" className="text-xs">
            {participant.language.toUpperCase()}
          </Chip>
          <Chip
            size="sm"
            color={participant.status === 'connected' ? 'success' : 'default'}
            variant="solid"
            className="text-xs"
          >
            {participant.status}
          </Chip>
        </div>
      </div>

      {/* Volume control for non-local participants */}
      {!isLocal && (
        <div className="w-full max-w-32">
          <Slider
            size="sm"
            step={1}
            minValue={0}
            maxValue={100}
            value={volume}
            onChange={(value) => handleVolumeChange(Array.isArray(value) ? value[0] : value)}
            className="w-full"
            startContent={<VolumeX className="w-3 h-3 text-text-muted" />}
            endContent={<Volume2 className="w-3 h-3 text-text-muted" />}
            classNames={{
              track: "bg-gray-200",
              filler: "bg-electric-blue",
              thumb: "bg-electric-blue"
            }}
          />
        </div>
      )}
    </div>
  )
}

export function AudioCallContainer({
  callId,
  initialCallState,
  onCallEnd,
  className
}: AudioCallContainerProps) {
  // Initialize media stream with audio and optional video
  const [mediaState, mediaControls] = useMediaStream({ video: false, audio: true })
  const [videoEnabled, setVideoEnabled] = useState(false)

  const [callState, setCallState] = useState<CallState>({
    id: callId,
    type: 'audio',
    status: 'connected',
    participants: [
      {
        id: 'local',
        name: 'You',
        isLocal: true,
        isMuted: false,
        isCameraOn: false,
        isScreenSharing: false,
        language: 'en',
        status: 'connected',
        joinedAt: new Date().toISOString(),
        networkQuality: 'excellent',
        audioLevel: 0.6
      },
      {
        id: 'participant-1',
        name: 'Maria Garcia',
        isLocal: false,
        isMuted: false,
        isCameraOn: false,
        isScreenSharing: false,
        language: 'es',
        status: 'connected',
        joinedAt: new Date().toISOString(),
        networkQuality: 'good',
        audioLevel: 0.4
      }
    ],
    localParticipant: {
      id: 'local',
      name: 'You',
      isLocal: true,
      isMuted: false,
      isCameraOn: false,
      isScreenSharing: false,
      language: 'en',
      status: 'connected',
      joinedAt: new Date().toISOString(),
      networkQuality: 'excellent',
      audioLevel: 0.6
    },
    settings: {
      video: false,
      audio: true,
      screenShare: false,
      recording: false,
      translation: {
        enabled: true,
        sourceLanguage: 'es',
        targetLanguage: 'en',
        showSubtitles: false,
        autoTranslate: true,
        subtitlePosition: 'bottom',
        fontSize: 'medium',
        showOriginal: true
      },
      quality: {
        video: 'low',
        audio: 'high'
      },
      layout: 'grid',
      maxParticipants: 10
    },
    startTime: new Date().toISOString(),
    ...initialCallState
  })

  const [callDuration, setCallDuration] = useState(0)
  const [activeParticipant, setActiveParticipant] = useState<string>('participant-1')
  const [translationActive, setTranslationActive] = useState(false)
  const [currentTranslation, setCurrentTranslation] = useState<string>('')

  // Chat system state
  const [showChatSystem, setShowChatSystem] = useState(false)
  const [showTranslationSettings, setShowTranslationSettings] = useState(false)
  const [showCallSettings, setShowCallSettings] = useState(false)
  const [chatMessages, setChatMessages] = useState<any[]>([
    {
      id: 'msg-1',
      participantId: 'participant-2',
      participantName: 'Maria Garcia',
      text: 'The connection sounds great!',
      timestamp: new Date(Date.now() - 180000).toISOString(),
      isCurrentUser: false
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

  // Sync video state with media stream
  useEffect(() => {
    setVideoEnabled(mediaState.isVideoEnabled)
  }, [mediaState.isVideoEnabled])

  // Call duration timer
  useEffect(() => {
    const interval = setInterval(() => {
      setCallDuration(prev => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Mock translation updates
  useEffect(() => {
    if (callState.settings.translation.enabled) {
      const interval = setInterval(() => {
        setTranslationActive(true)
        setCurrentTranslation('Hola, ¿cómo estás? → Hello, how are you?')

        // Add to translation messages
        const translationMessage = {
          id: `trans-${Date.now()}`,
          participantId: 'participant-2',
          participantName: 'Maria Garcia',
          originalText: 'Hola, ¿cómo estás?',
          translatedText: 'Hello, how are you?',
          sourceLanguage: 'es',
          targetLanguage: 'en',
          timestamp: new Date().toISOString(),
          confidence: 0.92,
          isCurrentUser: false
        }
        setTranslationMessages(prev => [...prev.slice(-10), translationMessage])

        setTimeout(() => {
          setTranslationActive(false)
          setCurrentTranslation('')
        }, 3000)
      }, 8000)

      return () => clearInterval(interval)
    }
  }, [callState.settings.translation.enabled])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
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

  // Video toggle handler
  const handleToggleVideo = async () => {
    try {
      await mediaControls.toggleVideo()
      const newVideoState = !videoEnabled
      setVideoEnabled(newVideoState)

      setCallState(prev => ({
        ...prev,
        localParticipant: { ...prev.localParticipant, isCameraOn: newVideoState },
        settings: { ...prev.settings, video: newVideoState }
      }))
    } catch (error) {
      console.error('Failed to toggle video:', error)
      // Revert state on error
      setVideoEnabled(prev => prev)
    }
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
    toggleCamera: handleToggleVideo,
    toggleScreenShare: () => {}, // Not implemented yet
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
      } catch (error) {
        console.error('Failed to start recording:', error)
      }
    },
    stopRecording: async () => {
      try {
        const recordedBlob = await mediaControls.stopRecording()
        if (recordedBlob) {
          // Create download link for the recorded audio
          const url = URL.createObjectURL(recordedBlob)
          const a = document.createElement('a')
          a.href = url
          a.download = `audio-call-recording-${Date.now()}.webm`
          a.click()
          URL.revokeObjectURL(url)
        }
      } catch (error) {
        console.error('Failed to stop recording:', error)
      }
    },
    pauseRecording: () => mediaControls.pauseRecording(),
    resumeRecording: () => mediaControls.resumeRecording(),
    changeLayout: () => {},
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
    adjustVolume: () => {},
    kickParticipant: () => {},
    inviteParticipant: () => {}
  }

  return (
    <div className={cn("h-[100dvh] w-full bg-gradient-to-br from-white to-light-gray relative", className)}>
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-30 p-3 sm:p-4 md:p-6 bg-white/80 backdrop-blur-sm border-b border-border-light">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Chip
              color="success"
              variant="solid"
              size="sm"
              startContent={<div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />}
            >
              Audio Call
            </Chip>
            <div className="flex items-center space-x-1 sm:space-x-2 text-text-primary">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="font-mono text-xs sm:text-sm">{formatDuration(callDuration)}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Chip variant="bordered" size="sm" startContent={<Users className="w-3 h-3" />}>
              {callState.participants.length}
            </Chip>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center h-full px-3 sm:px-4 md:px-6 pt-20 sm:pt-24 md:pt-28 pb-24 sm:pb-28 md:pb-32">
        <div className="max-w-4xl w-full">
          {/* Participants */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6 lg:gap-8 mb-6 sm:mb-8 md:mb-12">
            {callState.participants.map((participant) => (
              <AudioParticipant
                key={participant.id}
                participant={participant}
                isLocal={participant.isLocal}
                isActive={activeParticipant === participant.id}
                onVolumeChange={(volume) => controls.adjustVolume(participant.id, volume)}
                videoStream={participant.isLocal ? mediaState.stream : null}
                showVideo={videoEnabled || participant.isCameraOn}
              />
            ))}
          </div>

          {/* Translation Display */}
          {callState.settings.translation.enabled && (
            <Card className="mb-6 md:mb-8 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 md:mb-4 gap-2">
                  <div className="flex items-center space-x-2">
                    <Languages className="w-4 h-4 md:w-5 md:h-5 text-electric-blue" />
                    <span className="font-semibold text-text-primary text-sm md:text-base">Live Translation</span>
                    {translationActive && (
                      <Badge className="bg-electric-blue text-white animate-pulse text-xs">
                        <Zap className="w-3 h-3 mr-1" />
                        Translating
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-xs md:text-sm text-text-muted">
                    <Badge variant="outline" className="text-xs">{callState.settings.translation.sourceLanguage.toUpperCase()}</Badge>
                    <span>→</span>
                    <Badge variant="outline" className="text-xs">{callState.settings.translation.targetLanguage.toUpperCase()}</Badge>
                  </div>
                </div>

                {currentTranslation ? (
                  <div className="bg-electric-blue-light p-3 md:p-4 rounded-lg">
                    <p className="text-text-primary font-medium text-sm md:text-base">{currentTranslation}</p>
                  </div>
                ) : (
                  <div className="text-center py-8 text-text-muted">
                    <Globe className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Listening for speech to translate...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Call Controls */}
      <div className={cn(
        "fixed bottom-20 sm:bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-xs sm:max-w-sm md:max-w-none md:w-auto px-3 sm:px-4 md:px-0",
        showChatSystem && "hidden" // Hide on all screen sizes when chat is visible
      )}>
        <Card className="bg-white/95 backdrop-blur-sm border border-border-light shadow-lg">
          <CardContent className="p-2 sm:p-3 md:p-4">
            {/* Mobile Layout: Compact controls */}
            <div className="md:hidden">
              <div className="flex items-center justify-center space-x-3">
                {/* Microphone */}
                <Button
                  size="lg"
                  variant={!mediaState.isAudioEnabled ? "destructive" : "secondary"}
                  onClick={mediaState.isAudioEnabled ? controls.mute : controls.unmute}
                  className={cn(
                    "w-12 h-12 rounded-full",
                    !mediaState.isAudioEnabled
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300 text-text-primary"
                  )}
                >
                  {!mediaState.isAudioEnabled ? (
                    <MicOff className="w-5 h-5" />
                  ) : (
                    <Mic className="w-5 h-5" />
                  )}
                </Button>

                {/* Video Toggle */}
                <Button
                  size="lg"
                  variant={videoEnabled ? "default" : "secondary"}
                  onClick={handleToggleVideo}
                  className={cn(
                    "w-12 h-12 rounded-full",
                    videoEnabled
                      ? "bg-electric-blue hover:bg-electric-blue-hover text-white"
                      : "bg-gray-200 hover:bg-gray-300 text-forest-green"
                  )}
                >
                  {videoEnabled ? (
                    <Video className="w-5 h-5" />
                  ) : (
                    <VideoOff className="w-5 h-5" />
                  )}
                </Button>

                {/* Translation */}
                <Button
                  size="lg"
                  variant={callState.settings.translation.enabled ? "default" : "secondary"}
                  onClick={controls.toggleTranslation}
                  className={cn(
                    "w-12 h-12 rounded-full",
                    callState.settings.translation.enabled
                      ? "bg-electric-blue hover:bg-electric-blue-hover text-white"
                      : "bg-gray-200 hover:bg-gray-300 text-forest-green"
                  )}
                >
                  <Languages className="w-5 h-5" />
                </Button>

                {/* Settings */}
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => setShowCallSettings(true)}
                  className="w-12 h-12 rounded-full bg-gray-200 hover:bg-gray-300 text-forest-green"
                >
                  <Settings className="w-5 h-5" />
                </Button>

                {/* Chat */}
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => setShowChatSystem(!showChatSystem)}
                  className="w-12 h-12 rounded-full bg-gray-200 hover:bg-gray-300 text-forest-green"
                >
                  <MessageCircle className="w-5 h-5" />
                </Button>

                {/* End Call */}
                <Button
                  size="lg"
                  variant="destructive"
                  onClick={controls.endCall}
                  className="w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 text-white"
                >
                  <PhoneOff className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Desktop Layout: Original spacing */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Microphone */}
              <Button
                size="lg"
                variant={!mediaState.isAudioEnabled ? "destructive" : "secondary"}
                onClick={mediaState.isAudioEnabled ? controls.mute : controls.unmute}
                className={cn(
                  "w-14 h-14 rounded-full",
                  !mediaState.isAudioEnabled
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-text-primary"
                )}
              >
                {!mediaState.isAudioEnabled ? (
                  <MicOff className="w-6 h-6" />
                ) : (
                  <Mic className="w-6 h-6" />
                )}
              </Button>

              {/* Video Toggle */}
              <Button
                size="lg"
                variant={videoEnabled ? "default" : "secondary"}
                onClick={handleToggleVideo}
                className={cn(
                  "w-14 h-14 rounded-full",
                  videoEnabled
                    ? "bg-electric-blue hover:bg-electric-blue-hover text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-forest-green"
                )}
              >
                {videoEnabled ? (
                  <Video className="w-6 h-6" />
                ) : (
                  <VideoOff className="w-6 h-6" />
                )}
              </Button>

              {/* Translation */}
              <Button
                size="lg"
                variant={callState.settings.translation.enabled ? "default" : "secondary"}
                onClick={controls.toggleTranslation}
                className={cn(
                  "w-14 h-14 rounded-full",
                  callState.settings.translation.enabled
                    ? "bg-electric-blue hover:bg-electric-blue-hover text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-forest-green"
                )}
              >
                <Languages className="w-6 h-6" />
              </Button>

              {/* Settings */}
              <Button
                size="lg"
                variant="secondary"
                onClick={() => setShowCallSettings(true)}
                className="w-14 h-14 rounded-full bg-gray-200 hover:bg-gray-300 text-forest-green"
              >
                <Settings className="w-6 h-6" />
              </Button>

              {/* Chat */}
              <Button
                size="lg"
                variant="secondary"
                onClick={() => setShowChatSystem(!showChatSystem)}
                className="w-14 h-14 rounded-full bg-gray-200 hover:bg-gray-300 text-forest-green"
              >
                <MessageCircle className="w-6 h-6" />
              </Button>

              {/* End Call */}
              <Button
                size="lg"
                variant="destructive"
                onClick={controls.endCall}
                className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 text-white"
              >
                <PhoneOff className="w-6 h-6" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

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
        position="side"
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
