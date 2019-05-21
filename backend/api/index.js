const { buildSchema } = require('graphql');
const graphqlHTTP = require('express-graphql');
const stream = require('./stream');
const user = require('./user');
const gql = require('./gql');
console.log({...stream,...user})
module.exports = graphqlHTTP({
  schema: buildSchema(gql),
  rootValue: {...user, ...stream},
  graphiql: true
});