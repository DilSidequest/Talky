'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Info,
  Copy,
  Check,
  Users,
  Clock,
  Share,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface MeetingInfoDisplayProps {
  meetingId: string
  meetingPassword?: string
  participantCount: number
  duration: string
  callType: 'video' | 'audio'
  className?: string
}

export function MeetingInfoDisplay({
  meetingId,
  meetingPassword,
  participantCount,
  duration,
  callType,
  className
}: MeetingInfoDisplayProps) {
  const [copiedItem, setCopiedItem] = useState<string | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  const copyToClipboard = async (text: string, itemName: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedItem(itemName)
      setTimeout(() => setCopiedItem(null), 2000)
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
    }
  }

  const generateMeetingUrl = () => {
    return `${window.location.origin}/call/${meetingId}`
  }

  const shareInvite = async () => {
    const inviteText = `Join my ${callType} call!\n\nMeeting ID: ${meetingId}\n\nJoin here: ${generateMeetingUrl()}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join my call',
          text: inviteText,
          url: generateMeetingUrl()
        })
      } catch (error) {
        // Fallback to clipboard
        copyToClipboard(inviteText, 'invite')
      }
    } else {
      copyToClipboard(inviteText, 'invite')
    }
  }

  return (
    <div className={cn("fixed top-4 right-4 z-40", className)}>
      <Card className="bg-white/95 backdrop-blur-sm border border-border-light shadow-lg">
        <CardContent className="p-3">
          {/* Compact View */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-sm">
              <Info className="w-4 h-4 text-electric-blue" />
              <span className="font-medium text-forest-green">Meeting Info</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Badge variant="outline" className="text-xs">
                <Users className="w-3 h-3 mr-1" />
                {participantCount}
              </Badge>
              <Badge variant="outline" className="text-xs font-mono">
                <Clock className="w-3 h-3 mr-1" />
                {duration}
              </Badge>
            </div>

            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-6 w-6 p-0"
            >
              {isExpanded ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
            </Button>
          </div>

          {/* Expanded View */}
          {isExpanded && (
            <div className="mt-3 pt-3 border-t space-y-3">
              {/* Meeting ID */}
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <Info className="w-3 h-3" />
                  Meeting ID
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    value={meetingId}
                    readOnly
                    className="h-7 text-xs font-mono bg-gray-50"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(meetingId, 'id')}
                    className="h-7 w-7 p-0 shrink-0"
                  >
                    {copiedItem === 'id' ? (
                      <Check className="w-3 h-3 text-green-600" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </Button>
                </div>
              </div>



              {/* Quick Actions */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(generateMeetingUrl(), 'url')}
                  className="flex-1 h-7 text-xs"
                >
                  {copiedItem === 'url' ? (
                    <>
                      <Check className="w-3 h-3 mr-1 text-green-600" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 mr-1" />
                      Copy Link
                    </>
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={shareInvite}
                  className="flex-1 h-7 text-xs"
                >
                  {copiedItem === 'invite' ? (
                    <>
                      <Check className="w-3 h-3 mr-1 text-green-600" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Share className="w-3 h-3 mr-1" />
                      Share
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Alternative: Popover version for more compact display
export function MeetingInfoPopover({
  meetingId,
  meetingPassword,
  participantCount,
  duration,
  callType,
  className
}: MeetingInfoDisplayProps) {
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

  const generateMeetingUrl = () => {
    return `${window.location.origin}/call/${meetingId}`
  }

  return (
    <div className={cn("fixed top-4 right-4 z-40", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="bg-white/95 backdrop-blur-sm border border-border-light shadow-lg"
          >
            <Info className="w-4 h-4 mr-2 text-electric-blue" />
            <span className="text-forest-green font-medium">Meeting Info</span>
            <div className="ml-2 flex items-center gap-1">
              <Badge variant="secondary" className="text-xs">
                <Users className="w-3 h-3 mr-1" />
                {participantCount}
              </Badge>
              <Badge variant="secondary" className="text-xs font-mono">
                {duration}
              </Badge>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4" align="end">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5 text-electric-blue" />
              <h3 className="font-semibold text-forest-green">Meeting Details</h3>
            </div>

            {/* Meeting ID */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Meeting ID</label>
              <div className="flex items-center gap-2">
                <Input
                  value={meetingId}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(meetingId, 'id')}
                >
                  {copiedItem === 'id' ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>



            {/* Quick Actions */}
            <div className="flex gap-2 pt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(generateMeetingUrl(), 'url')}
                className="flex-1"
              >
                {copiedItem === 'url' ? (
                  <>
                    <Check className="w-4 h-4 mr-2 text-green-600" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Link
                  </>
                )}
              </Button>
              <Button
                size="sm"
                className="flex-1 bg-electric-blue hover:bg-electric-blue-hover text-white"
                onClick={() => {
                  const inviteText = `Join my ${callType} call!\n\nMeeting ID: ${meetingId}\n\nJoin here: ${generateMeetingUrl()}`
                  copyToClipboard(inviteText, 'invite')
                }}
              >
                {copiedItem === 'invite' ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Share className="w-4 h-4 mr-2" />
                    Share Invite
                  </>
                )}
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
