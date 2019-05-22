import { request as gr } from 'graphql-request'
import crypto from 'crypto'
import Key from '../config/rsa.js'

const origin = 'http://localhost:4000/graphql'
const api = {}
const publicKey = Key.publicKey

api.signup = (nickname, password) => {
  let hsh = crypto.createHash('sha256').update(password).digest().toString('base64')
  hsh = crypto.publicEncrypt(publicKey, Buffer.from(hsh)).toString('base64')
  return gr(origin,
    `mutation($nickname: String!,$password: String!){
      signup(nickname: $nickname, password: $password){
        uid,
        nickname,
        message,
        code
      }
    }`, {
      nickname,
      password: hsh
    })
}
api.signin = (nickname, password) => {
  let hsh = crypto.createHash('sha256').update(password).digest().toString('base64')
  hsh = crypto.publicEncrypt(publicKey, Buffer.from(hsh)).toString('base64')
  return gr(origin,
    `mutation($nickname: String!,$password: String!){
      signin(nickname: $nickname, password: $password){
        uid,
        nickname,
        message,
        code
      }
    }`, {
      nickname,
      password: hsh
    })
}
api.logout = () => {
  return gr(origin,
    `mutation{
      logout{
        message,
        code
      }
    }`)
}
api.helloworld = () => {
  return gr(origin, 
    `{
      helloworld{
        uid,
        nickname,
        message,
        code
      }
    }`)
}
api.newpost = (content) => {
  return gr(origin,
    `mutation($content: String){
      newpost(content: $content){
        pid
      }
    }`,
    {
      content
    })
}
api.postlist = () => {
  return gr(origin,
    `{
      postlist{
        pid,
        uid,
        content
      }
    }`)
}
export default api
