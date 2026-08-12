import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { useAsync } from '../hooks/useAsync.js';
import { galleryService } from '../services/api.service.js';
import { EVENT_CATEGORIES } from '../utils/constants.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import SectionTitle from '../components/SectionTitle.jsx';
import Skeleton, { SkeletonCard } from '../components/Skeleton.jsx';
import Modal from '../components/Modal.jsx';
import styles from './Gallery.module.css';

export default function Gallery() {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: images, loading } = useAsync(() => galleryService.getAll(), []);
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'all');
  const [popupIndex, setPopupIndex] = useState(null);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setActiveCategory(cat);
  }, [searchParams]);

  const filtered = useMemo(() => {
    if (!images) return [];
    const sorted = [...images].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (activeCategory === 'all') return sorted;
    return sorted.filter((img) => img.category === activeCategory);
  }, [images, activeCategory]);

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    if (cat === 'all') setSearchParams({});
    else setSearchParams({ category: cat });
  };

  const showPrev = () => setPopupIndex((i) => (i > 0 ? i - 1 : filtered.length - 1));
  const showNext = () => setPopupIndex((i) => (i < filtered.length - 1 ? i + 1 : 0));

  return (
    <div className={styles.page}>
      {/* Header */}
      <section className={styles.header}>
        <div className={styles.headerBg} />
        <div className={`container ${styles.headerContent}`}>
          <SectionTitle
            eyebrow={t('gallery.eyebrow')}
            title={t('gallery.title')}
            subtitle={t('gallery.subtitle')}
            light
          />
        </div>
      </section>

      {/* Filters */}
      <section className={styles.filtersSection}>
        <div className="container">
          <div className={styles.filterBar}>
            <div className={styles.filterLabel}>
              <Filter size={18} />
              <span>{t('gallery.filterByCategory')}</span>
            </div>
            <div className={styles.filters}>
              <button
                className={`${styles.filterChip} ${activeCategory === 'all' ? styles.active : ''}`}
                onClick={() => handleCategoryChange('all')}
              >
                {t('gallery.allEvents')}
              </button>
              {EVENT_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  className={`${styles.filterChip} ${activeCategory === cat.id ? styles.active : ''}`}
                  onClick={() => handleCategoryChange(cat.id)}
                >
                  {t(`categories.${cat.id}`)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Masonry Gallery */}
      <section className={styles.gallerySection}>
        <div className="container">
          {loading ? (
            <div className={styles.masonry}>
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} variant="rect" height={300} radius="var(--radius-lg)" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className={styles.empty}>
              <p>{t('gallery.empty')}</p>
            </div>
          ) : (
            <div className={styles.masonry}>
              {filtered.map((img, i) => (
                <motion.button
                  key={img.id}
                  className={styles.masonryItem}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: (i % 6) * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => setPopupIndex(i)}
                >
                  <img src={img.url} alt={img.title} loading="lazy" />
                  <div className={styles.itemOverlay}>
                    <span className={styles.itemTitle}>{img.title}</span>
                    <span className={styles.itemCategory}>{t(`categories.${img.category}`)}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Popup Preview */}
      <AnimatePresence>
        {popupIndex !== null && filtered[popupIndex] && (
          <motion.div
            className={styles.popupOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPopupIndex(null)}
          >
            <button className={styles.popupClose} onClick={() => setPopupIndex(null)}>
              <X size={28} />
            </button>
            <button className={`${styles.popupNav} ${styles.prev}`} onClick={(e) => { e.stopPropagation(); showPrev(); }}>
              <ChevronLeft size={32} />
            </button>
            <motion.div
              className={styles.popupContent}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <img src={filtered[popupIndex].url} alt={filtered[popupIndex].title} />
              <div className={styles.popupInfo}>
                <h3>{filtered[popupIndex].title}</h3>
                <span>{t(`categories.${filtered[popupIndex].category}`)}</span>
              </div>
            </motion.div>
            <button className={`${styles.popupNav} ${styles.next}`} onClick={(e) => { e.stopPropagation(); showNext(); }}>
              <ChevronRight size={32} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
