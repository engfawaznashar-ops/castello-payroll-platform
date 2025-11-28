import { ReactNode } from 'react'
import { DataCard } from './DataCard'

interface ChartCardProps {
  title: string
  subtitle?: string
  children: ReactNode
  className?: string
}

export function ChartCard({ title, subtitle, children, className }: ChartCardProps) {
  return (
    <DataCard className={className}>
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-1">{title}</h3>
        {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
      </div>
      <div className="w-full h-[300px]">
        {children}
      </div>
    </DataCard>
  )
}


