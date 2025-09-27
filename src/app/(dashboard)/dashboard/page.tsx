import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MessageCircle, Video, Camera, Phone, TrendingUp, Users, Clock, Globe } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-forest-green">Welcome to Talky</h1>
        <p className="text-text-muted">
          Your AI-powered communication hub. Break language barriers and connect with the world.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/chat">
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-border-light">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-electric-blue-light rounded-lg">
                  <MessageCircle className="w-5 h-5 text-electric-blue" />
                </div>
                <CardTitle className="text-lg">Chat</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-text-muted">
                Start conversations with AI translation
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/ocr">
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-border-light">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-electric-blue-light rounded-lg">
                  <Camera className="w-5 h-5 text-electric-blue" />
                </div>
                <CardTitle className="text-lg">OCR Scanner</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-text-muted">
                Scan and translate text from images
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/ai-caller">
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-border-light">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-electric-blue-light rounded-lg">
                  <Phone className="w-5 h-5 text-electric-blue" />
                </div>
                <CardTitle className="text-lg">AI Caller</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-text-muted">
                Make AI-powered phone calls
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/settings">
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-border-light">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-electric-blue-light rounded-lg">
                  <Globe className="w-5 h-5 text-electric-blue" />
                </div>
                <CardTitle className="text-lg">Settings</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-text-muted">
                Configure languages and preferences
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border-light">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-text-muted">
                Messages Translated
              </CardTitle>
              <TrendingUp className="w-4 h-4 text-electric-blue" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-forest-green">1,234</div>
            <p className="text-xs text-text-muted">
              <span className="text-green-600">+12%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-border-light">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-text-muted">
                Active Conversations
              </CardTitle>
              <Users className="w-4 h-4 text-electric-blue" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-forest-green">23</div>
            <p className="text-xs text-text-muted">
              <span className="text-green-600">+3</span> new today
            </p>
          </CardContent>
        </Card>

        <Card className="border-border-light">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-text-muted">
                Languages Used
              </CardTitle>
              <Globe className="w-4 h-4 text-electric-blue" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-forest-green">8</div>
            <p className="text-xs text-text-muted">
              Across all conversations
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="border-border-light">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-electric-blue" />
            <span>Recent Activity</span>
          </CardTitle>
          <CardDescription>
            Your latest conversations and translations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
            <div className="p-2 bg-electric-blue-light rounded-full">
              <MessageCircle className="w-4 h-4 text-electric-blue" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-forest-green">
                Chat with Maria (Spanish → English)
              </p>
              <p className="text-xs text-text-muted">2 minutes ago</p>
            </div>
            <Badge variant="secondary">Active</Badge>
          </div>

          <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
            <div className="p-2 bg-electric-blue-light rounded-full">
              <Camera className="w-4 h-4 text-electric-blue" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-forest-green">
                OCR Scan: Menu Translation (French → English)
              </p>
              <p className="text-xs text-text-muted">15 minutes ago</p>
            </div>
            <Badge variant="outline">Completed</Badge>
          </div>

          <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
            <div className="p-2 bg-electric-blue-light rounded-full">
              <Phone className="w-4 h-4 text-electric-blue" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-forest-green">
                AI Call: Hotel Reservation (English → Japanese)
              </p>
              <p className="text-xs text-text-muted">1 hour ago</p>
            </div>
            <Badge variant="outline">Completed</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
