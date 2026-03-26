require('dotenv').config();
const QRCode = require('qrcode');
const Jimp = require('jimp');
const fs = require('fs');
const path = require('path');
const { guestCode, signToken } = require('../lib/tokens');

const guests = [
  { id: 'g-116', name: 'James Bajee' },
  { id: 'g-001', name: 'Fuad Abdi' },
  { id: 'g-002', name: 'Dr. Johnson Mwangi' },
  { id: 'g-003', name: 'Mrs. Florence Kinuthia' },
  { id: 'g-004', name: 'Daniel Mwangi Kinuthia' },
  { id: 'g-005', name: 'Ruth Mwouria' },
  { id: 'g-006', name: 'Shadrack Njoroge' },
  { id: 'g-007', name: 'Cornelius Nyangres' },
  { id: 'g-008', name: 'Redempter Mwongeli' },
  { id: 'g-009', name: 'Suzan Nyatega' },
  { id: 'g-010', name: 'Catherine Wambui' },
  { id: 'g-011', name: 'Pamela Keen' },
  { id: 'g-012', name: 'Dharmesh Savla' },
  { id: 'g-013', name: 'Mr. Samuel Irungu' },
  { id: 'g-014', name: 'Dr. Destaings Nyongesa' },
  { id: 'g-015', name: 'Charles Lenjo Mwazighe' },
  { id: 'g-016', name: 'Steve Waudo' },
  { id: 'g-017', name: 'Grace Major' },
  { id: 'g-018', name: 'George Adalla' },
  { id: 'g-019', name: 'Jocelyn Omusembe' },
  { id: 'g-020', name: 'Maurice Nandwa' },
  { id: 'g-021', name: 'PEL Catherine Salt Div' },
  { id: 'g-022', name: 'Doreen Daria Marube' },
  { id: 'g-023', name: 'Wangu Mathu' },
  { id: 'g-024', name: 'William Mathu' },
  { id: 'g-025', name: 'Claudius Chepkemoi' },
  { id: 'g-026', name: 'Shafana Kanani' },
  { id: 'g-027', name: 'Rizwan Kanani' },
  { id: 'g-028', name: 'Hellen Nyokabi' },
  { id: 'g-029', name: 'S Mboyano' },
  { id: 'g-030', name: 'Peace Wambua' },
  { id: 'g-031', name: 'Dorothy Wambua' },
  { id: 'g-032', name: 'Daniel Wambua' },
  { id: 'g-033', name: 'Susan Gitau' },
  { id: 'g-034', name: 'Jareth Kinyanjui' },
  { id: 'g-035', name: 'Onesmus Kevin' },
  { id: 'g-036', name: 'Martin Mogusu' },
  { id: 'g-037', name: 'Rachael Mogusu' },
  { id: 'g-038', name: 'Ashina Wanga' },
  { id: 'g-039', name: 'Osborne Wanyoike' },
  { id: 'g-040', name: 'Anastasia Kibutu' },
  { id: 'g-041', name: 'Angela Mueni Munyasya' },
  { id: 'g-042', name: 'Annette Khasandi Wanyoike' },
  { id: 'g-043', name: 'Melanie Maina' },
  { id: 'g-044', name: 'Zuri Hedaya Monari' },
  { id: 'g-045', name: 'Albert Kioko' },
  { id: 'g-046', name: 'Brian Kintei' },
  { id: 'g-047', name: 'Jean Munga' },
  { id: 'g-048', name: 'Anita Mutula' },
  { id: 'g-049', name: 'Brenda Nzula Mutua' },
  { id: 'g-050', name: 'Christine Katunge Kitale' },
  { id: 'g-051', name: 'Ann Mumbua' },
  { id: 'g-052', name: 'Peter Mogere' },
  { id: 'g-053', name: 'Njeri Wanjau' },
  { id: 'g-054', name: 'Jane Mukabi' },
  { id: 'g-055', name: 'Ava Njeri Goro' },
  { id: 'g-056', name: 'Florence Mwithaga Minua' },
  { id: 'g-057', name: 'Margaret Njeri Maina' },
  { id: 'g-058', name: 'Margaret Wagio Minua' },
  { id: 'g-059', name: 'Ruth Wanjiru Minua' },
  { id: 'g-060', name: 'Rose Wanjiru Kanyugi' },
  { id: 'g-061', name: 'Assumpta Ndunge' },
  { id: 'g-062', name: 'Mr. Musika Raymond' },
  { id: 'g-063', name: 'Jane Waithira' },
  { id: 'g-064', name: 'Rosemary Muringi' },
  { id: 'g-065', name: 'Ronny Gichuki' },
  { id: 'g-066', name: 'Esther Wangombe' },
  { id: 'g-067', name: 'Wanjohi Wangombe' },
  { id: 'g-068', name: 'Leonard Lihanda' },
  { id: 'g-069', name: 'John Keverenge' },
  { id: 'g-070', name: 'Shadrack Mugazia' },
  { id: 'g-071', name: 'Abdullahi Bashir' },
  { id: 'g-072', name: 'Jason Tevin' },
  { id: 'g-073', name: 'Angela Ariko' },
  { id: 'g-074', name: 'Nyanchama Ogoti' },
  { id: 'g-075', name: 'Schola Wangeci' },
  { id: 'g-076', name: 'Sarah Kaminchia' },
  { id: 'g-077', name: 'Rose Ayuma' },
  { id: 'g-078', name: 'Monica Achieng Omondi' },
  { id: 'g-079', name: 'Edith Onyango' },
  { id: 'g-080', name: 'David Musyoki' },
  { id: 'g-081', name: 'Kenneth Gatheca' },
  { id: 'g-082', name: 'Lillian Oluoch' },
  { id: 'g-083', name: 'Merina Adhiaya' },
  { id: 'g-084', name: 'Selina Lwaki' },
  { id: 'g-085', name: 'Mr. George Wadegu' },
  { id: 'g-086', name: 'Andrew Wambua' },
  { id: 'g-087', name: 'Charles N Mwania' },
  { id: 'g-088', name: 'Shalney Sirintai' },
  { id: 'g-089', name: 'Sylvia Mantaine Kamoye' },
  { id: 'g-090', name: 'Estther Kithuku' },
  { id: 'g-091', name: 'Dr. Daniel Muindi' },
  { id: 'g-092', name: 'Mrs. Winnie Muindi' },
  { id: 'g-093', name: 'Prof. Kyallo Wamitila' },
  { id: 'g-094', name: 'Dr. Florence Muthiani' },
  { id: 'g-095', name: 'Victoria Mutile Kithuku' },
  { id: 'g-096', name: 'John Kibet' },
  { id: 'g-097', name: 'Steve Tele' },
  { id: 'g-098', name: 'Audrey Achieng' },
  { id: 'g-099', name: 'Kenneth Kiura Njora' },
  { id: 'g-100', name: 'Christine Katunge Kitale (2)' },
  { id: 'g-101', name: 'Grace Kiyuka' },
  { id: 'g-102', name: 'Caroline Mutuota' },
  { id: 'g-103', name: 'Clinton' },
  { id: 'g-104', name: 'Rosemary Baraza' },
  { id: 'g-105', name: 'Alice Wahome' },
  { id: 'g-106', name: 'Levis Njiru' },
  { id: 'g-107', name: 'Rosie Mueni' },
  { id: 'g-108', name: 'Divinah Moragwa' },
  { id: 'g-109', name: 'Edwin Binale' },
  { id: 'g-110', name: 'Cindy Mutuota' },
  { id: 'g-111', name: 'Rosebella Onyango' },
  { id: 'g-112', name: 'Caroline Kangogo' },
  { id: 'g-113', name: 'Veronica Maina' },
  { id: 'g-114', name: 'Moses Nderitu' },
  { id: 'g-115', name: 'Nicole Muthoni' },
];

const outDir = path.join(__dirname, '../qr-codes');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

const QR_SIZE = 400;

(async () => {
  const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
  const fontSmall = await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);

  for (const guest of guests) {
    const code = guestCode(guest.id);
    const token = signToken(guest.id);
    const safeName = guest.name.replace(/[^a-zA-Z0-9]/g, '_');
    const file = path.join(outDir, `${guest.id}_${safeName}.png`);

    // Generate QR as buffer
    const qrBuffer = await QRCode.toBuffer(token, {
      width: QR_SIZE, margin: 2,
      color: { dark: '#000000', light: '#ffffff' },
    });

    // Load QR into Jimp
    const qrImg = await Jimp.read(qrBuffer);

    // Create white canvas with extra space for labels
    const totalHeight = QR_SIZE + 90;
    const canvas = new Jimp(QR_SIZE, totalHeight, 0xffffffff);
    canvas.composite(qrImg, 0, 0);

    // Print guest name (truncate if too long)
    const displayName = guest.name.length > 28 ? guest.name.substring(0, 26) + '…' : guest.name;
    const nameWidth = Jimp.measureText(fontSmall, displayName);
    canvas.print(fontSmall, Math.max(0, (QR_SIZE - nameWidth) / 2), QR_SIZE + 8, displayName);

    // Print 7-char code in large font
    const codeWidth = Jimp.measureText(font, code);
    canvas.print(font, Math.max(0, (QR_SIZE - codeWidth) / 2), QR_SIZE + 42, code);

    await canvas.writeAsync(file);
    console.log(`✓ ${guest.id} — ${guest.name}  [${code}]`);
  }

  console.log(`\nDone. ${guests.length} QR codes saved to /qr-codes/`);
})();
