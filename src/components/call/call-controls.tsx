'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button as HeroButton, Chip } from '@heroui/react'
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  MonitorOff,
  Phone,
  PhoneOff,
  Settings,
  Users,
  Languages,
  Circle,
  Square,
  Pause,
  Play,
  Volume2,
  VolumeX,
  Grid3X3,
  User,
  Sidebar,
  MoreVertical,
  MessageCircle
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { CallState, CallControls as CallControlsType } from '@/types/call'

interface CallControlsProps {
  callState: CallState
  controls: CallControlsType
  onSettingsClick?: () => void
  onParticipantsClick?: () => void
  onTranslationClick?: () => void
  onChatClick?: () => void
  isChatVisible?: boolean
  className?: string
}

export function CallControls({
  callState,
  controls,
  onSettingsClick,
  onParticipantsClick,
  onTranslationClick,
  onChatClick,
  isChatVisible = false,
  className
}: CallControlsProps) {
  const [showMoreControls, setShowMoreControls] = useState(false)
  const { localParticipant, settings, recording } = callState

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Only handle shortcuts when not typing in an input
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return
      }

      switch (event.key.toLowerCase()) {
        case 'm':
          event.preventDefault()
          localParticipant.isMuted ? controls.unmute() : controls.mute()
          break
        case 'v':
          if (callState.type === 'video') {
            event.preventDefault()
            controls.toggleCamera()
          }
          break
        case 's':
          if (callState.type === 'video') {
            event.preventDefault()
            controls.toggleScreenShare()
          }
          break
        case 'r':
          event.preventDefault()
          recording?.isRecording ? controls.stopRecording() : controls.startRecording()
          break
        case 't':
          event.preventDefault()
          controls.toggleTranslation()
          break
        case 'escape':
          event.preventDefault()
          controls.endCall()
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [localParticipant.isMuted, callState.type, recording?.isRecording, controls])

  return (
    <div className={cn(
      "fixed bottom-20 sm:bottom-4 md:bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-xs sm:max-w-sm md:max-w-none md:w-auto px-3 sm:px-4 md:px-0",
      isChatVisible && "hidden", // Hide on all screen sizes when chat is visible
      className
    )}>
      <Card className="bg-white/95 backdrop-blur-sm border border-border-light shadow-lg">
        <CardContent className="p-2 sm:p-3 md:p-4">
          {/* Mobile Layout: Two rows */}
          <div className="md:hidden">
            {/* Row 1: Essential controls */}
            <div className="flex items-center justify-center space-x-2 mb-2">
              {/* Microphone */}
              <HeroButton
                isIconOnly
                size="md"
                color={localParticipant.isMuted ? "danger" : "default"}
                variant={localParticipant.isMuted ? "solid" : "bordered"}
                onPress={localParticipant.isMuted ? controls.unmute : controls.mute}
                className="min-w-10 w-10 h-10 rounded-full"
                title={localParticipant.isMuted ? "Unmute (M)" : "Mute (M)"}
              >
                {localParticipant.isMuted ? (
                  <MicOff className="w-4 h-4" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </HeroButton>

              {/* Camera (Video calls only) */}
              {callState.type === 'video' && (
                <HeroButton
                  isIconOnly
                  size="md"
                  color={!localParticipant.isCameraOn ? "danger" : "default"}
                  variant={!localParticipant.isCameraOn ? "solid" : "bordered"}
                  onPress={controls.toggleCamera}
                  className="min-w-10 w-10 h-10 rounded-full"
                  title={localParticipant.isCameraOn ? "Turn off camera (V)" : "Turn on camera (V)"}
                >
                  {localParticipant.isCameraOn ? (
                    <Video className="w-4 h-4" />
                  ) : (
                    <VideoOff className="w-4 h-4" />
                  )}
                </HeroButton>
              )}

              {/* End Call */}
              <HeroButton
                isIconOnly
                size="md"
                color="danger"
                variant="solid"
                onPress={controls.endCall}
                className="min-w-10 w-10 h-10 rounded-full"
                title="End call (Esc)"
              >
                <PhoneOff className="w-4 h-4" />
              </HeroButton>
            </div>

            {/* Row 2: Secondary controls */}
            <div className="flex items-center justify-center space-x-1">
              {/* Translation */}
              <Button
                size="sm"
                variant={settings.translation.enabled ? "default" : "secondary"}
                onClick={onTranslationClick || controls.toggleTranslation}
                className={cn(
                  "w-8 h-8 rounded-full p-0",
                  settings.translation.enabled
                    ? "bg-electric-blue hover:bg-electric-blue-hover text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-forest-green"
                )}
                title={settings.translation.enabled ? "Disable translation (T)" : "Enable translation (T)"}
              >
                <Languages className="w-3 h-3" />
              </Button>

              {/* Chat */}
              <Button
                size="sm"
                variant="secondary"
                onClick={onChatClick}
                className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 text-forest-green p-0"
                title="Open chat"
              >
                <MessageCircle className="w-3 h-3" />
              </Button>

              {/* Participants */}
              <Button
                size="sm"
                variant="secondary"
                onClick={onParticipantsClick}
                className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 text-forest-green relative p-0"
                title={`View participants (${callState.participants.length})`}
              >
                <Users className="w-3 h-3" />
                <Badge
                  className="absolute -top-1 -right-1 bg-electric-blue text-white text-xs min-w-[16px] h-4 flex items-center justify-center"
                >
                  {callState.participants.length}
                </Badge>
              </Button>

              {/* Settings */}
              <Button
                size="sm"
                variant="secondary"
                onClick={onSettingsClick}
                className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 text-forest-green p-0"
                title="Call settings"
              >
                <Settings className="w-3 h-3" />
              </Button>

              {/* Recording */}
              <Button
                size="sm"
                variant={recording?.isRecording ? "destructive" : "secondary"}
                onClick={recording?.isRecording ? controls.stopRecording : controls.startRecording}
                className={cn(
                  "w-8 h-8 rounded-full relative p-0",
                  recording?.isRecording
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-forest-green"
                )}
                title={recording?.isRecording ? "Stop recording (R)" : "Start recording (R)"}
              >
                {recording?.isRecording ? (
                  <Square className="w-3 h-3" />
                ) : (
                  <Circle className="w-3 h-3" />
                )}
                {recording?.isRecording && (
                  <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                )}
              </Button>

              {/* Screen Share (Video calls only) */}
              {callState.type === 'video' && (
                <Button
                  size="sm"
                  variant={localParticipant.isScreenSharing ? "default" : "secondary"}
                  onClick={controls.toggleScreenShare}
                  className={cn(
                    "w-8 h-8 rounded-full p-0",
                    localParticipant.isScreenSharing
                      ? "bg-electric-blue hover:bg-electric-blue-hover text-white"
                      : "bg-gray-200 hover:bg-gray-300 text-forest-green"
                  )}
                  title={localParticipant.isScreenSharing ? "Stop screen sharing (S)" : "Start screen sharing (S)"}
                >
                  {localParticipant.isScreenSharing ? (
                    <MonitorOff className="w-3 h-3" />
                  ) : (
                    <Monitor className="w-3 h-3" />
                  )}
                </Button>
              )}

              {/* Layout (Video calls only) */}
              {callState.type === 'video' && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    const layouts: Array<CallState['settings']['layout']> = ['grid', 'speaker', 'sidebar']
                    const currentIndex = layouts.indexOf(settings.layout)
                    const nextLayout = layouts[(currentIndex + 1) % layouts.length]
                    controls.changeLayout(nextLayout)
                  }}
                  className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 text-forest-green p-0"
                  title={`Change layout (current: ${settings.layout})`}
                >
                  {settings.layout === 'grid' && <Grid3X3 className="w-3 h-3" />}
                  {settings.layout === 'speaker' && <User className="w-3 h-3" />}
                  {settings.layout === 'sidebar' && <Sidebar className="w-3 h-3" />}
                </Button>
              )}
            </div>
          </div>

          {/* Desktop Layout: Single row */}
          <div className="hidden md:flex items-center justify-center space-x-1 sm:space-x-2 md:space-x-3">
            {/* Primary Controls */}
            <div className="flex items-center space-x-1 sm:space-x-1.5 md:space-x-2">
              {/* Microphone */}
              <HeroButton
                isIconOnly
                size="md"
                color={localParticipant.isMuted ? "danger" : "default"}
                variant={localParticipant.isMuted ? "solid" : "bordered"}
                onPress={localParticipant.isMuted ? controls.unmute : controls.mute}
                className={cn(
                  "min-w-10 w-10 h-10 sm:min-w-12 sm:w-12 sm:h-12 md:min-w-14 md:w-14 md:h-14 rounded-full"
                )}
                title={localParticipant.isMuted ? "Unmute microphone (M)" : "Mute microphone (M)"}
              >
                {localParticipant.isMuted ? (
                  <MicOff className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                ) : (
                  <Mic className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                )}
              </HeroButton>

              {/* Camera (Video calls only) */}
              {callState.type === 'video' && (
                <HeroButton
                  isIconOnly
                  size="md"
                  color={!localParticipant.isCameraOn ? "danger" : "default"}
                  variant={!localParticipant.isCameraOn ? "solid" : "bordered"}
                  onPress={controls.toggleCamera}
                  className={cn(
                    "min-w-10 w-10 h-10 sm:min-w-12 sm:w-12 sm:h-12 md:min-w-14 md:w-14 md:h-14 rounded-full"
                  )}
                  title={localParticipant.isCameraOn ? "Turn off camera (V)" : "Turn on camera (V)"}
                >
                  {localParticipant.isCameraOn ? (
                    <Video className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                  ) : (
                    <VideoOff className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                  )}
                </HeroButton>
              )}

              {/* Screen Share (Video calls only) */}
              {callState.type === 'video' && (
                <Button
                  size="lg"
                  variant={localParticipant.isScreenSharing ? "default" : "secondary"}
                  onClick={controls.toggleScreenShare}
                  className={cn(
                    "w-12 h-12 rounded-full",
                    localParticipant.isScreenSharing
                      ? "bg-electric-blue hover:bg-electric-blue-hover text-white"
                      : "bg-gray-200 hover:bg-gray-300 text-forest-green"
                  )}
                  title={localParticipant.isScreenSharing ? "Stop screen sharing (S)" : "Start screen sharing (S)"}
                >
                  {localParticipant.isScreenSharing ? (
                    <MonitorOff className="w-5 h-5" />
                  ) : (
                    <Monitor className="w-5 h-5" />
                  )}
                </Button>
              )}
            </div>

            {/* Separator */}
            <div className="w-px h-8 bg-border-light" />

            {/* Secondary Controls */}
            <div className="flex items-center space-x-2">
              {/* Translation */}
              <Button
                size="lg"
                variant={settings.translation.enabled ? "default" : "secondary"}
                onClick={onTranslationClick || controls.toggleTranslation}
                className={cn(
                  "w-12 h-12 rounded-full",
                  settings.translation.enabled
                    ? "bg-electric-blue hover:bg-electric-blue-hover text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-forest-green"
                )}
                title={settings.translation.enabled ? "Disable translation (T)" : "Enable translation (T)"}
              >
                <Languages className="w-5 h-5" />
              </Button>

              {/* Recording */}
              <Button
                size="lg"
                variant={recording?.isRecording ? "destructive" : "secondary"}
                onClick={recording?.isRecording ? controls.stopRecording : controls.startRecording}
                className={cn(
                  "w-12 h-12 rounded-full relative",
                  recording?.isRecording
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-forest-green"
                )}
                title={recording?.isRecording ? "Stop recording (R)" : "Start recording (R)"}
              >
                {recording?.isRecording ? (
                  <Square className="w-5 h-5" />
                ) : (
                  <Circle className="w-5 h-5" />
                )}
                {recording?.isRecording && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                )}
              </Button>

              {/* Participants */}
              <Button
                size="lg"
                variant="secondary"
                onClick={onParticipantsClick}
                className="w-12 h-12 rounded-full bg-gray-200 hover:bg-gray-300 text-forest-green relative"
                title={`View participants (${callState.participants.length})`}
              >
                <Users className="w-5 h-5" />
                <Badge
                  className="absolute -top-1 -right-1 bg-electric-blue text-white text-xs min-w-[20px] h-5 flex items-center justify-center"
                >
                  {callState.participants.length}
                </Badge>
              </Button>

              {/* Chat */}
              <Button
                size="lg"
                variant="secondary"
                onClick={onChatClick}
                className="w-12 h-12 rounded-full bg-gray-200 hover:bg-gray-300 text-forest-green"
                title="Open chat"
              >
                <MessageCircle className="w-5 h-5" />
              </Button>

              {/* Layout (Video calls only) */}
              {callState.type === 'video' && (
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => {
                    const layouts: Array<CallState['settings']['layout']> = ['grid', 'speaker', 'sidebar']
                    const currentIndex = layouts.indexOf(settings.layout)
                    const nextLayout = layouts[(currentIndex + 1) % layouts.length]
                    controls.changeLayout(nextLayout)
                  }}
                  className="w-12 h-12 rounded-full bg-gray-200 hover:bg-gray-300 text-forest-green"
                  title={`Change layout (current: ${settings.layout})`}
                >
                  {settings.layout === 'grid' && <Grid3X3 className="w-5 h-5" />}
                  {settings.layout === 'speaker' && <User className="w-5 h-5" />}
                  {settings.layout === 'sidebar' && <Sidebar className="w-5 h-5" />}
                </Button>
              )}

              {/* Settings */}
              <Button
                size="lg"
                variant="secondary"
                onClick={onSettingsClick}
                className="w-12 h-12 rounded-full bg-gray-200 hover:bg-gray-300 text-forest-green"
                title="Call settings"
              >
                <Settings className="w-5 h-5" />
              </Button>
            </div>

            {/* Separator */}
            <div className="w-px h-8 bg-border-light" />

            {/* End Call */}
            <HeroButton
              isIconOnly
              size="lg"
              color="danger"
              variant="solid"
              onPress={controls.endCall}
              className="min-w-12 w-12 h-12 sm:min-w-14 sm:w-14 sm:h-14 md:min-w-16 md:w-16 md:h-16 rounded-full"
              title="End call (Esc)"
            >
              <PhoneOff className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
            </HeroButton>
          </div>

          {/* Recording Status */}
          {recording?.isRecording && (
            <div className="mt-2 sm:mt-3 flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
              <Chip
                color="danger"
                variant="solid"
                size="sm"
                startContent={<div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />}
              >
                Recording
              </Chip>
              <span className="text-text-muted font-mono">
                {formatRecordingTime(recording.duration || 0)}
              </span>
              {recording.isPaused && (
                <Chip variant="bordered" size="sm">
                  Paused
                </Chip>
              )}
            </div>
          )}

          {/* Translation Status */}
          {settings.translation.enabled && (
            <div className="mt-2 flex items-center justify-center space-x-2 text-sm">
              <Languages className="w-4 h-4 text-electric-blue" />
              <span className="text-text-muted">
                {settings.translation.sourceLanguage} → {settings.translation.targetLanguage}
              </span>
              {settings.translation.showSubtitles && (
                <Badge variant="secondary" className="text-xs bg-electric-blue-light text-electric-blue">
                  Subtitles On
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
