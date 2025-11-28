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
    const severity = searchParams.get('severity')
    const status = searchParams.get('status')
    const type = searchParams.get('type')

    const where: any = {}

    if (severity && severity.toUpperCase() !== 'ALL') {
      where.severity = severity.toUpperCase()
    }

    if (status) {
      where.status = status.toUpperCase()
    }

    if (type) {
      where.type = type.toUpperCase()
    }

    const alerts = await prisma.alert.findMany({
      where,
      include: {
        employee: {
          select: {
            fullName: true,
            employeeCode: true,
            branch: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 100 // Limit to prevent overwhelming the UI
    })

    const formattedAlerts = alerts.map(alert => {
      // Calculate XP reward based on severity
      let xpReward = 25 // Default for INFO
      if (alert.severity === 'WARNING') xpReward = 50
      if (alert.severity === 'CRITICAL') xpReward = 75

      return {
        id: alert.id.toString(),
        type: alert.type,
        severity: alert.severity.toLowerCase() as 'info' | 'warning' | 'critical',
        title: alert.title,
        description: alert.description,
        employeeName: alert.employee?.fullName || undefined,
        employeeId: alert.employee?.employeeCode || undefined,
        branch: alert.employee?.branch?.name || undefined,
        xpReward,
        resolved: alert.status === 'RESOLVED',
        createdAt: alert.createdAt.toISOString(),
        resolvedAt: alert.resolvedAt?.toISOString()
      }
    })

    return NextResponse.json(formattedAlerts)
  } catch (error) {
    console.error('Error fetching alerts:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
