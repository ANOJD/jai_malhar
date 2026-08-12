import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useAsync } from '../hooks/useAsync.js';
import { decorationService } from '../services/api.service.js';
import { EVENT_CATEGORIES, SORT_OPTIONS } from '../utils/constants.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import SectionTitle from '../components/SectionTitle.jsx';
import DecorationCard from '../components/DecorationCard.jsx';
import { SkeletonCard } from '../components/Skeleton.jsx';
import styles from './Decorations.module.css';

export default function Decorations() {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: decorations, loading } = useAsync(() => decorationService.getAll(), []);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [sortBy, setSortBy] = useState(SORT_OPTIONS.NEWEST);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setCategory(cat);
  }, [searchParams]);

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    if (cat === 'all') setSearchParams({});
    else setSearchParams({ category: cat });
  };

  const filtered = useMemo(() => {
    if (!decorations) return [];
    let result = [...decorations];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q)
      );
    }

    if (category !== 'all') {
      result = result.filter((d) => d.eventType === category);
    }

    switch (sortBy) {
      case SORT_OPTIONS.NEWEST:
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case SORT_OPTIONS.POPULAR:
        result.sort((a, b) => b.popularity - a.popularity);
        break;
      case SORT_OPTIONS.ALPHABETICAL:
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    return result;
  }, [decorations, search, category, sortBy]);

  return (
    <div className={styles.page}>
      {/* Header */}
      <section className={styles.header}>
        <div className={styles.headerBg} />
        <div className={`container ${styles.headerContent}`}>
          <SectionTitle
            eyebrow={t('decorations.eyebrow')}
            title={t('decorations.title')}
            subtitle={t('decorations.subtitle')}
            light
          />
        </div>
      </section>

      {/* Search & Filter Bar */}
      <section className={styles.toolbarSection}>
        <div className="container">
          <div className={styles.toolbar}>
            <div className={styles.searchWrap}>
              <Search size={20} className={styles.searchIcon} />
              <input
                type="text"
                placeholder={t('decorations.searchPlaceholder')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={styles.searchInput}
              />
              {search && (
                <button className={styles.searchClear} onClick={() => setSearch('')}>
                  <X size={18} />
                </button>
              )}
            </div>

            <div className={styles.sortWrap}>
              <SlidersHorizontal size={18} className={styles.sortIcon} />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={styles.sortSelect}
              >
                <option value={SORT_OPTIONS.NEWEST}>{t('decorations.sortNewest')}</option>
                <option value={SORT_OPTIONS.POPULAR}>{t('decorations.sortPopular')}</option>
                <option value={SORT_OPTIONS.ALPHABETICAL}>{t('decorations.sortAZ')}</option>
              </select>
            </div>
          </div>

          {/* Category Filters */}
          <div className={styles.categoryFilters}>
            <button
              className={`${styles.catChip} ${category === 'all' ? styles.active : ''}`}
              onClick={() => handleCategoryChange('all')}
            >
              {t('decorations.allCategories')}
            </button>
            {EVENT_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                className={`${styles.catChip} ${category === cat.id ? styles.active : ''}`}
                onClick={() => handleCategoryChange(cat.id)}
              >
                {t(`categories.${cat.id}`)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Decorations Grid */}
      <section className={styles.gridSection}>
        <div className="container">
          <div className={styles.resultCount}>
            {loading
              ? t('decorations.loading')
              : t('decorations.resultsFound')(filtered.length)}
          </div>

          {loading ? (
            <div className={styles.grid}>
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className={styles.empty}>
              <p>{t('decorations.noMatch')}</p>
            </div>
          ) : (
            <div className={styles.grid}>
              {filtered.map((dec, i) => (
                <DecorationCard key={dec.id} decoration={dec} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
