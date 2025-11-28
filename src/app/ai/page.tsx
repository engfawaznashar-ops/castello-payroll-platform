'use client'

import { useQuery } from '@tanstack/react-query'
import { getAIInsights, getAdvancePredictions, getSalaryPredictions, getBranchSalaries } from '@/lib/api'
import { SectionHeader } from '@/components/SectionHeader'
import { AIInsightCard } from '@/components/AIInsightCard'
import { ChartCard } from '@/components/ChartCard'
import { DataCard } from '@/components/DataCard'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { formatCompactCurrency } from '@/lib/utils'
import { Sparkles, TrendingUp, AlertTriangle, Target, Lightbulb } from 'lucide-react'

export default function AIPage() {
  const { data: insights, isLoading: insightsLoading } = useQuery({
    queryKey: ['aiInsights'],
    queryFn: getAIInsights,
  })

  const { data: advancePredictions, isLoading: advanceLoading } = useQuery({
    queryKey: ['advancePredictions'],
    queryFn: getAdvancePredictions,
  })

  const { data: salaryPredictions, isLoading: salaryLoading } = useQuery({
    queryKey: ['salaryPredictions'],
    queryFn: getSalaryPredictions,
  })

  const { data: branchData, isLoading: branchLoading } = useQuery({
    queryKey: ['branchSalaries'],
    queryFn: getBranchSalaries,
  })

  if (insightsLoading || advanceLoading || salaryLoading || branchLoading) {
    return (
      <div className="animate-fade-in">
        <div className="h-48 skeleton rounded-3xl mb-6" />
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 skeleton rounded-3xl" />
          ))}
        </div>
      </div>
    )
  }

  // Group insights by priority
  const urgentInsights = insights?.filter(i => i.priority === 'urgent') || []
  const shortTermInsights = insights?.filter(i => i.priority === 'short_term') || []
  const longTermInsights = insights?.filter(i => i.priority === 'long_term') || []

  // Sort branch data by total salary
  const sortedBranchData = [...(branchData || [])].sort((a, b) => b.totalSalary - a.totalSalary)

  return (
    <div className="animate-fade-in space-y-8">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl p-12 glass-strong shadow-luxury">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-castello-gold-500/20 animate-glow-pulse" />
        
        <div className="relative text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 animate-pulse">
              <Sparkles className="w-12 h-12 text-purple-600" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-3">ساحة الذكاء الاصطناعي</h1>
          <p className="text-xl text-gray-600 mb-6">تحليلات متقدمة وتوقعات ذكية لتحسين الأداء</p>
          <div className="flex gap-4 justify-center">
            <div className="px-6 py-3 rounded-2xl bg-white/80 shadow-lg">
              <p className="text-sm text-gray-600">إجمالي التوفير المتوقع</p>
              <p className="text-2xl font-bold gold-gradient bg-clip-text text-transparent">
                {formatCompactCurrency(insights?.reduce((sum, i) => sum + (i.potentialSavings || 0), 0) || 0)}
              </p>
            </div>
            <div className="px-6 py-3 rounded-2xl bg-white/80 shadow-lg">
              <p className="text-sm text-gray-600">رؤى نشطة</p>
              <p className="text-2xl font-bold text-castello-red-600">{insights?.length || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Prediction Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Salary Predictions */}
        <ChartCard
          title="توقع الرواتب القادمة"
          subtitle="التوقعات للأشهر الستة القادمة"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salaryPredictions}>
              <defs>
                <linearGradient id="salaryPredGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#dc2626" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#dc2626" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="month" 
                stroke="#6b7280"
                style={{ fontSize: '11px', fontFamily: 'Cairo' }}
              />
              <YAxis 
                stroke="#6b7280"
                style={{ fontSize: '11px' }}
                tickFormatter={(value) => formatCompactCurrency(value)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  fontFamily: 'Cairo',
                }}
                formatter={(value: any) => formatCompactCurrency(value)}
                labelStyle={{ fontFamily: 'Cairo' }}
              />
              <Area 
                type="monotone" 
                dataKey="predicted" 
                stroke="#dc2626" 
                strokeWidth={3}
                fill="url(#salaryPredGradient)"
                dot={{ fill: '#dc2626', r: 5 }}
              />
              <Area 
                type="monotone" 
                dataKey="upper" 
                stroke="#f87171" 
                strokeWidth={1}
                strokeDasharray="5 5"
                fill="none"
              />
              <Area 
                type="monotone" 
                dataKey="lower" 
                stroke="#f87171" 
                strokeWidth={1}
                strokeDasharray="5 5"
                fill="none"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Advance Predictions */}
        <ChartCard
          title="توقع السلف القادمة"
          subtitle="التوقعات للأشهر الستة القادمة"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={advancePredictions}>
              <defs>
                <linearGradient id="advancePredGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#eab308" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#eab308" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="month" 
                stroke="#6b7280"
                style={{ fontSize: '11px', fontFamily: 'Cairo' }}
              />
              <YAxis 
                stroke="#6b7280"
                style={{ fontSize: '11px' }}
                tickFormatter={(value) => formatCompactCurrency(value)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  fontFamily: 'Cairo',
                }}
                formatter={(value: any) => formatCompactCurrency(value)}
                labelStyle={{ fontFamily: 'Cairo' }}
              />
              <Area 
                type="monotone" 
                dataKey="predicted" 
                stroke="#eab308" 
                strokeWidth={3}
                fill="url(#advancePredGradient)"
                dot={{ fill: '#eab308', r: 5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Branch Cost Analysis */}
      <ChartCard
        title="الفروع الأعلى تكلفة"
        subtitle="تحليل التكاليف حسب الفرع"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sortedBranchData} layout="vertical">
            <defs>
              <linearGradient id="costGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="5%" stopColor="#dc2626" stopOpacity={0.9} />
                <stop offset="50%" stopColor="#f97316" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#eab308" stopOpacity={0.7} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              type="number"
              stroke="#6b7280"
              style={{ fontSize: '11px' }}
              tickFormatter={(value) => formatCompactCurrency(value)}
            />
            <YAxis 
              type="category"
              dataKey="branch" 
              stroke="#6b7280"
              style={{ fontSize: '11px', fontFamily: 'Cairo' }}
              width={150}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                fontFamily: 'Cairo',
              }}
              formatter={(value: any) => formatCompactCurrency(value)}
            />
            <Bar 
              dataKey="totalSalary" 
              fill="url(#costGradient)"
              radius={[0, 12, 12, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Cost Optimization Opportunities */}
      <DataCard className="bg-gradient-to-br from-green-50 to-blue-50">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 rounded-2xl bg-green-100">
            <Lightbulb className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">فرص تحسين المصاريف</h2>
            <p className="text-gray-600">توصيات لتقليل التكاليف وتحسين الكفاءة</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-white shadow-sm">
            <div className="flex items-start gap-3 mb-2">
              <Target className="w-5 h-5 text-green-600 mt-1" />
              <div>
                <h4 className="font-bold text-gray-900 mb-1">تحسين جدولة السلف</h4>
                <p className="text-sm text-gray-600">تطبيق نظام سلف دورية محددة بدلاً من العشوائية</p>
                <p className="text-green-600 font-semibold text-sm mt-2">توفير: 35,000 ر.س شهرياً</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white shadow-sm">
            <div className="flex items-start gap-3 mb-2">
              <Target className="w-5 h-5 text-blue-600 mt-1" />
              <div>
                <h4 className="font-bold text-gray-900 mb-1">توحيد هيكل الرواتب</h4>
                <p className="text-sm text-gray-600">معايير موحدة للرواتب حسب المنصب والخبرة</p>
                <p className="text-blue-600 font-semibold text-sm mt-2">توفير: 28,000 ر.س شهرياً</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white shadow-sm">
            <div className="flex items-start gap-3 mb-2">
              <Target className="w-5 h-5 text-purple-600 mt-1" />
              <div>
                <h4 className="font-bold text-gray-900 mb-1">تقليل الخصومات غير المبررة</h4>
                <p className="text-sm text-gray-600">مراجعة أسباب الخصومات وتحسين السياسات</p>
                <p className="text-purple-600 font-semibold text-sm mt-2">توفير: 15,000 ر.س شهرياً</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white shadow-sm">
            <div className="flex items-start gap-3 mb-2">
              <Target className="w-5 h-5 text-orange-600 mt-1" />
              <div>
                <h4 className="font-bold text-gray-900 mb-1">أتمتة العمليات</h4>
                <p className="text-sm text-gray-600">تقليل الوقت المستغرق في المعالجة اليدوية</p>
                <p className="text-orange-600 font-semibold text-sm mt-2">توفير: 32 ساعة شهرياً</p>
              </div>
            </div>
          </div>
        </div>
      </DataCard>

      {/* AI Recommendations by Priority */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="w-8 h-8 text-purple-600" />
          <h2 className="text-3xl font-bold text-gray-900">توصيات الذكاء الاصطناعي</h2>
        </div>

        {/* Urgent */}
        {urgentInsights.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <h3 className="text-2xl font-bold text-red-600">عاجل</h3>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {urgentInsights.map((insight) => (
                <AIInsightCard key={insight.id} insight={insight} />
              ))}
            </div>
          </div>
        )}

        {/* Short Term */}
        {shortTermInsights.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-6 h-6 text-yellow-600" />
              <h3 className="text-2xl font-bold text-yellow-600">قصير المدى</h3>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {shortTermInsights.map((insight) => (
                <AIInsightCard key={insight.id} insight={insight} />
              ))}
            </div>
          </div>
        )}

        {/* Long Term */}
        {longTermInsights.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-6 h-6 text-blue-600" />
              <h3 className="text-2xl font-bold text-blue-600">طويل المدى</h3>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {longTermInsights.map((insight) => (
                <AIInsightCard key={insight.id} insight={insight} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


