const { Client } = require('pg');

// For serverless — create a fresh client per request, not a pool
async function getClient() {
  const connectionString = (process.env.DATABASE_URL || '').replace('?sslmode=require', '');
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();
  return client;
}

module.exports = { getClient };
