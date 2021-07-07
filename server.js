const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const db = require('./database.js');
 
// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  type Actor {
    id: String!
    name: String!
    appearsIn: [Movie]
  }

  type Movie {
    id: String!
    title: String!
    starring: [Actor!]!
  }

  type NewMovie {
    id: String!
    title: String!
    starring: [String!]!
  }

  type Error {
    id: String!,
    message: String!
  }

  union NewMovieResponse = NewMovie | Error

  type Query {
    actors: [Actor]
    movies: [Movie]
    actor(id: String!): Actor
    movie(id: String!): Movie
    moviesStarring(name: String!): [Movie]!
  }

  type Mutation {
    createMovie(
      title: String!,
      starring: [String!]!
    ): NewMovieResponse
  }
`);
 
// The root provides a resolver function for each API endpoint
const root = {
  actors: () => Object.values(db.actors),
  movies: () => Object.values(db.movies),
  actor: ({ id }) => db.actors[id],
  movie: ({ id }) => db.movies[id],
  createMovie: ({ title, starring }) => {
    // We could validate and update a database here
    if (!title.length) {
      return {
        id: 'err-01',
        message: 'Title should not be blank'
      }
    }
    return {
      id: 'new-id',
      title,
      starring
    };
  },
  moviesStarring: ({ name }) => {
    const actor = Object.values(db.actors).find((actor) => actor.name === name);
    return actor.appearsIn;
  },
};
 
const app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');