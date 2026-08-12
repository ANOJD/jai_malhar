import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, User } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useSettings } from '../context/SettingsContext.jsx';
import { validateEmail, validateRequired, validatePhone } from '../utils/helpers.js';
import SectionTitle from '../components/SectionTitle.jsx';
import Button from '../components/Button.jsx';
import styles from './Contact.module.css';

export default function Contact() {
  const { t } = useLanguage();
  const settings = useSettings();
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const e = {};
    if (!validateRequired(formData.name)) e.name = t('contact.errName');
    if (!validatePhone(formData.phone)) e.phone = t('contact.errPhone');
    if (formData.email && !validateEmail(formData.email)) e.email = t('contact.errEmail');
    if (!validateRequired(formData.message)) e.message = t('contact.errMessage');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    setSubmitting(false);
    setSubmitted(true);
    setFormData({ name: '', phone: '', email: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  const contactCards = [
    { icon: Phone, label: t('contact.phone'), values: [settings.primaryPhone, settings.secondaryPhone].filter(Boolean) },
    { icon: MessageCircle, label: t('contact.whatsapp'), value: settings.whatsapp, href: `https://wa.me/${settings.whatsapp.replace(/\D/g, '')}` },
    { icon: Mail, label: t('contact.email'), value: settings.email, href: `mailto:${settings.email}` },
    { icon: Clock, label: t('contact.businessHours'), value: settings.hours, href: null },
  ];

  return (
    <div className={styles.page}>
      {/* Header */}
      <section className={styles.header}>
        <div className={styles.headerBg} />
        <div className={`container ${styles.headerContent}`}>
          <SectionTitle
            eyebrow={t('contact.eyebrow')}
            title={t('contact.title')}
            subtitle={t('contact.subtitle')}
            light
          />
        </div>
      </section>

      {/* Contact Cards */}
      <section className={styles.cardsSection}>
        <div className="container">
          <div className={styles.cardsGrid}>
            {contactCards.map((card, i) => card.values ? (
              <div
                key={card.label}
                className={styles.contactCard}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className={styles.cardIcon}>
                  <card.icon size={24} />
                </div>
                <span className={styles.cardLabel}>{card.label}</span>
                {card.values.map((phone) => (
                  <a key={phone} href={`tel:${phone.replace(/\s/g, '')}`} className={styles.cardValue}>{phone}</a>
                ))}
              </div>
            ) : (
              <a
                key={card.label}
                href={card.href || '#'}
                className={styles.contactCard}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className={styles.cardIcon}>
                  <card.icon size={24} />
                </div>
                <span className={styles.cardLabel}>{card.label}</span>
                <span className={styles.cardValue}>{card.value}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form + Map */}
      <section className={styles.formSection}>
        <div className="container">
          <div className={styles.formGrid}>
            {/* Form */}
            <div className={styles.formCard}>
              <h2 className={styles.formTitle}>{t('contact.formTitle')}</h2>
              <p className={styles.formDesc}>
                {t('contact.formDesc')}
              </p>

              {submitted && (
                <div className={styles.successMsg}>
                  {t('contact.successMsg')}
                </div>
              )}

              <div className={styles.form}>
                <div className={styles.formGroup}>
                  <label className={styles.label}><User size={16} /> {t('contact.yourName')}</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                    placeholder={t('contact.enterName')}
                  />
                  {errors.name && <span className={styles.errorText}>{errors.name}</span>}
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}><Phone size={16} /> {t('contact.phoneLabel')}</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
                      placeholder={t('contact.phonePlaceholder')}
                      maxLength={10}
                    />
                    {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}><Mail size={16} /> {t('contact.emailLabel')}</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                      placeholder={t('contact.emailPlaceholder')}
                    />
                    {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>{t('contact.messageLabel')}</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    className={`${styles.input} ${styles.textarea} ${errors.message ? styles.inputError : ''}`}
                    placeholder={t('contact.messagePlaceholder')}
                    rows={5}
                  />
                  {errors.message && <span className={styles.errorText}>{errors.message}</span>}
                </div>

                <Button variant="primary" size="md" fullWidth isLoading={submitting} rightIcon={Send} onClick={handleSubmit}>
                  {t('contact.send')}
                </Button>
              </div>
            </div>

            {/* Map + Address */}
            <div className={styles.mapCard}>
              <div className={styles.mapPlaceholder}>
                <MapPin size={48} className={styles.mapPinIcon} />
                <span className={styles.mapText}>{t('contact.mapPlaceholder')}</span>
                <span className={styles.mapSubtext}>{settings.address}</span>
              </div>
              <div className={styles.addressInfo}>
                <h3 className={styles.addressTitle}>{t('contact.visitOffice')}</h3>
                <p className={styles.addressText}>{settings.address}</p>
                <p className={styles.addressHours}>{settings.hours}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
