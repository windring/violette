const { privateKey } = require('../config/rsa');
const crypto = require('crypto');
const { format } = require('mysql');
const db = require('../lib/db');

class User {
  constructor (uid, nickname, message, code) {
    this.uid = uid;
    this.nickname = nickname;
    this.message = message;
    this.code = code;
  }
}

const rootValue = {
  helloworld (args, req) {
    if (req.session && req.session.login === true) {
      return new User(req.session.uid, req.session.nickname, '已经登录', 1);
    }
    return new User(undefined, undefined, '未登录', -1);
  },
  async signup (args, req) {
    if (req.session.login === true) {
      return new User(req.session.uid, req.session.nickname, '请先退出登录',-1);
    }
    try {
      const buffer = Buffer.from(args.password, 'base64');
      const hashPass = crypto.privateDecrypt(privateKey, buffer).toString();
      console.dir(crypto.privateDecrypt(privateKey, buffer))
      try{
        await db.query(format('INSERT INTO user (nickname, password) VALUES (?, ?)', [args.nickname, hashPass]));
        const ret = await db.query(format('SELECT uid, nickname FROM user WHERE nickname = ?', [args.nickname]))
        return new User(ret.uid, ret.nickname, '', 1);
      }catch(e){
        return new User(undefined, args.nickname, e.toString(), -1);
      }
    }catch(e){
      return new User(undefined, args.nickname, e.toString(), -1);
    }
  },
  async signin(args, req) {
    if (req.session.login === true) {
      return new User(undefined, args.nickname, '已经记录', 1);
    }
    try{
      const buffer = Buffer.from(args.password, 'base64');
      const hashPass = crypto.privateDecrypt(privateKey, buffer).toString('utf-8');
      let ret = await db.query(format('SELECT uid, nickname FROM user WHERE nickname = ? and password = ?', [args.nickname, hashPass]));
      if(ret.length === 0)throw '用户名或密码不正确';
      ret = ret[0]
      const mksession = await new Promise((resolve, reject) => {
        req.session.regenerate((e) => {
          if (e) {
            reject(e.toString());
          } else {
            req.session.login = true;
            req.session.nickname = ret.nickname
            req.session.uid = ret.uid
            resolve('记录成功');
          }
        });
      });
      return new User(ret.uid, ret.nickname, mksession, 1);
    }catch(e){
      return new User(undefined, args.nickname, e, -1);
    }
  },
  async logout (args, req) {
    if (req.session.login !== true) {
      return new User(undefined, undefined, '没有登录', -1);
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
      return new User(undefined, undefined, ret, 1);
    }catch(e){
      return new User(undefined, req.session.nickname, '登出失败' + e.toString(), -1);
    }
  }
};


module.exports = rootValue;
