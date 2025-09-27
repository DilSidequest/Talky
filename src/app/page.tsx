'use client'

import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/ui/logo'
import { MessageCircle, Video, Camera, Phone } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-electric-blue-light">
      {/* Header */}
      <header className="flex items-center justify-between p-6">
        <Logo size="lg" />
        <div className="flex items-center gap-4">
          <SignInButton mode="modal">
            <Button variant="outline" className="interactive-element">
              Sign In
            </Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button className="interactive-element bg-electric-blue hover:bg-electric-blue-hover">
              Get Started
            </Button>
          </SignUpButton>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-forest-green mb-6">
            Break Down Language Barriers
          </h1>
          <p className="text-xl md:text-2xl text-text-secondary mb-8 max-w-2xl mx-auto">
            AI-powered video messaging with real-time translation.
            Connect with anyone, anywhere, in any language.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <SignUpButton mode="modal">
              <Button size="lg" className="interactive-element bg-electric-blue hover:bg-electric-blue-hover text-lg px-8 py-4">
                Start Talking Now
              </Button>
            </SignUpButton>
            <Button variant="outline" size="lg" className="interactive-element text-lg px-8 py-4">
              Watch Demo
            </Button>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
            <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-electric-blue-light rounded-lg flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6 text-electric-blue" />
              </div>
              <h3 className="font-semibold text-forest-green mb-2">Smart Chat</h3>
              <p className="text-text-muted text-sm text-center">
                Real-time translation in your conversations
              </p>
            </div>

            <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-electric-blue-light rounded-lg flex items-center justify-center mb-4">
                <Video className="w-6 h-6 text-electric-blue" />
              </div>
              <h3 className="font-semibold text-forest-green mb-2">Video Calls</h3>
              <p className="text-text-muted text-sm text-center">
                Live subtitles during video conversations
              </p>
            </div>

            <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-electric-blue-light rounded-lg flex items-center justify-center mb-4">
                <Camera className="w-6 h-6 text-electric-blue" />
              </div>
              <h3 className="font-semibold text-forest-green mb-2">OCR Scanner</h3>
              <p className="text-text-muted text-sm text-center">
                Translate text from images instantly
              </p>
            </div>

            <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-electric-blue-light rounded-lg flex items-center justify-center mb-4">
                <Phone className="w-6 h-6 text-electric-blue" />
              </div>
              <h3 className="font-semibold text-forest-green mb-2">AI Caller</h3>
              <p className="text-text-muted text-sm text-center">
                AI makes calls in any language for you
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
