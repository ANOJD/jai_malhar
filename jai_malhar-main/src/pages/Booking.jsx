import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  CheckCircle2,
  User,
  Phone,
  Mail,
  MapPin,
  Clock,
  Users,
  FileText,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Lightbulb,
  LogIn,
  UserPlus,
} from 'lucide-react';
import { useBooking } from '../context/BookingContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useAsync } from '../hooks/useAsync.js';
import { decorationService, bookingService } from '../services/api.service.js';
import { EVENT_CATEGORIES, ROUTES } from '../utils/constants.js';
import {
  validateEmail,
  validatePhone,
  validateRequired,
  formatPhoneNumber,
} from '../utils/helpers.js';
import Button from '../components/Button.jsx';
import styles from './Booking.module.css';

const isValid24HourTime = (time) => /^(?:[01]?\d|2[0-3]):[0-5]\d$/.test(time.trim());
const isValid12HourTime = (time) => /^(0?[1-9]|1[0-2]):[0-5]\d\s*(AM|PM)$/i.test(time.trim());

const formatTime12Hour = (time) => {
  if (!time) return '—';
  const normalized = time.trim();
  if (isValid12HourTime(normalized)) {
    const [input] = normalized.match(/^(\d{1,2}:\d{2})\s*(AM|PM)$/i).slice(1);
    return normalized.toUpperCase().replace(/\s+/g, ' ');
  }

  if (!isValid24HourTime(normalized)) return normalized;

  const [hours, minutes] = normalized.split(':');
  const date = new Date();
  date.setHours(Number(hours), Number(minutes), 0, 0);

  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

const parseTime12Hour = (value) => {
  if (!value) return '';
  const normalized = value.trim().toUpperCase().replace(/\s+/g, ' ');
  const match = normalized.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/);
  if (!match) return value;

  let [, hours, minutes, period] = match;
  let hour = Number(hours);
  const minute = Number(minutes);
  if (minute < 0 || minute > 59 || hour < 1 || hour > 12) return value;

  if (period === 'AM') {
    if (hour === 12) hour = 0;
  } else {
    if (hour !== 12) hour += 12;
  }

  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
};

const formatTimeInputValue = (time) => {
  if (!time) return '';
  if (isValid24HourTime(time)) return formatTime12Hour(time);
  if (isValid12HourTime(time)) return time.toUpperCase().replace(/\s+/g, ' ');
  return time;
};

const parseTimeInput = (value) => {
  if (!value) return '';
  if (isValid24HourTime(value.trim())) return value.trim();
  if (isValid12HourTime(value)) return parseTime12Hour(value);
  return value;
};

export default function Booking() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { bookingDraft, updateDraft, resetDraft, setLastBooking } = useBooking();
  const [step, setStep] = useState(bookingDraft.eventType ? 1 : 0);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const { data: decorations } = useAsync(() => decorationService.getAll(), []);
  const filteredDecorations = decorations?.filter(
    (d) => !bookingDraft.eventType || d.eventType === bookingDraft.eventType
  ) || [];

  const steps = [t('booking.step0'), t('booking.step1'), t('booking.step2'), t('booking.step3')];

  const handleEventTypeSelect = (catId) => {
    updateDraft({ eventType: catId, decorationId: '', decorationName: '', decoratorSuggestion: false });
    setStep(1);
  };

  const handleDecorationSelect = (dec) => {
    updateDraft({
      decorationId: dec.id,
      decorationName: dec.title,
      decoratorSuggestion: false,
    });
    setStep(2);
  };

  const handleSuggestion = () => {
    updateDraft({
      decorationId: '',
      decorationName: '',
      decoratorSuggestion: true,
    });
    setStep(2);
  };

  const validateDetails = () => {
    const e = {};
    if (!validateRequired(bookingDraft.customerName)) e.customerName = t('booking.errName');
    if (!validatePhone(bookingDraft.phone)) e.phone = t('booking.errPhone');
    if (bookingDraft.email && !validateEmail(bookingDraft.email)) e.email = t('booking.errEmail');
    if (!validateRequired(bookingDraft.date)) e.date = t('booking.errDate');
    if (!validateRequired(bookingDraft.time)) e.time = t('booking.errTime');
    if (!validateRequired(bookingDraft.venue)) e.venue = t('booking.errVenue');
    if (!validateRequired(bookingDraft.guests)) e.guests = t('booking.errGuests');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleDetailsNext = () => {
    if (validateDetails()) setStep(3);
  };

  const handleSubmit = async (asGuest = true) => {
    setSubmitting(true);
    try {
      const booking = await bookingService.create({
        customerName: bookingDraft.customerName,
        customerPhone: bookingDraft.phone,
        customerEmail: bookingDraft.email,
        eventType: bookingDraft.eventType,
        eventDate: bookingDraft.date,
        eventTime: bookingDraft.time.padStart(5, '0'),
        venue: bookingDraft.venue,
        guestCount: Number(bookingDraft.guests),
        specialRequirement: bookingDraft.requirements,
        decorationId: bookingDraft.decorationId
      });
      setLastBooking(booking);
      resetDraft();
      navigate(ROUTES.BOOKING_SUCCESS);
    } catch (err) {
      setErrors({ submit: err.message || t('booking.errSubmit') });
    } finally {
      setSubmitting(false);
    }
  };

  const getCategoryLabel = (catId) => t(`categories.${catId}`) || catId;

  return (
    <div className={styles.page}>
      {/* Header */}
      <section className={styles.header}>
        <div className={styles.headerBg} />
        <div className={`container ${styles.headerContent}`}>
          <span className={styles.headerEyebrow}>
            <Sparkles size={16} />
            {t('booking.eyebrow')}
          </span>
          <h1 className={styles.headerTitle}>{t('booking.title')}</h1>
          <p className={styles.headerSubtitle}>
            {t('booking.subtitle')}
          </p>
        </div>
      </section>

      {/* Stepper */}
      <section className={styles.stepperSection}>
        <div className="container">
          <div className={styles.stepper}>
            {steps.map((label, i) => (
              <div key={label} className={`${styles.step} ${i <= step ? styles.stepActive : ''} ${i < step ? styles.stepDone : ''}`}>
                <span className={styles.stepNum}>
                  {i < step ? <CheckCircle2 size={18} /> : i + 1}
                </span>
                <span className={styles.stepLabel}>{label}</span>
                {i < steps.length - 1 && <span className={styles.stepLine} />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Step Content */}
      <section className={styles.contentSection}>
        <div className="container">
          <AnimatePresence mode="wait">
            {/* STEP 0: Event Type */}
            {step === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className={styles.stepContent}
              >
                <h2 className={styles.stepTitle}>{t('booking.step0Title')}</h2>
                <p className={styles.stepDesc}>{t('booking.step0Desc')}</p>
                <div className={styles.eventTypeGrid}>
                  {EVENT_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      className={`${styles.eventTypeCard} ${bookingDraft.eventType === cat.id ? styles.selected : ''}`}
                      onClick={() => handleEventTypeSelect(cat.id)}
                    >
                      <span className={styles.eventTypeLabel}>{t(`categories.${cat.id}`)}</span>
                      <ArrowRight size={18} className={styles.eventTypeArrow} />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 1: Decoration Choice */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className={styles.stepContent}
              >
                <h2 className={styles.stepTitle}>{t('booking.step1Title')}</h2>
                <p className={styles.stepDesc}>
                  {t('booking.step1Desc')}
                </p>

                <button className={styles.suggestionBanner} onClick={handleSuggestion}>
                  <div className={styles.suggestionIcon}>
                    <Lightbulb size={24} />
                  </div>
                  <div className={styles.suggestionText}>
                    <span className={styles.suggestionTitle}>{t('booking.suggestionTitle')}</span>
                    <span className={styles.suggestionDesc}>
                      {t('booking.suggestionDesc')}
                    </span>
                  </div>
                  <ArrowRight size={20} />
                </button>

                <div className={styles.decoGrid}>
                  {filteredDecorations.map((dec) => (
                    <button
                      key={dec.id}
                      className={`${styles.decoCard} ${bookingDraft.decorationId === dec.id ? styles.selected : ''}`}
                      onClick={() => handleDecorationSelect(dec)}
                    >
                      <img src={dec.imageUrl} alt={dec.title} loading="lazy" />
                      <div className={styles.decoCardBody}>
                        <span className={styles.decoCardName}>{dec.title}</span>
                        <span className={styles.decoCardCat}>{getCategoryLabel(dec.eventType)}</span>
                      </div>
                    </button>
                  ))}
                </div>

                <div className={styles.stepNav}>
                  <Button variant="ghost" size="md" leftIcon={ArrowLeft} onClick={() => setStep(0)}>
                    {t('booking.back')}
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Details */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className={styles.stepContent}
              >
                <h2 className={styles.stepTitle}>{t('booking.step2Title')}</h2>
                <p className={styles.stepDesc}>{t('booking.step2Desc')}</p>

                <div className={styles.form}>
                  <div className={styles.formRow}>
                    <div className={styles.field}>
                      <label className={styles.label}><User size={16} /> {t('booking.yourName')}</label>
                      <input
                        type="text"
                        value={bookingDraft.customerName}
                        onChange={(e) => updateDraft({ customerName: e.target.value })}
                        className={`${styles.input} ${errors.customerName ? styles.inputError : ''}`}
                        placeholder={t('booking.enterFullName')}
                      />
                      {errors.customerName && <span className={styles.errorText}>{errors.customerName}</span>}
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label}><Phone size={16} /> {t('booking.phoneLabel')}</label>
                      <input
                        type="tel"
                        value={bookingDraft.phone}
                        onChange={(e) => updateDraft({ phone: formatPhoneNumber(e.target.value) })}
                        className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
                        placeholder={t('booking.phonePlaceholder')}
                        maxLength={11}
                      />
                      {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.field}>
                      <label className={styles.label}><Mail size={16} /> {t('booking.emailLabel')}</label>
                      <input
                        type="email"
                        value={bookingDraft.email}
                        onChange={(e) => updateDraft({ email: e.target.value })}
                        className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                        placeholder={t('booking.emailPlaceholder')}
                      />
                      {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label}><Users size={16} /> {t('booking.guestsLabel')}</label>
                      <input
                        type="number"
                        value={bookingDraft.guests}
                        onChange={(e) => updateDraft({ guests: e.target.value })}
                        className={`${styles.input} ${errors.guests ? styles.inputError : ''}`}
                        placeholder={t('booking.guestsPlaceholder')}
                        min="1"
                      />
                      {errors.guests && <span className={styles.errorText}>{errors.guests}</span>}
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.field}>
                      <label className={styles.label}><Calendar size={16} /> {t('booking.dateLabel')}</label>
                      <input
                        type="date"
                        value={bookingDraft.date}
                        onChange={(e) => updateDraft({ date: e.target.value })}
                        className={`${styles.input} ${errors.date ? styles.inputError : ''}`}
                        min={new Date().toISOString().split('T')[0]}
                      />
                      {errors.date && <span className={styles.errorText}>{errors.date}</span>}
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label}><Clock size={16} /> {t('booking.timeLabel')}</label>
                      <input
                        type="text"
                        value={formatTimeInputValue(bookingDraft.time)}
                        onChange={(e) => updateDraft({ time: parseTimeInput(e.target.value) })}
                        className={`${styles.input} ${errors.time ? styles.inputError : ''}`}
                        placeholder="05:00 PM"
                      />
                      {errors.time && <span className={styles.errorText}>{errors.time}</span>}
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.field}>
                      <label className={styles.label}><MapPin size={16} /> {t('booking.venueLabel')}</label>
                      <input
                        type="text"
                        value={bookingDraft.venue}
                        onChange={(e) => updateDraft({ venue: e.target.value })}
                        className={`${styles.input} ${errors.venue ? styles.inputError : ''}`}
                        placeholder={t('booking.venuePlaceholder')}
                      />
                      {errors.venue && <span className={styles.errorText}>{errors.venue}</span>}
                    </div>
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label}><FileText size={16} /> {t('booking.requirementsLabel')}</label>
                    <textarea
                      value={bookingDraft.requirements}
                      onChange={(e) => updateDraft({ requirements: e.target.value })}
                      className={`${styles.input} ${styles.textarea}`}
                      placeholder={t('booking.requirementsPlaceholder')}
                      rows={4}
                    />
                  </div>
                </div>

                <div className={styles.stepNav}>
                  <Button variant="ghost" size="md" leftIcon={ArrowLeft} onClick={() => setStep(1)}>
                    {t('booking.back')}
                  </Button>
                  <Button variant="primary" size="md" rightIcon={ArrowRight} onClick={handleDetailsNext}>
                    {t('booking.reviewBooking')}
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Confirm */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className={styles.stepContent}
              >
                <h2 className={styles.stepTitle}>{t('booking.step3Title')}</h2>
                <p className={styles.stepDesc}>{t('booking.step3Desc')}</p>

                <div className={styles.reviewCard}>
                  <div className={styles.reviewSection}>
                    <h3 className={styles.reviewSectionTitle}>{t('booking.reviewEvent')}</h3>
                    <div className={styles.reviewItem}>
                      <span>{t('booking.reviewEventType')}</span>
                      <strong>{getCategoryLabel(bookingDraft.eventType)}</strong>
                    </div>
                    <div className={styles.reviewItem}>
                      <span>{t('booking.reviewDecoration')}</span>
                      <strong>
                        {bookingDraft.decoratorSuggestion
                          ? t('booking.decoratorWillChoose')
                          : bookingDraft.decorationName}
                      </strong>
                    </div>
                  </div>

                  <div className={styles.reviewSection}>
                    <h3 className={styles.reviewSectionTitle}>{t('booking.reviewSchedule')}</h3>
                    <div className={styles.reviewItem}>
                      <span>{t('booking.reviewDate')}</span>
                      <strong>{bookingDraft.date}</strong>
                    </div>
                    <div className={styles.reviewItem}>
                      <span>{t('booking.reviewTime')}</span>
                      <strong>{formatTime12Hour(bookingDraft.time)}</strong>
                    </div>
                    <div className={styles.reviewItem}>
                      <span>{t('booking.reviewVenue')}</span>
                      <strong>{bookingDraft.venue}</strong>
                    </div>
                  
                    <div className={styles.reviewItem}>
                      <span>{t('booking.reviewGuests')}</span>
                      <strong>{bookingDraft.guests}</strong>
                    </div>
                  </div>

                  <div className={styles.reviewSection}>
                    <h3 className={styles.reviewSectionTitle}>{t('booking.reviewContact')}</h3>
                    <div className={styles.reviewItem}>
                      <span>{t('booking.reviewName')}</span>
                      <strong>{bookingDraft.customerName}</strong>
                    </div>
                    <div className={styles.reviewItem}>
                      <span>{t('booking.reviewPhone')}</span>
                      <strong>{bookingDraft.phone}</strong>
                    </div>
                    {bookingDraft.email && (
                      <div className={styles.reviewItem}>
                        <span>{t('booking.reviewEmail')}</span>
                        <strong>{bookingDraft.email}</strong>
                      </div>
                    )}
                    {bookingDraft.requirements && (
                      <div className={styles.reviewItem}>
                        <span>{t('booking.reviewRequirements')}</span>
                        <strong>{bookingDraft.requirements}</strong>
                      </div>
                    )}
                  </div>

                  <div className={styles.priceNote}>
                    <Sparkles size={18} />
                    <span>{t('booking.priceNote')}</span>
                  </div>
                </div>

                {/* Guest vs Login */}
                <div className={styles.authChoice}>
                  <h3 className={styles.authChoiceTitle}>{t('booking.authChoiceTitle')}</h3>
                  <div className={styles.authOptions}>
                    <button
                      className={`${styles.authOption} ${styles.guestHighlight}`}
                      onClick={() => handleSubmit(true)}
                      disabled={submitting}
                    >
                      <div className={styles.authIcon}><UserPlus size={24} /></div>
                      <div className={styles.authText}>
                        <span className={styles.authLabel}>{t('booking.continueGuest')}</span>
                        <span className={styles.authDesc}>{t('booking.guestDesc')}</span>
                      </div>
                      <span className={styles.authBadge}>{t('booking.recommended')}</span>
                    </button>
                    <button
                      className={styles.authOption}
                      onClick={() => handleSubmit(true)}
                      disabled={submitting}
                    >
                      <div className={styles.authIcon}><LogIn size={24} /></div>
                      <div className={styles.authText}>
                        <span className={styles.authLabel}>{t('booking.login')}</span>
                        <span className={styles.authDesc}>{t('booking.loginDesc')}</span>
                      </div>
                    </button>
                  </div>
                </div>

                {errors.submit && <div className={styles.submitError}>{errors.submit}</div>}

                <div className={styles.stepNav}>
                  <Button variant="ghost" size="md" leftIcon={ArrowLeft} onClick={() => setStep(2)}>
                    {t('booking.back')}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
