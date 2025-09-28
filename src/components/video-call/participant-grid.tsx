'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { VideoPlayer } from './video-player'
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  MoreVertical,
  Pin,
  UserX
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Participant, CallLayoutConfig } from '@/types/call'

interface ParticipantGridProps {
  participants: Participant[]
  localParticipantId: string
  layout: CallLayoutConfig
  localStream?: MediaStream | null
  onParticipantAction?: (participantId: string, action: 'mute' | 'kick' | 'pin') => void
  onVolumeChange?: (participantId: string, volume: number) => void
  className?: string
}

interface ParticipantTileProps {
  participant: Participant
  isLocal: boolean
  size: 'small' | 'medium' | 'large'
  showControls: boolean
  stream?: MediaStream | null
  onAction?: (action: 'mute' | 'kick' | 'pin') => void
  onVolumeChange?: (volume: number) => void
}

function ParticipantTile({
  participant,
  isLocal,
  size,
  showControls,
  stream,
  onAction,
  onVolumeChange
}: ParticipantTileProps) {
  const [showMenu, setShowMenu] = useState(false)
  const [volume, setVolume] = useState(100)

  const sizeClasses = {
    small: 'aspect-video min-h-[80px] sm:min-h-[100px] md:min-h-[120px]',
    medium: 'aspect-video min-h-[120px] sm:min-h-[150px] md:min-h-[180px]',
    large: 'aspect-video min-h-[160px] sm:min-h-[200px] md:min-h-[240px]'
  }

  const getNetworkQualityColor = (quality?: Participant['networkQuality']) => {
    switch (quality) {
      case 'excellent': return 'text-green-500'
      case 'good': return 'text-yellow-500'
      case 'poor': return 'text-red-500'
      case 'disconnected': return 'text-gray-500'
      default: return 'text-gray-400'
    }
  }

  const getNetworkQualityIcon = (quality?: Participant['networkQuality']) => {
    return quality === 'disconnected' ? WifiOff : Wifi
  }

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume)
    onVolumeChange?.(newVolume)
  }

  return (
    <div
      className={cn(
        "relative bg-white rounded-lg overflow-hidden group border-2 shadow-sm",
        sizeClasses[size],
        participant.status === 'connected' ? 'border-border-light' : 'border-warning',
        isLocal && 'ring-2 ring-electric-blue'
      )}
    >
      {/* Video/Avatar Display */}
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-light-gray to-lighter-gray">
        {participant.isCameraOn && stream ? (
          // Real video stream
          <VideoPlayer
            stream={stream}
            muted={isLocal} // Mute local video to prevent feedback
            className="w-full h-full rounded-lg"
          />
        ) : (
          // Avatar when camera is off or no stream
          <div className="flex flex-col items-center space-y-1 md:space-y-2">
            <Avatar className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20">
              <AvatarImage src={participant.avatar} alt={participant.name} />
              <AvatarFallback className="bg-electric-blue text-white text-sm md:text-lg">
                {participant.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <p className="text-text-primary text-xs md:text-sm font-medium text-center px-1">{participant.name}</p>
          </div>
        )}
      </div>

      {/* Screen sharing indicator */}
      {participant.isScreenSharing && (
        <div className="absolute top-1 md:top-2 left-1 md:left-2">
          <Badge className="bg-green-500 text-white text-xs">
            <Monitor className="w-2.5 h-2.5 md:w-3 md:h-3 mr-1" />
            <span className="hidden sm:inline">Sharing</span>
          </Badge>
        </div>
      )}

      {/* Local participant indicator */}
      {isLocal && (
        <div className="absolute top-1 md:top-2 right-1 md:right-2">
          <Badge className="bg-electric-blue text-white text-xs">You</Badge>
        </div>
      )}

      {/* Status indicators */}
      <div className="absolute bottom-2 left-2 flex items-center space-x-2">
        {/* Microphone status */}
        <div className={cn(
          "p-1.5 rounded-full",
          participant.isMuted ? 'bg-red-500' : 'bg-green-500'
        )}>
          {participant.isMuted ? (
            <MicOff className="w-3 h-3 text-white" />
          ) : (
            <Mic className="w-3 h-3 text-white" />
          )}
        </div>

        {/* Camera status */}
        {!participant.isCameraOn && (
          <div className="p-1.5 rounded-full bg-gray-600">
            <VideoOff className="w-3 h-3 text-white" />
          </div>
        )}

        {/* Network quality */}
        <div className={cn(
          "p-1.5 rounded-full bg-gray-800",
          getNetworkQualityColor(participant.networkQuality)
        )}>
          {(() => {
            const NetworkIcon = getNetworkQualityIcon(participant.networkQuality)
            return <NetworkIcon className="w-3 h-3" />
          })()}
        </div>
      </div>

      {/* Participant name */}
      <div className="absolute bottom-2 right-2">
        <Badge variant="secondary" className="bg-white/90 text-text-primary border border-border-light">
          {participant.name}
        </Badge>
      </div>

      {/* Audio level indicator */}
      {!participant.isMuted && participant.audioLevel && participant.audioLevel > 0.1 && (
        <div className="absolute inset-0 border-2 border-green-400 rounded-lg animate-pulse" />
      )}

      {/* Controls overlay (visible on hover for non-local participants) */}
      {showControls && !isLocal && (
        <div className="absolute inset-0 bg-white/90 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onAction?.('mute')}
              className="bg-electric-blue-light hover:bg-electric-blue text-electric-blue hover:text-white border border-electric-blue"
            >
              {participant.isMuted ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onAction?.('pin')}
              className="bg-electric-blue-light hover:bg-electric-blue text-electric-blue hover:text-white border border-electric-blue"
            >
              <Pin className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onAction?.('kick')}
              className="bg-red-50 hover:bg-error text-error hover:text-white border border-error"
            >
              <UserX className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Connection status overlay */}
      {participant.status !== 'connected' && (
        <div className="absolute inset-0 bg-white/95 flex items-center justify-center backdrop-blur-sm">
          <div className="text-center text-text-primary">
            <div className="animate-spin w-6 h-6 border-2 border-electric-blue border-t-transparent rounded-full mx-auto mb-2" />
            <p className="text-sm capitalize">{participant.status}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export function ParticipantGrid({
  participants,
  localParticipantId,
  layout,
  localStream,
  onParticipantAction,
  onVolumeChange,
  className
}: ParticipantGridProps) {
  const getGridLayout = () => {
    const count = participants.length

    if (layout.type === 'speaker') {
      return 'grid-cols-1'
    }

    if (layout.type === 'sidebar') {
      return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 grid-rows-1'
    }

    // Responsive grid layout based on participant count and screen size
    if (count <= 1) return 'grid-cols-1'
    if (count <= 2) return 'grid-cols-1 sm:grid-cols-2'
    if (count <= 4) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2'
    if (count <= 6) return 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3'
    if (count <= 9) return 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-3'
    if (count <= 16) return 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
    return 'grid-cols-3 sm:grid-cols-4 lg:grid-cols-5'
  }

  const getParticipantSize = (): 'small' | 'medium' | 'large' => {
    const count = participants.length
    if (layout.type === 'speaker') return 'large'
    if (count <= 4) return 'medium'
    return 'small'
  }

  return (
    <div className={cn("w-full h-full p-2 sm:p-3 md:p-4", className)}>
      <div className={cn(
        "grid gap-2 sm:gap-3 md:gap-4 h-full",
        getGridLayout()
      )}>
        {participants.map((participant) => (
          <ParticipantTile
            key={participant.id}
            participant={participant}
            isLocal={participant.id === localParticipantId}
            size={getParticipantSize()}
            showControls={layout.showParticipantNames}
            stream={participant.id === localParticipantId ? localStream : null}
            onAction={(action) => onParticipantAction?.(participant.id, action)}
            onVolumeChange={(volume) => onVolumeChange?.(participant.id, volume)}
          />
        ))}
      </div>
    </div>
  )
}
