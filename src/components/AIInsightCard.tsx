import { AIInsight, AIInsightPriority } from '@/types'
import { Sparkles, TrendingUp, Clock, Target } from 'lucide-react'
import { DataCard } from './DataCard'
import { Badge } from './ui/badge'
import { formatCurrency } from '@/lib/utils'

interface AIInsightCardProps {
  insight: AIInsight
}

export function AIInsightCard({ insight }: AIInsightCardProps) {
  const priorityConfig: Record<AIInsightPriority, { label: string; color: string; gradient: string }> = {
    urgent: {
      label: 'عاجل',
      color: 'text-red-600',
      gradient: 'from-red-500/10 to-red-600/10',
    },
    short_term: {
      label: 'قصير المدى',
      color: 'text-yellow-600',
      gradient: 'from-yellow-500/10 to-yellow-600/10',
    },
    long_term: {
      label: 'طويل المدى',
      color: 'text-blue-600',
      gradient: 'from-blue-500/10 to-blue-600/10',
    },
  }

  const config = priorityConfig[insight.priority]

  return (
    <DataCard hover className="relative overflow-hidden group border-2 border-transparent hover:border-castello-gold-300">
      {/* Gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-30 group-hover:opacity-50 transition-opacity`} />
      
      {/* Glowing border effect */}
      <div className="absolute inset-0 rounded-[28px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-[inset_0_0_20px_rgba(239,179,67,0.3)]" />
      
      <div className="relative">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-purple-100 via-pink-100 to-purple-100 shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all">
              <Sparkles className="w-7 h-7 text-purple-600 drop-shadow" />
            </div>
            <div>
              <Badge className={`${config.color} bg-white/80 shadow-sm px-3 py-1.5 text-xs font-bold`}>
                {config.label}
              </Badge>
            </div>
          </div>
          <div className="text-left px-3 py-1.5 rounded-xl bg-white/60 shadow-sm">
            <div className="flex items-center gap-1.5 text-sm text-gray-600 font-semibold">
              <Target className="w-4 h-4 text-castello-gold-600" />
              <span>{insight.confidence}%</span>
            </div>
          </div>
        </div>
        
        <h3 className="font-bold text-xl text-gray-900 mb-2">{insight.title}</h3>
        <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-start gap-2">
            <TrendingUp className="w-4 h-4 text-green-600 mt-1 shrink-0" />
            <div>
              <p className="text-xs text-gray-500">التأثير المتوقع</p>
              <p className="text-sm font-semibold text-gray-900">{insight.impact}</p>
            </div>
          </div>
          
          {insight.potentialSavings && (
            <div className="p-3 rounded-xl bg-green-50 border border-green-200">
              <p className="text-xs text-green-600 mb-1">توفير محتمل</p>
              <p className="text-lg font-bold text-green-700">
                {formatCurrency(insight.potentialSavings)}
              </p>
            </div>
          )}
        </div>
        
        <div className="pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-1">التوصية</p>
          <p className="text-sm text-gray-700 font-medium">{insight.recommendation}</p>
          
          {insight.implementationTime && (
            <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>مدة التنفيذ: {insight.implementationTime}</span>
            </div>
          )}
        </div>
      </div>
    </DataCard>
  )
}

