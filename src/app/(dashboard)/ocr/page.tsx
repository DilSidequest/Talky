'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CameraViewfinder } from '@/components/ocr/camera-viewfinder'
import { TranslationResult } from '@/components/ocr/translation-result'
import { ScanHistory } from '@/components/ocr/scan-history'
import { Camera, Image, FileText, Languages, Upload, Zap, History, Settings } from 'lucide-react'

interface DetectedText {
  id: string
  text: string
  bounds: {
    x: number
    y: number
    width: number
    height: number
  }
  confidence: number
}

interface ScanHistoryItem {
  id: string
  originalText: string
  translatedText: string
  sourceLanguage: string
  targetLanguage: string
  confidence: number
  imageData: string
  timestamp: Date
  isFavorite: boolean
}

export default function OCRPage() {
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [showTranslationResult, setShowTranslationResult] = useState(false)
  const [currentResult, setCurrentResult] = useState<any>(null)
  const [scanHistory, setScanHistory] = useState<ScanHistoryItem[]>([
    // Mock data for demonstration
    {
      id: '1',
      originalText: 'Bonjour, comment allez-vous?',
      translatedText: 'Hello, how are you?',
      sourceLanguage: 'French',
      targetLanguage: 'English',
      confidence: 0.95,
      imageData: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isFavorite: true
    },
    {
      id: '2',
      originalText: 'こんにちは',
      translatedText: 'Hello',
      sourceLanguage: 'Japanese',
      targetLanguage: 'English',
      confidence: 0.88,
      imageData: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      isFavorite: false
    }
  ])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleCameraCapture = (imageData: string, detectedTexts: DetectedText[]) => {
    // Simulate translation process
    const mockResult = {
      originalText: 'Sample detected text from camera',
      translatedText: 'Texto de muestra detectado desde la cámara',
      sourceLanguage: 'English',
      targetLanguage: 'Spanish',
      confidence: 0.92,
      imageData
    }

    setCurrentResult(mockResult)
    setIsCameraActive(false)
    setShowTranslationResult(true)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageData = e.target?.result as string
        // Simulate OCR and translation
        const mockResult = {
          originalText: 'Text extracted from uploaded image',
          translatedText: 'Texto extraído de la imagen subida',
          sourceLanguage: 'English',
          targetLanguage: 'Spanish',
          confidence: 0.87,
          imageData
        }

        setCurrentResult(mockResult)
        setShowTranslationResult(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveTranslation = (result: any) => {
    setScanHistory(prev => [result, ...prev])
    setShowTranslationResult(false)
    setCurrentResult(null)
  }

  const handleHistoryItemSelect = (item: ScanHistoryItem) => {
    setCurrentResult(item)
    setShowTranslationResult(true)
  }

  const handleHistoryItemDelete = (id: string) => {
    setScanHistory(prev => prev.filter(item => item.id !== id))
  }

  const handleHistoryItemToggleFavorite = (id: string) => {
    setScanHistory(prev =>
      prev.map(item =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-forest-green">OCR Scanner</h1>
          <p className="text-text-secondary">Translate text from images instantly with AI</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setIsCameraActive(true)}
            className="bg-electric-blue hover:bg-electric-blue-hover"
          >
            <Camera className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Open Camera</span>
            <span className="sm:hidden">Camera</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Upload</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="scanner" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="scanner" className="flex items-center gap-2">
            <Camera className="w-4 h-4" />
            Scanner
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="w-4 h-4" />
            History
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scanner" className="space-y-6">
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card
              className="p-6 hover:shadow-md transition-all cursor-pointer hover:border-electric-blue"
              onClick={() => setIsCameraActive(true)}
            >
              <div className="w-12 h-12 bg-electric-blue-light rounded-lg flex items-center justify-center mb-4">
                <Camera className="w-6 h-6 text-electric-blue" />
              </div>
              <h3 className="font-semibold text-forest-green mb-2">Live Camera</h3>
              <p className="text-text-muted text-sm mb-4">
                Point your camera at text for real-time detection and translation
              </p>
              <Button className="w-full bg-electric-blue hover:bg-electric-blue-hover">
                Start Scanning
              </Button>
            </Card>

            <Card
              className="p-6 hover:shadow-md transition-all cursor-pointer hover:border-electric-blue"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-12 h-12 bg-electric-blue-light rounded-lg flex items-center justify-center mb-4">
                <Image className="w-6 h-6 text-electric-blue" />
              </div>
              <h3 className="font-semibold text-forest-green mb-2">Upload Image</h3>
              <p className="text-text-muted text-sm mb-4">
                Upload an image from your device to extract and translate text
              </p>
              <Button variant="outline" className="w-full">
                Choose Image
              </Button>
            </Card>

            <Card className="p-6 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-electric-blue-light rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-electric-blue" />
              </div>
              <h3 className="font-semibold text-forest-green mb-2">Batch Processing</h3>
              <p className="text-text-muted text-sm mb-4">
                Process multiple images at once for efficient translation
              </p>
              <Button variant="outline" className="w-full" disabled>
                Coming Soon
              </Button>
            </Card>
          </div>

          {/* Recent Activity */}
          {scanHistory.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-forest-green mb-4">Recent Scans</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {scanHistory.slice(0, 3).map((item) => (
                  <Card
                    key={item.id}
                    className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleHistoryItemSelect(item)}
                  >
                    <div className="aspect-video bg-gray-100 rounded-lg mb-3 overflow-hidden">
                      <img
                        src={item.imageData}
                        alt="Scan preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-text-muted">
                          {item.sourceLanguage} → {item.targetLanguage}
                        </span>
                        <span className="text-xs text-text-muted">
                          {Math.round(item.confidence * 100)}%
                        </span>
                      </div>
                      <p className="text-sm text-forest-green line-clamp-2">
                        {item.translatedText}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="history">
          <ScanHistory
            history={scanHistory}
            onItemSelect={handleHistoryItemSelect}
            onItemDelete={handleHistoryItemDelete}
            onItemToggleFavorite={handleHistoryItemToggleFavorite}
          />
        </TabsContent>

        <TabsContent value="settings">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-forest-green mb-4">Translation Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-forest-green mb-2 block">
                    Default Source Language
                  </label>
                  <select className="w-full p-2 border border-border-light rounded-md">
                    <option>Auto-detect</option>
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
                    Default Target Language
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
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-forest-green mb-4">Camera Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-forest-green">Auto-capture</span>
                  <input type="checkbox" className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-forest-green">Flash by default</span>
                  <input type="checkbox" className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-forest-green">Save original images</span>
                  <input type="checkbox" className="rounded" defaultChecked />
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Camera Viewfinder */}
      <CameraViewfinder
        isActive={isCameraActive}
        onCapture={handleCameraCapture}
        onClose={() => setIsCameraActive(false)}
      />

      {/* Translation Result Modal */}
      {showTranslationResult && currentResult && (
        <TranslationResult
          originalText={currentResult.originalText}
          translatedText={currentResult.translatedText}
          sourceLanguage={currentResult.sourceLanguage}
          targetLanguage={currentResult.targetLanguage}
          confidence={currentResult.confidence}
          imageData={currentResult.imageData}
          onClose={() => setShowTranslationResult(false)}
          onSave={handleSaveTranslation}
        />
      )}
    </div>
  )
}
