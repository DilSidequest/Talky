'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Video,
  Phone,
  Users,
  Calendar,
  Settings,
  Copy,
  Send,
  X,
  Check,
  Clock,
  Lock,
  Globe,
  UserPlus,
  Search
} from 'lucide-react'
import { Contact } from '@/components/chat/contacts-list'
import { 
  MeetingRoom, 
  CreateMeetingRoomRequest, 
  generateRoomId, 
  generateRoomPassword,
  generateMeetingUrl,
  getDefaultMeetingSettings
} from '@/types/meeting-room'
import { cn } from '@/lib/utils'

interface CallCreationModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateCall: (room: MeetingRoom) => void
  availableContacts: Contact[]
  preSelectedContacts?: Contact[]
  defaultCallType?: 'video' | 'audio'
}

export function CallCreationModal({
  isOpen,
  onClose,
  onCreateCall,
  availableContacts,
  preSelectedContacts = [],
  defaultCallType = 'video'
}: CallCreationModalProps) {
  const [activeTab, setActiveTab] = useState<'instant' | 'scheduled'>('instant')
  const [callType, setCallType] = useState<'video' | 'audio'>(defaultCallType)
  const [roomName, setRoomName] = useState('')
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>(preSelectedContacts)
  const [searchQuery, setSearchQuery] = useState('')
  const [personalMessage, setPersonalMessage] = useState('')
  const [scheduledTime, setScheduledTime] = useState('')
  const [roomSettings, setRoomSettings] = useState(getDefaultMeetingSettings())
  const [isCreating, setIsCreating] = useState(false)
  const [createdRoom, setCreatedRoom] = useState<MeetingRoom | null>(null)

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setRoomName('')
      setSelectedContacts(preSelectedContacts)
      setSearchQuery('')
      setPersonalMessage('')
      setScheduledTime('')
      setCreatedRoom(null)
      setCallType(defaultCallType)
    }
  }, [isOpen, preSelectedContacts, defaultCallType])

  const filteredContacts = availableContacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    !selectedContacts.some(selected => selected.id === contact.id)
  )

  const handleContactToggle = (contact: Contact) => {
    setSelectedContacts(prev => {
      const isSelected = prev.some(c => c.id === contact.id)
      if (isSelected) {
        return prev.filter(c => c.id !== contact.id)
      } else {
        return [...prev, contact]
      }
    })
  }

  const handleCreateRoom = async () => {
    if (!roomName.trim()) {
      setRoomName(`${callType === 'video' ? 'Video' : 'Audio'} Call`)
    }

    setIsCreating(true)
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const roomId = generateRoomId()
      const password = generateRoomPassword()
      
      const newRoom: MeetingRoom = {
        id: roomId,
        name: roomName.trim() || `${callType === 'video' ? 'Video' : 'Audio'} Call`,
        password,
        hostId: 'current-user-id', // In real app, get from auth
        hostName: 'You', // In real app, get from auth
        type: callType,
        status: 'waiting',
        createdAt: new Date().toISOString(),
        scheduledFor: activeTab === 'scheduled' ? scheduledTime : undefined,
        maxParticipants: 50,
        participants: [],
        invitedContacts: selectedContacts.map(c => c.id.toString()),
        settings: roomSettings,
        isRecording: false
      }
      
      setCreatedRoom(newRoom)
      onCreateCall(newRoom)
    } catch (error) {
      console.error('Failed to create room:', error)
    } finally {
      setIsCreating(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      // Could add toast notification here
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
    }
  }

  const handleClose = () => {
    setCreatedRoom(null)
    onClose()
  }

  if (createdRoom) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              Meeting Room Created
            </DialogTitle>
            <DialogDescription>
              Your {createdRoom.type} call room is ready. Share the details below with participants.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Meeting URL</Label>
              <div className="flex items-center gap-2">
                <Input
                  value={generateMeetingUrl(createdRoom.id)}
                  readOnly
                  className="text-sm"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(generateMeetingUrl(createdRoom.id))}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Room ID</Label>
                <div className="flex items-center gap-2">
                  <Input
                    value={createdRoom.id}
                    readOnly
                    className="text-sm font-mono"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(createdRoom.id)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              

            </div>
            
            {selectedContacts.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Invited Participants</Label>
                <div className="flex flex-wrap gap-2">
                  {selectedContacts.map(contact => (
                    <Badge key={contact.id} variant="secondary" className="text-xs">
                      {contact.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex gap-2 pt-4">
              <Button
                className="flex-1 bg-electric-blue hover:bg-electric-blue-hover text-white"
                onClick={() => {
                  window.location.href = `/call/${createdRoom.id}?type=${createdRoom.type}`
                }}
              >
                {createdRoom.type === 'video' ? <Video className="w-4 h-4 mr-2" /> : <Phone className="w-4 h-4 mr-2" />}
                Start Call
              </Button>
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Create a Call</DialogTitle>
          <DialogDescription>
            Set up a video or audio call and invite participants
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'instant' | 'scheduled')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="instant">Instant Call</TabsTrigger>
            <TabsTrigger value="scheduled">Schedule Call</TabsTrigger>
          </TabsList>
          
          <TabsContent value="instant" className="space-y-4">
            <div className="space-y-4">
              {/* Call Type Selection */}
              <div className="space-y-2">
                <Label>Call Type</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={callType === 'video' ? 'default' : 'outline'}
                    onClick={() => setCallType('video')}
                    className={cn(
                      "justify-start",
                      callType === 'video' && "bg-electric-blue hover:bg-electric-blue-hover text-white"
                    )}
                  >
                    <Video className="w-4 h-4 mr-2" />
                    Video Call
                  </Button>
                  <Button
                    variant={callType === 'audio' ? 'default' : 'outline'}
                    onClick={() => setCallType('audio')}
                    className={cn(
                      "justify-start",
                      callType === 'audio' && "bg-electric-blue hover:bg-electric-blue-hover text-white"
                    )}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Audio Call
                  </Button>
                </div>
              </div>
              
              {/* Room Name */}
              <div className="space-y-2">
                <Label htmlFor="roomName">Meeting Name (Optional)</Label>
                <Input
                  id="roomName"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  placeholder={`${callType === 'video' ? 'Video' : 'Audio'} Call`}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="scheduled" className="space-y-4">
            <div className="space-y-4">
              {/* Call Type Selection */}
              <div className="space-y-2">
                <Label>Call Type</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={callType === 'video' ? 'default' : 'outline'}
                    onClick={() => setCallType('video')}
                    className={cn(
                      "justify-start",
                      callType === 'video' && "bg-electric-blue hover:bg-electric-blue-hover text-white"
                    )}
                  >
                    <Video className="w-4 h-4 mr-2" />
                    Video Call
                  </Button>
                  <Button
                    variant={callType === 'audio' ? 'default' : 'outline'}
                    onClick={() => setCallType('audio')}
                    className={cn(
                      "justify-start",
                      callType === 'audio' && "bg-electric-blue hover:bg-electric-blue-hover text-white"
                    )}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Audio Call
                  </Button>
                </div>
              </div>
              
              {/* Room Name */}
              <div className="space-y-2">
                <Label htmlFor="roomName">Meeting Name</Label>
                <Input
                  id="roomName"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  placeholder={`${callType === 'video' ? 'Video' : 'Audio'} Call`}
                />
              </div>
              
              {/* Scheduled Time */}
              <div className="space-y-2">
                <Label htmlFor="scheduledTime">Scheduled Time</Label>
                <Input
                  id="scheduledTime"
                  type="datetime-local"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Contact Selection */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Invite Participants</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-muted" />
              <Input
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          {/* Selected Contacts */}
          {selectedContacts.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm">Selected ({selectedContacts.length})</Label>
              <div className="flex flex-wrap gap-2">
                {selectedContacts.map(contact => (
                  <Badge
                    key={contact.id}
                    variant="secondary"
                    className="text-xs cursor-pointer hover:bg-red-100"
                    onClick={() => handleContactToggle(contact)}
                  >
                    {contact.name}
                    <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {/* Available Contacts */}
          <ScrollArea className="h-32">
            <div className="space-y-1">
              {filteredContacts.map(contact => (
                <div
                  key={contact.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleContactToggle(contact)}
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={contact.avatar} />
                    <AvatarFallback className="text-xs">
                      {contact.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{contact.name}</p>
                    <p className="text-xs text-text-muted">{contact.language}</p>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
        
        {/* Personal Message */}
        <div className="space-y-2">
          <Label htmlFor="message">Personal Message (Optional)</Label>
          <Textarea
            id="message"
            value={personalMessage}
            onChange={(e) => setPersonalMessage(e.target.value)}
            placeholder="Add a personal message to your invitation..."
            rows={2}
          />
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <Button variant="outline" onClick={handleClose} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={handleCreateRoom}
            disabled={isCreating}
            className="flex-1 bg-electric-blue hover:bg-electric-blue-hover text-white"
          >
            {isCreating ? (
              <>Creating...</>
            ) : (
              <>
                {callType === 'video' ? <Video className="w-4 h-4 mr-2" /> : <Phone className="w-4 h-4 mr-2" />}
                Create {activeTab === 'instant' ? 'Call' : 'Meeting'}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
