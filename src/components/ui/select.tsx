'use client'

import * as React from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SelectOption {
  value: string
  label: string
  icon?: React.ReactNode
}

interface SelectProps {
  value: string
  onValueChange: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  className?: string
  label?: string
}

export function Select({
  value,
  onValueChange,
  options,
  placeholder = 'Select an option',
  className,
  label
}: SelectProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const selectRef = React.useRef<HTMLDivElement>(null)

  const selectedOption = options.find(opt => opt.value === value)

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className={cn('w-full', className)} ref={selectRef}>
      {label && (
        <label className="text-sm font-medium text-forest-green mb-2 block">
          {label}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'w-full flex items-center justify-between px-4 py-3 bg-white border border-border-light rounded-lg',
            'text-left text-forest-green hover:border-electric-blue transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-electric-blue/20 focus:border-electric-blue',
            isOpen && 'border-electric-blue ring-2 ring-electric-blue/20'
          )}
        >
          <span className="flex items-center gap-2">
            {selectedOption?.icon}
            {selectedOption?.label || placeholder}
          </span>
          <ChevronDown
            className={cn(
              'w-4 h-4 text-text-muted transition-transform',
              isOpen && 'transform rotate-180'
            )}
          />
        </button>

        {isOpen && (
          <div className="absolute z-[9999] w-full mt-2 bg-white border border-border-light rounded-lg shadow-2xl overflow-hidden">
            <div className="max-h-[312px] overflow-y-auto scrollbar-thin scrollbar-thumb-electric-blue scrollbar-track-gray-100">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onValueChange(option.value)
                    setIsOpen(false)
                  }}
                  className={cn(
                    'w-full flex items-center gap-2 px-4 py-3 text-left transition-colors',
                    'hover:bg-electric-blue-light',
                    value === option.value && 'bg-electric-blue-light text-electric-blue font-medium'
                  )}
                >
                  {option.icon}
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

