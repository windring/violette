const mysql = require('mysql');
const option = require('../config/mysql');

const pool = mysql.createPool({
  ...option,
  connectionLimit: 10,
});

console.log('connecting to mysql');

pool.query('SELECT now() as time', (e, r, f) => {
  console.log(e, f , r);
})

module.exports = pool;