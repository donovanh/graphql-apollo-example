const { ApolloServer, gql } = require('apollo-server');
const db = require('./database.js');
 
// Construct a schema, using GraphQL schema language
const typeDefs = gql(`
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
 
const resolvers = {
  NewMovieResponse: {
    __resolveType(obj, context, info){
      if(obj.message){
        return 'Error';
      }
      if(obj.title){
        return 'NewMovie';
      }
      return null; // GraphQLError is thrown
    },
  },
  Query: {
    actors: () => Object.values(db.actors),
    movies: () => Object.values(db.movies),
    actor: (parent, { id }) => db.actors[id],
    movie: (parent, { id }) => db.movies[id],
    moviesStarring: (parent, { name }) => {
      const actor = Object.values(db.actors).find((actor) => actor.name === name);
      return actor.appearsIn;
    }
  },
  Mutation: {
      createMovie: (parent, { title, starring }) => {
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
    }
  }
};
 
// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});