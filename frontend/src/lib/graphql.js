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
        code,
        role
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
        code,
        role
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
        content,
        nickname,
        date,
        commentlist{
          cid,
          uid,
          touid,
          nickname,
          tonickname,
          date,
          content
        }
      }
    }`)
}
api.newcomment = (content, touid, pid) => {
  return gr(origin,
    `mutation($content: String, $touid: Int, $pid: Int){
      newcomment(content: $content, touid: $touid, pid: $pid)
    }`, {
      content,
      touid,
      pid
    })
}
api.banpost = (pid) => {
  return gr(origin,
    `mutation($pid: Int){
      banpost(pid: $pid)
    }`, {
      pid
    })
}
api.bancomment = (cid) => {
  return gr(origin,
    `mutation($cid: Int){
      bancomment(cid: $cid)
    }`, {
      cid
    })
}
export default api
