const mysql = require('mysql2/promise');

let pool;

function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host:     process.env.MYSQL_HOST,
      port:     parseInt(process.env.MYSQL_PORT),
      user:     process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      ssl:      { rejectUnauthorized: true },
      waitForConnections: true,
      connectionLimit: 5,
    });
  }
  return pool;
}

module.exports = { getPool };
