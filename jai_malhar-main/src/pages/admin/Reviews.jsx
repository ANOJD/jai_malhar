import { useState, useMemo } from 'react';
import { Search, Trash2, Star } from 'lucide-react';
import { useAsync } from '../../hooks/useAsync.js';
import { reviewService } from '../../services/api.service.js';
import { formatDate } from '../../utils/helpers.js';
import StarRating from '../../components/StarRating.jsx';
import styles from './admin.module.css';

export default function AdminReviews() {
  const { data: reviews, loading, error, refetch } = useAsync(async () => {
    try {
      return await reviewService.getAll();
    } catch (err) {
      throw err;
    }
  }, []);
  const [search, setSearch] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');

  const filtered = useMemo(() => {
    if (!reviews) return [];
    return reviews.filter((r) => {
      const matchSearch = !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.comment.toLowerCase().includes(search.toLowerCase());
      const matchRating = ratingFilter === 'all' || r.rating === parseInt(ratingFilter);
      return matchSearch && matchRating;
    });
  }, [reviews, search, ratingFilter]);

  const handleDelete = async (id) => {
  if (!confirm('Delete this review?')) return;

  try {
    await reviewService.remove(id);
    await refetch();
  } catch (error) {
    alert(error.message || 'Failed to delete review.');
  }
};

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Customer Reviews</h1>
          <p className={styles.pageDesc}>View and moderate customer reviews and ratings.</p>
        </div>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search reviews..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <select
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="all">All Ratings</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>
      </div>

      {error && (
        <div className={styles.errorBanner} style={{ marginBottom: '16px' }}>
          {error}
        </div>
      )}
      <div className={styles.tableCard}>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Event</th>
                <th>Rating</th>
                <th>Comment</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className={styles.emptyState}>Loading reviews...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className={styles.emptyState}>No reviews found.</td></tr>
              ) : (
                filtered.map((rev) => (
                  <tr key={rev.id}>
                    <td><strong style={{ color: 'var(--color-primary)' }}>{rev.name}</strong></td>
                    <td>{rev.event}</td>
                    <td><StarRating value={rev.rating} size={16} /></td>
                    <td style={{ maxWidth: '300px' }}>{rev.comment}</td>
                    <td>{formatDate(rev.createdAt)}</td>
                    <td>
                      <div className={styles.actionBtns}>
                        <button className={`${styles.actionBtn} ${styles.actionDelete}`} onClick={() => handleDelete(rev.id)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
