const { getClient } = require('../lib/db');
const { verifyToken } = require('../lib/tokens');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { token, code } = req.body || {};

  const client = await getClient();
  try {
    let guestId = null;

    if (token) {
      // Try signed token first, fall back to extracting just the ID part
      guestId = verifyToken(token);
      if (!guestId) {
        // Token format is "id|signature" — extract just the id
        guestId = token.includes('|') ? token.split('|')[0].trim() : token.trim();
      }
      console.log('RAW TOKEN:', JSON.stringify(token));
      console.log('EXTRACTED ID:', guestId);
    } else if (code) {
      const { rows } = await client.query('SELECT id FROM guests WHERE code = $1', [code.toUpperCase()]);
      if (!rows.length) return res.status(404).json({ error: 'Code not found' });
      guestId = rows[0].id;
    } else {
      return res.status(400).json({ error: 'Provide token or code' });
    }

    const { rows } = await client.query('SELECT * FROM guests WHERE id = $1', [guestId]);
    if (!rows.length) return res.status(404).json({ error: 'Guest not found' });

    const guest = rows[0];
    if (guest.arrived) {
      return res.status(200).json({ status: 'already_checked_in', guest });
    }

    await client.query('UPDATE guests SET arrived = true, arrived_at = NOW() WHERE id = $1', [guestId]);
    guest.arrived = true;
    guest.arrived_at = new Date();
    return res.status(200).json({ status: 'checked_in', guest });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  } finally {
    await client.end();
  }
};
