require('dotenv').config();
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  //   password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

connection.query('SELECT * FROM address_book LIMIT 5', (error, r) => {
  console.log(r);
});
