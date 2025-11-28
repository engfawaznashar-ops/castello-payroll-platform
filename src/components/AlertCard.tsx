'use client'

import { Alert, AlertSeverity } from '@/types'
import { AlertCircle, AlertTriangle, Info, Award, Loader2, CheckCircle } from 'lucide-react'
import { DataCard } from './DataCard'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { formatRelativeTime } from '@/lib/utils'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { resolveAlert } from '@/lib/api'
import { useState } from 'react'

interface AlertCardProps {
  alert: Alert
}

export function AlertCard({ alert }: AlertCardProps) {
  const queryClient = useQueryClient()
  const [isResolved, setIsResolved] = useState(alert.resolved)
  const [xpGained, setXpGained] = useState<number | null>(null)

  const resolveMutation = useMutation({
    mutationFn: () => resolveAlert(alert.id),
    onSuccess: (data) => {
      setIsResolved(true)
      setXpGained(data.xpGained)
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['alerts'] })
      queryClient.invalidateQueries({ queryKey: ['xp'] })
      
      // Show success animation briefly
      setTimeout(() => {
        setXpGained(null)
      }, 3000)
    },
    onError: (error) => {
      console.error('Failed to resolve alert:', error)
      // Optionally show error toast
    },
  })

  const severityConfig: Record<AlertSeverity, { icon: any; color: string; bgColor: string; borderColor: string }> = {
    info: {
      icon: Info,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-r-blue-500',
    },
    warning: {
      icon: AlertTriangle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-r-yellow-500',
    },
    critical: {
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-r-red-500',
    },
  }

  const config = severityConfig[alert.severity]
  const Icon = config.icon

  const handleResolve = () => {
    if (!isResolved && !resolveMutation.isPending) {
      resolveMutation.mutate()
    }
  }

  return (
    <DataCard hover className={`relative overflow-hidden border-r-4 ${config.borderColor} ${isResolved ? 'opacity-60 grayscale' : ''} transition-all duration-500`}>
      {/* Background gradient based on severity */}
      <div className={`absolute inset-0 ${config.bgColor} opacity-5 pointer-events-none`} />
      
      {/* XP Gained Animation */}
      {xpGained && (
        <div className="absolute top-2 left-2 bg-gradient-to-l from-castello-gold-500 to-castello-gold-600 text-white px-4 py-2 rounded-full shadow-xl animate-bounce flex items-center gap-2">
          <Award className="w-4 h-4" />
          <span className="font-bold">+{xpGained} XP</span>
        </div>
      )}
      
      <div className="relative flex gap-4">
        <div className={`p-4 rounded-2xl ${config.bgColor} shrink-0 shadow-md hover:scale-105 transition-transform`}>
          <Icon className={`w-7 h-7 ${config.color} drop-shadow`} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-3">
            <h3 className="font-bold text-gray-900 text-lg leading-tight">{alert.title}</h3>
            <Badge className="shrink-0 flex items-center gap-1.5 bg-gradient-to-l from-castello-gold-400 to-castello-gold-500 text-white shadow-lg shadow-castello-gold-500/30 px-3 py-1">
              <Award className="w-3.5 h-3.5" />
              <span className="font-bold">{alert.xpReward}</span>
              <span className="text-xs">XP</span>
            </Badge>
          </div>
          
          <p className="text-gray-600 text-sm mb-4 leading-relaxed">{alert.description}</p>
          
          {(alert.employeeName || alert.branch) && (
            <div className="space-y-2 mb-4 pb-4 border-b border-gray-100">
              {alert.employeeName && (
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <span className="font-semibold text-gray-700">الموظف:</span>
                  <span className="font-medium">{alert.employeeName}</span>
                </p>
              )}
              {alert.branch && (
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <span className="font-semibold text-gray-700">الفرع:</span>
                  <span className="font-medium">{alert.branch}</span>
                </p>
              )}
            </div>
          )}
          
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-gray-400 font-medium">
              {formatRelativeTime(alert.createdAt)}
            </span>
            
            {!isResolved ? (
              <Button 
                size="sm" 
                onClick={handleResolve} 
                disabled={resolveMutation.isPending}
                className="bg-gradient-to-l from-castello-gold-500 to-castello-gold-600 hover:from-castello-gold-600 hover:to-castello-gold-700 shadow-lg shadow-castello-gold-500/30 disabled:opacity-50"
              >
                {resolveMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                    جاري الحل...
                  </>
                ) : (
                  'تم الحل'
                )}
              </Button>
            ) : (
              <Badge className="bg-gradient-to-l from-green-500 to-emerald-500 text-white border-0 shadow-md flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" />
                تم الحل
              </Badge>
            )}
          </div>
        </div>
      </div>
    </DataCard>
  )
}
