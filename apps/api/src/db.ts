import { FastifyInstance } from "fastify";
import postgres from '@fastify/postgres';

const PASSWORD = process.env.POSTGRES_PASSWORD || 'postgres';
const HOST = process.env.POSTGRES_HOST || 'localhost';
const PORT = process.env.POSTGRES_PORT || '5432';
const NAME = process.env.POSTGRES_DB || 'zesty_zerbra';
const USER = process.env.POSTGRES_USER || 'postgres';

const DATABASE_URL =
  process.env.DATABASE_URL ||
  `postgres://${USER}:${PASSWORD}@${HOST}:${PORT}/${NAME}`;

export async function registerDb(server: FastifyInstance) {
    await server.register(postgres, {
        connectionString: DATABASE_URL,
      });
}