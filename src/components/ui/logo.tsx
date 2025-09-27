import { cn } from "@/lib/utils"

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'white'
  className?: string
}

const sizeClasses = {
  sm: 'text-xl',
  md: 'text-2xl',
  lg: 'text-3xl',
  xl: 'text-4xl'
}

export function Logo({ size = 'md', variant = 'default', className }: LogoProps) {
  const textColor = variant === 'white' ? 'text-white' : 'text-forest-green'
  const accentColor = variant === 'white' ? 'text-white' : 'text-electric-blue'
  
  return (
    <h1 className={cn(
      'font-bold',
      sizeClasses[size],
      textColor,
      className
    )}>
      Talky<span className={accentColor}>.</span>
    </h1>
  )
}
