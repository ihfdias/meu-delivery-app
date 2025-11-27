import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {  
  await prisma.product.deleteMany()
  await prisma.restaurant.deleteMany()
  await prisma.user.deleteMany()
  
  const passwordHash = await bcrypt.hash('123456', 6)
  
  const user = await prisma.user.create({
    data: {
      name: "Dono do Restaurante",
      email: "dono@teste.com",
      password: passwordHash,
    }
  })
 
  const restaurant = await prisma.restaurant.create({
    data: {
      name: "Fogo de Chão Digital",
      description: "Churrascaria via Wifi",
      address: "Nuvem AWS, Rua Serverless",
      phone: "11999999999",
      managerId: user.id,
    }
  })
  
  await prisma.product.create({
    data: {
      name: "Picanha Byte",
      description: "Suculenta e virtual",
      price: 89.90,
      restaurantId: restaurant.id
    }
  })

  console.log("🌱 Banco de dados semeado com sucesso!")
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })