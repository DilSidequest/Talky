'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Copy, Share2, Download, Edit3, Languages, Volume2, Star, X } from 'lucide-react'

interface TranslationResultProps {
  originalText: string
  translatedText: string
  sourceLanguage: string
  targetLanguage: string
  confidence: number
  imageData: string
  onClose: () => void
  onSave: (result: TranslationResult) => void
}

interface TranslationResult {
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

export function TranslationResult({
  originalText,
  translatedText,
  sourceLanguage,
  targetLanguage,
  confidence,
  imageData,
  onClose,
  onSave
}: TranslationResultProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTranslation, setEditedTranslation] = useState(translatedText)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      // Show toast notification in real app
    } catch (error) {
      console.error('Failed to copy text:', error)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Translated Text',
          text: `Original (${sourceLanguage}): ${originalText}\n\nTranslated (${targetLanguage}): ${translatedText}`
        })
      } catch (error) {
        console.error('Failed to share:', error)
      }
    }
  }

  const handleSave = () => {
    const result: TranslationResult = {
      id: Date.now().toString(),
      originalText,
      translatedText: editedTranslation,
      sourceLanguage,
      targetLanguage,
      confidence,
      imageData,
      timestamp: new Date(),
      isFavorite
    }
    onSave(result)
  }

  const handlePlayAudio = () => {
    setIsPlaying(true)
    // In real app, this would use text-to-speech API
    setTimeout(() => setIsPlaying(false), 2000)
  }

  const handleExport = () => {
    // In real app, this would export the translation as PDF or text file
    const exportData = {
      original: originalText,
      translated: editedTranslation,
      sourceLanguage,
      targetLanguage,
      confidence,
      timestamp: new Date().toISOString()
    }

    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `translation-${Date.now()}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'bg-green-100 text-green-800'
    if (confidence >= 0.7) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <Languages className="w-5 h-5 text-electric-blue" />
            <h2 className="text-lg font-semibold text-forest-green">Translation Result</h2>
            <Badge className={getConfidenceColor(confidence)}>
              {Math.round(confidence * 100)}% confidence
            </Badge>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row max-h-[calc(90vh-80px)]">
          {/* Image Preview */}
          <div className="lg:w-1/3 p-4 border-b lg:border-b-0 lg:border-r">
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={imageData}
                alt="Captured text"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-3 text-center">
              <p className="text-sm text-text-muted">Captured Image</p>
            </div>
          </div>

          {/* Translation Content */}
          <div className="lg:w-2/3 p-4 overflow-y-auto">
            <div className="space-y-6">
              {/* Original Text */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-forest-green">Original Text</h3>
                    <Badge variant="outline">{sourceLanguage}</Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => handleCopy(originalText)}>
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handlePlayAudio}>
                      <Volume2 className={`w-4 h-4 ${isPlaying ? 'text-electric-blue' : ''}`} />
                    </Button>
                  </div>
                </div>
                <Card className="p-4 bg-gray-50">
                  <p className="text-forest-green leading-relaxed">{originalText}</p>
                </Card>
              </div>

              <Separator />

              {/* Translated Text */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-forest-green">Translation</h3>
                    <Badge variant="outline">{targetLanguage}</Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleCopy(editedTranslation)}>
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handlePlayAudio}>
                      <Volume2 className={`w-4 h-4 ${isPlaying ? 'text-electric-blue' : ''}`} />
                    </Button>
                  </div>
                </div>
                
                {isEditing ? (
                  <textarea
                    value={editedTranslation}
                    onChange={(e) => setEditedTranslation(e.target.value)}
                    className="w-full p-4 border border-border-light rounded-lg resize-none min-h-[100px] focus:outline-none focus:ring-2 focus:ring-electric-blue"
                    placeholder="Edit translation..."
                  />
                ) : (
                  <Card className="p-4 bg-electric-blue-light">
                    <p className="text-forest-green leading-relaxed">{editedTranslation}</p>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-t bg-gray-50">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFavorite(!isFavorite)}
              className={isFavorite ? 'text-yellow-600' : ''}
            >
              <Star className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
              {isFavorite ? 'Favorited' : 'Add to Favorites'}
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button onClick={handleSave} className="bg-electric-blue hover:bg-electric-blue-hover">
              Save Translation
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
