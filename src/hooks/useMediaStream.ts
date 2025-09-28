'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

export interface MediaStreamState {
  stream: MediaStream | null
  isVideoEnabled: boolean
  isAudioEnabled: boolean
  isScreenSharing: boolean
  isRecording: boolean
  recordedChunks: Blob[]
  error: string | null
  isLoading: boolean
}

export interface MediaStreamControls {
  startVideo: () => Promise<void>
  stopVideo: () => void
  startAudio: () => Promise<void>
  stopAudio: () => void
  toggleVideo: () => Promise<void>
  toggleAudio: () => Promise<void>
  startScreenShare: () => Promise<void>
  stopScreenShare: () => void
  startRecording: () => Promise<void>
  stopRecording: () => Promise<Blob | null>
  pauseRecording: () => void
  resumeRecording: () => void
}

export function useMediaStream(initialConfig?: {
  video?: boolean
  audio?: boolean
}): [MediaStreamState, MediaStreamControls] {
  const [state, setState] = useState<MediaStreamState>({
    stream: null,
    isVideoEnabled: initialConfig?.video ?? false,
    isAudioEnabled: initialConfig?.audio ?? false,
    isScreenSharing: false,
    isRecording: false,
    recordedChunks: [],
    error: null,
    isLoading: false
  })

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const screenStreamRef = useRef<MediaStream | null>(null)

  // Cleanup function
  const cleanup = useCallback(() => {
    if (state.stream) {
      state.stream.getTracks().forEach(track => track.stop())
    }
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(track => track.stop())
    }
    if (mediaRecorderRef.current && state.isRecording) {
      mediaRecorderRef.current.stop()
    }
  }, [state.stream, state.isRecording])

  // Initialize media stream
  const initializeStream = useCallback(async (constraints: MediaStreamConstraints) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      setState(prev => ({ 
        ...prev, 
        stream, 
        isLoading: false,
        isVideoEnabled: constraints.video ? true : prev.isVideoEnabled,
        isAudioEnabled: constraints.audio ? true : prev.isAudioEnabled
      }))
      return stream
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to access media devices'
      setState(prev => ({ 
        ...prev, 
        error: errorMessage, 
        isLoading: false 
      }))
      throw error
    }
  }, [])

  // Start video
  const startVideo = useCallback(async () => {
    try {
      const constraints: MediaStreamConstraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        },
        audio: state.isAudioEnabled
      }
      
      if (state.stream) {
        // Stop existing stream
        state.stream.getTracks().forEach(track => track.stop())
      }
      
      await initializeStream(constraints)
    } catch (error) {
      console.error('Failed to start video:', error)
    }
  }, [state.isAudioEnabled, state.stream, initializeStream])

  // Stop video
  const stopVideo = useCallback(() => {
    if (state.stream) {
      const videoTracks = state.stream.getVideoTracks()
      videoTracks.forEach(track => track.stop())
      
      setState(prev => ({ 
        ...prev, 
        isVideoEnabled: false,
        stream: prev.stream && prev.stream.getAudioTracks().length > 0 ? prev.stream : null
      }))
    }
  }, [state.stream])

  // Start audio
  const startAudio = useCallback(async () => {
    try {
      const constraints: MediaStreamConstraints = {
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        },
        video: state.isVideoEnabled
      }
      
      if (state.stream) {
        // Stop existing stream
        state.stream.getTracks().forEach(track => track.stop())
      }
      
      await initializeStream(constraints)
    } catch (error) {
      console.error('Failed to start audio:', error)
    }
  }, [state.isVideoEnabled, state.stream, initializeStream])

  // Stop audio
  const stopAudio = useCallback(() => {
    if (state.stream) {
      const audioTracks = state.stream.getAudioTracks()
      audioTracks.forEach(track => track.stop())
      
      setState(prev => ({ 
        ...prev, 
        isAudioEnabled: false,
        stream: prev.stream && prev.stream.getVideoTracks().length > 0 ? prev.stream : null
      }))
    }
  }, [state.stream])

  // Toggle video
  const toggleVideo = useCallback(async () => {
    if (state.isVideoEnabled) {
      stopVideo()
    } else {
      await startVideo()
    }
  }, [state.isVideoEnabled, startVideo, stopVideo])

  // Toggle audio
  const toggleAudio = useCallback(async () => {
    if (state.isAudioEnabled) {
      stopAudio()
    } else {
      await startAudio()
    }
  }, [state.isAudioEnabled, startAudio, stopAudio])

  // Start screen sharing
  const startScreenShare = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))
      
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      })
      
      screenStreamRef.current = screenStream
      
      // Replace video track in existing stream
      if (state.stream) {
        const videoTrack = screenStream.getVideoTracks()[0]
        const sender = state.stream.getVideoTracks()[0]
        
        if (sender) {
          // In a real WebRTC implementation, you'd replace the track in peer connections
          state.stream.removeTrack(sender)
          state.stream.addTrack(videoTrack)
        }
      }
      
      setState(prev => ({ 
        ...prev, 
        isScreenSharing: true, 
        isLoading: false 
      }))
      
      // Handle screen share end
      screenStream.getVideoTracks()[0].addEventListener('ended', () => {
        stopScreenShare()
      })
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to start screen sharing'
      setState(prev => ({ 
        ...prev, 
        error: errorMessage, 
        isLoading: false 
      }))
    }
  }, [state.stream])

  // Stop screen sharing
  const stopScreenShare = useCallback(() => {
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(track => track.stop())
      screenStreamRef.current = null
    }
    
    setState(prev => ({ ...prev, isScreenSharing: false }))
    
    // Restart regular video if it was enabled
    if (state.isVideoEnabled) {
      startVideo()
    }
  }, [state.isVideoEnabled, startVideo])

  // Start recording
  const startRecording = useCallback(async () => {
    if (!state.stream) {
      throw new Error('No media stream available for recording')
    }
    
    try {
      const options = {
        mimeType: 'video/webm;codecs=vp9,opus'
      }
      
      // Fallback for browsers that don't support vp9
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options.mimeType = 'video/webm'
      }
      
      mediaRecorderRef.current = new MediaRecorder(state.stream, options)
      const chunks: Blob[] = []
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data)
        }
      }
      
      mediaRecorderRef.current.onstop = () => {
        setState(prev => ({ 
          ...prev, 
          recordedChunks: chunks, 
          isRecording: false 
        }))
      }
      
      mediaRecorderRef.current.start(1000) // Collect data every second
      setState(prev => ({ ...prev, isRecording: true }))
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to start recording'
      setState(prev => ({ ...prev, error: errorMessage }))
    }
  }, [state.stream])

  // Stop recording
  const stopRecording = useCallback(async (): Promise<Blob | null> => {
    if (mediaRecorderRef.current && state.isRecording) {
      return new Promise((resolve) => {
        if (mediaRecorderRef.current) {
          mediaRecorderRef.current.onstop = () => {
            const blob = new Blob(state.recordedChunks, { type: 'video/webm' })
            setState(prev => ({ ...prev, isRecording: false }))
            resolve(blob)
          }
          mediaRecorderRef.current.stop()
        } else {
          resolve(null)
        }
      })
    }
    return null
  }, [state.isRecording, state.recordedChunks])

  // Pause recording
  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && state.isRecording) {
      mediaRecorderRef.current.pause()
    }
  }, [state.isRecording])

  // Resume recording
  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && state.isRecording) {
      mediaRecorderRef.current.resume()
    }
  }, [state.isRecording])

  // Cleanup on unmount
  useEffect(() => {
    return cleanup
  }, [cleanup])

  const controls: MediaStreamControls = {
    startVideo,
    stopVideo,
    startAudio,
    stopAudio,
    toggleVideo,
    toggleAudio,
    startScreenShare,
    stopScreenShare,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording
  }

  return [state, controls]
}
