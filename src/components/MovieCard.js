// import React, { useState } from 'react';
// import styles from './MovieCard.module.css';

// const FALLBACK_POSTER = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="300" viewBox="0 0 200 300"><rect width="200" height="300" fill="%231a1a26"/><text x="100" y="150" font-family="sans-serif" font-size="40" fill="%23ffffff22" text-anchor="middle" dominant-baseline="middle">🎬</text></svg>';

// function parseYear(dateStr) {
//   if (!dateStr) return null;
//   const parts = dateStr.split('/');
//   if (parts.length === 3) {
//     const yr = parseInt(parts[2]);
//     return yr + (yr < 50 ? 2000 : 1900);
//   }
//   return null;
// }

// function StarRating({ score }) {
//   const pct = (score / 10) * 100;
//   return (
//     <div className={styles.ratingWrap} title={`${score}/10`}>
//       <span className={styles.ratingNum}>{score.toFixed(1)}</span>
//       <div className={styles.stars}>
//         <div className={styles.starsEmpty}>★★★★★</div>
//         <div className={styles.starsFill} style={{ width: `${pct}%` }}>★★★★★</div>
//       </div>
//     </div>
//   );
// }

// function MovieCard({ movie, index, onClick }) {
//   const [imgError, setImgError] = useState(false);

//   return (
//     <article
//       className={styles.card}
//       style={{ animationDelay: `${index * 40}ms` }}
//       onClick={onClick}
//       role="button"
//       tabIndex={0}
//       onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
//       aria-label={`View details for ${movie.title}`}
//     >
//       <div className={styles.poster}>
//         <img
//           src={imgError ? FALLBACK_POSTER : (movie.poster_path || FALLBACK_POSTER)}
//           alt={movie.title}
//           onError={() => setImgError(true)}
//           loading="lazy"
//         />
//         <div className={styles.overlay}>
//           <span className={styles.viewBtn}>View Film</span>
//         </div>
//         {movie.genres && movie.genres[0] && (
//           <span className={styles.genreBadge}>{movie.genres[0]}</span>
//         )}
//       </div>

//       <div className={styles.info}>
//         <h2 className={styles.title}>{movie.title}</h2>
//         {movie.tagline && (
//           <p className={styles.tagline}>{movie.tagline}</p>
//         )}
//         <div className={styles.footer}>
//           <StarRating score={movie.vote_average} />
//           {movie.release_date && (
//             <span className={styles.year}>
//               {parseYear(movie.release_date)}
//             </span>
//           )}
//         </div>
//       </div>
//     </article>
//   );
// }

// export default MovieCard;




import React, { useState } from 'react';
import styles from './MovieCard.module.css';

const FALLBACK_POSTER = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="300" viewBox="0 0 200 300"><rect width="200" height="300" fill="%231a1a26"/><text x="100" y="150" font-family="sans-serif" font-size="40" fill="%23ffffff22" text-anchor="middle" dominant-baseline="middle">🎬</text></svg>';

function parseYear(dateStr) {
  if (!dateStr) return null;
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    const yr = parseInt(parts[2]);
    return yr + (yr < 50 ? 2000 : 1900);
  }
  return null;
}

function StarRating({ score }) {
  if (score == null || isNaN(score)) return null; // ✅ guard added
  const pct = (score / 10) * 100;
  return (
    <div className={styles.ratingWrap} title={`${score}/10`}>
      <span className={styles.ratingNum}>{score.toFixed(1)}</span>
      <div className={styles.stars}>
        <div className={styles.starsEmpty}>★★★★★</div>
        <div className={styles.starsFill} style={{ width: `${pct}%` }}>★★★★★</div>
      </div>
    </div>
  );
}

function MovieCard({ movie, index, onClick }) {
  const [imgError, setImgError] = useState(false);
  const year = parseYear(movie.release_date); // ✅ computed once

  return (
    <article
      className={styles.card}
      style={{ animationDelay: `${index * 40}ms` }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
      aria-label={`View details for ${movie.title}`}
    >
      <div className={styles.poster}>
        <img
          src={imgError ? FALLBACK_POSTER : (movie.poster_path || FALLBACK_POSTER)}
          alt={movie.title}
          onError={() => setImgError(true)}
          loading="lazy"
        />
        <div className={styles.overlay}>
          <span className={styles.viewBtn}>View Film</span>
        </div>
        {movie.genres && movie.genres[0] && (
          <span className={styles.genreBadge}>{movie.genres[0]}</span>
        )}
      </div>

      <div className={styles.info}>
        <h2 className={styles.title}>{movie.title}</h2>
        {movie.tagline && (
          <p className={styles.tagline}>{movie.tagline}</p>
        )}
        <div className={styles.footer}>
          {movie.vote_average != null && ( // ✅ guard added
            <StarRating score={movie.vote_average} />
          )}
          {year && ( // ✅ only renders if valid
            <span className={styles.year}>{year}</span>
          )}
        </div>
      </div>
    </article>
  );
}

export default MovieCard;