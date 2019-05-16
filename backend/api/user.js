const { privateKey } = require('../config/rsa');
const crypto = require('crypto');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');

const schema = buildSchema(`
type User {
  uid: ID,
  nickname: String,
  message: String,
  code: Int
}
type Mutation {
  signup(username: String, password: String): User,
  signin(username: String!, password: String!): User,
  logout: User
}
`);

class User {
  constructor (uid, nickname, message, code) {
    this.uid = uid;
    this.nickname = nickname;
    this.message = message;
    this.code = code;
  }
}

const root = {
  signup (args) {
    const hashPass = crypto.privateDecrypt(privateKey, Buffer.from(args.password, 'base64')).toString('utf-8');
    return User(undefined, args.username, `try login ${args.username} with hash password ${hashPass}`, 1)
  },
  async signin(args, req) {
    if (req.session.login === true) {
      return User(undefined, args.username, '已经记录', 1);
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
      return User(undefined, args.username, ret, 1);
    } catch (e) {
      return User(undefined,args.username, e, -1);
    }
  },
  async logout (args, req) {
    if (req.session.login !== true) {
      return User(undefined, args.username, '没有登陆', -1);
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
      return User(undefined, args.username, ret, 1);
    }catch(e){
      return User(undefined, args.username, '登出失败' + e.toString(), -1);
    }
  }
};


module.exports = graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true
});