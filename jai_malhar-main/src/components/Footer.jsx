import { Link } from 'react-router-dom';
import { Sparkles, Phone, Mail, MapPin, Clock, Facebook, Instagram, Youtube, MessageCircle } from 'lucide-react';
import { ROUTES, EVENT_CATEGORIES } from '../utils/constants.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useSettings } from '../context/SettingsContext.jsx';
import styles from './Footer.module.css';

export default function Footer() {
  const { t } = useLanguage();
  const settings = useSettings();

  return (
    <footer className={styles.footer}>
      <div className={styles.topWave} />
      <div className={`container ${styles.inner}`}>
        <div className={styles.grid}>
          {/* Brand */}
          <div className={styles.brandCol}>
            <div className={styles.brand}>
              <span className={styles.brandIcon}>
                <Sparkles size={22} />
              </span>
              <span className={styles.brandText}>
                <span className={styles.brandMain}>Jai Malhar</span>
                <span className={styles.brandSub}>Events & Decorations</span>
              </span>
            </div>
            <p className={styles.about}>
              {t('footer.about')}
            </p>
            <div className={styles.socials}>
              <a href="#" className={styles.social} aria-label="Facebook"><Facebook size={18} /></a>
              <a href="#" className={styles.social} aria-label="Instagram"><Instagram size={18} /></a>
              <a href="#" className={styles.social} aria-label="YouTube"><Youtube size={18} /></a>
              <a href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`} className={styles.social} aria-label="WhatsApp"><MessageCircle size={18} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>{t('footer.quickLinks')}</h4>
            <ul className={styles.linkList}>
              <li><Link to={ROUTES.HOME}>{t('nav.home')}</Link></li>
              <li><Link to={ROUTES.DECORATIONS}>{t('nav.decorations')}</Link></li>
              <li><Link to={ROUTES.GALLERY}>{t('nav.gallery')}</Link></li>
              <li><Link to={ROUTES.REVIEWS}>{t('nav.reviews')}</Link></li>
              <li><Link to={ROUTES.CONTACT}>{t('footer.contactUs')}</Link></li>
              <li><Link to={ROUTES.BOOKING}>{t('footer.bookAnEvent')}</Link></li>
            </ul>
          </div>

          {/* Event Categories */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>{t('footer.ourServices')}</h4>
            <ul className={styles.linkList}>
              {EVENT_CATEGORIES.slice(0, 7).map((cat) => (
                <li key={cat.id}>
                  <Link to={`${ROUTES.DECORATIONS}?category=${cat.id}`}>{t(`categories.${cat.id}`)}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>{t('footer.getInTouch')}</h4>
            <ul className={styles.contactList}>
              <li>
                <MapPin size={18} className={styles.contactIcon} />
                <span>{settings.address}</span>
              </li>
              <li>
                <Phone size={18} className={styles.contactIcon} />
                <span>
                  <a href={`tel:${settings.primaryPhone.replace(/\s/g, '')}`}>{settings.primaryPhone}</a>
                  {settings.secondaryPhone && <><br /><a href={`tel:${settings.secondaryPhone.replace(/\s/g, '')}`}>{settings.secondaryPhone}</a></>}
                </span>
              </li>
              <li>
                <Mail size={18} className={styles.contactIcon} />
                <a href={`mailto:${settings.email}`}>{settings.email}</a>
              </li>
              <li>
                <Clock size={18} className={styles.contactIcon} />
                <span>{settings.hours}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>© {new Date().getFullYear()} {settings.businessName}. {t('footer.allRights')}</p>
          <p className={styles.bottomLinks}>
            <Link to={ROUTES.ADMIN_LOGIN}>{t('footer.adminLogin')}</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
