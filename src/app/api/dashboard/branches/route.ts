import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'

export const GET = auth(async (req) => {
  if (!req.auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Get all active branches with their employees
    const branches = await prisma.branch.findMany({
      where: {
        status: 'ACTIVE'
      },
      include: {
        employees: {
          where: {
            status: 'ACTIVE'
          },
          select: {
            basicSalary: true,
          },
        },
      },
      orderBy: { name: 'asc' }
    })

    const branchSalaries = branches.map(branch => ({
      branch: branch.name,
      totalSalary: branch.employees.reduce((sum, emp) => sum + (emp.basicSalary || 0), 0),
      employeeCount: branch.employees.length
    }))

    return NextResponse.json(branchSalaries)
  } catch (error) {
    console.error('Error fetching branch salaries:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
})
