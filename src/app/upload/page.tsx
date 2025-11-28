'use client'

import { useState } from 'react'
import { SectionHeader } from '@/components/SectionHeader'
import { UploadBox } from '@/components/UploadBox'
import { DataCard } from '@/components/DataCard'
import type { UploadResult } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { FileSpreadsheet } from 'lucide-react'

export default function UploadPage() {
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null)

  return (
    <div className="animate-fade-in space-y-8">
      <SectionHeader 
        title="رفع البيانات" 
        subtitle="رفع ومعالجة ملفات الرواتب"
      />

      <UploadBox onUploadComplete={setUploadResult} />

      {/* Data Preview */}
      {uploadResult && uploadResult.success && uploadResult.data.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <FileSpreadsheet className="w-6 h-6 text-castello-gold-600" />
            <h2 className="text-2xl font-bold text-gray-900">معاينة البيانات</h2>
            <span className="text-sm text-gray-600">
              (أول 10 صفوف)
            </span>
          </div>

          <DataCard className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  {uploadResult.data[0] && Object.keys(uploadResult.data[0]).map((key) => (
                    <th key={key} className="text-right px-4 py-3 font-bold text-gray-700 whitespace-nowrap">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {uploadResult.data.slice(0, 10).map((row: any, index: number) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    {Object.values(row).map((value: any, cellIndex: number) => (
                      <td key={cellIndex} className="px-4 py-3 text-gray-700 whitespace-nowrap">
                        {typeof value === 'number' && value > 1000 
                          ? formatCurrency(value)
                          : String(value)
                        }
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </DataCard>

          {uploadResult.data.length > 10 && (
            <p className="text-sm text-gray-500 text-center">
              و {uploadResult.data.length - 10} صفوف أخرى...
            </p>
          )}
        </div>
      )}

      {/* Instructions */}
      <DataCard>
        <h3 className="text-xl font-bold text-gray-900 mb-4">تعليمات الرفع</h3>
        <ul className="space-y-2 text-gray-700">
          <li className="flex gap-2">
            <span className="text-castello-gold-600">•</span>
            <span>يجب أن يحتوي الملف على الأعمدة التالية: employee_id, name, base_salary, net_salary</span>
          </li>
          <li className="flex gap-2">
            <span className="text-castello-gold-600">•</span>
            <span>الأعمدة الاختيارية: allowances, deductions, advances, branch, nationality</span>
          </li>
          <li className="flex gap-2">
            <span className="text-castello-gold-600">•</span>
            <span>تأكد من صحة أرقام IBAN للحسابات البنكية</span>
          </li>
          <li className="flex gap-2">
            <span className="text-castello-gold-600">•</span>
            <span>يجب أن تكون جميع القيم المالية أرقام صحيحة</span>
          </li>
          <li className="flex gap-2">
            <span className="text-castello-gold-600">•</span>
            <span>تجنب تكرار أرقام الموظفين في نفس الملف</span>
          </li>
        </ul>
      </DataCard>
    </div>
  )
}


