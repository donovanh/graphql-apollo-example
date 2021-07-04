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
    movies: [Movie],
    actor(id: String): Actor,
    moviesStarring(names: [String!]): [Movie]
  }
`);
 
// The root provides a resolver function for each API endpoint
const root = {
  actor: ({id}) => db.actors[id],
  movie: ({id}) => db.movies[id],
  movies: () => Object.values(db.movies),
  moviesStarring: ({names}) => Object.values(db.movies).filter((movie) => {
    for (actorName of names) {
      for (movieActor of movie.starring) {
        if (movieActor.name === actorName) {
          return true;
        }
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