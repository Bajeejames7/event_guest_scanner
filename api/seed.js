const { getPool } = require('../lib/db');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'POST') return res.status(405).end();

  if (req.headers['x-seed-secret'] !== process.env.SEED_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const pool = getPool();

    await pool.query(`
      CREATE TABLE IF NOT EXISTS guests (
        id         VARCHAR(36)  PRIMARY KEY,
        name       VARCHAR(255) NOT NULL,
        email      VARCHAR(255),
        type       VARCHAR(10)  DEFAULT 'regular',
        arrived    BOOLEAN      DEFAULT false,
        arrived_at TIMESTAMP    DEFAULT NULL
      )
    `);

    const sample = [
      ['g-001', 'Alice Smith',  'alice@example.com',  'vip'],
      ['g-002', 'Bob Jones',    'bob@example.com',    'regular'],
      ['g-003', 'Carol White',  'carol@example.com',  'vip'],
      ['g-004', 'David Brown',  'david@example.com',  'regular'],
      ['g-005', 'Eva Green',    'eva@example.com',    'regular'],
    ];

    for (const [id, name, email, type] of sample) {
      await pool.query(
        `INSERT INTO guests (id, name, email, type)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (id) DO NOTHING`,
        [id, name, email, type]
      );
    }

    res.status(200).json({ message: 'DB seeded', count: sample.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
