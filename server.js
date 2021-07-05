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
    actors: [Actor],
    movies: [Movie],
    actor(id: String): Actor,
    movie(id: String): Movie,
    moviesStarring(name: String!): [Movie]
  }
`);
 
// The root provides a resolver function for each API endpoint
const root = {
  actors: () => Object.values(db.actors),
  movies: () => Object.values(db.movies),
  actor: ({id}) => db.actors[id],
  movie: ({id}) => db.movies[id],
  moviesStarring: ({name}) => Object.values(db.movies).filter((movie) => {
    for (movieActor of movie.starring) {
      if (movieActor.name === name) {
        return true;
      }
    }
  })
};
 
const app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');