// import React, { useState, useEffect } from 'react';
// import logo from './logo.svg';
// import './App.css';

// function App() {
//   const [movies, setMovies] = useState([]);
//   useEffect(() => {
//     async function getData() {
//       const response = await fetch('/api/movies');
//       const payload = await response.json();
//       setMovies(payload.data);
//     }
//     getData();
//   }, []);
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and your changes will live-update automatically.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//         <p>Nice Movies:</p>
//         <p>{JSON.stringify(movies)}</p>
        
//       </header>
//     </div>
//   );
// }

// export default App;

import React from 'react';
import { Switch, Route } from 'react-router-dom';
import MovieListPage from './components/MovieListPage';
import MovieDetailPage from './components/MovieDetailPage';

function App() {
  return (
    <Switch>
      <Route exact path="/" component={MovieListPage} />
      <Route path="/movie/:id" component={MovieDetailPage} />
    </Switch>
  );
}

export default App;