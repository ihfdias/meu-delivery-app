import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import { userRoutes } from './routes/users.js';
import { authRoutes } from './routes/auth.js';
import { restaurantsRoutes } from './routes/restaurants.ts';

const app = Fastify({
    logger: true
});

app.register(cors, {
    origin: true
});

app.register(jwt, {
    secret: process.env.JWT_SECRET || 'supersecret'
});

app.register(userRoutes);
app.register(authRoutes);
app.register(restaurantsRoutes);

app.get('/', async (request, reply) => {
    return { mensagem: "Bem-vindo à API do Clone do iFood!"};
});

const start = async () => {
    try {
        await app.listen({ port: 3333, host: '0.0.0.0'});
        console.log('Servidor rodando no ar!');
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

start();