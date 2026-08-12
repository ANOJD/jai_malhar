import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import styles from './EventCard.module.css';

export default function EventCard({ category, index = 0 }) {
  const { t } = useLanguage();
  const Icon = Icons[category.icon] || Icons.Sparkles;

  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.08, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6 }}
    >
      <Link to={`/decorations?category=${category.id}`} className={styles.link}>
        <div className={styles.iconWrap}>
          <Icon size={28} className={styles.icon} />
        </div>
        <span className={styles.label}>{t(`categories.${category.id}`)}</span>
        <span className={styles.arrow}>→</span>
      </Link>
    </motion.div>
  );
}
