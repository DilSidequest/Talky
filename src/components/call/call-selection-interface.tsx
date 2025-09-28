'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Video,
  Mic,
  Users,
  Monitor,
  Languages,
  Globe,
  Zap,
  Shield,
  Phone,
  Clock,
  LogIn,
  Plus
} from 'lucide-react'
import { cn } from '@/lib/utils'

export function CallSelectionInterface() {
  const [selectedCallType, setSelectedCallType] = useState<'video' | 'audio' | null>(null)
  const [roomId, setRoomId] = useState('')
  const [roomPassword, setRoomPassword] = useState('')
  const [isJoining, setIsJoining] = useState(false)

  const handleStartCall = (type: 'video' | 'audio') => {
    // Generate a unique call ID
    const callId = `call-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    window.location.href = `/call/${callId}?type=${type}`
  }

  const handleJoinRoom = async () => {
    if (!roomId.trim()) return

    setIsJoining(true)
    try {
      // In a real app, you'd validate the room and password here
      await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API call

      const url = roomPassword
        ? `/call/${roomId}?password=${roomPassword}`
        : `/call/${roomId}`

      window.location.href = url
    } catch (error) {
      console.error('Failed to join room:', error)
    } finally {
      setIsJoining(false)
    }
  }

  const videoFeatures = [
    { icon: Video, label: 'HD video calls', description: 'Crystal clear video quality' },
    { icon: Users, label: 'Multi-participant', description: 'Up to 50 participants' },
    { icon: Monitor, label: 'Screen sharing', description: 'Share your screen easily' },
    { icon: Languages, label: 'Live subtitles', description: 'Real-time translation overlay' },
  ]

  const audioFeatures = [
    { icon: Mic, label: 'Voice translation', description: 'Translate speech in real-time' },
    { icon: Globe, label: 'Multi-language', description: 'Support for 100+ languages' },
    { icon: Zap, label: 'Low latency', description: 'Instant voice translation' },
    { icon: Shield, label: 'Secure calls', description: 'End-to-end encryption' },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-2xl md:text-3xl font-bold text-text-primary">
          Start a Call
        </h2>
        <p className="text-text-secondary max-w-2xl mx-auto">
          Connect with anyone, anywhere, in any language. Choose between video calls with live translation 
          or audio calls with voice translation.
        </p>
      </div>

      {/* Call Type Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Video Call Card */}
        <Card
          className={cn(
            "relative overflow-hidden transition-all duration-300 cursor-pointer hover:shadow-lg border-2",
            selectedCallType === 'video'
              ? "border-electric-blue bg-electric-blue-light"
              : "border-border-light hover:border-electric-blue/50"
          )}
          onClick={() => setSelectedCallType('video')}
        >
          <CardHeader className="pb-3 md:pb-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center space-x-2 md:space-x-3">
                <div className="p-1.5 md:p-2 bg-electric-blue-light rounded-lg">
                  <Video className="w-5 h-5 md:w-6 md:h-6 text-electric-blue" />
                </div>
                <div>
                  <CardTitle className="text-lg md:text-xl text-text-primary">Video Call</CardTitle>
                  <p className="text-xs md:text-sm text-text-secondary">Teams/Google Meets style</p>
                </div>
              </div>
              <Badge variant="outline" className="border-electric-blue text-electric-blue text-xs">
                Popular
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 md:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
              {videoFeatures.map((feature, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <feature.icon className="w-3.5 h-3.5 md:w-4 md:h-4 text-electric-blue mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium text-text-primary text-xs md:text-sm truncate">{feature.label}</p>
                    <p className="text-xs text-text-muted leading-tight">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button
              className="w-full bg-electric-blue hover:bg-electric-blue-hover text-white h-10 md:h-11"
              onClick={(e) => {
                e.stopPropagation()
                handleStartCall('video')
              }}
            >
              <Video className="w-4 h-4 mr-2" />
              Start Video Call
            </Button>
          </CardContent>
        </Card>

        {/* Audio Call Card */}
        <Card
          className={cn(
            "relative overflow-hidden transition-all duration-300 cursor-pointer hover:shadow-lg border-2",
            selectedCallType === 'audio'
              ? "border-electric-blue bg-electric-blue-light"
              : "border-border-light hover:border-electric-blue/50"
          )}
          onClick={() => setSelectedCallType('audio')}
        >
          <CardHeader className="pb-3 md:pb-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center space-x-2 md:space-x-3">
                <div className="p-1.5 md:p-2 bg-electric-blue-light rounded-lg">
                  <Phone className="w-5 h-5 md:w-6 md:h-6 text-electric-blue" />
                </div>
                <div>
                  <CardTitle className="text-lg md:text-xl text-text-primary">Audio Call</CardTitle>
                  <p className="text-xs md:text-sm text-text-secondary">Voice translation focused</p>
                </div>
              </div>
              <Badge variant="outline" className="border-text-primary text-text-primary text-xs">
                Simple
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 md:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
              {audioFeatures.map((feature, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <feature.icon className="w-3.5 h-3.5 md:w-4 md:h-4 text-electric-blue mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium text-text-primary text-xs md:text-sm truncate">{feature.label}</p>
                    <p className="text-xs text-text-muted leading-tight">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              className="w-full border-text-primary text-text-primary hover:bg-text-primary hover:text-white h-10 md:h-11"
              onClick={(e) => {
                e.stopPropagation()
                handleStartCall('audio')
              }}
            >
              <Phone className="w-4 h-4 mr-2" />
              Start Audio Call
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Separator */}
      <div className="relative">
        <Separator />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="bg-white px-4 text-sm text-text-muted">or</span>
        </div>
      </div>

      {/* Join Meeting Section */}
      <Card className="border-2 border-dashed border-border-light">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <LogIn className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <CardTitle className="text-lg text-text-primary">Join a Meeting</CardTitle>
              <p className="text-sm text-text-secondary">Enter a meeting ID to join an existing call</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="roomId">Meeting ID</Label>
              <Input
                id="roomId"
                placeholder="Enter meeting ID"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="roomPassword">Password</Label>
              <Input
                id="roomPassword"
                type="password"
                placeholder="Enter password"
                value={roomPassword}
                onChange={(e) => setRoomPassword(e.target.value)}
                className="font-mono"
              />
            </div>
          </div>
          <Button
            onClick={handleJoinRoom}
            disabled={!roomId.trim() || isJoining}
            className="w-full sm:w-auto bg-gray-600 hover:bg-gray-700 text-white"
          >
            {isJoining ? (
              <>Joining...</>
            ) : (
              <>
                <LogIn className="w-4 h-4 mr-2" />
                Join Meeting
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-2 md:gap-4 text-center">
        <div className="space-y-1 p-3 md:p-4 bg-bg-secondary rounded-lg">
          <p className="text-lg md:text-2xl font-bold text-electric-blue">100+</p>
          <p className="text-xs md:text-sm text-text-muted">Languages</p>
        </div>
        <div className="space-y-1 p-3 md:p-4 bg-bg-secondary rounded-lg">
          <p className="text-lg md:text-2xl font-bold text-electric-blue">50</p>
          <p className="text-xs md:text-sm text-text-muted">Max Participants</p>
        </div>
        <div className="space-y-1 p-3 md:p-4 bg-bg-secondary rounded-lg">
          <p className="text-lg md:text-2xl font-bold text-electric-blue">24/7</p>
          <p className="text-xs md:text-sm text-text-muted">Available</p>
        </div>
      </div>

      {/* Recent Calls Section */}
      <div className="space-y-3 md:space-y-4">
        <h3 className="text-base md:text-lg font-semibold text-text-primary">Recent Calls</h3>
        <div className="text-center py-6 md:py-8 text-text-muted">
          <Clock className="w-8 h-8 md:w-12 md:h-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm md:text-base">No recent calls</p>
          <p className="text-xs md:text-sm">Your call history will appear here</p>
        </div>
      </div>
    </div>
  )
}
