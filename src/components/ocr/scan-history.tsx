'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, Star, Trash2, Share2, Copy, Calendar, Languages, Image } from 'lucide-react'

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

interface ScanHistoryProps {
  history: ScanHistoryItem[]
  onItemSelect: (item: ScanHistoryItem) => void
  onItemDelete: (id: string) => void
  onItemToggleFavorite: (id: string) => void
}

export function ScanHistory({ history, onItemSelect, onItemDelete, onItemToggleFavorite }: ScanHistoryProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterBy, setFilterBy] = useState<'all' | 'favorites' | 'recent'>('all')
  const [sortBy, setSortBy] = useState<'date' | 'confidence' | 'language'>('date')
  const [displayCount, setDisplayCount] = useState(12)

  const filteredHistory = history
    .filter(item => {
      const matchesSearch = 
        item.originalText.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.translatedText.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesFilter = 
        filterBy === 'all' || 
        (filterBy === 'favorites' && item.isFavorite) ||
        (filterBy === 'recent' && new Date().getTime() - item.timestamp.getTime() < 24 * 60 * 60 * 1000)
      
      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return b.timestamp.getTime() - a.timestamp.getTime()
        case 'confidence':
          return b.confidence - a.confidence
        case 'language':
          return a.sourceLanguage.localeCompare(b.sourceLanguage)
        default:
          return 0
      }
    })

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (error) {
      console.error('Failed to copy text:', error)
    }
  }

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 12)
  }

  const handleShare = async (item: ScanHistoryItem) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Translated Text',
          text: `Original: ${item.originalText}\n\nTranslated: ${item.translatedText}`
        })
      } catch (error) {
        console.error('Failed to share:', error)
      }
    }
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`
    if (diffInHours < 48) return 'Yesterday'
    return date.toLocaleDateString()
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'bg-green-100 text-green-800'
    if (confidence >= 0.7) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-muted" />
          <Input
            placeholder="Search translations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value as any)}
            className="px-3 py-2 border border-border-light rounded-md text-sm"
          >
            <option value="all">All</option>
            <option value="favorites">Favorites</option>
            <option value="recent">Recent</option>
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-border-light rounded-md text-sm"
          >
            <option value="date">Date</option>
            <option value="confidence">Confidence</option>
            <option value="language">Language</option>
          </select>
        </div>
      </div>

      {/* History Items */}
      <div className="space-y-3">
        {filteredHistory.length === 0 ? (
          <Card className="p-8 text-center">
            <Languages className="w-12 h-12 text-text-muted mx-auto mb-3" />
            <h3 className="font-semibold text-forest-green mb-2">
              {searchQuery ? 'No matching translations' : 'No scan history'}
            </h3>
            <p className="text-text-muted">
              {searchQuery 
                ? 'Try adjusting your search terms or filters'
                : 'Your translated texts will appear here'
              }
            </p>
          </Card>
        ) : (
          filteredHistory.slice(0, displayCount).map((item) => (
            <Card key={item.id} className="p-4 sm:p-5 hover:shadow-md transition-shadow">
              {/* Mobile Layout */}
              <div className="flex flex-col gap-4 md:hidden">
                {/* Header with Thumbnail and Badges */}
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={item.imageData}
                        alt="Scan thumbnail"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <Badge variant="outline" className="text-xs">
                        {item.sourceLanguage} → {item.targetLanguage}
                      </Badge>
                      <Badge className={`text-xs ${getConfidenceColor(item.confidence)}`}>
                        {Math.round(item.confidence * 100)}%
                      </Badge>
                      {item.isFavorite && (
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Text Content */}
                <div className="space-y-3">
                  <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                    <div className="text-sm">
                      <strong className="text-forest-green">Original:</strong>
                      <p className="text-text-muted mt-1 line-clamp-2">{item.originalText}</p>
                    </div>
                    <div className="text-sm">
                      <strong className="text-forest-green">Translation:</strong>
                      <p className="text-forest-green mt-1 line-clamp-2 font-medium">{item.translatedText}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-text-muted text-xs">
                    <Calendar className="w-3 h-3" />
                    {formatDate(item.timestamp)}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onItemSelect(item)}
                    className="w-full text-electric-blue hover:text-electric-blue-hover border-electric-blue hover:bg-electric-blue-light"
                  >
                    View Details
                  </Button>

                  <div className="flex gap-2 justify-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onItemToggleFavorite(item.id)}
                      className={item.isFavorite ? 'text-yellow-600' : 'text-text-muted'}
                      title="Toggle Favorite"
                    >
                      <Star className={`w-4 h-4 ${item.isFavorite ? 'fill-current' : ''}`} />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(item.translatedText)}
                      className="text-text-muted hover:text-forest-green"
                      title="Copy Translation"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleShare(item)}
                      className="text-text-muted hover:text-forest-green"
                      title="Share"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onItemDelete(item.id)}
                      className="text-text-muted hover:text-red-600"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden md:flex items-start justify-between gap-4">
                {/* Thumbnail */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={item.imageData}
                      alt="Scan thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className="text-xs">
                        {item.sourceLanguage} → {item.targetLanguage}
                      </Badge>
                      <Badge className={`text-xs ${getConfidenceColor(item.confidence)}`}>
                        {Math.round(item.confidence * 100)}%
                      </Badge>
                      {item.isFavorite && (
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      )}
                    </div>
                  </div>

                  {/* Text Preview */}
                  <div className="space-y-2">
                    <div className="text-sm text-text-muted">
                      <p className="mb-1"><strong className="text-forest-green">Original:</strong> <span className="text-forest-green line-clamp-2">{item.originalText}</span></p>
                      <p className="mb-1"><strong className="text-forest-green">Translation:</strong> <span className="text-forest-green line-clamp-2 font-medium">{item.translatedText}</span></p>
                    </div>
                    <div className="flex items-center gap-1 text-text-muted text-xs">
                      <Calendar className="w-3 h-3" />
                      {formatDate(item.timestamp)}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onItemSelect(item)}
                    className="text-electric-blue hover:text-electric-blue-hover"
                  >
                    View Details
                  </Button>

                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onItemToggleFavorite(item.id)}
                      className={item.isFavorite ? 'text-yellow-600' : 'text-text-muted'}
                      title="Toggle Favorite"
                    >
                      <Star className={`w-4 h-4 ${item.isFavorite ? 'fill-current' : ''}`} />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(item.translatedText)}
                      className="text-text-muted hover:text-forest-green"
                      title="Copy Translation"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleShare(item)}
                      className="text-text-muted hover:text-forest-green"
                      title="Share"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onItemDelete(item.id)}
                      className="text-text-muted hover:text-red-600"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Load More */}
      {filteredHistory.length > displayCount && (
        <div className="text-center pt-4">
          <Button variant="outline" onClick={handleLoadMore}>
            Load More Results ({filteredHistory.length - displayCount} remaining)
          </Button>
        </div>
      )}
    </div>
  )
}
