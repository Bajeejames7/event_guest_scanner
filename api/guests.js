const { getPool } = require('../lib/db');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'GET') return res.status(405).end();

  try {
    const pool = getPool();
    const { rows } = await pool.query(
      'SELECT id, name, email, type, arrived, arrived_at FROM guests ORDER BY name'
    );
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};
