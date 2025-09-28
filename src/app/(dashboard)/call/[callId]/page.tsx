'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { VideoCallContainer } from '@/components/video-call/video-call-container'
import { AudioCallContainer } from '@/components/call/audio-call-container'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Video, 
  Phone, 
  Loader2, 
  AlertCircle, 
  CheckCircle,
  Clock,
  Users,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { CallState } from '@/types/call'

interface CallPageProps {
  params: Promise<{
    callId: string
  }>
}

type CallStatus = 'connecting' | 'connected' | 'ended' | 'failed' | 'waiting'

export default function CallPage({ params }: CallPageProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callType = searchParams.get('type') as 'video' | 'audio' || 'video'
  const roomPassword = searchParams.get('password')

  const [callStatus, setCallStatus] = useState<CallStatus>('connecting')
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const [callDuration, setCallDuration] = useState(0)
  const [callId, setCallId] = useState<string>('')
  const [roomInfo, setRoomInfo] = useState<{
    id: string
    name: string
    hasPassword: boolean
    participantCount: number
  } | null>(null)

  // Initialize callId from params
  useEffect(() => {
    const initParams = async () => {
      const resolvedParams = await params
      setCallId(resolvedParams.callId)
    }
    initParams()
  }, [params])

  // Simulate connection process and request media permissions
  useEffect(() => {
    const initializeCall = async () => {
      try {
        // Simulate room validation (in real app, this would be an API call)
        await new Promise(resolve => setTimeout(resolve, 500))

        // Set room info (mock data)
        setRoomInfo({
          id: callId,
          name: `Meeting Room ${callId.slice(-6)}`,
          hasPassword: !!roomPassword,
          participantCount: 1
        })

        // Request media permissions based on call type
        const constraints = callType === 'video'
          ? { video: true, audio: true }
          : { audio: true }

        await navigator.mediaDevices.getUserMedia(constraints)

        // Simulate connection delay
        setTimeout(() => {
          setCallStatus('connected')
        }, 1000)
      } catch (error) {
        console.error('Failed to get media permissions:', error)
        setConnectionError('Failed to access camera/microphone. Please check your permissions.')
        setCallStatus('failed')
      }
    }

    if (callId) {
      initializeCall()
    }
  }, [callType, callId, roomPassword])

  // Call duration timer
  useEffect(() => {
    if (callStatus === 'connected') {
      const interval = setInterval(() => {
        setCallDuration(prev => prev + 1)
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [callStatus])

  const handleCallEnd = () => {
    setCallStatus('ended')
    // Redirect after a short delay
    setTimeout(() => {
      router.push('/chat')
    }, 3000)
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Connection/Loading Screen
  if (callStatus === 'connecting') {
    return (
      <div className="h-screen w-full bg-gradient-to-br from-electric-blue to-electric-blue-hover flex items-center justify-center px-4">
        <Card className="max-w-sm md:max-w-md w-full">
          <CardContent className="p-6 md:p-8 text-center space-y-4 md:space-y-6">
            <div className="flex justify-center">
              {callType === 'video' ? (
                <Video className="w-12 h-12 md:w-16 md:h-16 text-electric-blue" />
              ) : (
                <Phone className="w-12 h-12 md:w-16 md:h-16 text-electric-blue" />
              )}
            </div>

            <div className="space-y-1 md:space-y-2">
              <h2 className="text-xl md:text-2xl font-bold text-text-primary">
                {roomInfo ? `Joining ${roomInfo.name}` : `Connecting to ${callType} call...`}
              </h2>
              <p className="text-sm md:text-base text-text-secondary">
                {roomInfo
                  ? `${roomInfo.participantCount} participant${roomInfo.participantCount !== 1 ? 's' : ''} in room`
                  : `Setting up your ${callType} call with translation features`
                }
              </p>
              {roomInfo?.hasPassword && (
                <div className="flex items-center justify-center space-x-1 text-xs text-green-600">
                  <CheckCircle className="w-3 h-3" />
                  <span>Password verified</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="w-5 h-5 animate-spin text-electric-blue" />
              <span className="text-sm text-text-muted">Establishing connection</span>
            </div>

            <div className="space-y-2 text-sm text-text-muted">
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Microphone access granted</span>
              </div>
              {callType === 'video' && (
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Camera access granted</span>
                </div>
              )}
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Translation engine ready</span>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => router.push('/chat')}
              className="w-full"
            >
              Cancel
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Call Ended Screen
  if (callStatus === 'ended') {
    return (
      <div className="h-screen w-full bg-gradient-to-br from-bg-primary to-bg-secondary flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                <Phone className="w-8 h-8 text-gray-500" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-forest-green">
                Call Ended
              </h2>
              <p className="text-text-secondary">
                Your {callType} call has ended
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-muted">Duration:</span>
                <span className="font-medium text-forest-green">{formatDuration(callDuration)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-muted">Type:</span>
                <Badge variant="outline" className="capitalize">
                  {callType} Call
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-muted">Translation:</span>
                <Badge className="bg-electric-blue text-white">
                  Enabled
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Button
                onClick={() => router.push('/chat')}
                className="w-full bg-electric-blue hover:bg-electric-blue-hover"
              >
                Back to Chat
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/call')}
                className="w-full"
              >
                Start New Call
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Connection Failed Screen
  if (callStatus === 'failed') {
    return (
      <div className="h-screen w-full bg-gradient-to-br from-bg-primary to-bg-secondary flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-forest-green">
                Connection Failed
              </h2>
              <p className="text-text-secondary">
                Unable to connect to the call
              </p>
              {connectionError && (
                <p className="text-sm text-red-600 bg-red-50 p-2 rounded">
                  {connectionError}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Button
                onClick={() => setCallStatus('connecting')}
                className="w-full bg-electric-blue hover:bg-electric-blue-hover"
              >
                Try Again
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/chat')}
                className="w-full"
              >
                Back to Chat
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Active Call Screen
  return (
    <div className="h-screen w-full">
      {/* Back Button (only visible on hover) */}
      <div className="absolute top-4 left-4 z-50 opacity-0 hover:opacity-100 transition-opacity">
        <Link href="/chat">
          <Button
            size="sm"
            variant="ghost"
            className="bg-black/20 text-white hover:bg-black/40 backdrop-blur-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
      </div>

      {/* Call Interface */}
      {callId && (callType === 'video' ? (
        <VideoCallContainer
          callId={callId}
          onCallEnd={handleCallEnd}
        />
      ) : (
        <AudioCallContainer
          callId={callId}
          onCallEnd={handleCallEnd}
        />
      ))}
    </div>
  )
}
