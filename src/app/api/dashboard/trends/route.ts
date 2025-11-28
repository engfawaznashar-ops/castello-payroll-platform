import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(req: Request) {
  const session = await auth()
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Get last 12 months of payroll batches
    const batches = await prisma.payrollBatch.findMany({
      where: {
        status: { in: ['VALIDATED', 'APPROVED', 'PROCESSED'] }
      },
      include: {
        entries: true
      },
      orderBy: { month: 'desc' },
      take: 12
    })

    // Format data for charts
    const trends = batches.reverse().map(batch => {
      const totalSalaries = batch.entries.reduce((sum, e) => sum + e.grossSalary, 0)
      const totalDeductions = batch.entries.reduce((sum, e) => sum + e.deductionsTotal, 0)
      const netSalaries = batch.entries.reduce((sum, e) => sum + e.netSalary, 0)

      return {
        month: batch.month.toLocaleDateString('ar-SA', { month: 'short', year: 'numeric' }),
        totalSalaries,
        netSalaries,
        deductions: totalDeductions
      }
    })

    return NextResponse.json(trends)
  } catch (error) {
    console.error('Error fetching monthly trends:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}