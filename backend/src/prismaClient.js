const { PrismaClient } = require('@prisma/client');

// Singleton pattern — reuse the same Prisma client instance across the app
const prisma = new PrismaClient();

module.exports = prisma;
