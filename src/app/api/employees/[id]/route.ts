import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'

export const GET = auth(async (req, { params }: { params: { id: string } }) => {
  if (!req.auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const employee = await prisma.employee.findFirst({
      where: { 
        OR: [
          { employeeCode: params.id },
          { id: parseInt(params.id) || 0 }
        ]
      },
      include: {
        branch: true,
        documents: {
          orderBy: { createdAt: 'desc' }
        },
        payrollEntries: {
          include: {
            batch: true
          },
          orderBy: { createdAt: 'desc' },
          take: 6
        }
      }
    })

    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 })
    }

    // Fetch alerts for this employee
    const alerts = await prisma.alert.findMany({
      where: { 
        employeeId: employee.id,
        status: 'OPEN'
      },
      orderBy: { createdAt: 'desc' }
    })

    const completedDocs = employee.documents.filter(d => d.status === 'VALID').length
    const totalDocs = employee.documents.filter(d => d.isRequired).length
    const completionPercentage = totalDocs > 0 ? Math.round((completedDocs / totalDocs) * 100) : 0

    const latestEntry = employee.payrollEntries[0]

    // Generate avatar URL using UI Avatars service
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.fullName)}&background=C62828&color=fff&size=200&font-size=0.4&bold=true`

    const formattedEmployee = {
      id: employee.employeeCode,
      name: employee.fullName,
      email: `${employee.employeeCode.toLowerCase()}@castello.com`,
      avatar: avatarUrl,
      branch: employee.branch?.name || 'غير محدد',
      branchCity: employee.branch?.city || '',
      nationality: employee.nationality || 'غير محدد',
      iqamaNumber: employee.iqamaNumber || 'غير متوفر',
      position: 'موظف',
      hireDate: employee.hireDate?.toISOString() || new Date().toISOString(),
      baseSalary: employee.basicSalary || 0,
      allowances: 0, // Calculate from payroll if needed
      deductions: latestEntry?.deductionsTotal || 0,
      netSalary: latestEntry?.netSalary || (employee.basicSalary || 0),
      bankAccount: employee.bankAccount || 'غير متوفر',
      completionPercentage,
      status: employee.status,
      documents: employee.documents.map(doc => ({
        id: doc.id.toString(),
        type: doc.documentType,
        name: doc.documentType,
        status: doc.status.toLowerCase() as 'valid' | 'expiring' | 'expired' | 'missing',
        issueDate: doc.issueDate?.toISOString(),
        expiryDate: doc.expiryDate?.toISOString(),
        fileUrl: doc.fileUrl
      })),
      payrollHistory: employee.payrollEntries.map(entry => ({
        month: entry.batch.month.toLocaleDateString('ar-SA', { year: 'numeric', month: 'long' }),
        gross: entry.grossSalary,
        deductions: entry.deductionsTotal,
        net: entry.netSalary
      })),
      alerts: alerts.map(alert => ({
        id: alert.id.toString(),
        type: alert.type,
        severity: alert.severity.toLowerCase() as 'info' | 'warning' | 'critical',
        title: alert.title,
        description: alert.description,
        employeeName: employee.fullName,
        employeeId: employee.employeeCode,
        xpReward: alert.severity === 'CRITICAL' ? 75 : alert.severity === 'WARNING' ? 50 : 25,
        resolved: alert.status === 'RESOLVED',
        createdAt: alert.createdAt.toISOString(),
        resolvedAt: alert.resolvedAt?.toISOString()
      }))
    }

    return NextResponse.json(formattedEmployee)
  } catch (error) {
    console.error('Error fetching employee:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
})
