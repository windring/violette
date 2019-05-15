const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');

const session = require('./lib/session');
const crypto = require('crypto');
const md5 = crypto.createHash('md5');

const schema = buildSchema(`
type Res {
  code: Int,
  message: String
}
type Query {
  login(username: String!, password: String!): String,
}
type Mutation {
  signup(username: String!, password: String!): String,
  signin(username: String!, password: String!): String,
  logout: String
}
`);

const root = {
  signup: (args, request) => {
    return args.username + md5.update(args.password).digest('hex');
  },
  async signin(args, req) {
    if (req.session.login === true) {
      return '已经记录';
    }
    try {
      const ret = await new Promise((resolve, reject) => {
        req.session.regenerate((e) => {
          if (e) {
            reject(e.toString());
          } else {
            req.session.login = true;
            resolve('记录成功');
          }
        });
      });
      return ret;
    } catch (e) {
      return e;
    }
  },
  async logout (args, req) {
    if (req.session.login !== true) {
      return '没有登陆';
    }
    try {
      const ret = await new Promise((resolve, reject) => {
        req.session.destroy((e) => {
          if (e) {
            reject(e.toString());
          } else {
            resolve('登出成功');
          }
        })
      });
      return ret;
    }catch(e){
      return '登出失败' + e.toString();
    }
  }
};

const app = express();

app.use((req, res, next) => {
  console.log(req.ip);
  next();
});

app.use(session);

app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true
}));
app.listen(4000);