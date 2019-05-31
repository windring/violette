module.exports = `
type User {
  uid: ID,
  nickname: String,
  message: String,
  code: Int,
  role: Int,
}
type Comment {
  cid: Int,
  uid: Int,
  touid: Int,
  nickname: String,
  tonickname: String,
  date: String,
  content: String,
  likelist: [Int],
  dislikelist: [Int]
}
type Post {
  pid: Int,
  uid: Int,
  nickname: String,
  content: String,
  date: String,
  commentlist: [Comment],
  likelist: [Int],
  dislikelist: [Int]
}
type Mutation {
  signup(nickname: String, password: String): User,
  signin(nickname: String!, password: String!): User,
  logout: User,
  newpost(content: String): Post,
  newcomment(content: String, touid: Int, pid: Int): Int,
  banpost(pid: Int): Int,
  bancomment(cid: Int): Int,
  likecomment(cid: Int, attitude: Int): Int,
  likepost(pid: Int, attitude: Int): Int,
}
type Query {
  helloworld: User,
  postlist: [Post]
}
`;