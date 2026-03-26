const { getClient } = require('../lib/db');
const { guestCode } = require('../lib/tokens');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'POST') return res.status(405).end();
  if (req.headers['x-seed-secret'] !== process.env.SEED_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const client = await getClient();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS guests (
        id VARCHAR(36) PRIMARY KEY, name VARCHAR(255) NOT NULL,
        email VARCHAR(255), type VARCHAR(10) DEFAULT 'regular',
        code VARCHAR(7) UNIQUE, arrived BOOLEAN DEFAULT false,
        arrived_at TIMESTAMP DEFAULT NULL
      )
    `);
    await client.query(`ALTER TABLE guests ADD COLUMN IF NOT EXISTS code VARCHAR(7)`);

    const sample = [
      ['g-116','James Bajee','vip'],['g-001','Fuad Abdi','vip'],
      ['g-002','Dr. Johnson Mwangi','vip'],['g-003','Mrs. Florence Kinuthia','vip'],
      ['g-004','Daniel Mwangi Kinuthia','vip'],['g-005','Ruth Mwouria','vip'],
      ['g-006','Shadrack Njoroge','vip'],['g-007','Cornelius Nyangres','vip'],
      ['g-008','Redempter Mwongeli','vip'],['g-009','Suzan Nyatega','vip'],
      ['g-010','Catherine Wambui','vip'],['g-011','Pamela Keen','vip'],
      ['g-012','Dharmesh Savla','vip'],['g-013','Mr. Samuel Irungu','vip'],
      ['g-014','Dr. Destaings Nyongesa','vip'],['g-015','Charles Lenjo Mwazighe','vip'],
      ['g-016','Steve Waudo','vip'],['g-017','Grace Major','vip'],
      ['g-018','George Adalla','vip'],['g-019','Jocelyn Omusembe','vip'],
      ['g-020','Maurice Nandwa','regular'],['g-021','PEL Catherine Salt Div','regular'],
      ['g-022','Doreen Daria Marube','regular'],['g-023','Wangu Mathu','regular'],
      ['g-024','William Mathu','regular'],['g-025','Claudius Chepkemoi','regular'],
      ['g-026','Shafana Kanani','regular'],['g-027','Rizwan Kanani','regular'],
      ['g-028','Hellen Nyokabi','regular'],['g-029','S Mboyano','regular'],
      ['g-030','Peace Wambua','regular'],['g-031','Dorothy Wambua','regular'],
      ['g-032','Daniel Wambua','regular'],['g-033','Susan Gitau','regular'],
      ['g-034','Jareth Kinyanjui','regular'],['g-035','Onesmus Kevin','regular'],
      ['g-036','Martin Mogusu','regular'],['g-037','Rachael Mogusu','regular'],
      ['g-038','Ashina Wanga','regular'],['g-039','Osborne Wanyoike','regular'],
      ['g-040','Anastasia Kibutu','regular'],['g-041','Angela Mueni Munyasya','regular'],
      ['g-042','Annette Khasandi Wanyoike','regular'],['g-043','Melanie Maina','regular'],
      ['g-044','Zuri Hedaya Monari','regular'],['g-045','Albert Kioko','regular'],
      ['g-046','Brian Kintei','regular'],['g-047','Jean Munga','regular'],
      ['g-048','Anita Mutula','regular'],['g-049','Brenda Nzula Mutua','regular'],
      ['g-050','Christine Katunge Kitale','regular'],['g-051','Ann Mumbua','regular'],
      ['g-052','Peter Mogere','regular'],['g-053','Njeri Wanjau','regular'],
      ['g-054','Jane Mukabi','regular'],['g-055','Ava Njeri Goro','regular'],
      ['g-056','Florence Mwithaga Minua','regular'],['g-057','Margaret Njeri Maina','regular'],
      ['g-058','Margaret Wagio Minua','regular'],['g-059','Ruth Wanjiru Minua','regular'],
      ['g-060','Rose Wanjiru Kanyugi','regular'],['g-061','Assumpta Ndunge','regular'],
      ['g-062','Mr. Musika Raymond','regular'],['g-063','Jane Waithira','regular'],
      ['g-064','Rosemary Muringi','regular'],['g-065','Ronny Gichuki','regular'],
      ['g-066','Esther Wangombe','regular'],['g-067','Wanjohi Wangombe','regular'],
      ['g-068','Leonard Lihanda','regular'],['g-069','John Keverenge','regular'],
      ['g-070','Shadrack Mugazia','regular'],['g-071','Abdullahi Bashir','regular'],
      ['g-072','Jason Tevin','regular'],['g-073','Angela Ariko','regular'],
      ['g-074','Nyanchama Ogoti','regular'],['g-075','Schola Wangeci','regular'],
      ['g-076','Sarah Kaminchia','regular'],['g-077','Rose Ayuma','regular'],
      ['g-078','Monica Achieng Omondi','regular'],['g-079','Edith Onyango','regular'],
      ['g-080','David Musyoki','regular'],['g-081','Kenneth Gatheca','regular'],
      ['g-082','Lillian Oluoch','regular'],['g-083','Merina Adhiaya','regular'],
      ['g-084','Selina Lwaki','regular'],['g-085','Mr. George Wadegu','regular'],
      ['g-086','Andrew Wambua','regular'],['g-087','Charles N Mwania','regular'],
      ['g-088','Shalney Sirintai','regular'],['g-089','Sylvia Mantaine Kamoye','regular'],
      ['g-090','Estther Kithuku','regular'],['g-091','Dr. Daniel Muindi','regular'],
      ['g-092','Mrs. Winnie Muindi','regular'],['g-093','Prof. Kyallo Wamitila','regular'],
      ['g-094','Dr. Florence Muthiani','regular'],['g-095','Victoria Mutile Kithuku','regular'],
      ['g-096','John Kibet','regular'],['g-097','Steve Tele','regular'],
      ['g-098','Audrey Achieng','regular'],['g-099','Kenneth Kiura Njora','regular'],
      ['g-100','Christine Katunge Kitale (2)','regular'],['g-101','Grace Kiyuka','regular'],
      ['g-102','Caroline Mutuota','regular'],['g-103','Clinton','regular'],
      ['g-104','Rosemary Baraza','regular'],['g-105','Alice Wahome','regular'],
      ['g-106','Levis Njiru','regular'],['g-107','Rosie Mueni','regular'],
      ['g-108','Divinah Moragwa','regular'],['g-109','Edwin Binale','regular'],
      ['g-110','Cindy Mutuota','regular'],['g-111','Rosebella Onyango','regular'],
      ['g-112','Caroline Kangogo','regular'],['g-113','Veronica Maina','regular'],
      ['g-114','Moses Nderitu','regular'],['g-115','Nicole Muthoni','regular'],
    ];

    for (const [id, name, type] of sample) {
      const code = guestCode(id);
      await client.query(
        `INSERT INTO guests (id, name, type, code) VALUES ($1,$2,$3,$4)
         ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code`,
        [id, name, type, code]
      );
    }
    res.status(200).json({ message: 'Seeded', count: sample.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  } finally {
    await client.end();
  }
};
