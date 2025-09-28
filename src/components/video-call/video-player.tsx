'use client'

import { useEffect, useRef, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface VideoPlayerProps {
  stream: MediaStream | null
  muted?: boolean
  autoPlay?: boolean
  playsInline?: boolean
  className?: string
  onLoadedMetadata?: () => void
  onError?: (error: Event) => void
}

export const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(
  ({ 
    stream, 
    muted = true, 
    autoPlay = true, 
    playsInline = true, 
    className,
    onLoadedMetadata,
    onError 
  }, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null)
    const internalRef = ref || videoRef

    useEffect(() => {
      const video = typeof internalRef === 'object' && internalRef?.current
      if (!video) return

      if (stream) {
        video.srcObject = stream
        
        // Handle video events
        const handleLoadedMetadata = () => {
          onLoadedMetadata?.()
        }
        
        const handleError = (error: Event) => {
          console.error('Video player error:', error)
          onError?.(error)
        }
        
        video.addEventListener('loadedmetadata', handleLoadedMetadata)
        video.addEventListener('error', handleError)
        
        return () => {
          video.removeEventListener('loadedmetadata', handleLoadedMetadata)
          video.removeEventListener('error', handleError)
        }
      } else {
        video.srcObject = null
      }
    }, [stream, internalRef, onLoadedMetadata, onError])

    return (
      <video
        ref={internalRef}
        autoPlay={autoPlay}
        muted={muted}
        playsInline={playsInline}
        className={cn(
          "w-full h-full object-cover bg-electric-blue-lighter",
          className
        )}
      />
    )
  }
)

VideoPlayer.displayName = 'VideoPlayer'
