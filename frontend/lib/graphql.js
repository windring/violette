import { request } from 'graphql-request';
import crypto from 'crypto';
const hash=crypto.createHash('sha256');
const origin = 'http://localhost:4000/graphql';
const api = {};
api.sigup = (nickname, password)  => {
  hash.update(password)
  password = hash.digest()
  return await request(origin,
    `mutation{
      signup(nickname: $nickname, password: $password){
        uid,
        nickname,
        message,
        code
      }
    }`, {
      nickname,
      password
    });
};
module.exports = api;