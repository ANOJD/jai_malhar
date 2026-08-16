import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sparkles, Phone, Shield } from 'lucide-react';
import { ROUTES } from '../utils/constants.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useSettings } from '../context/SettingsContext.jsx';
import Button from './Button.jsx';
import LanguageSwitcher from './LanguageSwitcher.jsx';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { t } = useLanguage();
  const settings = useSettings();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: ROUTES.HOME, label: t('nav.home') },
    { to: ROUTES.DECORATIONS, label: t('nav.decorations') },
    { to: ROUTES.GALLERY, label: t('nav.gallery') },
    { to: ROUTES.REVIEWS, label: t('nav.reviews') },
    { to: ROUTES.CONTACT, label: t('nav.contact') },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
        <div className={`container ${styles.inner}`}>
          <Link to={ROUTES.HOME} className={styles.logo}>
            <span className={styles.logoIcon}>
              <Sparkles size={22} />
            </span>
            <span className={styles.logoText}>
              <span className={styles.logoMain}>Jai Malhar</span>
              <span className={styles.logoSub}>Events & Decorations</span>
            </span>
          </Link>

          <nav className={styles.desktopNav}>
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.active : ''}`
                }
              >
                {link.label}
              </NavLink>
            ))}


            {/* <LanguageSwitcher /> */}
            <Button
              variant="gold"
              size="sm"
              onClick={() => (window.location.href = `tel:${settings.primaryPhone.replace(/\s/g, '')}`)}
              leftIcon={Phone}
            >
              {t('nav.callNow')}
            </Button>
            
            <Link to={ROUTES.ADMIN_LOGIN} className={styles.adminLink2} aria-label={t('nav.adminLogin')}>
              <Shield size={20} />
            </Link>
            
          </nav>

          <div className={styles.actions}>


            <LanguageSwitcher />

            
            <Link to={ROUTES.BOOKING} className={styles.bookBtn}>
              <Button variant="primary" size="sm">
                {t('nav.bookEvent')}
              </Button>
            </Link>
            <Link to={ROUTES.ADMIN_LOGIN} className={styles.adminLink} aria-label={t('nav.adminLogin')}>
              <Shield size={20} />
            </Link>
            <button
              className={styles.menuToggle}
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={t('nav.toggleMenu')}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className={styles.mobileNav}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={styles.mobileLinks}>
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `${styles.mobileLink} ${isActive ? styles.active : ''}`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <Link to={ROUTES.BOOKING} className={styles.mobileBookLink}>
                {t('nav.bookEvent')}
              </Link>
              <Link to={ROUTES.ADMIN_LOGIN} className={styles.mobileAdminLink}>
                <Shield size={18} />
                {t('nav.adminLogin')}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
