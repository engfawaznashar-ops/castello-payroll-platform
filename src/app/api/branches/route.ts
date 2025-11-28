export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth-helpers'

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const branches = await prisma.branch.findMany({
      where: { status: 'ACTIVE' },
      include: {
        _count: {
          select: { employees: true }
        }
      },
      orderBy: { name: 'asc' }
    })

    const formattedBranches = branches.map(branch => ({
      id: branch.id,
      name: branch.name,
      city: branch.city,
      employeeCount: branch._count.employees,
      status: branch.status
    }))

    return NextResponse.json(formattedBranches)
  } catch (error) {
    console.error('Error fetching branches:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}


