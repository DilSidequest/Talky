# Talky Routing System

## Next.js App Router Structure

### Directory Structure
```
src/app/
├── (auth)/                 # Auth route group
│   ├── sign-in/
│   │   └── page.tsx
│   ├── sign-up/
│   │   └── page.tsx
│   └── layout.tsx         # Auth layout
├── (dashboard)/           # Protected dashboard routes
│   ├── chat/
│   │   ├── [chatId]/
│   │   │   └── page.tsx   # Individual chat
│   │   └── page.tsx       # Chat list
│   ├── call/
│   │   ├── [callId]/
│   │   │   └── page.tsx   # Active call
│   │   └── page.tsx       # Call interface
│   ├── ocr/
│   │   └── page.tsx       # OCR scanner
│   ├── ai-caller/
│   │   ├── new/
│   │   │   └── page.tsx   # Create new AI call
│   │   ├── [callId]/
│   │   │   └── page.tsx   # AI call details
│   │   └── page.tsx       # AI caller dashboard
│   ├── settings/
│   │   ├── profile/
│   │   │   └── page.tsx
│   │   ├── preferences/
│   │   │   └── page.tsx
│   │   └── page.tsx
│   └── layout.tsx         # Dashboard layout
├── api/                   # API routes (if needed)
├── globals.css
├── layout.tsx             # Root layout
└── page.tsx              # Landing page
```

## Route Definitions

### Public Routes
- `/` - Landing page
- `/sign-in` - Authentication sign-in
- `/sign-up` - Authentication sign-up

### Protected Routes (Require Authentication)
- `/chat` - Chat dashboard/list
- `/chat/[chatId]` - Individual chat conversation
- `/call` - Video call interface
- `/call/[callId]` - Active video call
- `/ocr` - OCR camera scanner
- `/ai-caller` - AI phone caller dashboard
- `/ai-caller/new` - Create new AI call
- `/ai-caller/[callId]` - AI call details and monitoring
- `/settings` - General settings
- `/settings/profile` - User profile settings
- `/settings/preferences` - Language and app preferences

## Layout Components

## Root Layout (`app/layout.tsx`)
```typescript
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <ThemeProvider>
            <Toaster />
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
```

## Auth Layout (`app/(auth)/layout.tsx`)
```typescript
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-blue-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-forest-green text-center">
            Talky<span className="text-electric-blue">.</span>
          </h1>
        </div>
        {children}
      </div>
    </div>
  )
}
```

### Dashboard Layout (`app/(dashboard)/layout.tsx`)
```typescript
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-white">
      <DashboardHeader />
      <div className="flex">
        <DashboardSidebar />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
      <MobileNavigation />
    </div>
  )
}
```

## Navigation Components

### Desktop Navigation
```typescript
// components/navigation/DashboardSidebar.tsx
const navigationItems = [
  { name: 'Chat', href: '/chat', icon: MessageCircle },
  { name: 'Call', href: '/call', icon: Video },
  { name: 'OCR Scanner', href: '/ocr', icon: Camera },
  { name: 'AI Caller', href: '/ai-caller', icon: Phone },
  { name: 'Settings', href: '/settings', icon: Settings },
]
```

### Mobile Navigation
```typescript
// components/navigation/MobileNavigation.tsx
const mobileNavItems = [
  { name: 'Chat', href: '/chat', icon: MessageCircle },
  { name: 'Call', href: '/call', icon: Video },
  { name: 'OCR', href: '/ocr', icon: Camera },
  { name: 'AI Call', href: '/ai-caller', icon: Phone },
  { name: 'More', href: '/settings', icon: MoreHorizontal },
]
```

### Chat/Call Toggle Bar (ShadCN)
```typescript
// components/navigation/ChatCallToggle.tsx
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function ChatCallToggle() {
  return (
    <Tabs defaultValue="chat" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="chat">Chat</TabsTrigger>
        <TabsTrigger value="call">Call</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
```

## Route Protection

### Middleware (`middleware.ts`)
```typescript
import { authMiddleware } from "@clerk/nextjs"

export default authMiddleware({
  publicRoutes: ["/", "/sign-in", "/sign-up"],
  ignoredRoutes: ["/api/webhook"]
})

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}
```

### Protected Route Component
```typescript
// components/auth/ProtectedRoute.tsx
import { useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoaded, userId } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && !userId) {
      router.push("/sign-in")
    }
  }, [isLoaded, userId, router])

  if (!isLoaded) return <LoadingSpinner />
  if (!userId) return null

  return <>{children}</>
}
```

## Dynamic Routing

### Chat Routes
- `/chat` - Shows list of all conversations
- `/chat/[chatId]` - Individual chat with dynamic chat ID
- `/chat/new` - Create new chat/conversation

### Call Routes
- `/call` - Call interface/dashboard
- `/call/[callId]` - Active call with dynamic call ID
- `/call/join/[roomId]` - Join call via room ID

### AI Caller Routes
- `/ai-caller` - AI caller dashboard
- `/ai-caller/new` - Create new AI call configuration
- `/ai-caller/[callId]` - Monitor specific AI call
- `/ai-caller/history` - Call history and analytics

## URL Parameters & Search Params

### Chat Parameters
```typescript
// /chat/[chatId]?lang=es&translate=true
interface ChatPageProps {
  params: { chatId: string }
  searchParams: { lang?: string; translate?: string }
}
```

### Call Parameters
```typescript
// /call/[callId]?video=true&audio=true&subtitles=true
interface CallPageProps {
  params: { callId: string }
  searchParams: { 
    video?: string
    audio?: string
    subtitles?: string
  }
}
```

## Navigation Hooks

### Custom Navigation Hook
```typescript
// hooks/useNavigation.ts
export function useNavigation() {
  const router = useRouter()
  const pathname = usePathname()

  const navigateToChat = (chatId?: string) => {
    router.push(chatId ? `/chat/${chatId}` : '/chat')
  }

  const navigateToCall = (callId?: string) => {
    router.push(callId ? `/call/${callId}` : '/call')
  }

  const isActive = (path: string) => pathname.startsWith(path)

  return {
    navigateToChat,
    navigateToCall,
    isActive,
    currentPath: pathname
  }
}
```

## Breadcrumb Navigation
```typescript
// components/navigation/Breadcrumb.tsx
export function Breadcrumb() {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {segments.map((segment, index) => (
          <li key={segment} className="flex items-center">
            {index > 0 && <ChevronRight className="h-4 w-4 mx-2" />}
            <Link
              href={`/${segments.slice(0, index + 1).join('/')}`}
              className="text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              {formatSegment(segment)}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  )
}
```

## Route Transitions

### Page Transitions
```typescript
// components/transitions/PageTransition.tsx
import { motion } from "framer-motion"

export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}
```

## Error Handling

### Not Found Page (`app/not-found.tsx`)
```typescript
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-forest-green mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-6">
          The page you're looking for doesn't exist.
        </p>
        <Button asChild>
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </div>
  )
}
```

### Error Boundary (`app/error.tsx`)
```typescript
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          Something went wrong!
        </h2>
        <Button onClick={reset}>Try again</Button>
      </div>
    </div>
  )
}
```

## Mobile-Specific Routing

### Mobile Route Handling
- Bottom navigation for primary routes
- Swipe gestures for navigation
- Back button handling for Android
- Deep linking support

### PWA Routing
- Service worker route caching
- Offline route fallbacks
- App shell routing strategy
