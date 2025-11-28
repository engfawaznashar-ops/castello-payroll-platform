import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Log database URL for debugging (hide password)
const dbUrl = process.env.DATABASE_URL
if (dbUrl) {
  const maskedUrl = dbUrl.replace(/:([^@]+)@/, ':****@')
  console.log('[Prisma] Database URL configured:', maskedUrl)
} else {
  console.error('[Prisma] DATABASE_URL is not set!')
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'error', 'warn'] 
    : ['error', 'warn'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Test connection on startup
prisma.$connect()
  .then(() => {
    console.log('[Prisma] Successfully connected to database')
  })
  .catch((error) => {
    console.error('[Prisma] Failed to connect to database:', error)
  })

// Default export for easier imports
export default prisma

