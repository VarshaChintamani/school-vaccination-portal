// // db.js
// const mysql = require('mysql2');

// const connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'varsha_db', // change this if you used a different username
//   password: 'Deepu@0811', // replace with your MySQL password
//   database: 'school_vaccination_portal' // replace if you use a different DB name
// });

// connection.connect((err) => {
//   if (err) {
//     console.error('❌ Error connecting to MySQL:', err.message);
//     return;
//   }
//   console.log('✅ Connected to MySQL database!');
// });

// module.exports = connection;


const mysql = require('mysql2/promise');
require('dotenv').config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.query('SELECT 1')
  .then(() => console.log('✅ Database connected!'))
  .catch(err => console.error('❌ Database connection failed:', err));

module.exports = db;
