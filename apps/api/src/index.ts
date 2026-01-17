import Fastify from 'fastify';
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
    await registerDb(server);
    await runMigrations();

    await server.register(usersRoutes);

    await server.listen({ port: PORT, host: HOST });
    server.log.info(`Server listening on http://${HOST}:${PORT}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

start();
