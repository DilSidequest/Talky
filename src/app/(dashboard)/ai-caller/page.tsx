'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Phone, Plus, History, Settings } from 'lucide-react'

export default function AICallerPage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-forest-green">AI Phone Caller</h1>
          <p className="text-text-secondary">Let AI make calls in any language for you</p>
        </div>
        <Button className="bg-electric-blue hover:bg-electric-blue-hover">
          <Plus className="w-4 h-4 mr-2" />
          New AI Call
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="p-6 text-center hover:shadow-md transition-shadow cursor-pointer">
          <div className="w-12 h-12 bg-electric-blue-light rounded-lg flex items-center justify-center mx-auto mb-4">
            <Phone className="w-6 h-6 text-electric-blue" />
          </div>
          <h3 className="font-semibold text-forest-green mb-2">Make AI Call</h3>
          <p className="text-text-muted text-sm">Configure and start a new AI-powered call</p>
        </Card>

        <Card className="p-6 text-center hover:shadow-md transition-shadow cursor-pointer">
          <div className="w-12 h-12 bg-electric-blue-light rounded-lg flex items-center justify-center mx-auto mb-4">
            <History className="w-6 h-6 text-electric-blue" />
          </div>
          <h3 className="font-semibold text-forest-green mb-2">Call History</h3>
          <p className="text-text-muted text-sm">View and analyze previous AI calls</p>
        </Card>

        <Card className="p-6 text-center hover:shadow-md transition-shadow cursor-pointer">
          <div className="w-12 h-12 bg-electric-blue-light rounded-lg flex items-center justify-center mx-auto mb-4">
            <Settings className="w-6 h-6 text-electric-blue" />
          </div>
          <h3 className="font-semibold text-forest-green mb-2">Voice Settings</h3>
          <p className="text-text-muted text-sm">Customize AI voice and behavior</p>
        </Card>
      </div>

      {/* Recent AI Calls */}
      <div>
        <h2 className="text-xl font-semibold text-forest-green mb-4">Recent AI Calls</h2>
        <div className="text-center py-12">
          <Phone className="w-16 h-16 text-text-muted mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-forest-green mb-2">
            No AI calls yet
          </h3>
          <p className="text-text-secondary mb-6">
            Configure your first AI call to get started
          </p>
          <Button className="bg-electric-blue hover:bg-electric-blue-hover">
            <Plus className="w-4 h-4 mr-2" />
            Create AI Call
          </Button>
        </div>
      </div>
    </div>
  )
}
