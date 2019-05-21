const { privateKey } = require('../config/rsa');
const crypto = require('crypto');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const { format } = require('mysql');
const db = require('../lib/db');

const schema = buildSchema(`
type User {
  uid: ID,
  nickname: String,
  message: String,
  code: Int
}
type Mutation {
  signup(nickname: String, password: String): User,
  signin(nickname: String!, password: String!): User,
  logout: User
}
type Query {
  helloworld: User
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
  helloworld () {
    return new User(1,1,1,1);
  },
  async signup (args, req) {
    if (req.session.login === true) {
      return new User(req.session.uid, req.session.nickname, '请先退出登录',-1);
    }
    try {
      const buffer = Buffer.from(args.password, 'base64');
      const hashPass = crypto.privateDecrypt(privateKey, buffer).toString('utf-8');
      try{
        await db.query(format('INSERT INTO user (nickname, password) VALUES (?, ?)', [args.nickname, hashPass]));
      }catch(e){
        return new User(undefined, args.nickname, e.toString(), -1);
      }
      return new User(undefined, args.nickname, `try login ${args.nickname} with hash password ${hashPass}`, 1);
    }catch(e){
      return new User(undefined, args.nickname, e.toString(), -1);
    }
  },
  async signin(args, req) {
    if (req.session.login === true) {
      return new User(undefined, args.nickname, '已经记录', 1);
    }
    try {
      const ret = await new Promise((resolve, reject) => {
        req.session.regenerate((e) => {
          if (e) {
            reject(e.toString());
          } else {
            req.session.login = true;
            req.session.nickname = args.nickname
            req.session.uid = undefined
            resolve('记录成功');
          }
        });
      });
      return new User(undefined, args.nickname, ret, 1);
    } catch (e) {
      return new User(undefined,args.nickname, e, -1);
    }
  },
  async logout (args, req) {
    if (req.session.login !== true) {
      return new User(undefined, undefined, '没有登陆', -1);
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
      return new User(undefined, req.session.nickname, ret, 1);
    }catch(e){
      return new User(undefined, req.session.nickname, '登出失败' + e.toString(), -1);
    }
  }
};


module.exports = graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true
});
