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
      list[i].likelist = (await db.query(format('SELECT uid FROM postattitude WHERE pid = ? AND attitude = 1', [list[i].pid]))).map(i => i.uid);
      list[i].dislikelist = (await db.query(format('SELECT uid FROM postattitude WHERE pid = ? AND attitude = -1', [list[i].pid]))).map(i => i.uid);
      for (let j = 0; j < list[i].commentlist.length; j++) {
        list[i].commentlist[j].likelist = (await db.query(format('SELECT uid FROM commentattitude WHERE cid = ? AND attitude = 1', list[i].commentlist[j].cid))).map(i => i.uid);
        list[i].commentlist[j].dislikelist = (await db.query(format('SELECT uid FROM commentattitude WHERE cid = ? AND attitude = -1', list[i].commentlist[j].cid))).map(i => i.uid);
      }
    }
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
  },
  async likecomment(args, req) {
    if(!req.session || req.session.login !== true) {
      throw '未登录';
    }
    let ret = await db.query(format('SELECT * FROM commentattitude WHERE cid = ? AND uid = ?', [args.cid, req.session.uid]));
    if (ret.length === 0) {
      await db.query(format('INSERT INTO commentattitude (cid, uid, attitude) VALUES (?, ?, ?)', [args.cid, req.session.uid, args.attitude]));
    } else {
      await db.query(format('UPDATE commentattitude SET attitude = ? WHERE cid = ? AND uid = ?', [args.attitude === ret[0].attitude ? 0 : args.attitude, args.cid, req.session.uid]));
    }
  },
  async likepost(args, req) {
    if(!req.session || req.session.login !== true) {
      throw '未登录';
    }
    let ret = await db.query(format('SELECT * FROM postattitude WHERE pid = ? AND uid = ?', [args.pid, req.session.uid]));
    if (ret.length === 0) {
      await db.query(format('INSERT INTO postattitude (pid, uid, attitude) VALUES (?, ?, ?)', [args.pid, req.session.uid, args.attitude]));
    } else {
      await db.query(format('UPDATE postattitude SET attitude = ? WHERE pid = ? AND uid = ?', [args.attitude === ret[0].attitude ? 0 : args.attitude, args.pid, req.session.uid]));
    }
  }
};
module.exports = rootValue;