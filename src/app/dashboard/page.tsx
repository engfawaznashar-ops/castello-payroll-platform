'use client'

import { useQuery } from '@tanstack/react-query'
import { getKPIData, getMonthlyTrends, getNationalityDistribution, getBranchSalaries } from '@/lib/api'
import { KPICardLuxury } from '@/components/KPICardLuxury'
import { ProgressBarXP } from '@/components/ProgressBarXP'
import { SectionHeader } from '@/components/SectionHeader'
import { ChartCard } from '@/components/ChartCard'
import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { formatCompactCurrency } from '@/lib/utils'

export default function DashboardPage() {
  const { data: kpiData, isLoading: kpiLoading } = useQuery({
    queryKey: ['kpi'],
    queryFn: getKPIData,
  })

  const { data: monthlyTrends, isLoading: trendsLoading } = useQuery({
    queryKey: ['monthlyTrends'],
    queryFn: getMonthlyTrends,
  })

  const { data: nationalityDist, isLoading: nationalityLoading } = useQuery({
    queryKey: ['nationality'],
    queryFn: getNationalityDistribution,
  })

  const { data: branchSalaries, isLoading: branchLoading } = useQuery({
    queryKey: ['branchSalaries'],
    queryFn: getBranchSalaries,
  })

  if (kpiLoading || trendsLoading || nationalityLoading || branchLoading) {
    return (
      <div className="animate-fade-in">
        <SectionHeader title="لوحة التحكم" subtitle="نظرة شاملة على بيانات الرواتب والموظفين" />
        <div className="space-y-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 skeleton rounded-3xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in space-y-8">
      <SectionHeader title="لوحة التحكم" subtitle="نظرة شاملة على بيانات الرواتب والموظفين" />

      {/* XP Progress Bar */}
      <ProgressBarXP />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {kpiData?.map((kpi, index) => (
          <KPICardLuxury
            key={index}
            label={kpi.label}
            value={kpi.value}
            change={kpi.change}
            changeType={kpi.changeType}
            iconName={kpi.icon as any}
          />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Monthly Salary Trends */}
        <ChartCard
          title="اتجاه الرواتب خلال الأشهر"
          subtitle="آخر 12 شهر"
          className="xl:col-span-2"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyTrends}>
              <defs>
                <linearGradient id="salaryGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#dc2626" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#dc2626" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="netGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#eab308" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#eab308" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="month" 
                stroke="#6b7280"
                style={{ fontSize: '12px', fontFamily: 'Cairo' }}
              />
              <YAxis 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
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
              />
              <Legend 
                wrapperStyle={{ fontFamily: 'Cairo', fontSize: '14px' }}
                formatter={(value) => {
                  const labels: Record<string, string> = {
                    salary: 'إجمالي الرواتب',
                    net: 'صافي الرواتب',
                    advances: 'السلف',
                    deductions: 'الخصومات',
                  }
                  return labels[value] || value
                }}
              />
              <Line 
                type="monotone" 
                dataKey="salary" 
                stroke="#dc2626" 
                strokeWidth={3}
                fill="url(#salaryGradient)"
                dot={{ fill: '#dc2626', r: 5 }}
                activeDot={{ r: 7 }}
              />
              <Line 
                type="monotone" 
                dataKey="net" 
                stroke="#eab308" 
                strokeWidth={3}
                fill="url(#netGradient)"
                dot={{ fill: '#eab308', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Nationality Distribution */}
        <ChartCard
          title="توزيع الجنسيات"
          subtitle="نسبة الموظفين حسب الجنسية"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={nationalityDist}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ nationality, percentage }) => `${nationality} ${percentage}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
                style={{ fontFamily: 'Cairo', fontSize: '12px' }}
              >
                {nationalityDist?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  fontFamily: 'Cairo',
                }}
                formatter={(value: any, name: string, props: any) => [
                  `${value} موظف (${props.payload.percentage}%)`,
                  props.payload.nationality
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Branch Salaries */}
        <ChartCard
          title="الرواتب حسب الفروع"
          subtitle="مقارنة بين الفروع"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={branchSalaries} layout="horizontal">
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="5%" stopColor="#dc2626" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#eab308" stopOpacity={0.8} />
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
                labelFormatter={(label) => label}
              />
              <Bar 
                dataKey="totalSalary" 
                fill="url(#barGradient)"
                radius={[0, 12, 12, 0]}
                label={{
                  position: 'left',
                  formatter: (value: number) => formatCompactCurrency(value),
                  style: { fontFamily: 'Cairo', fontSize: '11px', fill: '#fff', fontWeight: 'bold' }
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  )
}


