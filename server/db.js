// server/db.js
const mysql = require('mysql2');
require('dotenv').config(); // Load environment variables from .env file

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Export the promise-based version of the pool
module.exports = pool.promise();

// const mysql = require('mysql2/promise');
// require('dotenv').config();

// const db = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
// });

// db.query('SELECT 1')
//   .then(() => console.log('✅ Database connected!'))
//   .catch(err => console.error('❌ Database connection failed:', err));

// module.exports = db;
