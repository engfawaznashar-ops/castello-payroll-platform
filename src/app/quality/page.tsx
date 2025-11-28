'use client'

import { useQuery } from '@tanstack/react-query'
import { getDataQuality } from '@/lib/api'
import { SectionHeader } from '@/components/SectionHeader'
import { DataCard } from '@/components/DataCard'
import { getQualityColor, formatDate } from '@/lib/utils'
import { Info, AlertTriangle, AlertCircle, CheckCircle2, TrendingUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default function QualityPage() {
  const { data: qualityData, isLoading } = useQuery({
    queryKey: ['dataQuality'],
    queryFn: getDataQuality,
  })

  if (isLoading) {
    return (
      <div className="animate-fade-in">
        <SectionHeader title="جودة البيانات" subtitle="مراقبة وتحسين جودة البيانات" />
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 skeleton rounded-3xl" />
          ))}
        </div>
      </div>
    )
  }

  if (!qualityData) return null

  const { color, bgColor, borderColor } = getQualityColor(qualityData.overall)

  const severityConfig = {
    info: {
      icon: Info,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-300',
      label: 'معلومات',
    },
    warning: {
      icon: AlertTriangle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-300',
      label: 'تحذيرات',
    },
    critical: {
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-300',
      label: 'حرجة',
    },
  }

  return (
    <div className="animate-fade-in space-y-8">
      <SectionHeader 
        title="جودة البيانات" 
        subtitle="مراقبة وتحسين جودة بيانات الموظفين والرواتب"
      />

      {/* Quality Score Hero */}
      <DataCard className="relative overflow-hidden">
        <div className={`absolute inset-0 ${bgColor} opacity-20`} />
        
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            {/* Circular Score */}
            <div className="relative inline-flex items-center justify-center">
              <svg className="w-40 h-40 transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="60"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  className="text-gray-200"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="60"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={2 * Math.PI * 60}
                  strokeDashoffset={2 * Math.PI * 60 * (1 - qualityData.overall / 100)}
                  strokeLinecap="round"
                  className={`${color} transition-all duration-1000 ease-out drop-shadow-lg`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-5xl font-bold ${color}`}>
                  {qualityData.overall}%
                </span>
                <span className="text-sm text-gray-600">جودة البيانات</span>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {qualityData.overall >= 80 ? 'ممتازة' : qualityData.overall >= 60 ? 'جيدة' : 'تحتاج تحسين'}
              </h2>
              <p className="text-gray-600 mb-3">آخر تحديث: {formatDate(qualityData.lastUpdated)}</p>
              <div className="flex items-center gap-2 text-sm text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span>تحسن بنسبة 5% من الأسبوع الماضي</span>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="flex gap-4">
            <div className="text-center p-4 rounded-2xl bg-blue-50">
              <Info className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-3xl font-bold text-blue-600">{qualityData.infoCount}</p>
              <p className="text-sm text-blue-700">معلومات</p>
            </div>

            <div className="text-center p-4 rounded-2xl bg-yellow-50">
              <AlertTriangle className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <p className="text-3xl font-bold text-yellow-600">{qualityData.warningCount}</p>
              <p className="text-sm text-yellow-700">تحذيرات</p>
            </div>

            <div className="text-center p-4 rounded-2xl bg-red-50">
              <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <p className="text-3xl font-bold text-red-600">{qualityData.criticalCount}</p>
              <p className="text-sm text-red-700">حرجة</p>
            </div>
          </div>
        </div>
      </DataCard>

      {/* Issues Grid */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">المشاكل المكتشفة</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {qualityData.issues.map((issue) => {
            const config = severityConfig[issue.severity]
            const Icon = config.icon

            return (
              <DataCard key={issue.id} hover className={`border-r-4 ${config.borderColor}`}>
                <div className="flex items-start gap-3 mb-4">
                  <div className={`p-3 rounded-2xl ${config.bgColor} shrink-0`}>
                    <Icon className={`w-6 h-6 ${config.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Badge className={`${config.color} ${config.bgColor} mb-2`}>
                      {config.label}
                    </Badge>
                    <h3 className="font-bold text-lg text-gray-900 mb-1">{issue.title}</h3>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4">{issue.description}</p>

                <div className={`p-3 rounded-xl ${config.bgColor} mb-4`}>
                  <p className={`text-2xl font-bold ${config.color} mb-1`}>{issue.count}</p>
                  <p className="text-xs text-gray-600">حالات مكتشفة</p>
                </div>

                {issue.details && issue.details.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-gray-700">التفاصيل:</p>
                    <ul className="space-y-1">
                      {issue.details.map((detail, index) => (
                        <li key={index} className="text-sm text-gray-600 flex gap-2">
                          <span className={config.color}>•</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {issue.affectedEmployees.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      يؤثر على {issue.affectedEmployees.length} موظف
                    </p>
                  </div>
                )}
              </DataCard>
            )
          })}
        </div>
      </div>

      {/* Recommendations */}
      <DataCard className="bg-gradient-to-br from-green-50 to-blue-50">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-green-100">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">توصيات للتحسين</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex gap-2">
                <span className="text-green-600">✓</span>
                <span>مراجعة وتحديث البيانات المفقودة للموظفين</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-600">✓</span>
                <span>التحقق من صحة الحسابات البنكية وتصحيح أرقام IBAN</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-600">✓</span>
                <span>رفع المستندات الناقصة لجميع الموظفين</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-600">✓</span>
                <span>مراجعة الحسابات والتأكد من دقة صافي الرواتب</span>
              </li>
            </ul>
          </div>
        </div>
      </DataCard>
    </div>
  )
}


