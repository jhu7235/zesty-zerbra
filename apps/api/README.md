# API Backend

Fastify-based REST API backend application with Postgres database.

## Database Setup

Start the Postgres database using Docker Compose:

```bash
# From the repository root
docker-compose up -d
```

This will start a Postgres 16 container on port 5432 with the following defaults:
- User: `postgres`
- Password: `postgres`
- Database: `zesty_zerbra`

To stop the database:

```bash
docker-compose down
```

To stop and remove all data:

```bash
docker-compose down -v
```

## Development

1. Start the database (if not already running):
   ```bash
   docker-compose up -d
   ```

2. Create a `.env` file in `apps/api/` with database configuration:
   ```env
   DATABASE_URL=postgres://postgres:postgres@localhost:5432/zesty_zerbra
   PORT=3001
   HOST=0.0.0.0
   ```

3. Install dependencies and start the development server:
   ```bash
   pnpm install
   pnpm dev
   ```

Starts the development server with hot reload on port 3001 (or PORT environment variable).

## Build

```bash
pnpm build
```

Compiles TypeScript to JavaScript in the `dist/` directory.

## Start Production

```bash
pnpm start
```

Runs the compiled production build.

## Environment Variables

- `PORT` - Server port (default: 3001)
- `HOST` - Server host (default: 0.0.0.0)
- `DATABASE_URL` - Full Postgres connection string (takes precedence over individual params)
- `POSTGRES_USER` - Database user (default: postgres)
- `POSTGRES_PASSWORD` - Database password (default: postgres)
- `POSTGRES_HOST` - Database host (default: localhost)
- `POSTGRES_PORT` - Database port (default: 5432)
- `POSTGRES_DB` - Database name (default: zesty_zerbra)

## API Endpoints

- `GET /health` - Health check endpoint (includes database connection status)
