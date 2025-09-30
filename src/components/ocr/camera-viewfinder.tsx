'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Camera, Square, RotateCcw, Flashlight, FlashlightOff, X, Check } from 'lucide-react'

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

interface CameraViewfinderProps {
  onCapture: (imageData: string, detectedTexts: DetectedText[]) => void
  onClose: () => void
  isActive: boolean
}

export function CameraViewfinder({ onCapture, onClose, isActive }: CameraViewfinderProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const [flashEnabled, setFlashEnabled] = useState(false)
  const [detectedTexts, setDetectedTexts] = useState<DetectedText[]>([])
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment')

  useEffect(() => {
    if (isActive) {
      startCamera()
    } else {
      stopCamera()
    }

    return () => stopCamera()
  }, [isActive, facingMode])

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      })
      
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
  }

  const switchCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user')
  }

  const toggleFlash = async () => {
    if (stream) {
      const track = stream.getVideoTracks()[0]
      const capabilities = track.getCapabilities()
      
      if (capabilities.torch) {
        try {
          await track.applyConstraints({
            advanced: [{ torch: !flashEnabled } as any]
          })
          setFlashEnabled(!flashEnabled)
        } catch (error) {
          console.error('Flash not supported:', error)
        }
      }
    }
  }

  const captureImage = async () => {
    if (!videoRef.current || !canvasRef.current) return

    setIsCapturing(true)
    
    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    
    if (context) {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      context.drawImage(video, 0, 0)
      
      const imageData = canvas.toDataURL('image/jpeg', 0.8)
      
      // Simulate text detection (in real app, this would call OCR API)
      const mockDetectedTexts: DetectedText[] = [
        {
          id: '1',
          text: 'Sample detected text',
          bounds: { x: 100, y: 100, width: 200, height: 30 },
          confidence: 0.95
        }
      ]
      
      setTimeout(() => {
        setIsCapturing(false)
        onCapture(imageData, mockDetectedTexts)
      }, 1000)
    }
  }

  if (!isActive) return null

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Camera View */}
      <div className="relative w-full h-full">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        
        {/* Text Detection Overlays */}
        {detectedTexts.map((text) => (
          <div
            key={text.id}
            className="absolute border-2 border-electric-blue bg-electric-blue-light bg-opacity-20"
            style={{
              left: `${text.bounds.x}px`,
              top: `${text.bounds.y}px`,
              width: `${text.bounds.width}px`,
              height: `${text.bounds.height}px`,
            }}
          >
            <div className="absolute -top-6 left-0 bg-electric-blue text-white text-xs px-2 py-1 rounded">
              {Math.round(text.confidence * 100)}%
            </div>
          </div>
        ))}

        {/* Camera Controls Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Top Controls */}
          <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/50 to-transparent pointer-events-auto">
            <div className="flex justify-between items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </Button>
              
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleFlash}
                  className="text-white hover:bg-white/20"
                >
                  {flashEnabled ? <Flashlight className="w-5 h-5" /> : <FlashlightOff className="w-5 h-5" />}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={switchCamera}
                  className="text-white hover:bg-white/20"
                >
                  <RotateCcw className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Center Viewfinder Guide */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-80 h-48 border-2 border-white/50 rounded-lg relative">
              <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-white"></div>
              <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-white"></div>
              <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-white"></div>
              <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-white"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-white text-sm bg-black/50 px-3 py-1 rounded">
                  Position text within frame
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/50 to-transparent pointer-events-auto">
            <div className="flex justify-center items-center">
              <Button
                onClick={captureImage}
                disabled={isCapturing}
                className="w-16 h-16 rounded-full bg-white hover:bg-gray-100 text-black relative"
              >
                {isCapturing ? (
                  <div className="w-6 h-6 border-2 border-electric-blue border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Camera className="w-8 h-8" />
                )}
              </Button>
            </div>
            
            <div className="text-center mt-4">
              <p className="text-white text-sm">
                Tap to capture • {detectedTexts.length} text regions detected
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden canvas for image capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
