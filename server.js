const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const db = require('./database.js');
 
// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  type Actor {
    id: String!,
    name: String!,
    appearsIn: [Movie]
  }

  type Movie {
    id: String!,
    title: String!,
    starring: [Actor!]!
  }

  type Query {
    movie(id: String): Movie,
    actor(id: String): Actor
  }
`);
 
// The root provides a resolver function for each API endpoint
const root = {
  actor: ({id}) => db.actors[id],
  movie: ({id}) => db.movies[id]
};
 
const app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');