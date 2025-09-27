'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Camera, Image, FileText, Languages } from 'lucide-react'

export default function OCRPage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-forest-green">OCR Scanner</h1>
          <p className="text-text-secondary">Translate text from images instantly</p>
        </div>
        <Button className="bg-electric-blue hover:bg-electric-blue-hover">
          <Camera className="w-4 h-4 mr-2" />
          Open Camera
        </Button>
      </div>

      {/* Scanner Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
          <div className="w-12 h-12 bg-electric-blue-light rounded-lg flex items-center justify-center mb-4">
            <Camera className="w-6 h-6 text-electric-blue" />
          </div>
          <h3 className="font-semibold text-forest-green mb-2">Live Camera</h3>
          <p className="text-text-muted text-sm mb-4">
            Point your camera at text for real-time translation
          </p>
          <Button className="w-full bg-electric-blue hover:bg-electric-blue-hover">
            Start Scanning
          </Button>
        </Card>

        <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
          <div className="w-12 h-12 bg-electric-blue-light rounded-lg flex items-center justify-center mb-4">
            <Image className="w-6 h-6 text-electric-blue" />
          </div>
          <h3 className="font-semibold text-forest-green mb-2">Upload Image</h3>
          <p className="text-text-muted text-sm mb-4">
            Upload an image to extract and translate text
          </p>
          <Button variant="outline" className="w-full">
            Choose Image
          </Button>
        </Card>
      </div>

      {/* Recent Scans */}
      <div>
        <h2 className="text-xl font-semibold text-forest-green mb-4">Recent Scans</h2>
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-text-muted mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-forest-green mb-2">
            No scans yet
          </h3>
          <p className="text-text-secondary mb-6">
            Your translated texts will be saved here for easy access
          </p>
          <Button className="bg-electric-blue hover:bg-electric-blue-hover">
            <Camera className="w-4 h-4 mr-2" />
            Start Your First Scan
          </Button>
        </div>
      </div>
    </div>
  )
}
