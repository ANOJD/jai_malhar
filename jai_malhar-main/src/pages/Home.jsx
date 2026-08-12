import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Calendar,
  Award,
  Heart,
  Sparkles,
  Users,
  Clock,
  CheckCircle2,
  Star,
  ChevronRight,
} from 'lucide-react';
import { ROUTES, EVENT_CATEGORIES, BUSINESS } from '../utils/constants.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useAsync } from '../hooks/useAsync.js';
import { decorationService } from '../services/api.service.js';
import SectionTitle from '../components/SectionTitle.jsx';
import EventCard from '../components/EventCard.jsx';
import DecorationCard from '../components/DecorationCard.jsx';
import ReviewCard from '../components/ReviewCard.jsx';
import { SkeletonCard } from '../components/Skeleton.jsx';
import Button from '../components/Button.jsx';
import styles from './Home.module.css';

export default function Home() {
  const { t } = useLanguage();
  const { data: decorations, loading: decLoading } = useAsync(() => decorationService.getAll(), []);
  const { data: reviews, loading: revLoading } = useAsync(() => reviewService.getAll(), []);

  const featuredDecorations = decorations?.filter((d) => d.featured).slice(0, 3) || [];
  const latestDecorations = decorations?.slice(0, 6) || [];
  const topReviews = reviews?.slice(0, 3) || [];

  const whyChooseUs = [
    { icon: Award, title: t('home.whyQualityTitle'), desc: t('home.whyQualityDesc') },
    { icon: Heart, title: t('home.whyPersonalTitle'), desc: t('home.whyPersonalDesc') },
    { icon: Users, title: t('home.whyExperiencedTitle'), desc: t('home.whyExperiencedDesc') },
    { icon: Clock, title: t('home.whyOnTimeTitle'), desc: t('home.whyOnTimeDesc') },
  ];

  return (
    <div className={styles.page}>
      {/* ===== HERO ===== */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <img
            src="https://images.pexels.com/photos/13156145/pexels-photo-13156145.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt={t('home.heroAlt')}
            className={styles.heroImg}
          />
          <div className={styles.heroOverlay} />
        </div>

        <div className={`container ${styles.heroContent}`}>
          <motion.div
            className={styles.heroText}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className={styles.heroEyebrow}>
              <Sparkles size={16} />
              {BUSINESS.tagline}
            </span>
            <h1 className={styles.heroTitle}>
              {t('home.heroTitle1')} <span className={styles.gold}>{t('home.heroTitle2')}</span> {t('home.heroTitle3')}
            </h1>
            <p className={styles.heroSubtitle}>
              {t('home.heroSubtitle')}
            </p>
            <div className={styles.heroActions}>
              <Link to={ROUTES.BOOKING}>
                <Button variant="gold" size="lg" rightIcon={Calendar}>
                  {t('home.bookYourEvent')}
                </Button>
              </Link>
              <Link to={ROUTES.DECORATIONS}>
                <Button variant="glass" size="lg" rightIcon={ArrowRight}>
                  {t('home.exploreDecorations')}
                </Button>
              </Link>
            </div>
            <div className={styles.heroStats}>
              <div className={styles.stat}>
                <span className={styles.statNum}>500+</span>
                <span className={styles.statLabel}>{t('home.statEvents')}</span>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.stat}>
                <span className={styles.statNum}>12</span>
                <span className={styles.statLabel}>{t('home.statCategories')}</span>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.stat}>
                <span className={styles.statNum}>4.9★</span>
                <span className={styles.statLabel}>{t('home.statRating')}</span>
              </div>
            </div>
          </motion.div>
        </div>
        <div className={styles.heroScroll}>
          <span className={styles.scrollLine} />
        </div>
      </section>

      {/* ===== EVENT CATEGORIES ===== */}
      <section className={styles.section}>
        <div className="container">
          <SectionTitle
            eyebrow={t('home.servicesEyebrow')}
            title={t('home.servicesTitle')}
            subtitle={t('home.servicesSubtitle')}
          />
          <div className={styles.categoryGrid}>
            {EVENT_CATEGORIES.map((cat, i) => (
              <EventCard key={cat.id} category={cat} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED DECORATIONS ===== */}
      <section className={`${styles.section} ${styles.featuredSection}`}>
        <div className="container">
          <SectionTitle
            eyebrow={t('home.featuredEyebrow')}
            title={t('home.featuredTitle')}
            subtitle={t('home.featuredSubtitle')}
          />
          <div className={styles.decorationGrid}>
            {decLoading
              ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
              : featuredDecorations.map((dec, i) => (
                  <DecorationCard key={dec.id} decoration={dec} index={i} />
                ))}
          </div>
          <div className={styles.viewAllWrap}>
            <Link to={ROUTES.DECORATIONS}>
              <Button variant="outline" size="md" rightIcon={ChevronRight}>
                {t('home.viewAllDecorations')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== WHY CHOOSE US ===== */}
      <section className={styles.whySection}>
        <div className="container">
          <SectionTitle
            eyebrow={t('home.whyEyebrow')}
            title={t('home.whyTitle')}
            subtitle={t('home.whySubtitle')}
            light
          />
          <div className={styles.whyGrid}>
            {whyChooseUs.map((item, i) => (
              <motion.div
                key={i}
                className={styles.whyCard}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -6 }}
              >
                <div className={styles.whyIcon}>
                  <item.icon size={28} />
                </div>
                <h3 className={styles.whyTitle}>{item.title}</h3>
                <p className={styles.whyDesc}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== LATEST EVENTS PREVIEW ===== */}
      <section className={styles.section}>
        <div className="container">
          <SectionTitle
            eyebrow={t('home.recentEyebrow')}
            title={t('home.recentTitle')}
            subtitle={t('home.recentSubtitle')}
          />
          <div className={styles.decorationGrid}>
            {decLoading
              ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
              : latestDecorations.slice(0, 3).map((dec, i) => (
                  <DecorationCard key={dec.id} decoration={dec} index={i} />
                ))}
          </div>
        </div>
      </section>

      {/* ===== GALLERY PREVIEW ===== */}
      <section className={`${styles.section} ${styles.galleryPreview}`}>
        <div className="container">
          <SectionTitle
            eyebrow={t('home.galleryEyebrow')}
            title={t('home.galleryTitle')}
            subtitle={t('home.gallerySubtitle')}
          />
          <div className={styles.galleryGrid}>
            {[
              '34079355', '14395559', '33417234', '35985211', '16120244', '17001756',
            ].map((id, i) => (
              <motion.div
                key={id}
                className={styles.galleryItem}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.1, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4 }}
              >
                <Link to={ROUTES.GALLERY}>
                  <img
                    src={`https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=600`}
                    alt="Gallery preview"
                    loading="lazy"
                  />
                  <div className={styles.galleryOverlay}>
                    <span>{t('home.viewGallery')}</span>
                    <ArrowRight size={20} />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          <div className={styles.viewAllWrap}>
            <Link to={ROUTES.GALLERY}>
              <Button variant="gold" size="md" rightIcon={ArrowRight}>
                {t('home.exploreFullGallery')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== REVIEWS ===== */}
      <section className={styles.section}>
        <div className="container">
          <SectionTitle
            eyebrow={t('home.reviewsEyebrow')}
            title={t('home.reviewsTitle')}
            subtitle={t('home.reviewsSubtitle')}
          />
          <div className={styles.reviewGrid}>
            {revLoading
              ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
              : topReviews.map((rev, i) => (
                  <ReviewCard key={rev.id} review={rev} index={i} />
                ))}
          </div>
          <div className={styles.viewAllWrap}>
            <Link to={ROUTES.REVIEWS}>
              <Button variant="outline" size="md" rightIcon={ChevronRight}>
                {t('home.readAllReviews')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaBg} />
        <div className="container">
          <motion.div
            className={styles.ctaContent}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={styles.ctaBadge}>
              <CheckCircle2 size={18} />
              <span>{t('home.ctaBadge')}</span>
            </div>
            <h2 className={styles.ctaTitle}>
              {t('home.ctaTitle1')} <span className={styles.gold}>{t('home.ctaTitle2')}</span>
            </h2>
            <p className={styles.ctaText}>
              {t('home.ctaText')}
            </p>
            <div className={styles.ctaActions}>
              <Link to={ROUTES.BOOKING}>
                <Button variant="gold" size="lg" rightIcon={Calendar}>
                  {t('home.ctaBookNow')}
                </Button>
              </Link>
              <Link to={ROUTES.CONTACT}>
                <Button variant="glass" size="lg">
                  {t('home.ctaContactPrice')}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
