import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, User, ArrowLeft, Sparkles, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { ROUTES } from '../utils/constants.js';
import { useSettings } from '../context/SettingsContext.jsx';
import Button from '../components/Button.jsx';
import styles from './AdminLogin.module.css';

export default function AdminLogin() {
  const { t } = useLanguage();
  const settings = useSettings();
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (field, value) => {
    setCredentials((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(credentials);
      navigate(ROUTES.ADMIN_DASHBOARD);
    } catch (err) {
      setError(err.message || t('adminLogin.errLogin'));
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.bgPattern} />
      <div className={styles.bgGradient} />

      <Link to={ROUTES.HOME} className={styles.backLink}>
        <ArrowLeft size={18} />
        {t('adminLogin.backHome')}
      </Link>

      <motion.div
        className={styles.card}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className={styles.logo}>
          <span className={styles.logoIcon}>
            <Sparkles size={26} />
          </span>
          <div className={styles.logoText}>
            <span className={styles.logoMain}>Jai Malhar</span>
            <span className={styles.logoSub}>{t('adminLogin.adminPanel')}</span>
          </div>
        </div>

        <div className={styles.header}>
          <div className={styles.lockIcon}>
            <Lock size={24} />
          </div>
          <h1 className={styles.title}>{t('adminLogin.title')}</h1>
          <p className={styles.subtitle}>{t('adminLogin.subtitle')}</p>
        </div>

        {error && <div className={styles.errorBanner}>{error}</div>}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>
              <User size={16} />
              {t('adminLogin.username')}
            </label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              className={styles.input}
              placeholder={t('adminLogin.usernamePlaceholder')}
              required
              autoFocus
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>
              <Lock size={16} />
              {t('adminLogin.password')}
            </label>
            <div className={styles.passwordWrap}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={credentials.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={styles.input}
                placeholder={t('adminLogin.passwordPlaceholder')}
                required
              />
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShowPassword((v) => !v)}
                aria-label={t('adminLogin.togglePassword')}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <Button type="submit" variant="primary" size="lg" fullWidth isLoading={loading}>
            {t('adminLogin.signIn')}
          </Button>
        </form>

        <div className={styles.hint}>
          <strong>{t('adminLogin.demoCreds')}</strong>
        </div>

        <p className={styles.footer}>
          © {new Date().getFullYear()} {settings.businessName}
        </p>
      </motion.div>
    </div>
  );
}
