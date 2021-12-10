import { PrismaClient, Prisma } from '@prisma/client'


const prisma = new PrismaClient();

prisma.$queryRaw(Prisma.sql`SELECT 1`).then(() => {
  console.log("PostgreSQL connected");
})

export default prisma;


