'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { User, Languages, Bell, Shield, Palette, HelpCircle } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-forest-green">Settings</h1>
        <p className="text-text-secondary">Manage your account and app preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <Card className="p-4">
            <nav className="space-y-2">
              <Button variant="ghost" className="w-full justify-start gap-3">
                <User className="w-4 h-4" />
                Profile
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3">
                <Languages className="w-4 h-4" />
                Language Preferences
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3">
                <Bell className="w-4 h-4" />
                Notifications
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3">
                <Shield className="w-4 h-4" />
                Privacy & Security
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3">
                <Palette className="w-4 h-4" />
                Appearance
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3">
                <HelpCircle className="w-4 h-4" />
                Help & Support
              </Button>
            </nav>
          </Card>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="space-y-6">
              {/* Profile Section */}
              <div>
                <h3 className="text-lg font-semibold text-forest-green mb-4">Profile Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-forest-green mb-2 block">
                      Display Name
                    </label>
                    <Input placeholder="Enter your display name" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-forest-green mb-2 block">
                      Email
                    </label>
                    <Input placeholder="your.email@example.com" type="email" />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Language Preferences */}
              <div>
                <h3 className="text-lg font-semibold text-forest-green mb-4">Language Preferences</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-forest-green mb-2 block">
                      Primary Language
                    </label>
                    <select className="w-full p-2 border border-border-light rounded-md">
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                      <option>Japanese</option>
                      <option>Chinese</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-forest-green mb-2 block">
                      Auto-translate incoming messages
                    </label>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="auto-translate" className="rounded" />
                      <label htmlFor="auto-translate" className="text-sm text-text-secondary">
                        Automatically translate messages to your primary language
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Save Button */}
              <div className="flex justify-end">
                <Button className="bg-electric-blue hover:bg-electric-blue-hover">
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
