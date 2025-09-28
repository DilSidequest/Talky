'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Settings,
  Copy,
  Users,
  Clock,
  Video,
  Phone,
  Check,
  Share,
  Info,
  Globe,
  Mic,
  Camera,
  Monitor
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { CallState, Participant } from '@/types/call'

interface CallSettingsPanelProps {
  isOpen: boolean
  onClose: () => void
  callState: CallState
  meetingId?: string
  meetingPassword?: string
  meetingUrl?: string
  onSettingsChange?: (settings: Partial<CallState['settings']>) => void
  className?: string
}

export function CallSettingsPanel({
  isOpen,
  onClose,
  callState,
  meetingId,
  meetingPassword,
  meetingUrl,
  onSettingsChange,
  className
}: CallSettingsPanelProps) {
  const [copiedItem, setCopiedItem] = useState<string | null>(null)

  const copyToClipboard = async (text: string, itemName: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedItem(itemName)
      setTimeout(() => setCopiedItem(null), 2000)
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
    }
  }

  const formatDuration = (startTime?: string) => {
    if (!startTime) return '00:00'
    const start = new Date(startTime).getTime()
    const now = Date.now()
    const duration = Math.floor((now - start) / 1000)
    const minutes = Math.floor(duration / 60)
    const seconds = duration % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  const generateMeetingUrl = () => {
    if (meetingUrl) return meetingUrl
    if (meetingId) {
      return `${window.location.origin}/call/${meetingId}`
    }
    return `${window.location.origin}/call/${callState.id}`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-electric-blue" />
            Call Settings & Information
          </DialogTitle>
          <DialogDescription>
            Meeting details, participants, and call settings
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Meeting Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Info className="w-4 h-4 text-electric-blue" />
                Meeting Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Meeting ID */}
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Meeting ID
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    value={meetingId || callState.id}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(meetingId || callState.id, 'id')}
                    className="shrink-0"
                  >
                    {copiedItem === 'id' ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>



              {/* Meeting URL */}
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Share className="w-4 h-4" />
                  Meeting Link
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    value={generateMeetingUrl()}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(generateMeetingUrl(), 'url')}
                    className="shrink-0"
                  >
                    {copiedItem === 'url' ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Call Duration */}
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Duration
                </Label>
                <Badge variant="secondary" className="font-mono">
                  {formatDuration(callState.startTime)}
                </Badge>
              </div>

              {/* Call Type */}
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Call Type</Label>
                <Badge variant="outline" className="flex items-center gap-1">
                  {callState.type === 'video' ? (
                    <Video className="w-3 h-3" />
                  ) : (
                    <Phone className="w-3 h-3" />
                  )}
                  {callState.type === 'video' ? 'Video Call' : 'Audio Call'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Participants */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="w-4 h-4 text-electric-blue" />
                Participants ({callState.participants.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {callState.participants.map((participant) => (
                  <div key={participant.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={participant.avatar} />
                        <AvatarFallback className="bg-electric-blue text-white text-xs">
                          {participant.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">
                          {participant.name}
                          {participant.isLocal && <span className="text-electric-blue ml-1">(You)</span>}
                        </p>
                        <p className="text-xs text-gray-500">
                          {participant.language.toUpperCase()} • {participant.status}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {participant.isMuted ? (
                        <Badge variant="destructive" size="sm">
                          <Mic className="w-3 h-3 mr-1" />
                          Muted
                        </Badge>
                      ) : (
                        <Badge variant="secondary" size="sm">
                          <Mic className="w-3 h-3 mr-1" />
                          Active
                        </Badge>
                      )}
                      {participant.isCameraOn && (
                        <Badge variant="secondary" size="sm">
                          <Camera className="w-3 h-3" />
                        </Badge>
                      )}
                      {participant.isScreenSharing && (
                        <Badge variant="secondary" size="sm">
                          <Monitor className="w-3 h-3" />
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Call Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Settings className="w-4 h-4 text-electric-blue" />
                Current Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Video</Label>
                  <Badge variant={callState.settings.video ? "default" : "secondary"}>
                    {callState.settings.video ? "On" : "Off"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Audio</Label>
                  <Badge variant={callState.settings.audio ? "default" : "secondary"}>
                    {callState.settings.audio ? "On" : "Off"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Recording</Label>
                  <Badge variant={callState.settings.recording ? "destructive" : "secondary"}>
                    {callState.settings.recording ? "Recording" : "Off"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Translation</Label>
                  <Badge variant={callState.settings.translation.enabled ? "default" : "secondary"}>
                    {callState.settings.translation.enabled ? "On" : "Off"}
                  </Badge>
                </div>
              </div>

              {callState.settings.translation.enabled && (
                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Translation:</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" size="sm">
                        {callState.settings.translation.sourceLanguage.toUpperCase()}
                      </Badge>
                      <span>→</span>
                      <Badge variant="outline" size="sm">
                        {callState.settings.translation.targetLanguage.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
