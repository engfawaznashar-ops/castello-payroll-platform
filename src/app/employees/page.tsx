'use client'

import { useQuery } from '@tanstack/react-query'
import { getEmployees } from '@/lib/api'
import { SectionHeader } from '@/components/SectionHeader'
import { EmployeeTable } from '@/components/EmployeeTable'

export default function EmployeesPage() {
  const { data: employees, isLoading } = useQuery({
    queryKey: ['employees'],
    queryFn: getEmployees,
  })

  if (isLoading) {
    return (
      <div className="animate-fade-in">
        <SectionHeader title="الموظفين" subtitle="إدارة بيانات الموظفين" />
        <div className="space-y-4">
          <div className="h-20 skeleton rounded-3xl" />
          <div className="h-[600px] skeleton rounded-3xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <SectionHeader 
        title="الموظفين" 
        subtitle={`إدارة ${employees?.length || 0} موظف`}
      />
      
      {employees && <EmployeeTable employees={employees} />}
    </div>
  )
}


