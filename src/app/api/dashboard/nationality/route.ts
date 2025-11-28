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
    // Group employees by nationality
    const nationalityData = await prisma.employee.groupBy({
      by: ['nationality'],
      where: {
        status: 'ACTIVE',
        nationality: { not: null }
      },
      _count: {
        nationality: true,
      },
      orderBy: {
        _count: {
          nationality: 'desc',
        },
      },
      take: 6 // Top 6 nationalities
    })

    const totalEmployees = await prisma.employee.count({ where: { status: 'ACTIVE' } })

    const distribution = nationalityData.map(data => ({
      name: data.nationality || 'غير محدد',
      value: data._count.nationality,
      percentage: totalEmployees > 0 ? Math.round((data._count.nationality / totalEmployees) * 100) : 0,
    }))

    return NextResponse.json(distribution)
  } catch (error) {
    console.error('Error fetching nationality distribution:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}