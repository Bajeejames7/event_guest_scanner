const { getPool } = require('../lib/db');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { id } = req.body || {};
  if (!id) return res.status(400).json({ error: 'Missing guest id' });

  try {
    const pool = getPool();
    const { rows } = await pool.query('SELECT * FROM guests WHERE id = $1', [id]);
    if (!rows.length) return res.status(404).json({ error: 'Guest not found' });

    const guest = rows[0];
    if (guest.arrived) {
      return res.status(200).json({ status: 'already_checked_in', guest });
    }

    await pool.query(
      'UPDATE guests SET arrived = true, arrived_at = NOW() WHERE id = $1',
      [id]
    );
    guest.arrived = true;
    guest.arrived_at = new Date();
    return res.status(200).json({ status: 'checked_in', guest });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};
