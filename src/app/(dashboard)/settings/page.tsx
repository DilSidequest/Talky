'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { User, Languages, Bell, Shield, Palette, HelpCircle, Camera, Mic, Volume2, Globe, Smartphone, Monitor, Moon, Sun, Eye, Lock, Key, CreditCard, Download, Trash2, Mail, MessageSquare, Phone } from 'lucide-react'

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('profile')
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    callReminders: true,
    translationUpdates: true,
    securityAlerts: true
  })

  const [privacy, setPrivacy] = useState({
    shareUsageData: false,
    allowAnalytics: true,
    publicProfile: false,
    showOnlineStatus: true
  })

  const [audioVideo, setAudioVideo] = useState({
    cameraQuality: 'hd',
    microphoneGain: 75,
    speakerVolume: 80,
    noiseCancellation: true,
    autoAdjustVolume: true
  })

  const handleUploadPhoto = () => {
    // In real app, this would open file picker
    console.log('Opening file picker for photo upload')
  }

  const handleRemovePhoto = () => {
    // In real app, this would remove the profile photo
    console.log('Removing profile photo')
  }

  const handleEnable2FA = () => {
    // In real app, this would start 2FA setup process
    console.log('Starting 2FA setup')
  }

  const handleChangePassword = () => {
    // In real app, this would open password change modal
    console.log('Opening password change modal')
  }

  const handleDownloadData = () => {
    // In real app, this would initiate data download
    console.log('Initiating data download')
  }

  const handleResetDefaults = () => {
    // In real app, this would reset all settings to defaults
    console.log('Resetting settings to defaults')
  }

  const handleSaveChanges = () => {
    // In real app, this would save settings to backend
    console.log('Saving settings changes')
  }

  const settingsNavigation = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'language', name: 'Language', icon: Languages },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'privacy', name: 'Privacy & Security', icon: Shield },
    { id: 'audio-video', name: 'Audio & Video', icon: Camera },
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'help', name: 'Help & Support', icon: HelpCircle }
  ]

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-forest-green">Settings</h1>
        <p className="text-text-secondary">Manage your account and app preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation - Mobile Tabs, Desktop Sidebar */}
        <div className="lg:col-span-1">
          {/* Mobile Tabs */}
          <div className="lg:hidden mb-6">
            <Tabs value={activeSection} onValueChange={setActiveSection}>
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="profile" className="text-xs">Profile</TabsTrigger>
                <TabsTrigger value="language" className="text-xs">Language</TabsTrigger>
                <TabsTrigger value="notifications" className="text-xs">Notifications</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Desktop Sidebar */}
          <Card className="p-4 hidden lg:block">
            <nav className="space-y-2">
              {settingsNavigation.map((item) => {
                const Icon = item.icon
                return (
                  <Button
                    key={item.id}
                    variant={activeSection === item.id ? "default" : "ghost"}
                    className={`w-full justify-start gap-3 ${
                      activeSection === item.id
                        ? 'bg-electric-blue text-white hover:bg-electric-blue-hover'
                        : 'hover:bg-bg-accent'
                    }`}
                    onClick={() => setActiveSection(item.id)}
                  >
                    <Icon className="w-4 h-4" />
                    {item.name}
                  </Button>
                )
              })}
            </nav>
          </Card>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <Card className="p-6">
            {/* Profile Section */}
            {activeSection === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-forest-green mb-4">Profile Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-forest-green mb-2 block">
                        Display Name
                      </label>
                      <Input placeholder="Enter your display name" defaultValue="John Doe" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-forest-green mb-2 block">
                        Email
                      </label>
                      <Input placeholder="your.email@example.com" type="email" defaultValue="john@example.com" />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold text-forest-green mb-4">Profile Picture</h3>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-electric-blue-light rounded-full flex items-center justify-center">
                      <User className="w-8 h-8 text-electric-blue" />
                    </div>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm" onClick={handleUploadPhoto}>
                        <Camera className="w-4 h-4 mr-2" />
                        Upload Photo
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600" onClick={handleRemovePhoto}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold text-forest-green mb-4">Account Status</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-forest-green">Account Type</span>
                      <Badge className="bg-electric-blue-light text-electric-blue">Premium</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-forest-green">Member Since</span>
                      <span className="text-sm text-text-muted">January 2024</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-forest-green">Storage Used</span>
                      <span className="text-sm text-text-muted">2.3 GB / 10 GB</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Language Section */}
            {activeSection === 'language' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-forest-green mb-4">Language Preferences</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-forest-green mb-2 block">
                        Primary Language
                      </label>
                      <select className="w-full p-2 border border-border-light rounded-md">
                        <option>English (US)</option>
                        <option>English (UK)</option>
                        <option>Spanish</option>
                        <option>French</option>
                        <option>German</option>
                        <option>Japanese</option>
                        <option>Chinese (Simplified)</option>
                        <option>Chinese (Traditional)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-forest-green mb-2 block">
                        Secondary Language
                      </label>
                      <select className="w-full p-2 border border-border-light rounded-md">
                        <option>None</option>
                        <option>Spanish</option>
                        <option>French</option>
                        <option>German</option>
                        <option>Japanese</option>
                        <option>Chinese</option>
                      </select>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold text-forest-green mb-4">Translation Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-forest-green">Auto-translate incoming messages</span>
                        <p className="text-xs text-text-muted">Automatically translate messages to your primary language</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-forest-green">Show original text</span>
                        <p className="text-xs text-text-muted">Display original text alongside translations</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-forest-green">Real-time translation</span>
                        <p className="text-xs text-text-muted">Translate text as you type</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold text-forest-green mb-4">Regional Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-forest-green mb-2 block">
                        Time Zone
                      </label>
                      <select className="w-full p-2 border border-border-light rounded-md">
                        <option>UTC-8 (Pacific Time)</option>
                        <option>UTC-5 (Eastern Time)</option>
                        <option>UTC+0 (GMT)</option>
                        <option>UTC+1 (Central European Time)</option>
                        <option>UTC+9 (Japan Standard Time)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-forest-green mb-2 block">
                        Date Format
                      </label>
                      <select className="w-full p-2 border border-border-light rounded-md">
                        <option>MM/DD/YYYY</option>
                        <option>DD/MM/YYYY</option>
                        <option>YYYY-MM-DD</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Section */}
            {activeSection === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-forest-green mb-4">Notification Preferences</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-electric-blue" />
                        <div>
                          <span className="text-sm font-medium text-forest-green">Email Notifications</span>
                          <p className="text-xs text-text-muted">Receive notifications via email</p>
                        </div>
                      </div>
                      <Switch
                        checked={notifications.email}
                        onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, email: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Smartphone className="w-5 h-5 text-electric-blue" />
                        <div>
                          <span className="text-sm font-medium text-forest-green">Push Notifications</span>
                          <p className="text-xs text-text-muted">Receive push notifications on your device</p>
                        </div>
                      </div>
                      <Switch
                        checked={notifications.push}
                        onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, push: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <MessageSquare className="w-5 h-5 text-electric-blue" />
                        <div>
                          <span className="text-sm font-medium text-forest-green">SMS Notifications</span>
                          <p className="text-xs text-text-muted">Receive important updates via SMS</p>
                        </div>
                      </div>
                      <Switch
                        checked={notifications.sms}
                        onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, sms: checked }))}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold text-forest-green mb-4">Specific Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-electric-blue" />
                        <div>
                          <span className="text-sm font-medium text-forest-green">Call Reminders</span>
                          <p className="text-xs text-text-muted">Reminders for scheduled calls</p>
                        </div>
                      </div>
                      <Switch
                        checked={notifications.callReminders}
                        onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, callReminders: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Languages className="w-5 h-5 text-electric-blue" />
                        <div>
                          <span className="text-sm font-medium text-forest-green">Translation Updates</span>
                          <p className="text-xs text-text-muted">New language support and improvements</p>
                        </div>
                      </div>
                      <Switch
                        checked={notifications.translationUpdates}
                        onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, translationUpdates: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-electric-blue" />
                        <div>
                          <span className="text-sm font-medium text-forest-green">Security Alerts</span>
                          <p className="text-xs text-text-muted">Important security notifications</p>
                        </div>
                      </div>
                      <Switch
                        checked={notifications.securityAlerts}
                        onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, securityAlerts: checked }))}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Privacy & Security Section */}
            {activeSection === 'privacy' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-forest-green mb-4">Privacy Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Eye className="w-5 h-5 text-electric-blue" />
                        <div>
                          <span className="text-sm font-medium text-forest-green">Public Profile</span>
                          <p className="text-xs text-text-muted">Allow others to find your profile</p>
                        </div>
                      </div>
                      <Switch
                        checked={privacy.publicProfile}
                        onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, publicProfile: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-electric-blue" />
                        <div>
                          <span className="text-sm font-medium text-forest-green">Show Online Status</span>
                          <p className="text-xs text-text-muted">Let others see when you're online</p>
                        </div>
                      </div>
                      <Switch
                        checked={privacy.showOnlineStatus}
                        onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, showOnlineStatus: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Monitor className="w-5 h-5 text-electric-blue" />
                        <div>
                          <span className="text-sm font-medium text-forest-green">Share Usage Data</span>
                          <p className="text-xs text-text-muted">Help improve the app by sharing anonymous usage data</p>
                        </div>
                      </div>
                      <Switch
                        checked={privacy.shareUsageData}
                        onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, shareUsageData: checked }))}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold text-forest-green mb-4">Security</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Lock className="w-5 h-5 text-electric-blue" />
                        <div>
                          <span className="text-sm font-medium text-forest-green">Two-Factor Authentication</span>
                          <p className="text-xs text-text-muted">Add an extra layer of security</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" onClick={handleEnable2FA}>
                        Enable
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Key className="w-5 h-5 text-electric-blue" />
                        <div>
                          <span className="text-sm font-medium text-forest-green">Change Password</span>
                          <p className="text-xs text-text-muted">Update your account password</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" onClick={handleChangePassword}>
                        Change
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Download className="w-5 h-5 text-electric-blue" />
                        <div>
                          <span className="text-sm font-medium text-forest-green">Download Data</span>
                          <p className="text-xs text-text-muted">Download a copy of your data</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" onClick={handleDownloadData}>
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Audio & Video Section */}
            {activeSection === 'audio-video' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-forest-green mb-4">Camera Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-forest-green mb-2 block">
                        Camera Quality
                      </label>
                      <select
                        className="w-full p-2 border border-border-light rounded-md"
                        value={audioVideo.cameraQuality}
                        onChange={(e) => setAudioVideo(prev => ({ ...prev, cameraQuality: e.target.value }))}
                      >
                        <option value="sd">SD (480p)</option>
                        <option value="hd">HD (720p)</option>
                        <option value="fhd">Full HD (1080p)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold text-forest-green mb-4">Audio Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-forest-green mb-2 block">
                        Microphone Gain: {audioVideo.microphoneGain}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={audioVideo.microphoneGain}
                        onChange={(e) => setAudioVideo(prev => ({ ...prev, microphoneGain: parseInt(e.target.value) }))}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-forest-green mb-2 block">
                        Speaker Volume: {audioVideo.speakerVolume}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={audioVideo.speakerVolume}
                        onChange={(e) => setAudioVideo(prev => ({ ...prev, speakerVolume: parseInt(e.target.value) }))}
                        className="w-full"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-forest-green">Noise Cancellation</span>
                        <p className="text-xs text-text-muted">Reduce background noise during calls</p>
                      </div>
                      <Switch
                        checked={audioVideo.noiseCancellation}
                        onCheckedChange={(checked) => setAudioVideo(prev => ({ ...prev, noiseCancellation: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-forest-green">Auto-adjust Volume</span>
                        <p className="text-xs text-text-muted">Automatically adjust volume based on environment</p>
                      </div>
                      <Switch
                        checked={audioVideo.autoAdjustVolume}
                        onCheckedChange={(checked) => setAudioVideo(prev => ({ ...prev, autoAdjustVolume: checked }))}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Appearance Section */}
            {activeSection === 'appearance' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-forest-green mb-4">Theme</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-4 cursor-pointer border-2 border-electric-blue bg-electric-blue-light">
                      <div className="flex items-center gap-3 mb-2">
                        <Sun className="w-5 h-5 text-electric-blue" />
                        <span className="font-medium text-forest-green">Light</span>
                      </div>
                      <p className="text-xs text-text-muted">Clean and bright interface</p>
                    </Card>

                    <Card className="p-4 cursor-pointer hover:border-gray-300">
                      <div className="flex items-center gap-3 mb-2">
                        <Moon className="w-5 h-5 text-gray-600" />
                        <span className="font-medium text-forest-green">Dark</span>
                      </div>
                      <p className="text-xs text-text-muted">Easy on the eyes</p>
                    </Card>

                    <Card className="p-4 cursor-pointer hover:border-gray-300">
                      <div className="flex items-center gap-3 mb-2">
                        <Monitor className="w-5 h-5 text-gray-600" />
                        <span className="font-medium text-forest-green">System</span>
                      </div>
                      <p className="text-xs text-text-muted">Match system preference</p>
                    </Card>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold text-forest-green mb-4">Display</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-forest-green mb-2 block">
                        Font Size
                      </label>
                      <select className="w-full p-2 border border-border-light rounded-md">
                        <option>Small</option>
                        <option>Medium</option>
                        <option>Large</option>
                        <option>Extra Large</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-forest-green">Compact Mode</span>
                        <p className="text-xs text-text-muted">Show more content in less space</p>
                      </div>
                      <Switch />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-forest-green">High Contrast</span>
                        <p className="text-xs text-text-muted">Improve visibility with higher contrast</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Help & Support Section */}
            {activeSection === 'help' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-forest-green mb-4">Get Help</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-center gap-3 mb-2">
                        <HelpCircle className="w-5 h-5 text-electric-blue" />
                        <span className="font-medium text-forest-green">FAQ</span>
                      </div>
                      <p className="text-sm text-text-muted">Find answers to common questions</p>
                    </Card>

                    <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-center gap-3 mb-2">
                        <MessageSquare className="w-5 h-5 text-electric-blue" />
                        <span className="font-medium text-forest-green">Contact Support</span>
                      </div>
                      <p className="text-sm text-text-muted">Get help from our support team</p>
                    </Card>

                    <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-center gap-3 mb-2">
                        <Globe className="w-5 h-5 text-electric-blue" />
                        <span className="font-medium text-forest-green">User Guide</span>
                      </div>
                      <p className="text-sm text-text-muted">Learn how to use all features</p>
                    </Card>

                    <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-center gap-3 mb-2">
                        <Mail className="w-5 h-5 text-electric-blue" />
                        <span className="font-medium text-forest-green">Send Feedback</span>
                      </div>
                      <p className="text-sm text-text-muted">Help us improve the app</p>
                    </Card>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold text-forest-green mb-4">About</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-forest-green">Version</span>
                      <span className="text-sm text-text-muted">1.2.0</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-forest-green">Last Updated</span>
                      <span className="text-sm text-text-muted">March 15, 2024</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-forest-green">Build</span>
                      <span className="text-sm text-text-muted">#1234</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t">
              <div className="text-sm text-text-muted">
                Changes are saved automatically
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleResetDefaults}>
                  Reset to Defaults
                </Button>
                <Button className="bg-electric-blue hover:bg-electric-blue-hover" onClick={handleSaveChanges}>
                  Save Changes
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
