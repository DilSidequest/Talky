export interface MeetingRoom {
  id: string
  name: string
  password: string
  hostId: string
  hostName: string
  type: 'video' | 'audio'
  status: 'waiting' | 'active' | 'ended'
  createdAt: string
  scheduledFor?: string
  maxParticipants: number
  participants: MeetingParticipant[]
  invitedContacts: string[] // Contact IDs
  settings: MeetingRoomSettings
  isRecording: boolean
  recordingUrl?: string
}

export interface MeetingParticipant {
  id: string
  name: string
  email?: string
  avatar?: string
  isHost: boolean
  joinedAt: string
  status: 'connected' | 'disconnected' | 'connecting'
  isMuted: boolean
  isCameraOn: boolean
  isScreenSharing: boolean
  language: string
  networkQuality: 'poor' | 'fair' | 'good' | 'excellent'
}

export interface MeetingRoomSettings {
  allowParticipantsToUnmute: boolean
  allowParticipantsToShareScreen: boolean
  enableWaitingRoom: boolean
  enableRecording: boolean
  enableTranslation: boolean
  defaultLanguage: string
  requirePassword: boolean
  allowAnonymousJoin: boolean
  maxDuration?: number // in minutes
  autoEndWhenHostLeaves: boolean
}

export interface MeetingInvitation {
  id: string
  roomId: string
  roomName: string
  hostName: string
  invitedContactId: string
  invitedContactName: string
  invitedContactEmail?: string
  type: 'video' | 'audio'
  scheduledFor?: string
  message?: string
  status: 'pending' | 'accepted' | 'declined' | 'expired'
  sentAt: string
  respondedAt?: string
}

export interface CreateMeetingRoomRequest {
  name: string
  type: 'video' | 'audio'
  invitedContacts: string[] // Contact IDs
  scheduledFor?: string
  settings?: Partial<MeetingRoomSettings>
  personalMessage?: string
}

export interface JoinMeetingRequest {
  roomId: string
  password?: string
  participantName: string
  participantEmail?: string
}

// Utility functions
export const generateRoomId = (): string => {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substr(2, 9)
  return `room-${timestamp}-${random}`
}

export const generateRoomPassword = (): string => {
  // Generate a 6-digit numeric password like Zoom
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export const generateMeetingUrl = (roomId: string): string => {
  return `${window.location.origin}/call/${roomId}`
}

export const formatMeetingTime = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  })
}

export const getDefaultMeetingSettings = (): MeetingRoomSettings => ({
  allowParticipantsToUnmute: true,
  allowParticipantsToShareScreen: true,
  enableWaitingRoom: false,
  enableRecording: false,
  enableTranslation: true,
  defaultLanguage: 'en',
  requirePassword: true,
  allowAnonymousJoin: false,
  autoEndWhenHostLeaves: true
})

// Meeting room status helpers
export const isRoomActive = (room: MeetingRoom): boolean => {
  return room.status === 'active' && room.participants.some(p => p.status === 'connected')
}

export const isRoomFull = (room: MeetingRoom): boolean => {
  return room.participants.length >= room.maxParticipants
}

export const canJoinRoom = (room: MeetingRoom, password?: string): boolean => {
  if (room.status === 'ended') return false
  if (isRoomFull(room)) return false
  if (room.settings.requirePassword && room.password !== password) return false
  return true
}

export const getRoomParticipantCount = (room: MeetingRoom): number => {
  return room.participants.filter(p => p.status === 'connected').length
}
