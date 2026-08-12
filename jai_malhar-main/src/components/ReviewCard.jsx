import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import StarRating from './StarRating.jsx';
import { formatDate } from '../utils/helpers.js';
import styles from './ReviewCard.module.css';

export default function ReviewCard({ review, index = 0 }) {
  const initials = review.name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('');

  return (
    <motion.article
      className={styles.card}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.1, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4 }}
    >
      <Quote className={styles.quoteIcon} size={36} />
      <StarRating value={review.rating} size={18} />
      <p className={styles.comment}>"{review.comment}"</p>
      <div className={styles.author}>
        <span className={styles.avatar}>{initials}</span>
        <div className={styles.authorInfo}>
          <span className={styles.name}>{review.name}</span>
          <span className={styles.meta}>
            {review.event} · {formatDate(review.createdAt)}
          </span>
        </div>
      </div>
    </motion.article>
  );
}
