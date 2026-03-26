const { Pool } = require('pg');

let pool;

function getPool() {
  if (!pool) {
    // Strip sslmode from the URL so pg doesn't override our ssl config
    const connectionString = (process.env.DATABASE_URL || '').replace('?sslmode=require', '');
    pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      max: 2,
      idleTimeoutMillis: 10000,
      connectionTimeoutMillis: 5000,
    });
  }
  return pool;
}

module.exports = { getPool };
