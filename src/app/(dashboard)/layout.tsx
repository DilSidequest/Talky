'use client'

import { UserButton } from '@clerk/nextjs'
import { Logo } from '@/components/ui/logo'
import { Button } from '@/components/ui/button'
import { MessageCircle, Camera, Phone, Settings, Home } from 'lucide-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const navigationItems = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Chat', href: '/chat', icon: MessageCircle },
  { name: 'OCR Scanner', href: '/ocr', icon: Camera },
  { name: 'AI Caller', href: '/ai-caller', icon: Phone },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Desktop Header */}
      <header className="hidden md:flex items-center justify-between p-6 border-b border-border-light">
        <Logo size="lg" />
        <div className="flex items-center gap-4">
          <UserButton 
            appearance={{
              elements: {
                avatarBox: 'w-10 h-10'
              }
            }}
          />
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-64 bg-bg-secondary border-r border-border-light p-4">
          <nav className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname.startsWith(item.href)
              
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={`w-full justify-start gap-3 ${
                      isActive 
                        ? 'bg-electric-blue text-white hover:bg-electric-blue-hover' 
                        : 'hover:bg-bg-accent'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </Button>
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 pb-20 md:pb-6">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border-light safe-area-inset-bottom">
        <div className="grid grid-cols-5 gap-0.5 px-2 py-1">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname.startsWith(item.href)

            return (
              <Link key={item.name} href={item.href} className="flex-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`w-full flex flex-col items-center gap-0.5 h-auto py-1.5 px-1 min-h-[60px] ${
                    isActive ? 'text-electric-blue bg-electric-blue-light' : 'text-text-muted'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="text-[10px] leading-tight text-center truncate w-full">
                    {item.name === 'OCR Scanner' ? 'OCR' : item.name === 'AI Caller' ? 'AI Call' : item.name}
                  </span>
                </Button>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
