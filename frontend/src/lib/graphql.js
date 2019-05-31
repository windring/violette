import { GraphQLClient } from 'graphql-request'
import crypto from 'crypto'
import origin from '../config/url'
import { publicKey } from '../config/rsa'

const api = {}

const client = new GraphQLClient(origin, {
  credentials: 'include'
});


api.signup = (nickname, password) => {
  let hsh = crypto.createHash('sha256').update(password).digest().toString('base64')
  hsh = crypto.publicEncrypt(publicKey, Buffer.from(hsh)).toString('base64')
  return client.request(
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
  return client.request(
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
  return client.request(
    `mutation{
      logout{
        message,
        code
      }
    }`)
}
api.helloworld = () => {
  return client.request(
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
  return client.request(
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
  return client.request(
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
          content,
          likelist,
          dislikelist
        },
        likelist,
        dislikelist
      }
    }`)
}
api.newcomment = (content, touid, pid) => {
  return client.request(
    `mutation($content: String, $touid: Int, $pid: Int){
      newcomment(content: $content, touid: $touid, pid: $pid)
    }`, {
      content,
      touid,
      pid
    })
}
api.banpost = (pid) => {
  return client.request(
    `mutation($pid: Int){
      banpost(pid: $pid)
    }`, {
      pid
    })
}
api.bancomment = (cid) => {
  return client.request(
    `mutation($cid: Int){
      bancomment(cid: $cid)
    }`, {
      cid
    })
}
api.likepost = (pid, attitude) => {
  return client.request(
    `mutation($pid: Int, $attitude: Int){
      likepost(pid: $pid, attitude: $attitude)
    }`, {
      pid,
      attitude
    }
  )
}
api.likecomment = (cid, attitude) => {
  return client.request(
    `mutation($cid: Int, $attitude: Int){
      likecomment(cid: $cid, attitude: $attitude)
    }`, {
      cid,
      attitude
    }
  )
}
export default api
