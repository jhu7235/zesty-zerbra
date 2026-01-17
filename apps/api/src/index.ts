import Fastify from 'fastify';
import cors from '@fastify/cors';
import { usersRoutes } from './routes/users.js';
import { registerDb } from './db.js';
import { runMigrations } from './migrations/runMigrations.js';

const server = Fastify({
  logger: true,
});

const PORT = Number(process.env.PORT) || 7235;
const HOST = process.env.HOST || '0.0.0.0';


async function start() {
  try {
    server.log.info('Starting server...');
    
    // Register CORS
    await server.register(cors, {
      origin: true, // Allow all origins in development
      credentials: true,
    });

    server.log.info('Connecting to database...');
    await registerDb(server);
    
    server.log.info('Running migrations...');
    await runMigrations();

    server.log.info('Registering routes...');
    await server.register(usersRoutes);

    await server.listen({ port: PORT, host: HOST });
    server.log.info(`Server listening on http://${HOST}:${PORT}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

start();
