import React, { useEffect, useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import MovieCard from './MovieCard';
import styles from './MovieListPage.module.css';

function MovieListPage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const history = useHistory();

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const fetchMovies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.set('search', debouncedSearch);
      const res = await fetch(`/api/movies?${params}`);
      if (!res.ok) throw new Error('Failed to fetch movies');
      const data = await res.json();
      setMovies(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>▶</span>
            <span className={styles.logoText}>Pi-Xcels</span>
          </div>
          <div className={styles.searchWrap}>
            <span className={styles.searchIcon}>⌕</span>
            <input
              className={styles.searchInput}
              type="text"
              placeholder="Search titles, taglines…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search movies"
            />
            {search && (
              <button className={styles.clearBtn} onClick={() => setSearch('')} aria-label="Clear search">✕</button>
            )}
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.headingRow}>
          <h1 className={styles.heading}>
            {debouncedSearch ? (
              <>Results for <em>"{debouncedSearch}"</em></>
            ) : (
              'All Films'
            )}
          </h1>
          {!loading && (
            <span className={styles.count}>{movies.length} film{movies.length !== 1 ? 's' : ''}</span>
          )}
        </div>

        {loading && (
          <div className={styles.grid}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className={styles.skeleton} />
            ))}
          </div>
        )}

        {error && (
          <div className={styles.error}>
            <p>⚠ {error}</p>
            <button className={styles.retryBtn} onClick={fetchMovies}>Retry</button>
          </div>
        )}

        {!loading && !error && movies.length === 0 && (
          <div className={styles.empty}>
            <p className={styles.emptyIcon}>🎬</p>
            <p>No films match your search.</p>
          </div>
        )}

        {!loading && !error && movies.length > 0 && (
          <div className={styles.grid}>
            {movies.map((movie, i) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                index={i}
                onClick={() => history.push(`/movie/${movie.id}`)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default MovieListPage;