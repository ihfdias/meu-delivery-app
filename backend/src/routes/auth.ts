import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma.js";
import bcrypt from "bcryptjs";
import z from 'zod';
import { request } from "http";

export async function authRoutes(app: FastifyInstance) {
    app.post('/login', async (request, reply) =>{

        const { email, password } = request.body as any
        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            return reply.status(400).send({ message: "Credenciais inválidas" })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        
        if (!isPasswordValid) {
            return reply.status(400).send({ message: "Credenciais inválidas"})
        }

        const token = app.jwt.sign(
            {
                name: user.name,
            },
            {
                sub: user.id,
                expiresIn: '7d',
            }
        )

        return reply.status(200).send({ token })
    })
}