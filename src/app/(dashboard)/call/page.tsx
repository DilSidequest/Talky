'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Video, 
  Phone, 
  Users, 
  Languages, 
  Monitor, 
  Mic,
  Camera,
  Settings,
  Clock,
  Globe,
  Zap,
  Shield
} from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

export default function CallPage() {
  const router = useRouter()
  const [selectedCallType, setSelectedCallType] = useState<'video' | 'audio' | null>(null)

  const handleStartCall = (type: 'video' | 'audio') => {
    // Generate a unique call ID (in real app, this would come from backend)
    const callId = `call-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    router.push(`/call/${callId}?type=${type}`)
  }

  const videoFeatures = [
    { icon: Users, label: 'Multi-participant grid', description: 'Up to 50 participants' },
    { icon: Monitor, label: 'Screen sharing', description: 'Share your screen or window' },
    { icon: Languages, label: 'Live translation', description: 'Real-time subtitle translation' },
    { icon: Camera, label: 'HD video quality', description: 'Crystal clear video calls' },
  ]

  const audioFeatures = [
    { icon: Mic, label: 'Voice translation', description: 'Translate speech in real-time' },
    { icon: Globe, label: 'Multi-language', description: 'Support for 100+ languages' },
    { icon: Zap, label: 'Low latency', description: 'Instant voice translation' },
    { icon: Shield, label: 'Secure calls', description: 'End-to-end encryption' },
  ]

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary">
          Start a Call
        </h1>
        <p className="text-lg text-text-secondary max-w-2xl mx-auto">
          Connect with anyone, anywhere, in any language. Choose between video calls with live translation
          or audio calls with voice translation.
        </p>
      </div>

      {/* Call Type Selection */}
      <div className="grid md:grid-cols-2 gap-6 md:gap-8">
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
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-electric-blue rounded-lg">
                  <Video className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl text-text-primary">Video Call</CardTitle>
                  <p className="text-sm text-text-secondary">Teams/Google Meets style</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-electric-blue-light text-electric-blue">
                Popular
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Features */}
            <div className="space-y-3">
              {videoFeatures.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <feature.icon className="w-5 h-5 text-electric-blue mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-text-primary text-sm">{feature.label}</p>
                    <p className="text-xs text-text-muted">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Button */}
            <Button 
              className="w-full bg-electric-blue hover:bg-electric-blue-hover text-white"
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
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-forest-green rounded-lg">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl text-text-primary">Audio Call</CardTitle>
                  <p className="text-sm text-text-secondary">Voice translation focused</p>
                </div>
              </div>
              <Badge variant="outline" className="border-text-primary text-text-primary">
                Simple
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Features */}
            <div className="space-y-3">
              {audioFeatures.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <feature.icon className="w-5 h-5 text-forest-green mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-text-primary text-sm">{feature.label}</p>
                    <p className="text-xs text-text-muted">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Button */}
            <Button
              variant="outline"
              className="w-full border-text-primary text-text-primary hover:bg-text-primary hover:text-white"
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

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-border-light">
        <div className="text-center">
          <div className="text-2xl font-bold text-electric-blue">100+</div>
          <div className="text-sm text-text-muted">Languages</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-electric-blue">50</div>
          <div className="text-sm text-text-muted">Max Participants</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-electric-blue">HD</div>
          <div className="text-sm text-text-muted">Video Quality</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-electric-blue">24/7</div>
          <div className="text-sm text-text-muted">Available</div>
        </div>
      </div>

      {/* Recent Calls */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-text-primary">Recent Calls</h2>
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-text-muted mx-auto mb-4" />
              <p className="text-text-muted">No recent calls</p>
              <p className="text-sm text-text-muted mt-1">Your call history will appear here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
