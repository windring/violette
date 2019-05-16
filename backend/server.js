const express = require('express');
const session = require('./lib/session');
const user = require('./api/user');
const stream = require('./api/stream');

const app = express();

app.use((req, _, next) => {
  console.log(req.ip);
  next();
});

app.use(session);

app.use('/graphql', user);
app.listen(4000);
console.log('serving on http://localhost:4000/graphql')