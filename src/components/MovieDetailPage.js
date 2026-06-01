import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import styles from './MovieDetailPage.module.css';

const FALLBACK_BACKDROP = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720"><rect width="1280" height="720" fill="%2312121a"/></svg>';

function parseDate(dateStr) {
  if (!dateStr) return null;
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    const day = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1;
    const yr = parseInt(parts[2]);
    const fullYear = yr + (yr < 50 ? 2000 : 1900);
    return new Date(fullYear, month, day).toLocaleDateString(undefined, {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  }
  return dateStr;
}

function DetailRow({ label, value }) {
  if (!value && value !== 0) return null;
  return (
    <div className={styles.detailRow}>
      <dt className={styles.label}>{label}</dt>
      <dd className={styles.value}>{value}</dd>
    </div>
  );
}

function formatCurrency(n) {
  if (!n) return null;
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 }).format(n);
}

function formatRuntime(mins) {
  if (!mins) return null;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m (${mins} min)` : `${m} min`;
}

function formatLanguage(code) {
  try {
    return new Intl.DisplayNames(['en'], { type: 'language' }).of(code) || code;
  } catch {
    return code;
  }
}

function MovieDetailPage() {
  const { id } = useParams();
  const history = useHistory();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [backdropError, setBackdropError] = useState(false);
  const [posterError, setPosterError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/movies/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error(r.status === 404 ? 'Movie not found.' : 'Failed to load movie.');
        return r.json();
      })
      .then(setMovie)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className={styles.loadingPage}>
        <div className={styles.spinner} />
        <p>Loading film…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorPage}>
        <p className={styles.errorText}>⚠ {error}</p>
        <button className={styles.backBtn} onClick={() => history.push('/')}>← Back to Films</button>
      </div>
    );
  }

  if (!movie) return null;

  return (
    <div className={styles.page}>
      <div className={styles.backdrop}>
        <img
          src={backdropError ? FALLBACK_BACKDROP : (movie.backdrop_path || FALLBACK_BACKDROP)}
          alt=""
          role="presentation"
          onError={() => setBackdropError(true)}
        />
        <div className={styles.backdropOverlay} />
      </div>

      <div className={styles.content}>
        <button className={styles.backBtn} onClick={() => history.push('/')}>
          ← Back to Films
        </button>

        <div className={styles.hero}>
          <div className={styles.posterWrap}>
            <img
              className={styles.poster}
              src={posterError ? '' : (movie.poster_path || '')}
              alt={movie.title}
              onError={() => setPosterError(true)}
            />
          </div>

          <div className={styles.heroInfo}>
            {movie.genres && movie.genres.length > 0 && (
              <div className={styles.genres}>
                {movie.genres.map((g) => (
                  <span key={g} className={styles.genre}>{g}</span>
                ))}
              </div>
            )}

            <h1 className={styles.title}>{movie.title}</h1>

            {movie.tagline && (
              <p className={styles.tagline}>"{movie.tagline}"</p>
            )}

            <div className={styles.ratingRow}>
              <span className={styles.score}>{movie.vote_average?.toFixed(1)}</span>
              <span className={styles.scoreLabel}>/ 10</span>
              {movie.vote_count && (
                <span className={styles.voteCount}>
                  ({new Intl.NumberFormat().format(movie.vote_count)} votes)
                </span>
              )}
            </div>

            {movie.overview && (
              <p className={styles.overview}>{movie.overview}</p>
            )}

            <dl className={styles.details}>
              <DetailRow label="Director" value={movie.director} />
              <DetailRow label="Release Date" value={parseDate(movie.release_date)} />
              <DetailRow label="Runtime" value={formatRuntime(movie.runtime)} />
              <DetailRow label="Status" value={movie.status} />
              <DetailRow label="Language" value={formatLanguage(movie.original_language)} />
              <DetailRow label="Budget" value={formatCurrency(movie.budget)} />
              <DetailRow label="Revenue" value={formatCurrency(movie.revenue)} />
            </dl>

            {movie.cast && movie.cast.length > 0 && (
              <div className={styles.castSection}>
                <h3 className={styles.castHeading}>Cast</h3>
                <div className={styles.castList}>
                  {movie.cast.map((name) => (
                    <span key={name} className={styles.castName}>{name}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetailPage;