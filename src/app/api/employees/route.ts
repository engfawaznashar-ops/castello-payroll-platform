import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(req: Request) {
  const session = await auth()
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {

    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || ''
    const branch = searchParams.get('branch') || ''
    const nationality = searchParams.get('nationality') || ''

    const where: any = {
      status: 'ACTIVE'
    }

    if (search) {
      where.OR = [
        { fullName: { contains: search } },
        { employeeCode: { contains: search } },
        { iqamaNumber: { contains: search } }
      ]
    }

    if (branch) {
      where.branch = { name: branch }
    }

    if (nationality) {
      where.nationality = nationality
    }

    const employees = await prisma.employee.findMany({
      where,
      include: {
        branch: true,
        documents: true,
        payrollEntries: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { fullName: 'asc' }
    })

    const formattedEmployees = employees.map(emp => {
      const latestEntry = emp.payrollEntries[0]
      const completedDocs = emp.documents.filter(d => d.status === 'VALID').length
      const totalDocs = emp.documents.filter(d => d.isRequired).length
      const completionPercentage = totalDocs > 0 ? Math.round((completedDocs / totalDocs) * 100) : 0

      // Generate avatar URL using UI Avatars service
      const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.fullName)}&background=C62828&color=fff&size=128&font-size=0.4&bold=true`

      return {
        id: emp.employeeCode,
        name: emp.fullName,
        email: `${emp.employeeCode.toLowerCase()}@castello.com`,
        avatar: avatarUrl,
        branch: emp.branch?.name || 'غير محدد',
        nationality: emp.nationality || 'غير محدد',
        iqamaNumber: emp.iqamaNumber || 'غير متوفر',
        salary: emp.basicSalary || 0,
        advances: latestEntry?.loansTotal || 0,
        deductions: latestEntry?.deductionsTotal || 0,
        netSalary: latestEntry?.netSalary || (emp.basicSalary || 0),
        bankAccount: emp.bankAccount || 'غير متوفر',
        completionPercentage
      }
    })

    return NextResponse.json(formattedEmployees)
  } catch (error) {
    console.error('Error fetching employees:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}