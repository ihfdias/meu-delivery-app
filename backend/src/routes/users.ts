import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma.js";
import bcrypt from "bcryptjs";

export async function userRoutes(app: FastifyInstance) {
    app.post('/users', async (request, reply) => {
        const { name, email, password } = request.body as any
        const passwordHash = await bcrypt.hash(password, 6)

        try {
            const user = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: passwordHash,
                }
            })
            return reply.status(201).send({
                id: user.id,
                name: user.name,
                email: user.email,
            })
        } catch (error) {            
            return reply.status(409).send({ message: "Erro ao criar usuário. Email já existe?"})
        }
    })
}