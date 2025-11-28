'use client'

import { useQuery } from '@tanstack/react-query'
import { getXPData } from '@/lib/api'
import { DataCard } from './DataCard'
import { Crown, Sparkles, Loader2 } from 'lucide-react'

export function ProgressBarXP() {
  const { data: xpData, isLoading, error } = useQuery({
    queryKey: ['xp'],
    queryFn: getXPData,
    refetchInterval: 30000, // Refetch every 30 seconds
  })

  if (isLoading) {
    return (
      <DataCard className="mb-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-castello-gold animate-spin" />
          <span className="mr-3 text-castello-neutral-600">جاري تحميل بيانات XP...</span>
        </div>
      </DataCard>
    )
  }

  if (error || !xpData) {
    return (
      <DataCard className="mb-8">
        <div className="text-center py-8 text-castello-neutral-600">
          <p>حدث خطأ في تحميل بيانات XP</p>
        </div>
      </DataCard>
    )
  }

  const { xp, level, currentLevelXP, nextLevelXP, progress } = xpData

  return (
    <DataCard className="mb-8 relative overflow-hidden">
      {/* Background Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-l from-castello-gold-500/10 via-transparent to-transparent opacity-50" />
      
      <div className="relative">
        <div className="flex items-center justify-between gap-4 mb-5">
          {/* Left: Level Badge */}
          <div className="flex items-center gap-3">
            <div className="relative p-3 rounded-2xl bg-gradient-to-br from-castello-gold-400 via-castello-gold-500 to-castello-gold-600 shadow-xl shadow-castello-gold-500/30">
              <Crown className="w-7 h-7 text-white drop-shadow-lg" />
              <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-300 animate-pulse" />
            </div>
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-l from-castello-gold-600 to-castello-gold-700 bg-clip-text text-transparent">
                المستوى {level}
              </h3>
              <p className="text-sm text-gray-600 font-medium">
                {currentLevelXP.toLocaleString('en-US')} / {nextLevelXP.toLocaleString('en-US')} نقطة خبرة
              </p>
            </div>
          </div>

          {/* Right: Total XP */}
          <div className="text-left px-5 py-3 rounded-2xl bg-gradient-to-bl from-castello-gold-50 to-white shadow-inner">
            <p className="text-3xl font-bold bg-gradient-to-l from-castello-gold-600 to-castello-gold-700 bg-clip-text text-transparent">
              {xp.toLocaleString('en-US')}
            </p>
            <p className="text-xs text-gray-500 font-semibold">إجمالي نقاط XP</p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="relative h-3.5 w-full bg-gradient-to-l from-gray-100 to-gray-200 rounded-full overflow-hidden shadow-inner">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-30">
            <div className="h-full w-full bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer" 
                 style={{ backgroundSize: '200% 100%' }} />
          </div>
          
          {/* Progress Fill */}
          <div
            className="absolute top-0 right-0 h-full rounded-full transition-all duration-1000 ease-out shadow-lg"
            style={{ 
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #EFB343 0%, #F6D36B 50%, #EFB343 100%)',
              boxShadow: '0 0 20px rgba(239, 179, 67, 0.6)'
            }}
          >
            {/* Inner Glow */}
            <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent rounded-full" />
            
            {/* Shimmer Effect */}
            <div className="absolute inset-0 shimmer rounded-full" />
            
            {/* Level Badge at End */}
            {progress > 10 && (
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gradient-to-br from-castello-gold-400 to-castello-gold-600 shadow-xl flex items-center justify-center border-2 border-white">
                <Crown className="w-4 h-4 text-white drop-shadow" />
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-3">
          <p className="text-xs text-gray-500 font-medium">
            {Math.round(nextLevelXP - currentLevelXP).toLocaleString('en-US')} نقطة متبقية
          </p>
          <p className="text-xs font-bold text-castello-gold-600">
            {Math.round(progress)}%
          </p>
        </div>

        {/* Executive Description */}
        <div className="mt-6 pt-6 border-t border-castello-neutral-200">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 w-1.5 h-1.5 rounded-full bg-castello-gold flex-shrink-0" />
            <p className="text-[0.875rem] leading-relaxed text-castello-primaryDark" style={{ lineHeight: '1.7' }}>
              <span className="font-semibold">يمثّل هذا المؤشر مستوى نضج إدارة الموارد البشرية وجودة معالجة البيانات داخل النظام.</span>
              {' '}تُحتسب نقاط XP تلقائياً بناءً على إنجاز المهام، إغلاق التنبيهات، تحديث البيانات، حلّ المشاكل، وتحسين دقة الرواتب.
              {' '}كلما ارتفع المستوى، ارتفعت كفاءة الإدارة، وانخفضت المخاطر التشغيلية، وتحسّن أداء الشركة في التخطيط المالي واتخاذ القرار.
            </p>
          </div>
        </div>
      </div>
    </DataCard>
  )
}

