export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'

// Helper function to calculate level and progress
const calculateLevel = (totalXp: number) => {
  // Level formula: Each level requires progressively more XP
  // Level 1: 0-100 XP
  // Level 2: 100-250 XP (150 more)
  // Level 3: 250-450 XP (200 more)
  // Level 4: 450-700 XP (250 more)
  // Formula: nextLevelXP = 100 + (level * 50)
  
  let level = 1
  let xpForLevel = 0
  let xpForNextLevel = 100
  
  while (totalXp >= xpForLevel + xpForNextLevel) {
    xpForLevel += xpForNextLevel
    level++
    xpForNextLevel = 100 + (level * 50)
  }
  
  const currentLevelXP = totalXp - xpForLevel
  const nextLevelXP = xpForNextLevel
  const progress = Math.round((currentLevelXP / nextLevelXP) * 100)
  
  return {
    level,
    xp: totalXp,
    currentLevelXP,
    nextLevelXP,
    progress: Math.min(100, progress)
  }
}

export async function GET(req: Request) {
  const session = await auth()
  
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = parseInt(session.user.id)

  try {
    // Sum all XP points for this user
    const totalXpResult = await prisma.xpEvent.aggregate({
      _sum: { xpPoints: true },
      where: { userId: userId },
    })

    const totalXp = totalXpResult._sum.xpPoints || 0
    const levelInfo = calculateLevel(totalXp)

    // Get recent XP events for activity log (optional)
    const recentEvents = await prisma.xpEvent.findMany({
      where: { userId: userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        relatedEmployee: {
          select: {
            fullName: true,
            employeeCode: true
          }
        }
      }
    })

    return NextResponse.json({
      ...levelInfo,
      recentEvents: recentEvents.map(event => ({
        id: event.id,
        type: event.eventType,
        xpPoints: event.xpPoints,
        employeeName: event.relatedEmployee?.fullName,
        createdAt: event.createdAt.toISOString()
      }))
    })
  } catch (error) {
    console.error('Error fetching XP data:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}