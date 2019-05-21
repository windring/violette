const express = require('express');
const session = require('./lib/session');
const api = require('./api/index')

const app = express();

app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  next();
});

app.use((req, _, next) => {
  console.log(req.ip);
  next();
});

app.use(session);

app.use('/graphql', api);
app.listen(4000);
console.log('serving on http://localhost:4000/graphql')