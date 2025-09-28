import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MessageCircle, Video, Camera, Phone, TrendingUp, Users, Clock, Globe, Settings, BarChart3, Zap, Languages } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-forest-green">Welcome to Talky</h1>
      </div>



      {/* Enhanced Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border-light hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-text-muted">
                Messages Translated
              </CardTitle>
              <div className="p-2 bg-electric-blue-light rounded-lg">
                <TrendingUp className="w-4 h-4 text-electric-blue" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-forest-green">1,234</div>
            <p className="text-xs text-text-muted">
              <span className="text-green-600">+12%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-border-light hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-text-muted">
                Active Conversations
              </CardTitle>
              <div className="p-2 bg-electric-blue-light rounded-lg">
                <Users className="w-4 h-4 text-electric-blue" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-forest-green">23</div>
            <p className="text-xs text-text-muted">
              <span className="text-green-600">+3</span> new today
            </p>
          </CardContent>
        </Card>

        <Card className="border-border-light hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-text-muted">
                Languages Used
              </CardTitle>
              <div className="p-2 bg-electric-blue-light rounded-lg">
                <Globe className="w-4 h-4 text-electric-blue" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-forest-green">8</div>
            <p className="text-xs text-text-muted">
              Across all conversations
            </p>
          </CardContent>
        </Card>

        <Card className="border-border-light hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-text-muted">
                Translation Accuracy
              </CardTitle>
              <div className="p-2 bg-electric-blue-light rounded-lg">
                <Zap className="w-4 h-4 text-electric-blue" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-forest-green">98.5%</div>
            <p className="text-xs text-text-muted">
              <span className="text-green-600">+0.3%</span> this week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border-light">
          <CardHeader>
            <CardTitle className="flex items-center justify-center space-x-2">
              <BarChart3 className="w-5 h-5 text-electric-blue" />
              <span>Translation Usage</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">ES</Badge>
                  <span className="text-sm font-medium">Spanish</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-20 h-2 bg-gray-200 rounded-full">
                    <div className="w-16 h-2 bg-electric-blue rounded-full"></div>
                  </div>
                  <span className="text-xs text-text-muted">80%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">FR</Badge>
                  <span className="text-sm font-medium">French</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-20 h-2 bg-gray-200 rounded-full">
                    <div className="w-12 h-2 bg-electric-blue rounded-full"></div>
                  </div>
                  <span className="text-xs text-text-muted">60%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">JA</Badge>
                  <span className="text-sm font-medium">Japanese</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-20 h-2 bg-gray-200 rounded-full">
                    <div className="w-8 h-2 bg-electric-blue rounded-full"></div>
                  </div>
                  <span className="text-xs text-text-muted">40%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border-light">
          <CardHeader>
            <CardTitle className="flex items-center justify-center space-x-2">
              <Languages className="w-5 h-5 text-electric-blue" />
              <span>Quick Language Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Primary Language</span>
                <Badge className="bg-electric-blue text-white">English</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Auto-detect</span>
                <Badge variant="outline" className="text-green-600 border-green-600">Enabled</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Translation Mode</span>
                <Badge variant="secondary">Real-time</Badge>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full mt-4">
              <Settings className="w-4 h-4 mr-2" />
              Configure Languages
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="border-border-light">
        <CardHeader>
          <CardTitle className="flex items-center justify-center space-x-2">
            <Clock className="w-5 h-5 text-electric-blue" />
            <span>Recent Activity</span>
          </CardTitle>
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
