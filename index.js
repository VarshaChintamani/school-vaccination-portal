// index.js
const db = require('./db2');

db.query('SELECT 2', (err, results) => {
  if (err) throw err;
  console.log('✅ DB test query successful:', results);
});
