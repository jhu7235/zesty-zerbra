# API Backend

Fastify-based REST API backend application.

## Development

```bash
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

## API Endpoints

- `GET /health` - Health check endpoint
