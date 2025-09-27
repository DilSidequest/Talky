'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Send, 
  Paperclip, 
  Mic, 
  Camera, 
  Image, 
  File, 
  Languages,
  X,
  MicOff,
  Square
} from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface MessageInputProps {
  onSendMessage: (message: string, type?: 'text' | 'audio' | 'image' | 'file') => void
  onSendFile?: (file: File) => void
  placeholder?: string
  disabled?: boolean
  targetLanguage?: string
  autoTranslate?: boolean
  className?: string
}

export function MessageInput({
  onSendMessage,
  onSendFile,
  placeholder = "Type a message...",
  disabled = false,
  targetLanguage = "Spanish",
  autoTranslate = true,
  className
}: MessageInputProps) {
  const [message, setMessage] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [showAttachments, setShowAttachments] = useState(false)
  const [translationPreview, setTranslationPreview] = useState('')
  const [detectedLanguage, setDetectedLanguage] = useState('English')
  const [isTranslating, setIsTranslating] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const recordingIntervalRef = useRef<NodeJS.Timeout>()

  // Mock translation function (would be replaced with actual API call)
  const translateText = async (text: string) => {
    if (!text.trim() || !autoTranslate) return ''
    
    setIsTranslating(true)
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Mock translation
    const mockTranslations: Record<string, string> = {
      'hello': 'hola',
      'how are you': 'cómo estás',
      'good morning': 'buenos días',
      'thank you': 'gracias',
      'goodbye': 'adiós'
    }
    
    const lowerText = text.toLowerCase()
    const translation = mockTranslations[lowerText] || `[${text} translated to ${targetLanguage}]`
    
    setTranslationPreview(translation)
    setIsTranslating(false)
  }

  // Debounced translation
  useEffect(() => {
    const timer = setTimeout(() => {
      if (message.trim()) {
        translateText(message)
      } else {
        setTranslationPreview('')
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [message, autoTranslate, targetLanguage])

  const handleSendMessage = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim())
      setMessage('')
      setTranslationPreview('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const startRecording = () => {
    setIsRecording(true)
    setRecordingTime(0)
    recordingIntervalRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1)
    }, 1000)
  }

  const stopRecording = () => {
    setIsRecording(false)
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current)
    }
    // TODO: Process recorded audio and send
    onSendMessage(`Audio message (${recordingTime}s)`, 'audio')
    setRecordingTime(0)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && onSendFile) {
      onSendFile(file)
    }
    setShowAttachments(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className={cn("space-y-3", className)}>
      {/* Translation Preview */}
      {translationPreview && autoTranslate && (
        <div className="p-3 bg-electric-blue-light rounded-lg border border-electric-blue/20">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Languages className="w-4 h-4 text-electric-blue" />
              <span className="text-sm font-medium text-electric-blue">
                Translation to {targetLanguage}
              </span>
              <Badge variant="secondary" className="text-xs">
                {detectedLanguage}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTranslationPreview('')}
              className="h-auto p-1"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
          <p className="text-sm text-forest-green">
            {isTranslating ? (
              <span className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-electric-blue border-t-transparent rounded-full animate-spin"></div>
                <span>Translating...</span>
              </span>
            ) : (
              translationPreview
            )}
          </p>
        </div>
      )}

      {/* Recording Interface */}
      {isRecording && (
        <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-red-700">
              Recording: {formatTime(recordingTime)}
            </span>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={stopRecording}
          >
            <Square className="w-4 h-4 mr-2" />
            Stop
          </Button>
        </div>
      )}

      {/* Main Input */}
      <div className="flex items-end space-x-2">
        {/* Attachment Button */}
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAttachments(!showAttachments)}
            className={cn(
              "p-2",
              showAttachments && "bg-electric-blue-light text-electric-blue"
            )}
          >
            <Paperclip className="w-4 h-4" />
          </Button>

          {/* Attachment Menu */}
          {showAttachments && (
            <div className="absolute bottom-full left-0 mb-2 bg-white border border-border-light rounded-lg shadow-lg p-2 space-y-1">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => imageInputRef.current?.click()}
              >
                <Image className="w-4 h-4 mr-2" />
                Photo
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => fileInputRef.current?.click()}
              >
                <File className="w-4 h-4 mr-2" />
                File
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => {
                  // TODO: Open camera
                  setShowAttachments(false)
                }}
              >
                <Camera className="w-4 h-4 mr-2" />
                Camera
              </Button>
            </div>
          )}
        </div>

        {/* Text Input */}
        <div className="flex-1 relative">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={placeholder}
            disabled={disabled || isRecording}
            className="pr-12 resize-none"
            onKeyPress={handleKeyPress}
          />
          
          {/* Voice Recording Button */}
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "absolute right-1 top-1/2 transform -translate-y-1/2 p-2",
              isRecording && "text-red-500"
            )}
            onClick={isRecording ? stopRecording : startRecording}
            disabled={disabled}
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </Button>
        </div>

        {/* Send Button */}
        <Button
          onClick={handleSendMessage}
          disabled={!message.trim() || disabled || isRecording}
          className="bg-electric-blue hover:bg-electric-blue-hover p-2"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>

      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileSelect}
        accept="*/*"
      />
      <input
        ref={imageInputRef}
        type="file"
        className="hidden"
        onChange={handleFileSelect}
        accept="image/*"
      />
    </div>
  )
}
