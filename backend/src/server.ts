import Fastify from 'fastify';
import cors from '@fastify/cors';

const app = Fastify({
    logger: true
});

app.register(cors, {
    origin: true
});

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