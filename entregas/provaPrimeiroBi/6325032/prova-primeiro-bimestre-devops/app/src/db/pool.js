const { Pool } = require('pg');

const useSsl = process.env.PGSSL === 'true';

const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: useSsl ? { rejectUnauthorized: false } : false,
      }
    : {
        host: process.env.PGHOST || 'db',
        port: Number(process.env.PGPORT) || 5432,
        user: process.env.PGUSER || 'postgres',
        password: process.env.PGPASSWORD || 'postgres',
        database: process.env.PGDATABASE || 'reservas',
        ssl: useSsl ? { rejectUnauthorized: false } : undefined,
      }
);

// Cria a tabela na subida da aplicação, se ainda não existir.
async function initSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS reservas (
      id SERIAL PRIMARY KEY,
      cliente VARCHAR(255) NOT NULL,
      data DATE NOT NULL,
      status VARCHAR(50) NOT NULL DEFAULT 'pendente',
      criado_em TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);
}

module.exports = { pool, initSchema };
