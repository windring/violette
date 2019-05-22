module.exports = `
type User {
  uid: ID,
  nickname: String,
  message: String,
  code: Int
}
type Post {
  pid: Int,
  uid: Int,
  nickname: String,
  content: String,
}
type Mutation {
  signup(nickname: String, password: String): User,
  signin(nickname: String!, password: String!): User,
  logout: User,
  newpost(content: String): Post
}
type Query {
  helloworld: User,
  postlist: [Post]
}
`;