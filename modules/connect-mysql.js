require('dotenv').config();
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  //   password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10, // 最大連線數
  queueLimit: 0, //沒有限制排幾個
});

module.exports = pool.promise(); // 滙出 promise pool
