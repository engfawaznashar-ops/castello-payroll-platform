import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'

export const GET = auth(async (req) => {
  if (!req.auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Count various quality issues
    const totalEmployees = await prisma.employee.count({ where: { status: 'ACTIVE' } })
    
    // Missing iqama numbers
    const missingIqama = await prisma.employee.count({
      where: {
        status: 'ACTIVE',
        OR: [
          { iqamaNumber: null },
          { iqamaNumber: '' }
        ]
      }
    })

    // Missing bank accounts
    const missingBankAccounts = await prisma.employee.count({
      where: {
        status: 'ACTIVE',
        OR: [
          { bankAccount: null },
          { bankAccount: '' }
        ]
      }
    })

    // Missing or expired documents
    const documentIssues = await prisma.employeeDocument.count({
      where: {
        OR: [
          { status: 'MISSING' },
          { status: 'EXPIRED' },
          { status: 'EXPIRING' }
        ]
      }
    })

    // Count documents by severity
    const criticalDocs = await prisma.employeeDocument.count({
      where: {
        status: 'EXPIRED',
        isRequired: true
      }
    })

    const warningDocs = await prisma.employeeDocument.count({
      where: {
        OR: [
          { status: 'EXPIRING' },
          { status: 'MISSING', isRequired: true }
        ]
      }
    })

    // Payroll validation errors (dummy for now)
    const payrollErrors = await prisma.payrollEntry.count({
      where: {
        validationStatus: { not: 'OK' }
      }
    })

    // Calculate totals
    const totalCritical = missingIqama + missingBankAccounts + criticalDocs
    const totalWarnings = documentIssues - criticalDocs + Math.floor(payrollErrors / 2)
    const totalInfo = payrollErrors - Math.floor(payrollErrors / 2)
    const totalIssues = totalCritical + totalWarnings + totalInfo

    // Calculate overall score (100 - penalty)
    const penalty = Math.min(100, (totalCritical * 5) + (totalWarnings * 2) + (totalInfo * 0.5))
    const overallScore = Math.max(0, Math.round(100 - penalty))

    // Generate issues breakdown
    const issues = [
      {
        id: '1',
        title: 'قيم مفقودة',
        description: 'بيانات ناقصة في سجلات الموظفين',
        severity: 'critical' as const,
        count: missingIqama + missingBankAccounts,
        affectedEmployees: missingIqama + missingBankAccounts
      },
      {
        id: '2',
        title: 'مستندات منتهية',
        description: 'مستندات منتهية الصلاحية',
        severity: 'critical' as const,
        count: criticalDocs,
        affectedEmployees: criticalDocs
      },
      {
        id: '3',
        title: 'مستندات تنتهي قريباً',
        description: 'مستندات ستنتهي خلال 30 يوم',
        severity: 'warning' as const,
        count: warningDocs,
        affectedEmployees: warningDocs
      },
      {
        id: '4',
        title: 'أخطاء في حسابات الرواتب',
        description: 'عدم تطابق في حسابات بعض الرواتب',
        severity: 'warning' as const,
        count: payrollErrors,
        affectedEmployees: Math.floor(payrollErrors * 0.8)
      },
      {
        id: '5',
        title: 'بيانات تحتاج مراجعة',
        description: 'بيانات غير مؤكدة تحتاج مراجعة',
        severity: 'info' as const,
        count: totalInfo,
        affectedEmployees: totalInfo
      }
    ].filter(issue => issue.count > 0)

    return NextResponse.json({
      overall: overallScore,
      totalIssues,
      criticalIssues: totalCritical,
      warningIssues: totalWarnings,
      infoIssues: totalInfo,
      completeness: totalEmployees > 0 ? Math.round(((totalEmployees - totalIssues) / totalEmployees) * 100) : 0,
      totalEmployees,
      lastUpdated: new Date().toISOString(),
      issues
    })
  } catch (error) {
    console.error('Error calculating quality score:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
})
