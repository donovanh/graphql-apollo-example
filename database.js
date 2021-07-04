'use strict';

const actors = {
  a01: {
    id: 'a01',
    name: 'Harvey Keitel'
  },
  a02: {
    id: 'a02',
    name: 'Tim Roth'
  },
  a03: {
    id: 'a03',
    name: 'Steve Buscemi'
  },
  a04: {
    id: 'a04',
    name: 'Quentin Tarantino'
  },
  a05: {
    id: 'a05',
    name: 'Christian Slater'
  },
  a06: {
    id: 'a06',
    name: 'James Gandolfini'
  },
  a07: {
    id: 'a07',
    name: 'Patricia Arquette'
  },
  a08: {
    id: 'a08',
    name: 'Dennis Hopper'
  },
  a09: {
    id: 'a09',
    name: 'Val Kilmer'
  },
  a10: {
    id: 'a10',
    name: 'Christopher Walken'
  },
  a11: {
    id: 'a11',
    name: 'John Travolta'
  },
  a12: {
    id: 'a12',
    name: 'Uma Thurman'
  }
};

const movies = {
  m01: {
    id: 'm01',
    title: 'Reservoir Dogs',
    starring: [
      actors.a01,
      actors.a02,
      actors.a03,
      actors.a04
    ]
  },
  m02: {
    id: 'm02',
    title: 'True Romance',
    starring: [
      actors.a05,
      actors.a06,
      actors.a07,
      actors.a08,
      actors.a09,
      actors.a10
    ]
  },
  m03: {
    id: 'm03',
    title: 'Pulp Fiction',
    starring: [
      actors.a01,
      actors.a02,
      actors.a03,
      actors.a04,
      actors.a10,
      actors.a11,
      actors.a12
    ]
  }
};

// Add "appearsIn" programatically
for (const actor of Object.values(actors)) {
  actor.appearsIn = [];
  for (const movie of Object.values(movies)) {
    if (movie.starring.includes(actor)) {
      actor.appearsIn.push(movie);
    }
  }
}

module.exports = {
  actors,
  movies
}