import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, MessageCircle, Home, CheckCircle2, Clock, User } from 'lucide-react';
import { useBooking } from '../context/BookingContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { ROUTES } from '../utils/constants.js';
import { useSettings } from '../context/SettingsContext.jsx';
import Button from '../components/Button.jsx';
import styles from './BookingSuccess.module.css';

export default function BookingSuccess() {
  const { t } = useLanguage();
  const { lastBooking } = useBooking();
  const settings = useSettings();

  return (
    <div className={styles.page}>
      <div className={styles.bgPattern} />

      <motion.div
        className={styles.card}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Animated Check */}
        <div className={styles.checkWrap}>
          <motion.div
            className={styles.checkCircle}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1], delay: 0.2 }}
          >
            <svg viewBox="0 0 52 52" className={styles.checkSvg}>
              <motion.path
                d="M14 27 L22 35 L38 17"
                fill="none"
                stroke="#fff"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              />
            </svg>
          </motion.div>
          <div className={styles.pulseRing} />
          <div className={styles.pulseRing2} />
        </div>

        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          {t('bookingSuccess.title')}
        </motion.h1>

        <motion.p
          className={styles.message}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {t('bookingSuccess.message1')}
          <br />
          {t('bookingSuccess.message2')}
        </motion.p>

        {/* Booking Info */}
        {lastBooking && (
          <motion.div
            className={styles.infoCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
          >
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>{t('bookingSuccess.bookingId')}</span>
              <span className={styles.infoValue}>{lastBooking.id}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>{t('bookingSuccess.status')}</span>
              <span className={`${styles.infoValue} ${styles.statusBadge}`}>{t('bookingSuccess.pending')}</span>
            </div>
          </motion.div>
        )}

        {/* Owner Contact */}
        <motion.div
          className={styles.ownerCard}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <div className={styles.ownerInfo}>
            <div className={styles.ownerIcon}>
              <User size={20} />
            </div>
            <div>
              <span className={styles.ownerName}>{settings.ownerName}</span>
              <a className={styles.ownerPhone} href={`tel:${settings.primaryPhone.replace(/\s/g, '')}`}>{settings.primaryPhone}</a>
              {settings.secondaryPhone && <><span> | </span><a className={styles.ownerPhone} href={`tel:${settings.secondaryPhone.replace(/\s/g, '')}`}>{settings.secondaryPhone}</a></>}
            </div>
          </div>
          <p className={styles.urgentNote}>
            {t('bookingSuccess.urgentNote')}
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          className={styles.actions}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
        >
          <a href={`tel:${settings.primaryPhone.replace(/\s/g, '')}`}>
            <Button variant="primary" size="md" fullWidth leftIcon={Phone}>
              {t('bookingSuccess.callNow')}
            </Button>
          </a>
          <a href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
            <Button variant="success" size="md" fullWidth leftIcon={MessageCircle}>
              {t('bookingSuccess.whatsapp')}
            </Button>
          </a>
          <Link to={ROUTES.HOME}>
            <Button variant="outline" size="md" fullWidth leftIcon={Home}>
              {t('bookingSuccess.backHome')}
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
