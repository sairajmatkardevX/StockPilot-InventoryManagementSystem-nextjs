import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// TEMPORARY HARCODED FOR DEMO - use same URL as API routes
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: 'postgres://bc426524577fb0f28585900493803037d2bac9c56bf1a2fb74d827635b3f2537:sk_7ou8QqGy5gUvszaFbp5ko@db.prisma.io:5432/postgres?sslmode=require'
    }
  }
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma