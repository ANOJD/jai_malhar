import { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { LANGUAGES, useLanguage } from '../context/LanguageContext.jsx';
import styles from './LanguageSwitcher.module.css';

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const current = LANGUAGES[lang];

  return (
    <div className={styles.wrapper} ref={ref}>
      <button
        className={styles.trigger}
        onClick={() => setOpen((v) => !v)}
        aria-label="Change language"
      >
        <Globe size={18} />
        <span className={styles.label}>{current.nativeLabel}</span>
        <ChevronDown size={14} className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`} />
      </button>
      {open && (
        <div className={styles.dropdown}>
          {Object.values(LANGUAGES).map((l) => (
            <button
              key={l.code}
              className={`${styles.option} ${l.code === lang ? styles.optionActive : ''}`}
              onClick={() => {
                setLang(l.code);
                setOpen(false);
              }}
            >
              <span>{l.nativeLabel}</span>
              {l.code === lang && <Check size={16} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
