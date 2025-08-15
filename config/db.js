require('dotenv').config();  // Load .env variables

const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: process.env.DB_HOST,      // from .env
  user: process.env.DB_USER,      // from .env
  password: process.env.DB_PASS,  // from .env
  database: process.env.DB_NAME,  // from .env
  waitForConnections: true,
 connectTimeout: 10000 ,
  queueLimit: 0
});

module.exports = db;
