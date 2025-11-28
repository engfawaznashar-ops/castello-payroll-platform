import { formatCurrency, formatPercentage } from '@/lib/utils'
import * as Icons from 'lucide-react'
import { LucideIcon } from 'lucide-react'
import { DataCard } from './DataCard'

interface KPICardLuxuryProps {
  label: string
  value: number
  change: number
  changeType: 'increase' | 'decrease'
  iconName: keyof typeof Icons
}

export function KPICardLuxury({ label, value, change, changeType, iconName }: KPICardLuxuryProps) {
  const Icon = Icons[iconName] as LucideIcon
  const isPositive = changeType === 'increase'

  return (
    <DataCard hover className="relative overflow-hidden group">
      {/* Gold accent on hover */}
      <div className="absolute inset-0 rounded-card opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none border border-castello-gold/30 shadow-gold" />
      
      <div className="relative">
        <div className="flex items-start justify-between mb-5">
          <div className="flex-1">
            <p className="text-sm text-castello-gold font-bold mb-2 tracking-wide">{label}</p>
            <p className="text-3xl font-bold text-castello-black mb-3 tracking-tight">
              {formatCurrency(value)}
            </p>
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full font-semibold text-xs ${
                isPositive 
                  ? 'bg-green-500 text-white shadow-soft' 
                  : 'bg-red-500 text-white shadow-soft'
              }`}>
                {isPositive ? (
                  <Icons.TrendingUp className="w-3 h-3" />
                ) : (
                  <Icons.TrendingDown className="w-3 h-3" />
                )}
                <span>{formatPercentage(change)}</span>
              </div>
              <span className="text-xs text-castello-neutral-600 font-medium">من الشهر الماضي</span>
            </div>
          </div>
          
          <div className="p-3.5 rounded-card bg-gradient-to-br from-castello-gold/10 to-castello-primary/10 shadow-soft group-hover:shadow-gold group-hover:scale-105 transition-all duration-200">
            <Icon className="w-8 h-8 text-castello-primary" />
          </div>
        </div>

        {/* Timestamp */}
        <div className="pt-3 border-t border-castello-neutral-200">
          <p className="text-xs text-castello-neutral-500 font-medium flex items-center gap-1.5">
            <Icons.Clock className="w-3 h-3" />
            آخر تحديث: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}
          </p>
        </div>
      </div>
    </DataCard>
  )
}

