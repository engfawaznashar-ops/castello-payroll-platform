export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = parseInt(session.user.id)
  const alertId = parseInt(params.id)

  try {
    // Fetch the alert first to calculate XP
    const alert = await prisma.alert.findUnique({
      where: { id: alertId },
      include: {
        employee: true
      }
    })

    if (!alert) {
      return NextResponse.json({ error: 'Alert not found' }, { status: 404 })
    }

    if (alert.status === 'RESOLVED') {
      return NextResponse.json({ error: 'Alert already resolved' }, { status: 400 })
    }

    // Calculate XP based on severity
    let xpGained = 25 // INFO
    if (alert.severity === 'WARNING') xpGained = 50
    if (alert.severity === 'CRITICAL') xpGained = 75

    // Update alert as resolved
    const updatedAlert = await prisma.alert.update({
      where: { id: alertId },
      data: {
        status: 'RESOLVED',
        resolvedAt: new Date(),
        resolvedById: userId,
      },
    })

    // Create XP event
    await prisma.xpEvent.create({
      data: {
        userId: userId,
        eventType: 'FIXED_ALERT',
        xpPoints: xpGained,
        relatedEmployeeId: alert.employeeId,
      },
    })

    return NextResponse.json({
      success: true,
      xpGained,
      alert: {
        id: updatedAlert.id.toString(),
        status: updatedAlert.status,
        resolvedAt: updatedAlert.resolvedAt?.toISOString()
      }
    })
  } catch (error) {
    console.error(`Error resolving alert ${alertId}:`, error)
    return NextResponse.json({ error: 'Failed to resolve alert' }, { status: 500 })
  }
}
