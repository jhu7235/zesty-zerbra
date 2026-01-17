import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DATABASE_URL =
  process.env.DATABASE_URL ||
  `postgres://${process.env.POSTGRES_USER || 'postgres'}:${process.env.POSTGRES_PASSWORD || 'postgres'}@${process.env.POSTGRES_HOST || 'localhost'}:${process.env.POSTGRES_PORT || '5432'}/${process.env.POSTGRES_DB || 'zesty_zerbra'}`;

export async function runMigrations() {
  const { Client } = await import('pg');
  const client = new Client({ 
    connectionString: DATABASE_URL,
    connectionTimeoutMillis: 5000, // 5 second timeout
  });

  try {
    await client.connect();
    console.log('Connected to database');

    // Create migrations table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version VARCHAR(255) PRIMARY KEY,
        applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Get migrations directory
    const migrationsDir = join(__dirname, '../../migrations');
    const files = readdirSync(migrationsDir)
      .filter((file) => file.endsWith('.sql'))
      .sort();

    // Get applied migrations
    const result = await client.query('SELECT version FROM schema_migrations');
    const appliedVersions = new Set(result.rows.map((row) => row.version));

    for (const file of files) {
      const version = file.replace('.sql', '');
      if (appliedVersions.has(version)) {
        console.log(`Skipping ${file} (already applied)`);
        continue;
      }

      console.log(`Running migration: ${file}`);
      const sql = readFileSync(join(migrationsDir, file), 'utf-8');

      await client.query('BEGIN');
      try {
        await client.query(sql);
        await client.query('INSERT INTO schema_migrations (version) VALUES ($1)', [version]);
        await client.query('COMMIT');
        console.log(`✓ Applied ${file}`);
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      }
    }

    console.log('All migrations completed');
  } catch (err) {
    console.error('Migration failed:', err);
    if (err instanceof Error) {
      if (err.message.includes('timeout') || err.message.includes('ECONNREFUSED')) {
        console.error('\n⚠️  Database connection failed. Make sure:');
      }
    }
    throw err;
  } finally {
    await client.end();
  }
}