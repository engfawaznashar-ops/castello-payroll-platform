export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(req: Request) {
  const session = await auth()
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Get current month data (latest validated/approved batch)
    const currentMonthBatch = await prisma.payrollBatch.findFirst({
      where: {
        status: { in: ['VALIDATED', 'APPROVED', 'PROCESSED'] }
      },
      orderBy: { month: 'desc' },
      include: {
        entries: true
      }
    })

    // Get previous month data
    const previousMonthBatch = await prisma.payrollBatch.findFirst({
      where: {
        status: { in: ['VALIDATED', 'APPROVED', 'PROCESSED'] },
        month: {
          lt: currentMonthBatch?.month || new Date()
        }
      },
      orderBy: { month: 'desc' },
      include: {
        entries: true
      }
    })

    // Calculate current month totals
    const currentTotalSalaries = currentMonthBatch?.entries.reduce((sum, e) => sum + e.grossSalary, 0) || 0
    const currentTotalDeductions = currentMonthBatch?.entries.reduce((sum, e) => sum + e.deductionsTotal, 0) || 0
    const currentTotalAdvances = currentMonthBatch?.entries.reduce((sum, e) => sum + e.loansTotal, 0) || 0
    const currentNetSalaries = currentMonthBatch?.entries.reduce((sum, e) => sum + e.netSalary, 0) || 0

    // Calculate previous month totals
    const previousTotalSalaries = previousMonthBatch?.entries.reduce((sum, e) => sum + e.grossSalary, 0) || 0
    const previousTotalDeductions = previousMonthBatch?.entries.reduce((sum, e) => sum + e.deductionsTotal, 0) || 0
    const previousTotalAdvances = previousMonthBatch?.entries.reduce((sum, e) => sum + e.loansTotal, 0) || 0
    const previousNetSalaries = previousMonthBatch?.entries.reduce((sum, e) => sum + e.netSalary, 0) || 0

    // Calculate percentage changes
    const calculateChange = (current: number, previous: number) => {
      if (previous === 0) return 0
      return Math.round(((current - previous) / previous) * 100 * 10) / 10 // Round to 1 decimal
    }

    const salariesChange = calculateChange(currentTotalSalaries, previousTotalSalaries)
    const deductionsChange = calculateChange(currentTotalDeductions, previousTotalDeductions)
    const advancesChange = calculateChange(currentTotalAdvances, previousTotalAdvances)
    const netChange = calculateChange(currentNetSalaries, previousNetSalaries)

    return NextResponse.json({
      totalSalaries: currentTotalSalaries,
      totalDeductions: currentTotalDeductions,
      totalAdvances: currentTotalAdvances,
      netSalaries: currentNetSalaries,
      changes: {
        salariesChange,
        deductionsChange,
        advancesChange,
        netChange
      }
    })
  } catch (error) {
    console.error('Error fetching KPIs:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
