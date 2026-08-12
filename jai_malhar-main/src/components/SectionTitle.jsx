import { motion } from 'framer-motion';
import styles from './SectionTitle.module.css';

// Reusable section heading with eyebrow label, title, and optional subtitle.
export default function SectionTitle({ eyebrow, title, subtitle, align = 'center', light = false }) {
  return (
    <motion.div
      className={`${styles.wrapper} ${styles[align]}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {eyebrow && (
        <span className={`${styles.eyebrow} ${light ? styles.lightEyebrow : ''}`}>
          <span className={styles.eyebrowLine} />
          {eyebrow}
          <span className={styles.eyebrowLine} />
        </span>
      )}
      <h2 className={`${styles.title} ${light ? styles.lightTitle : ''}`}>{title}</h2>
      {subtitle && (
        <p className={`${styles.subtitle} ${light ? styles.lightSubtitle : ''}`}>{subtitle}</p>
      )}
    </motion.div>
  );
}
