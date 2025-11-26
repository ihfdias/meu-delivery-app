import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma.js'
import z from 'zod'

export async function restaurantsRoutes(app: FastifyInstance) {  
    
    app.get('/restaurants', async (request, reply) => {      
      const restaurants = await prisma.restaurant.findMany()

      return reply.status(200).send(restaurants)
    })
    
    app.post('/restaurants', async (request, reply) => {
      
      try {
        await request.jwtVerify()
      } catch (err) {
        return reply.status(401).send({ message: "Você precisa estar logado!" })
      }

      const restaurantSchema = z.object({
        name: z.string(),
        description: z.string().optional(),
        address: z.string(),
        phone: z.string(),
      })

      const { name, description, address, phone } = restaurantSchema.parse(request.body)

      const userId = request.user.sub

      const restaurant = await prisma.restaurant.create({
        data: {
          name,
          description,
          address,
          phone,
          managerId: userId,
        }
      })

      return reply.status(201).send(restaurant)
    })
  }