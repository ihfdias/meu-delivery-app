import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma.js";
import bcrypt from "bcryptjs";
import z from 'zod';
import { request } from "http";

export async function authRoutes(app: FastifyInstance) {
  
  app.post('/login', async (request, reply) => {    
    
    const loginSchema = z.object({
      email: z.string().email(), 
      password: z.string().min(6) 
    })
    
    const { email, password } = loginSchema.parse(request.body)
    
    const user = await prisma.user.findUnique({
      where: { email }
    })
    
    if (!user) {
      return reply.status(400).send({ message: "Credenciais inválidas" })
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return reply.status(400).send({ message: "Credenciais inválidas" })
    }
    
    const token = app.jwt.sign(
      { name: user.name }, 
      {
        sub: user.id,
        expiresIn: '7d',
      }
    )

    return reply.status(200).send({ token })
  })
}