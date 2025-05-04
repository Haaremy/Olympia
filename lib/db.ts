// lib/db.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['error', 'warn'], // More helpful in production
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Add connection verification
prisma.$connect().then(() => {
  console.log('Prisma connected successfully')
}).catch((err) => {
  console.error('Prisma connection error:', err)
})