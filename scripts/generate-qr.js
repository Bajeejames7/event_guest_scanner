require('dotenv').config();
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

// Edit this list or load from a CSV/JSON file
const guests = [
  { id: 'g-001', name: 'Alice Smith' },
  { id: 'g-002', name: 'Bob Jones' },
  { id: 'g-003', name: 'Carol White' },
  { id: 'g-004', name: 'David Brown' },
  { id: 'g-005', name: 'Eva Green' },
];

const outDir = path.join(__dirname, '../qr-codes');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

(async () => {
  for (const guest of guests) {
    const file = path.join(outDir, `${guest.id}.png`);
    await QRCode.toFile(file, guest.id, {
      width: 300,
      margin: 2,
      color: { dark: '#000000', light: '#ffffff' },
    });
    console.log(`Generated: ${guest.name} → ${file}`);
  }
  console.log('Done. QR codes saved to /qr-codes/');
})();
