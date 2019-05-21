const mysql = require('mysql');
const option = require('../config/mysql');

const db = {};

const pool = mysql.createPool({
  ...option,
  connectionLimit: 10,
});

console.log('connecting to mysql');

pool.query('SELECT now() as time', (e, r, f) => {
  console.log(e, f , r);
})

db.query = function (sql) {
  return new Promise((resolve, reject) => {
    pool.query(sql, (e, r, f) => {
      if (e) reject(e);
      console.log(e ,r ,f);
    });
  });
};
module.exports = db;
