const { format } = require('mysql');
const db = require('../lib/db');

class Post {
  constructor(pid, uid, nickname, content, date, commentlist) {
    this.pid = pid;
    this.uid = uid;
    this.nickname = nickname;
    this.content = content;
    this.date = date;
    this.commentlist = commentlist;
  }
}
class Comment {
  constructor(cid, pid, nickname, tonickname, content,date){
    this.cid = cid;
    this.pid = pid;
    this.nickname = nickname;
    this.tonickname = tonickname;
    this.content = content;
    this.date = date;
  }
}
const rootValue = {
  async newpost(args, req) {
    if (!req.session || req.session.login !== true) {
      throw '未登录';
    }
    if (req.session && req.session.login === true) {
      await db.query(format('INSERT INTO post (content,uid) VALUES (?,?)', [args.content, req.session.uid]));
      const post = await db.query(format('SELECT pid,user.uid AS uid,nickname,content FROM post JOIN user ON post.uid=user.uid WHERE post.uid = ? ORDER BY pid DESC', [req.session.uid]));
      return new Post(post[0].pid, post[0].uid, post[0].nickname, post[0].content);
    }
  },
  async postlist(args, req) {
    let list = await db.query(format('SELECT content,nickname,pid,date,user.uid as uid FROM post JOIN user ON post.uid = user.uid WHERE post.status = 1 ORDER BY date DESC'));
    for (let i = 0; i < list.length; i++) {
      list[i].commentlist = await db.query(format('SELECT cid,comment.uid,comment.touid,P.nickname as nickname,Q.nickname as tonickname,comment.date,comment.content FROM comment JOIN user as P ON comment.uid=P.uid JOIN user as Q ON comment.touid=Q.uid WHERE comment.status = 1 AND pid = ? ORDER BY comment.date', [list[i].pid]));
    }
    console.log(list);
    return list;
  },
  async newcomment(args, req) {
    if (!req.session || req.session.login !== true) {
      throw '未登录';
    }
    await db.query(format("INSERT INTO comment (pid,uid,touid,content) VALUES (?,?,?,?)", [args.pid, req.session.uid, args.touid, args.content]));
    return 200;
  },
  async banpost(args, req) {
    if (!req.session || req.session.login !== true || req.session.role !== 0) {
      throw '没有权限';
    }
    const ret = await db.query(format('UPDATE post SET status = 0 WHERE pid = ?', [args.pid]));
    return 200;
  },
  async bancomment(args, req) {
    if (!req.session || req.session.login !== true || req.session.role !== 0) {
      throw '没有权限';
    }
    const ret = await db.query(format('UPDATE comment SET status = 0 WHERE cid = ?', [args.cid]));
    return 200;
  }
};
module.exports = rootValue;