import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface DataCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
}

export function DataCard({ children, className, hover = false }: DataCardProps) {
  return (
    <div
      className={cn(
        'backdrop-blur-md bg-white rounded-card p-card border border-castello-neutral-200',
        'shadow-card',
        hover && 'hover:shadow-gold hover:-translate-y-0.5 cursor-pointer',
        'transition-all duration-200 ease-out',
        className
      )}
    >
      {children}
    </div>
  )
}

