const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

const option = require('../config/mysql');

module.exports = session({
  name: 'session_cookie_name',
  secret: 'session_cookie_screct',
  store: new MySQLStore(option),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 10 * 1000
  }
});