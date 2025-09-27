export interface Contact {
  id: string | number
  name: string
  lastMessage?: string
  translation?: string
  timestamp: string
  unreadCount: number
  language: string
  avatar?: string
  status: 'online' | 'offline' | 'away' | 'busy'
  isTyping?: boolean
  lastSeen?: string
  isPinned?: boolean
  email?: string
  phone?: string
}

export interface Message {
  id: string | number
  senderId: string
  content: string
  translation?: string
  timestamp: string
  isTranslated: boolean
  type: 'text' | 'audio' | 'video' | 'image' | 'file'
  language?: string
  confidence?: number
  audioUrl?: string
  videoUrl?: string
  imageUrl?: string
  fileName?: string
  fileSize?: string
  status?: 'sending' | 'sent' | 'delivered' | 'read' | 'failed'
  replyTo?: string | number
  reactions?: MessageReaction[]
}

export interface MessageReaction {
  emoji: string
  userId: string
  timestamp: string
}

export interface ChatState {
  messages: Message[]
  activeTranslation: boolean
  sourceLanguage: string
  targetLanguage: string
  translationMode: 'auto' | 'manual'
  isTyping: boolean
  participants: Contact[]
}

export interface TranslationSettings {
  enabled: boolean
  sourceLanguage: string
  targetLanguage: string
  mode: 'auto' | 'manual'
  autoSpeak: boolean
  showConfidence: boolean
  showOriginal: boolean
}

export interface Language {
  code: string
  name: string
  nativeName: string
  flag: string
}

export interface TypingIndicator {
  userId: string
  userName: string
  timestamp: string
}

export interface ChatRoom {
  id: string
  name?: string
  type: 'direct' | 'group'
  participants: Contact[]
  lastMessage?: Message
  unreadCount: number
  createdAt: string
  updatedAt: string
  settings: {
    notifications: boolean
    translation: TranslationSettings
  }
}

export interface MediaFile {
  id: string
  name: string
  type: string
  size: number
  url: string
  thumbnailUrl?: string
  duration?: number // for audio/video files
  dimensions?: { width: number; height: number } // for images/videos
  uploadProgress?: number
}

export interface VoiceRecording {
  id: string
  audioUrl: string
  duration: number
  waveform?: number[]
  transcript?: string
  translation?: string
  language?: string
}
