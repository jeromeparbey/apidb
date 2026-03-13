import bcrypt from "bcrypt"
import { prisma } from "../src/lib/prisma"




async function main() {

  const adminPassword = await bcrypt.hash("Admin123!", 10)
  const userPassword = await bcrypt.hash("User123!", 10)

  await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@gmail.com",
      password: adminPassword,
      role: "ADMIN"
    }
  })

  await prisma.user.create({
    data: {
      name: "User",
      email: "user@gmail.com",
      password: userPassword,
      role: "USER"
    }
  })

  console.log("Seed terminé ")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
