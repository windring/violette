const express = require('express');
const cors = require('cors');
const session = require('./lib/session');
const api = require('./api/index')

const app = express();

app.use(cors());

app.use((req, _, next) => {
  console.log(req.ip);
  next();
});

app.use(session);

app.use('/graphql', api);
app.listen(4000);
console.log('serving on http://localhost:4000/graphql')
