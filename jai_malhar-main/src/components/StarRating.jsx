import { Star } from 'lucide-react';
import styles from './StarRating.module.css';

// Interactive star rating. If `interactive` is false, renders a display-only row.
export default function StarRating({ value = 0, onChange, size = 22, interactive = false }) {
  return (
    <div className={styles.container}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={styles.starBtn}
          disabled={!interactive}
          onClick={() => interactive && onChange?.(star)}
          aria-label={`${star} star${star > 1 ? 's' : ''}`}
        >
          <Star
            size={size}
            className={`${styles.star} ${star <= value ? styles.filled : ''}`}
            fill={star <= value ? 'var(--color-secondary)' : 'none'}
            strokeWidth={1.5}
          />
        </button>
      ))}
    </div>
  );
}
