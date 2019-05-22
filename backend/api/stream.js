const { format } = require('mysql');
const db = require('../lib/db');

class Post{
  constructor(pid, uid, nickname, content){
    this.pid = pid;
    this.uid = uid;
    this.nickname = nickname;
    this.content = content;
  }
}
const rootValue = {
  async newpost (args, req) {
    if (!req.session || req.session.login !== true) {
      throw '未登录';
    }
    if (req.session && req.session.login === true) {
      await db.query(format('INSERT INTO post (content,uid) VALUES (?,?)', [args.content, req.session.uid]));
      const post = await db.query(format('SELECT pid,user.uid AS uid,nickname,content FROM post JOIN user ON post.uid=user.uid WHERE post.uid = ? ORDER BY pid DESC', [req.session.uid]));
      return new Post(post[0].pid, post[0].uid, post[0].nickname, post[0].content);
    }
  },
  async postlist (args, req) {
    console.log('hhh')
    const list = await db.query(format('SELECT * FROM post ORDER BY pid'));
    console.log(list);
    return list;
  }
};
module.exports = rootValue;