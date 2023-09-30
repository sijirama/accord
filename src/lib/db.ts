import { PrismaClient } from "@prisma/client"

declare global {
    var prisma: PrismaClient | undefined
}

export const db = globalThis.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
    globalThis.prisma = db
}

// The idea here is to reuse an existing prisma instance if it has already been created to avoid creating multiple database connections.
