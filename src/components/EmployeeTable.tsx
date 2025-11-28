'use client'

import { Employee } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { EmployeeCompletionMeter } from './EmployeeCompletionMeter'
import { Button } from './ui/button'
import { Eye, Search, Download, User } from 'lucide-react'
import { DataCard } from './DataCard'
import Link from 'next/link'
import { useState } from 'react'
import { exportToCSV } from '@/lib/csv-parser'

interface EmployeeTableProps {
  employees: Employee[]
}

// Flag emoji mapping for nationalities
const nationalityFlags: Record<string, string> = {
  'سعودي': '🇸🇦',
  'مصري': '🇪🇬',
  'سوري': '🇸🇾',
  'يمني': '🇾🇪',
  'أردني': '🇯🇴',
  'فلسطيني': '🇵🇸',
  'لبناني': '🇱🇧',
  'سوداني': '🇸🇩',
  'باكستاني': '🇵🇰',
  'هندي': '🇮🇳',
  'بنغلاديشي': '🇧🇩',
  'فلبيني': '🇵🇭',
}

// Enhanced Completion Meter Component
function EnhancedCompletionMeter({ percentage }: { percentage: number }) {
  return (
    <div className="flex items-center gap-2 min-w-[120px]">
      <div className="relative flex-1 h-2 bg-gray-100 rounded-full overflow-hidden shadow-inner">
        {/* Animated Progress Bar */}
        <div
          className="absolute top-0 right-0 h-full rounded-full transition-all duration-700 ease-out"
          style={{ 
            width: `${percentage}%`,
            background: 'linear-gradient(90deg, #EFB343 0%, #F6D36B 50%, #EFB343 100%)',
            boxShadow: '0 0 8px rgba(239, 179, 67, 0.4)'
          }}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 opacity-30">
            <div className="h-full w-full bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer" />
          </div>
          
          {/* Circular indicator at end */}
          {percentage > 5 && (
            <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-lg border-2 border-castello-gold-500 animate-pulse" />
          )}
        </div>
      </div>
      <span className="text-xs font-bold text-castello-gold-600 min-w-[35px]">
        {percentage}%
      </span>
    </div>
  )
}

export function EmployeeTable({ employees }: EmployeeTableProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterBranch, setFilterBranch] = useState('')
  const [filterNationality, setFilterNationality] = useState('')

  // Get unique branches and nationalities
  const branches = Array.from(new Set(employees.map(emp => emp.branch)))
  const nationalities = Array.from(new Set(employees.map(emp => emp.nationality)))

  // Filter employees
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = 
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesBranch = !filterBranch || emp.branch === filterBranch
    const matchesNationality = !filterNationality || emp.nationality === filterNationality
    
    return matchesSearch && matchesBranch && matchesNationality
  })

  const handleExport = () => {
    const exportData = filteredEmployees.map(emp => ({
      'رقم الموظف': emp.id,
      'الاسم': emp.name,
      'الفرع': emp.branch,
      'الجنسية': emp.nationality,
      'رقم الإقامة': emp.iqamaNumber,
      'الراتب': emp.baseSalary,
      'السلف': emp.advances,
      'الخصومات': emp.deductions,
      'الصافي': emp.netSalary,
      'الحساب البنكي': emp.bankAccount,
      'نسبة الاكتمال': `${emp.completionPercentage}%`,
    }))
    exportToCSV(exportData, `castello-employees-${new Date().toISOString().split('T')[0]}`)
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <DataCard>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="ابحث عن موظف..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-castello-gold-400 transition-all"
            />
          </div>
          
          <select
            value={filterBranch}
            onChange={(e) => setFilterBranch(e.target.value)}
            className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-castello-gold-400 transition-all min-w-[200px]"
          >
            <option value="">جميع الفروع</option>
            {branches.map(branch => (
              <option key={branch} value={branch}>{branch}</option>
            ))}
          </select>
          
          <select
            value={filterNationality}
            onChange={(e) => setFilterNationality(e.target.value)}
            className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-castello-gold-400 transition-all min-w-[180px]"
          >
            <option value="">جميع الجنسيات</option>
            {nationalities.map(nationality => (
              <option key={nationality} value={nationality}>{nationality}</option>
            ))}
          </select>
          
          <Button onClick={handleExport} variant="gold" className="gap-2">
            <Download className="w-4 h-4" />
            تصدير
          </Button>
        </div>
      </DataCard>

      {/* Table */}
      <DataCard className="overflow-x-auto custom-scrollbar">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-right px-3 py-3 text-xs font-bold text-gray-600 uppercase tracking-wide">صورة</th>
              <th className="text-right px-3 py-3 text-xs font-bold text-gray-600 uppercase tracking-wide">الاسم</th>
              <th className="text-right px-3 py-3 text-xs font-bold text-gray-600 uppercase tracking-wide">الفرع</th>
              <th className="text-right px-3 py-3 text-xs font-bold text-gray-600 uppercase tracking-wide">الجنسية</th>
              <th className="text-right px-3 py-3 text-xs font-bold text-gray-600 uppercase tracking-wide">رقم الإقامة</th>
              <th className="text-right px-3 py-3 text-xs font-bold text-gray-600 uppercase tracking-wide">الراتب</th>
              <th className="text-right px-3 py-3 text-xs font-bold text-gray-600 uppercase tracking-wide">السلف</th>
              <th className="text-right px-3 py-3 text-xs font-bold text-gray-600 uppercase tracking-wide">الخصومات</th>
              <th className="text-right px-3 py-3 text-xs font-bold text-gray-600 uppercase tracking-wide">الصافي</th>
              <th className="text-right px-3 py-3 text-xs font-bold text-gray-600 uppercase tracking-wide">الحساب البنكي</th>
              <th className="text-right px-3 py-3 text-xs font-bold text-gray-600 uppercase tracking-wide">نسبة الاكتمال</th>
              <th className="text-center px-3 py-3 text-xs font-bold text-gray-600 uppercase tracking-wide">التفاصيل</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee, index) => (
              <tr 
                key={employee.id} 
                className="group border-b border-black/5 hover:bg-gradient-to-l hover:from-castello-gold-50/30 hover:to-transparent transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
              >
                {/* Avatar - Minimal Icon */}
                <td className="px-3 py-2.5">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-castello-gold-100 to-castello-red-100 shadow-sm">
                    <User className="w-3.5 h-3.5 text-castello-red-600" />
                  </div>
                </td>
                
                {/* Name */}
                <td className="px-3 py-2.5">
                  <div className="flex flex-col">
                    <p className="font-bold text-sm text-gray-900 leading-tight">{employee.name}</p>
                    <p className="text-xs text-gray-400 font-mono mt-0.5">{employee.id}</p>
                  </div>
                </td>
                
                {/* Branch */}
                <td className="px-3 py-2.5">
                  <span className="text-sm text-gray-700 font-medium">{employee.branch}</span>
                </td>
                
                {/* Nationality - Flag + Label Pill */}
                <td className="px-3 py-2.5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-l from-blue-50 to-indigo-50 border border-blue-100 shadow-sm">
                    <span className="text-base leading-none">{nationalityFlags[employee.nationality] || '🌐'}</span>
                    <span className="text-xs font-semibold text-gray-700">{employee.nationality}</span>
                  </div>
                </td>
                
                {/* Iqama Number */}
                <td className="px-3 py-2.5">
                  <span className="text-xs text-gray-600 font-mono bg-gray-50 px-2 py-1 rounded">{employee.iqamaNumber}</span>
                </td>
                
                {/* Base Salary - Gold Gradient */}
                <td className="px-3 py-2.5">
                  <span className="text-sm font-bold bg-gradient-to-l from-castello-gold-600 to-castello-gold-700 bg-clip-text text-transparent">
                    {formatCurrency(employee.baseSalary)}
                  </span>
                </td>
                
                {/* Advances - Soft Red */}
                <td className="px-3 py-2.5">
                  <span className="text-sm font-semibold bg-gradient-to-l from-red-500 to-rose-500 bg-clip-text text-transparent">
                    {formatCurrency(employee.advances)}
                  </span>
                </td>
                
                {/* Deductions - Soft Red */}
                <td className="px-3 py-2.5">
                  <span className="text-sm font-semibold bg-gradient-to-l from-red-500 to-rose-500 bg-clip-text text-transparent">
                    {formatCurrency(employee.deductions)}
                  </span>
                </td>
                
                {/* Net Salary - Green Gradient */}
                <td className="px-3 py-2.5">
                  <span className="text-sm font-bold bg-gradient-to-l from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    {formatCurrency(employee.netSalary)}
                  </span>
                </td>
                
                {/* Bank Account */}
                <td className="px-3 py-2.5">
                  <span className="text-xs text-gray-500 font-mono max-w-[140px] truncate block">
                    {employee.bankAccount}
                  </span>
                </td>
                
                {/* Completion Meter - Enhanced */}
                <td className="px-3 py-2.5">
                  <EnhancedCompletionMeter percentage={employee.completionPercentage} />
                </td>
                
                {/* Details Button - Icon Only */}
                <td className="px-3 py-2.5 text-center">
                  <Link href={`/employees/${employee.id}`}>
                    <button className="inline-flex items-center justify-center w-8 h-8 rounded-lg border-2 border-gray-300 text-gray-600 hover:border-castello-gold-500 hover:text-castello-gold-600 hover:bg-castello-gold-50 hover:shadow-lg hover:shadow-castello-gold-500/30 transition-all duration-300 group">
                      <Eye className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredEmployees.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">لا توجد نتائج</p>
          </div>
        )}
        
        <div className="mt-6 pt-6 border-t border-gray-200 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            عرض {filteredEmployees.length} من أصل {employees.length} موظف
          </p>
        </div>
      </DataCard>
    </div>
  )
}

