require('dotenv').config();
const sgMail = require('@sendgrid/mail');
const fs = require('fs');
const path = require('path');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Same list as generate-qr.js — keep them in sync
const guests = [
  { id: 'g-001', name: 'Alice Smith',  email: 'alice@example.com' },
  { id: 'g-002', name: 'Bob Jones',    email: 'bob@example.com' },
  { id: 'g-003', name: 'Carol White',  email: 'carol@example.com' },
  { id: 'g-004', name: 'David Brown',  email: 'david@example.com' },
  { id: 'g-005', name: 'Eva Green',    email: 'eva@example.com' },
];

(async () => {
  for (const guest of guests) {
    const qrPath = path.join(__dirname, '../qr-codes', `${guest.id}.png`);
    if (!fs.existsSync(qrPath)) {
      console.warn(`QR not found for ${guest.name}, skipping. Run generate-qr.js first.`);
      continue;
    }

    const qrBase64 = fs.readFileSync(qrPath).toString('base64');

    const msg = {
      to:   guest.email,
      from: process.env.FROM_EMAIL,
      subject: 'Your Event Ticket & QR Code',
      html: `
        <p>Hi ${guest.name},</p>
        <p>Please present the QR code below at the entrance.</p>
        <img src="cid:qrcode" alt="QR Code" style="width:200px" />
        <p>See you there!</p>
      `,
      attachments: [{
        content:     qrBase64,
        filename:    'ticket.png',
        type:        'image/png',
        disposition: 'inline',
        content_id:  'qrcode',
      }],
    };

    try {
      await sgMail.send(msg);
      console.log(`Sent to ${guest.name} <${guest.email}>`);
    } catch (err) {
      console.error(`Failed for ${guest.name}:`, err.message);
    }
  }
  console.log('Done.');
})();
