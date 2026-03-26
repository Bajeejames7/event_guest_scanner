const crypto = require('crypto');

const SECRET = process.env.QR_SECRET || 'dev-secret-change-me';

// Generate a stable 7-char alphanumeric code for a guest id
function guestCode(guestId) {
  return crypto.createHmac('sha256', SECRET)
    .update(guestId)
    .digest('base64')
    .replace(/[^A-Z0-9]/gi, '')
    .substring(0, 7)
    .toUpperCase();
}

// Create a signed QR token: "id|sig" where sig = first 12 chars of HMAC
function signToken(guestId) {
  const sig = crypto.createHmac('sha256', SECRET)
    .update(guestId)
    .digest('hex')
    .substring(0, 12);
  return `${guestId}|${sig}`;
}

// Verify a scanned token, returns guestId or null
function verifyToken(token) {
  const parts = (token || '').split('|');
  if (parts.length !== 2) return null;
  const [guestId, sig] = parts;
  const expected = crypto.createHmac('sha256', SECRET)
    .update(guestId)
    .digest('hex')
    .substring(0, 12);
  return sig === expected ? guestId : null;
}

module.exports = { guestCode, signToken, verifyToken };
