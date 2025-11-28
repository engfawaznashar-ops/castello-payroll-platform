'use client'

import { useQuery } from '@tanstack/react-query'
import { getAlerts } from '@/lib/api'
import { SectionHeader } from '@/components/SectionHeader'
import { AlertCard } from '@/components/AlertCard'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { DataCard } from '@/components/DataCard'
import { Badge } from '@/components/ui/badge'
import { Info, AlertTriangle, AlertCircle, Filter } from 'lucide-react'
import { useState } from 'react'

export default function AlertsPage() {
  const { data: alerts, isLoading } = useQuery({
    queryKey: ['alerts'],
    queryFn: () => getAlerts(),
  })

  const [selectedTab, setSelectedTab] = useState('all')
  const [sortBy, setSortBy] = useState('date')

  if (isLoading) {
    return (
      <div className="animate-fade-in">
        <SectionHeader title="التنبيهات" subtitle="مركز إدارة التنبيهات" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 skeleton rounded-3xl" />
          ))}
        </div>
      </div>
    )
  }

  if (!alerts) return null

  // Filter alerts based on tab
  const filteredAlerts = alerts.filter(alert => {
    if (selectedTab === 'all') return true
    return alert.severity === selectedTab
  })

  // Sort alerts
  const sortedAlerts = [...filteredAlerts].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'xp':
        return b.xpReward - a.xpReward
      case 'severity':
        const severityOrder = { critical: 0, warning: 1, info: 2 }
        return severityOrder[a.severity] - severityOrder[b.severity]
      default:
        return 0
    }
  })

  // Count by severity
  const infoCounts = alerts.filter(a => a.severity === 'info').length
  const warningCount = alerts.filter(a => a.severity === 'warning').length
  const criticalCount = alerts.filter(a => a.severity === 'critical').length
  const totalXP = alerts.reduce((sum, alert) => sum + alert.xpReward, 0)

  return (
    <div className="animate-fade-in space-y-8">
      <SectionHeader 
        title="التنبيهات" 
        subtitle={`${alerts.length} تنبيه نشط`}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <DataCard hover>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-blue-100">
              <Info className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-600">{infoCounts}</p>
              <p className="text-sm text-gray-600">معلومات</p>
            </div>
          </div>
        </DataCard>

        <DataCard hover>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-yellow-100">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-yellow-600">{warningCount}</p>
              <p className="text-sm text-gray-600">تحذيرات</p>
            </div>
          </div>
        </DataCard>

        <DataCard hover>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-red-100">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-red-600">{criticalCount}</p>
              <p className="text-sm text-gray-600">حرجة</p>
            </div>
          </div>
        </DataCard>

        <DataCard hover className="bg-gradient-to-br from-castello-gold-50 to-castello-red-50">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-castello-gold-100">
              <span className="text-2xl">🏆</span>
            </div>
            <div>
              <p className="text-3xl font-bold gold-gradient bg-clip-text text-transparent">{totalXP}</p>
              <p className="text-sm text-gray-600">نقاط XP متاحة</p>
            </div>
          </div>
        </DataCard>
      </div>

      {/* Filters and Tabs */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full md:w-auto">
          <TabsList>
            <TabsTrigger value="all">
              جميع التنبيهات
              <Badge variant="outline" className="mr-2">{alerts.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="info">
              معلومات
              <Badge variant="outline" className="mr-2">{infoCounts}</Badge>
            </TabsTrigger>
            <TabsTrigger value="warning">
              تحذيرات
              <Badge variant="outline" className="mr-2">{warningCount}</Badge>
            </TabsTrigger>
            <TabsTrigger value="critical">
              حرجة
              <Badge variant="outline" className="mr-2">{criticalCount}</Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <DataCard className="flex items-center gap-3 px-4 py-2 w-full md:w-auto">
          <Filter className="w-5 h-5 text-gray-600" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent focus:outline-none text-gray-700 font-medium"
          >
            <option value="date">ترتيب حسب: التاريخ</option>
            <option value="severity">ترتيب حسب: الأهمية</option>
            <option value="xp">ترتيب حسب: نقاط XP</option>
          </select>
        </DataCard>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {sortedAlerts.length === 0 ? (
          <DataCard>
            <div className="text-center py-12">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">✓</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">لا توجد تنبيهات</h3>
              <p className="text-gray-600">جميع التنبيهات في هذه الفئة تم حلها</p>
            </div>
          </DataCard>
        ) : (
          sortedAlerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))
        )}
      </div>

      {/* Pagination Info */}
      {sortedAlerts.length > 0 && (
        <DataCard>
          <p className="text-center text-gray-600">
            عرض {sortedAlerts.length} تنبيه
          </p>
        </DataCard>
      )}
    </div>
  )
}

