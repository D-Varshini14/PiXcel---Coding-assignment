// const express = require("express");
// const path = require("path");

// const app = express();

// // A test route to make sure the server is up.
// app.get("/api/ping", (request, response) => {
//   console.log("❇️ Received GET request to /api/ping");
//   response.send("pong!");
// });

// // A mock route to return some data.
// app.get("/api/movies", (request, response) => {
//   console.log("❇️ Received GET request to /api/movies");
//   response.json({ data: [{ id: 1, name: '1' }, { id: 2, name: '2' }] });
// });

// // Express port-switching logic
// let port;
// console.log("❇️ NODE_ENV is", process.env.NODE_ENV);
// if (process.env.NODE_ENV === "production") {
//   port = process.env.PORT || 3000;
//   app.use(express.static(path.join(__dirname, "../build")));
//   app.get("*", (request, response) => {
//     response.sendFile(path.join(__dirname, "../build", "index.html"));
//   });
// } else {
//   port = 3001;
//   console.log("⚠️ Not seeing your changes as you develop?");
//   console.log(
//     "⚠️ Do you need to set 'start': 'npm run development' in package.json?"
//   );
// }

// // Start the listener!
// const listener = app.listen(port, () => {
//   console.log("❇️ Express server is running on port", listener.address().port);
// });



const express = require('express');
const path = require('path');
const movies = require('./movies_metadata.json');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Serve static files from React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'build')));
}

// GET /api/movies - List all movies
app.get('/api/movies', (req, res) => {
  const { search, genre } = req.query;
  let result = movies;

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        (m.tagline && m.tagline.toLowerCase().includes(q))
    );
  }

  if (genre) {
    result = result.filter(
      (m) => m.genres && m.genres.some((g) => g.toLowerCase() === genre.toLowerCase())
    );
  }

  // Return lighter payload for list view
  const list = result.map(({ id, title, tagline, vote_average, poster_path, genres, release_date }) => ({
    id,
    title,
    tagline,
    vote_average,
    poster_path,
    genres,
    release_date,
  }));

  res.json(list);
});

// GET /api/movies/:id - Get single movie by ID
app.get('/api/movies/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const movie = movies.find((m) => m.id === id);

  if (!movie) {
    return res.status(404).json({ error: 'Movie not found' });
  }

  res.json(movie);
});

// Fallback to React app in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🎬 Movie API server running on http://localhost:${PORT}`);
});