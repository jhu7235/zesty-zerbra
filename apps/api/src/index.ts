import Fastify from 'fastify';
import { healthRoutes } from './routes/health.js';

const server = Fastify({
  logger: true,
});

const PORT = Number(process.env.PORT) || 3001;
const HOST = process.env.HOST || '0.0.0.0';

async function start() {
  try {
    await server.register(healthRoutes);

    await server.listen({ port: PORT, host: HOST });
    server.log.info(`Server listening on http://${HOST}:${PORT}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

start();
