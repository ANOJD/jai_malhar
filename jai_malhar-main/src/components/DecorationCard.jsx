import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Lightbulb } from 'lucide-react';
import { useBooking } from '../context/BookingContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { ROUTES } from '../utils/constants.js';
import styles from './DecorationCard.module.css';

export default function DecorationCard({ decoration, index = 0 }) {
  const navigate = useNavigate();
  const { updateDraft } = useBooking();
  const { t } = useLanguage();

  const handleBook = () => {
    updateDraft({
      eventType: decoration.eventType,
      decorationId: decoration.id,
      decorationName: decoration.title,
      decoratorSuggestion: false,
    });
    navigate(ROUTES.BOOKING);
  };

  const handleSuggestion = () => {
    updateDraft({
      eventType: decoration.eventType,
      decorationId: '',
      decorationName: '',
      decoratorSuggestion: true,
    });
    navigate(ROUTES.BOOKING);
  };

  return (
    <motion.article
      className={styles.card}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.1, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -8 }}
    >
      <div className={styles.imageWrap}>
        <img src={decoration.imageUrl} alt={decoration.title} className={styles.image} loading="lazy" />
        <span className={styles.categoryBadge}>{t(`categories.${decoration.eventType}`)}</span>
        {decoration.featured && <span className={styles.featuredBadge}>Featured</span>}
        <div className={styles.imageOverlay} />
      </div>

      <div className={styles.body}>
        <h3 className={styles.name}>{decoration.title}</h3>
        <p className={styles.description}>{decoration.description}</p>
        <div className={styles.priceNote}>
          <span className={styles.priceDot} />
          {t('home.ctaContactPrice')}
        </div>
        <div className={styles.actions}>
          <button className={styles.bookBtn} onClick={handleBook}>
            {t('home.bookYourEvent')}
            <ArrowRight size={16} />
          </button>
          <button className={styles.suggestBtn} onClick={handleSuggestion}>
            <Lightbulb size={16} />
            {t('booking.suggestionTitle')}
          </button>
        </div>
      </div>
    </motion.article>
  );
}
