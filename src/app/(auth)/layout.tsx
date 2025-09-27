import { Logo } from '@/components/ui/logo'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-electric-blue-light">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Logo size="xl" />
        </div>
        {children}
      </div>
    </div>
  )
}
