'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Search, Plus, Languages, MessageCircle, Video, Phone } from 'lucide-react'

// Mock data for demonstration
const conversations = [
  {
    id: 1,
    name: 'Maria Garcia',
    lastMessage: 'Hola! ¿Cómo estás?',
    translation: 'Hello! How are you?',
    time: '2m ago',
    unread: 2,
    language: 'ES',
    avatar: '/avatars/maria.jpg'
  },
  {
    id: 2,
    name: 'Hiroshi Tanaka',
    lastMessage: 'こんにちは、元気ですか？',
    translation: 'Hello, how are you?',
    time: '1h ago',
    unread: 0,
    language: 'JA',
    avatar: '/avatars/hiroshi.jpg'
  },
  {
    id: 3,
    name: 'Pierre Dubois',
    lastMessage: 'Bonjour, comment allez-vous?',
    translation: 'Hello, how are you?',
    time: '3h ago',
    unread: 1,
    language: 'FR',
    avatar: '/avatars/pierre.jpg'
  }
]

export default function ChatPage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Chat/Call Toggle */}
      <Tabs defaultValue="chat" className="w-full mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            Chat
          </TabsTrigger>
          <TabsTrigger value="call" className="flex items-center gap-2">
            <Video className="w-4 h-4" />
            Call
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-6">
          {/* Chat Header */}
          <div className="flex items-center justify-between">
            <div>
          <h1 className="text-3xl font-bold text-forest-green">Conversations</h1>
          <p className="text-text-secondary">Connect with people worldwide</p>
        </div>
        <Button className="bg-electric-blue hover:bg-electric-blue-hover">
          <Plus className="w-4 h-4 mr-2" />
          New Chat
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted w-4 h-4" />
        <Input 
          placeholder="Search conversations..." 
          className="pl-10"
        />
      </div>

      {/* Conversations List */}
      <div className="space-y-4">
        {conversations.map((conversation) => (
          <Card key={conversation.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-4">
              <Avatar className="w-12 h-12">
                <AvatarImage src={conversation.avatar} alt={conversation.name} />
                <AvatarFallback>{conversation.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-forest-green truncate">
                    {conversation.name}
                  </h3>
                  <Badge variant="secondary" className="text-xs">
                    {conversation.language}
                  </Badge>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-text-secondary truncate">
                    {conversation.lastMessage}
                  </p>
                  <div className="flex items-center gap-2">
                    <Languages className="w-3 h-3 text-electric-blue" />
                    <p className="text-xs text-text-muted truncate">
                      {conversation.translation}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-2">
                <span className="text-xs text-text-muted">
                  {conversation.time}
                </span>
                {conversation.unread > 0 && (
                  <Badge className="bg-electric-blue text-white text-xs">
                    {conversation.unread}
                  </Badge>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

          {/* Empty State (when no conversations) */}
          {conversations.length === 0 && (
            <div className="text-center py-12">
              <MessageCircle className="w-16 h-16 text-text-muted mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-forest-green mb-2">
                No conversations yet
              </h3>
              <p className="text-text-secondary mb-6">
                Start your first conversation and break down language barriers
              </p>
              <Button className="bg-electric-blue hover:bg-electric-blue-hover">
                <Plus className="w-4 h-4 mr-2" />
                Start Chatting
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="call" className="space-y-6">
          {/* Call Interface */}
          <div className="text-center py-12">
            <Video className="w-16 h-16 text-electric-blue mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-forest-green mb-2">
              Video Calls with Translation
            </h3>
            <p className="text-text-secondary mb-6">
              Make video calls with real-time AI translation
            </p>
            <div className="space-y-4 max-w-md mx-auto">
              <Button className="w-full bg-electric-blue hover:bg-electric-blue-hover">
                <Video className="w-4 h-4 mr-2" />
                Start Video Call
              </Button>
              <Button variant="outline" className="w-full">
                <Phone className="w-4 h-4 mr-2" />
                Start Audio Call
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
