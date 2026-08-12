import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquarePlus, X } from 'lucide-react';
import { useAsync } from '../hooks/useAsync.js';
import { reviewService } from '../services/api.service.js';
import { EVENT_CATEGORIES } from '../utils/constants.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { validateRequired, validatePhone } from '../utils/helpers.js';
import SectionTitle from '../components/SectionTitle.jsx';
import ReviewCard from '../components/ReviewCard.jsx';
import StarRating from '../components/StarRating.jsx';
import Button from '../components/Button.jsx';
import Modal from '../components/Modal.jsx';
import { SkeletonCard } from '../components/Skeleton.jsx';
import styles from './Reviews.module.css';

export default function Reviews() {
  const { t, tf } = useLanguage();
 const { data: reviews, loading, refetch } =
  useAsync(() => reviewService.getAll(), []);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    event: '',
    rating: 5,
    comment: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const avgRating = reviews?.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0';

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const e = {};
    if (!validateRequired(formData.name)) e.name = t('reviews.errName');
    if (!validatePhone(formData.phone)) e.phone = t('reviews.errPhone');
    if (!validateRequired(formData.event)) e.event = t('reviews.errEvent');
    if (!validateRequired(formData.comment)) e.comment = t('reviews.errComment');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
     await reviewService.create(formData);
      setShowForm(false);
      setFormData({ name: '', phone: '', event: '', rating: 5, comment: '' });
      refetch();
    } catch (err) {
      setErrors({ submit: err.message || t('reviews.errSubmit') });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <section className={styles.header}>
        <div className={styles.headerBg} />
        <div className={`container ${styles.headerContent}`}>
          <SectionTitle
            eyebrow={t('reviews.eyebrow')}
            title={t('reviews.title')}
            subtitle={t('reviews.subtitle')}
            light
          />
          {reviews && reviews.length > 0 && (
            <div className={styles.ratingSummary}>
              <div className={styles.avgRating}>
                <span className={styles.avgNum}>{avgRating}</span>
                <StarRating value={Math.round(avgRating)} size={20} />
                <span className={styles.avgLabel}>{t('reviews.outOf5')}</span>
              </div>
              <span className={styles.reviewCount}>
                {tf('reviews.basedOn', reviews.length)}
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Reviews Grid */}
      <section className={styles.reviewsSection}>
        <div className="container">
          <div className={styles.writeBar}>
            <p className={styles.writeText}>{t('reviews.writeText')}</p>
            <Button variant="primary" size="md" leftIcon={MessageSquarePlus} onClick={() => setShowForm(true)}>
              {t('reviews.writeReview')}
            </Button>
          </div>

          {loading ? (
            <div className={styles.grid}>
              {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : (
            <div className={styles.grid}>
              {reviews?.map((rev, i) => (
                <ReviewCard key={rev.id} review={rev} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Write Review Modal */}
      <Modal open={showForm} onClose={() => setShowForm(false)} maxWidth={540}>
        <div className={styles.formModal}>
          <div className={styles.formHeader}>
            <h2>{t('reviews.writeReview')}</h2>
            <button className={styles.formClose} onClick={() => setShowForm(false)}>
              <X size={22} />
            </button>
          </div>

          <div className={styles.formBody}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>{t('reviews.formName')}</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`${styles.formInput} ${errors.name ? styles.inputError : ''}`}
                placeholder={t('reviews.formNamePlaceholder')}
              />
              {errors.name && <span className={styles.errorText}>{errors.name}</span>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>{t('reviews.formPhone')}</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`${styles.formInput} ${errors.phone ? styles.inputError : ''}`}
                placeholder={t('reviews.formPhonePlaceholder')}
                maxLength={10}
              />
              {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>{t('reviews.formEvent')}</label>
              <select
                value={formData.event}
                onChange={(e) => handleInputChange('event', e.target.value)}
                className={`${styles.formInput} ${errors.event ? styles.inputError : ''}`}
              >
                <option value="">{t('reviews.formEventPlaceholder')}</option>
                {EVENT_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.label}>{t(`categories.${cat.id}`)}</option>
                ))}
              </select>
              {errors.event && <span className={styles.errorText}>{errors.event}</span>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>{t('reviews.formRating')}</label>
              <div className={styles.ratingInput}>
                <StarRating value={formData.rating} onChange={(v) => handleInputChange('rating', v)} interactive size={28} />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>{t('reviews.formReview')}</label>
              <textarea
                value={formData.comment}
                onChange={(e) => handleInputChange('comment', e.target.value)}
                className={`${styles.formInput} ${styles.formTextarea} ${errors.comment ? styles.inputError : ''}`}
                placeholder={t('reviews.formReviewPlaceholder')}
                rows={4}
              />
              {errors.comment && <span className={styles.errorText}>{errors.comment}</span>}
            </div>

            {errors.submit && <div className={styles.submitError}>{errors.submit}</div>}

            <Button variant="primary" size="md" fullWidth isLoading={submitting} onClick={handleSubmit}>
              {t('reviews.submit')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
