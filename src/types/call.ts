export interface Participant {
  id: string
  name: string
  avatar?: string
  isLocal: boolean
  isMuted: boolean
  isCameraOn: boolean
  isScreenSharing: boolean
  language: string
  status: 'connecting' | 'connected' | 'disconnected' | 'reconnecting'
  audioLevel?: number
  networkQuality?: 'excellent' | 'good' | 'poor' | 'disconnected'
  joinedAt: string
  lastSeen?: string
}

export interface CallSettings {
  video: boolean
  audio: boolean
  screenShare: boolean
  recording: boolean
  translation: {
    enabled: boolean
    sourceLanguage: string
    targetLanguage: string
    showSubtitles: boolean
    autoTranslate: boolean
    subtitlePosition: 'top' | 'bottom' | 'center'
    fontSize: 'small' | 'medium' | 'large'
    showOriginal: boolean
  }
  quality: {
    video: 'low' | 'medium' | 'high' | 'hd'
    audio: 'low' | 'medium' | 'high'
  }
  layout: 'grid' | 'speaker' | 'sidebar'
  maxParticipants: number
}

export interface CallState {
  id: string
  type: 'video' | 'audio'
  status: 'idle' | 'calling' | 'ringing' | 'connected' | 'ended' | 'failed'
  participants: Participant[]
  localParticipant: Participant
  settings: CallSettings
  startTime?: string
  endTime?: string
  duration?: number
  recording?: {
    isRecording: boolean
    startTime?: string
    duration?: number
    isPaused: boolean
    fileName?: string
  }
  translation?: {
    currentSubtitle?: string
    originalText?: string
    translatedText?: string
    confidence?: number
    language?: string
  }
  errors?: string[]
  networkStats?: {
    latency: number
    bandwidth: number
    packetLoss: number
  }
}

export interface CallInvitation {
  id: string
  from: Participant
  to: Participant[]
  type: 'video' | 'audio'
  message?: string
  createdAt: string
  expiresAt: string
  status: 'pending' | 'accepted' | 'declined' | 'expired' | 'cancelled'
}

export interface CallHistory {
  id: string
  type: 'video' | 'audio'
  participants: Participant[]
  startTime: string
  endTime: string
  duration: number
  status: 'completed' | 'missed' | 'declined' | 'failed'
  recording?: {
    url: string
    duration: number
    size: number
  }
  translation?: {
    languages: string[]
    totalTranslations: number
  }
}

export interface SubtitleData {
  id: string
  text: string
  translation?: string
  language: string
  targetLanguage?: string
  timestamp: number
  duration: number
  participantId: string
  confidence?: number
  isOriginal: boolean
}

export interface ScreenShareData {
  participantId: string
  isSharing: boolean
  streamId?: string
  type: 'screen' | 'window' | 'tab'
  title?: string
}

export interface CallControls {
  mute: () => void
  unmute: () => void
  toggleCamera: () => void
  toggleScreenShare: () => void
  endCall: () => void
  startRecording: () => void
  stopRecording: () => void
  pauseRecording: () => void
  resumeRecording: () => void
  changeLayout: (layout: CallSettings['layout']) => void
  toggleTranslation: () => void
  changeLanguage: (source: string, target: string) => void
  adjustVolume: (participantId: string, volume: number) => void
  kickParticipant: (participantId: string) => void
  inviteParticipant: (email: string) => void
}

export interface CallEvents {
  onParticipantJoined: (participant: Participant) => void
  onParticipantLeft: (participantId: string) => void
  onParticipantMuted: (participantId: string, isMuted: boolean) => void
  onParticipantCameraToggled: (participantId: string, isCameraOn: boolean) => void
  onScreenShareStarted: (data: ScreenShareData) => void
  onScreenShareStopped: (participantId: string) => void
  onSubtitleReceived: (subtitle: SubtitleData) => void
  onRecordingStarted: () => void
  onRecordingStopped: (recording: CallHistory['recording']) => void
  onCallEnded: (reason: string) => void
  onError: (error: string) => void
  onNetworkQualityChanged: (participantId: string, quality: Participant['networkQuality']) => void
}

export interface CallLayoutConfig {
  type: 'grid' | 'speaker' | 'sidebar'
  gridSize?: {
    rows: number
    cols: number
  }
  speakerSize?: 'small' | 'medium' | 'large'
  sidebarPosition?: 'left' | 'right'
  showParticipantNames: boolean
  showNetworkQuality: boolean
  showAudioLevels: boolean
}

export interface CallQualityMetrics {
  video: {
    resolution: string
    frameRate: number
    bitrate: number
  }
  audio: {
    sampleRate: number
    bitrate: number
    codec: string
  }
  network: {
    rtt: number
    jitter: number
    packetLoss: number
    bandwidth: number
  }
}

// Hook interfaces for call management
export interface UseCallReturn {
  callState: CallState
  controls: CallControls
  events: CallEvents
  isLoading: boolean
  error: string | null
  connect: (callId: string) => Promise<void>
  disconnect: () => void
  updateSettings: (settings: Partial<CallSettings>) => void
}

// WebRTC related interfaces
export interface MediaStreamConfig {
  video: boolean | MediaTrackConstraints
  audio: boolean | MediaTrackConstraints
  screen?: boolean
}

export interface PeerConnectionConfig {
  iceServers: RTCIceServer[]
  iceTransportPolicy?: RTCIceTransportPolicy
  bundlePolicy?: RTCBundlePolicy
}
