import bcrypt from "bcrypt"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const createAdmin = async () => {
  const passwordHash = await bcrypt.hash("Admin123!", 10)
  const admin = await prisma.user.create({
    data: {
      email: "admin@example.com",
      passwordHash,
      role: "ADMIN",
    },
  })
  console.log("Admin created:", admin)
}

createAdmin()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect())