'use client'

import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/ui/logo'
import { MessageCircle, Video, Camera, Phone } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const { isSignedIn, isLoaded } = useUser()

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-electric-blue-light">
      {/* Header */}
      <header className="flex items-center justify-between p-6">
        <Logo size="lg" />
        <div className="flex items-center gap-4">
          {isLoaded && (
            <>
              {isSignedIn ? (
                <>
                  <Link href="/dashboard">
                    <Button className="interactive-element bg-electric-blue hover:bg-electric-blue-hover">
                      Go to Dashboard
                    </Button>
                  </Link>
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: 'w-10 h-10'
                      }
                    }}
                  />
                </>
              ) : (
                <>
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
                </>
              )}
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-forest-green mb-8 text-center">
            Break Down Language Barriers
          </h1>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            {isLoaded && (
              <>
                {isSignedIn ? (
                  <Link href="/dashboard">
                    <Button size="lg" className="interactive-element bg-electric-blue hover:bg-electric-blue-hover text-lg px-8 py-4">
                      Go to Dashboard
                    </Button>
                  </Link>
                ) : (
                  <SignUpButton mode="modal">
                    <Button size="lg" className="interactive-element bg-electric-blue hover:bg-electric-blue-hover text-lg px-8 py-4">
                      Start Talking Now
                    </Button>
                  </SignUpButton>
                )}
              </>
            )}
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
              <h3 className="font-semibold text-forest-green text-center">Smart Chat</h3>
            </div>

            <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-electric-blue-light rounded-lg flex items-center justify-center mb-4">
                <Video className="w-6 h-6 text-electric-blue" />
              </div>
              <h3 className="font-semibold text-forest-green text-center">Video Calls</h3>
            </div>

            <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-electric-blue-light rounded-lg flex items-center justify-center mb-4">
                <Camera className="w-6 h-6 text-electric-blue" />
              </div>
              <h3 className="font-semibold text-forest-green text-center">OCR Scanner</h3>
            </div>

            <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-electric-blue-light rounded-lg flex items-center justify-center mb-4">
                <Phone className="w-6 h-6 text-electric-blue" />
              </div>
              <h3 className="font-semibold text-forest-green text-center">AI Caller</h3>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
