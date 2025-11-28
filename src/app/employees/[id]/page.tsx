'use client'

import { useQuery } from '@tanstack/react-query'
import { getEmployee, getPayrollHistory, getEmployeeAlerts } from '@/lib/api'
import { DataCard } from '@/components/DataCard'
import { EmployeeCompletionMeter } from '@/components/EmployeeCompletionMeter'
import { AlertCard } from '@/components/AlertCard'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDate } from '@/lib/utils'
import { CheckCircle2, XCircle, AlertTriangle, Calendar, Briefcase, MapPin, Globe, Phone, Mail, CreditCard, FileText } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function EmployeeProfilePage({ params }: { params: { id: string } }) {
  const { data: employee, isLoading } = useQuery({
    queryKey: ['employee', params.id],
    queryFn: () => getEmployee(params.id),
  })

  const { data: payrollHistory } = useQuery({
    queryKey: ['payrollHistory', params.id],
    queryFn: () => getPayrollHistory(params.id),
    enabled: !!employee,
  })

  const { data: employeeAlerts } = useQuery({
    queryKey: ['employeeAlerts', params.id],
    queryFn: () => getEmployeeAlerts(params.id),
    enabled: !!employee,
  })

  if (isLoading) {
    return (
      <div className="animate-fade-in space-y-6">
        <div className="h-64 skeleton rounded-3xl" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-80 skeleton rounded-3xl" />
          ))}
        </div>
      </div>
    )
  }

  if (!employee) {
    return (
      <div className="animate-fade-in">
        <DataCard>
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">الموظف غير موجود</p>
            <Link href="/employees">
              <Button className="mt-4" variant="gold">
                العودة إلى قائمة الموظفين
              </Button>
            </Link>
          </div>
        </DataCard>
      </div>
    )
  }

  const statusIcons = {
    valid: CheckCircle2,
    expiring: AlertTriangle,
    expired: XCircle,
    missing: XCircle,
  }

  const statusColors = {
    valid: 'text-green-600 bg-green-50',
    expiring: 'text-yellow-600 bg-yellow-50',
    expired: 'text-red-600 bg-red-50',
    missing: 'text-gray-600 bg-gray-50',
  }

  const statusLabels = {
    valid: 'صالح',
    expiring: 'ينتهي قريباً',
    expired: 'منتهي',
    missing: 'مفقود',
  }

  return (
    <div className="animate-fade-in space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl p-8 glass-strong shadow-luxury">
        <div className="absolute inset-0 bg-gradient-to-br from-castello-red-500/20 via-castello-gold-500/20 to-transparent" />
        
        <div className="relative flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden shadow-2xl ring-4 ring-white">
              <Image
                src={employee.avatar || ''}
                alt={employee.name}
                width={128}
                height={128}
                className="object-cover"
              />
            </div>
            <Badge className="absolute -bottom-2 -right-2 bg-castello-gold-500 text-white">
              {employee.id}
            </Badge>
          </div>

          <div className="flex-1 text-center md:text-right">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{employee.name}</h1>
            <p className="text-lg text-gray-600 mb-4">{employee.position}</p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <Badge variant="outline" className="flex items-center gap-2">
                <MapPin className="w-3 h-3" />
                {employee.branch}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-2">
                <Globe className="w-3 h-3" />
                {employee.nationality}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-2">
                <Calendar className="w-3 h-3" />
                {formatDate(employee.hireDate)}
              </Badge>
            </div>
          </div>

          <div className="shrink-0">
            <EmployeeCompletionMeter percentage={employee.completionPercentage} size="large" />
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <DataCard>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-2xl bg-blue-100">
              <Briefcase className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">البيانات الأساسية</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-500">البريد الإلكتروني</p>
                <p className="font-semibold text-gray-900">{employee.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-500">رقم الهاتف</p>
                <p className="font-semibold text-gray-900 direction-ltr text-right">{employee.phone}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-500">رقم الإقامة</p>
                <p className="font-semibold text-gray-900 font-mono">{employee.iqamaNumber}</p>
                <p className="text-xs text-gray-500">تنتهي: {formatDate(employee.iqamaExpiry)}</p>
              </div>
            </div>

            {employee.passportNumber && (
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">رقم جواز السفر</p>
                  <p className="font-semibold text-gray-900 font-mono">{employee.passportNumber}</p>
                  {employee.passportExpiry && (
                    <p className="text-xs text-gray-500">تنتهي: {formatDate(employee.passportExpiry)}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </DataCard>

        {/* Documents */}
        <DataCard>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-2xl bg-purple-100">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">المستندات</h2>
          </div>

          <div className="space-y-3">
            {employee.documents.map((doc, index) => {
              const StatusIcon = statusIcons[doc.status]
              const colorClass = statusColors[doc.status]
              const label = statusLabels[doc.status]

              return (
                <div
                  key={index}
                  className={`flex items-center justify-between p-4 rounded-xl ${colorClass.split(' ')[1]} border ${colorClass.split(' ')[1].replace('bg-', 'border-')}`}
                >
                  <div className="flex items-center gap-3">
                    <StatusIcon className={`w-5 h-5 ${colorClass.split(' ')[0]}`} />
                    <div>
                      <p className="font-semibold text-gray-900">{doc.type}</p>
                      {doc.expiryDate && (
                        <p className="text-xs text-gray-600">
                          ينتهي: {formatDate(doc.expiryDate)}
                        </p>
                      )}
                    </div>
                  </div>
                  <Badge className={colorClass}>{label}</Badge>
                </div>
              )
            })}
          </div>
        </DataCard>

        {/* Financial Section */}
        <DataCard>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-2xl bg-green-100">
              <CreditCard className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">القسم المالي</h2>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-gray-50">
              <p className="text-sm text-gray-600 mb-1">الراتب الأساسي</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(employee.baseSalary)}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-blue-50">
              <p className="text-sm text-gray-600 mb-1">البدلات</p>
              <p className="text-2xl font-bold text-blue-700">
                {formatCurrency(employee.allowances)}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-red-50">
                <p className="text-xs text-gray-600 mb-1">السلف</p>
                <p className="text-lg font-bold text-red-600">
                  {formatCurrency(employee.advances)}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-red-50">
                <p className="text-xs text-gray-600 mb-1">الخصومات</p>
                <p className="text-lg font-bold text-red-600">
                  {formatCurrency(employee.deductions)}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-green-50 border-2 border-green-300">
              <p className="text-sm text-gray-600 mb-1">صافي الراتب</p>
              <p className="text-3xl font-bold text-green-700">
                {formatCurrency(employee.netSalary)}
              </p>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-2">معلومات الحساب البنكي</p>
              <p className="font-semibold text-gray-900 mb-1">{employee.bankName}</p>
              <p className="text-sm font-mono text-gray-600 break-all">
                {employee.bankAccount}
              </p>
            </div>
          </div>
        </DataCard>

        {/* Payroll History */}
        <DataCard>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-2xl bg-yellow-100">
              <Calendar className="w-6 h-6 text-yellow-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">سجل الرواتب</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-right px-3 py-2 text-sm font-bold text-gray-700">الشهر</th>
                  <th className="text-right px-3 py-2 text-sm font-bold text-gray-700">الإجمالي</th>
                  <th className="text-right px-3 py-2 text-sm font-bold text-gray-700">الخصومات</th>
                  <th className="text-right px-3 py-2 text-sm font-bold text-gray-700">الصافي</th>
                </tr>
              </thead>
              <tbody>
                {payrollHistory?.map((record, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="px-3 py-3 text-sm font-medium text-gray-900">{record.month}</td>
                    <td className="px-3 py-3 text-sm text-gray-700">{formatCurrency(record.gross)}</td>
                    <td className="px-3 py-3 text-sm text-red-600">{formatCurrency(record.deductions)}</td>
                    <td className="px-3 py-3 text-sm font-bold text-green-600">{formatCurrency(record.net)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DataCard>
      </div>

      {/* Employee Alerts */}
      {employeeAlerts && employeeAlerts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">تنبيهات خاصة بالموظف</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {employeeAlerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}


