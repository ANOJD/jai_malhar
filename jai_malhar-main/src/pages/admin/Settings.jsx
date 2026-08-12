import { useEffect, useState } from 'react';
import { Save, User, Phone, Mail, MapPin, Clock, Building2 } from 'lucide-react';
import { BUSINESS } from '../../utils/constants.js';
import { settingsService } from '../../services/api.service.js';
import { normalizeSettings } from '../../context/SettingsContext.jsx';
import Button from '../../components/Button.jsx';
import styles from './admin.module.css';
import decoStyles from './Decorations.module.css';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    businessName: BUSINESS.name,
    primaryPhone: BUSINESS.phone,
    secondaryPhone: '',
    whatsapp: BUSINESS.whatsapp,
    email: BUSINESS.email,
    address: BUSINESS.address,
    hours: BUSINESS.hours,
    ownerName: BUSINESS.ownerName,
  });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    settingsService.get().then((savedSettings) => setSettings(normalizeSettings(savedSettings))).catch((requestError) => {
      setError(requestError.message || 'Failed to load settings.');
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const updatedSettings = await settingsService.update(settings);
      setSettings(normalizeSettings(updatedSettings));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (requestError) {
      setError(requestError.message || 'Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Settings</h1>
          <p className={styles.pageDesc}>Manage your business information and preferences.</p>
        </div>
      </div>

      {saved && (
        <div style={{
          padding: '14px 18px',
          background: 'var(--color-success-bg)',
          color: 'var(--color-success)',
          borderRadius: 'var(--radius-md)',
          fontSize: 'var(--fs-sm)',
          fontWeight: 'var(--fw-semibold)',
        }}>
          Settings saved successfully!
        </div>
      )}
      {error && <p className={decoStyles.errorText}>{error}</p>}

      <div className={decoStyles.settingsCard}>
        <div className={decoStyles.settingsHeader}>
          <Building2 size={22} className={decoStyles.settingsIcon} />
          <h2 className={decoStyles.settingsTitle}>Business Information</h2>
        </div>

        <div className={decoStyles.settingsForm}>
          <div className={decoStyles.formRow}>
            <div className={decoStyles.formGroup}>
              <label className={decoStyles.formLabel}><User size={16} /> Business Name</label>
              <input
                type="text"
                value={settings.businessName}
                onChange={(e) => setSettings((p) => ({ ...p, businessName: e.target.value }))}
                className={decoStyles.formInput}
              />
            </div>
            <div className={decoStyles.formGroup}>
              <label className={decoStyles.formLabel}><User size={16} /> Owner Name</label>
              <input
                type="text"
                value={settings.ownerName}
                onChange={(e) => setSettings((p) => ({ ...p, ownerName: e.target.value }))}
                className={decoStyles.formInput}
              />
            </div>
          </div>

          <div className={decoStyles.formRow}>
            <div className={decoStyles.formGroup}>
              <label className={decoStyles.formLabel}><Phone size={16} /> Primary Phone Number</label>
              <input
                type="tel"
                value={settings.primaryPhone}
                onChange={(e) => setSettings((p) => ({ ...p, primaryPhone: e.target.value }))}
                className={decoStyles.formInput}
              />
            </div>
            <div className={decoStyles.formGroup}>
              <label className={decoStyles.formLabel}><Phone size={16} /> Secondary Phone Number</label>
              <input
                type="tel"
                value={settings.secondaryPhone}
                onChange={(e) => setSettings((p) => ({ ...p, secondaryPhone: e.target.value }))}
                className={decoStyles.formInput}
              />
            </div>
          </div>

          <div className={decoStyles.formGroup}>
            <label className={decoStyles.formLabel}><Phone size={16} /> WhatsApp Number</label>
            <input
              type="tel"
              value={settings.whatsapp}
              onChange={(e) => setSettings((p) => ({ ...p, whatsapp: e.target.value }))}
              className={decoStyles.formInput}
            />
          </div>

          <div className={decoStyles.formGroup}>
            <label className={decoStyles.formLabel}><Mail size={16} /> Email Address</label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => setSettings((p) => ({ ...p, email: e.target.value }))}
              className={decoStyles.formInput}
            />
          </div>

          <div className={decoStyles.formGroup}>
            <label className={decoStyles.formLabel}><MapPin size={16} /> Business Address</label>
            <textarea
              value={settings.address}
              onChange={(e) => setSettings((p) => ({ ...p, address: e.target.value }))}
              className={`${decoStyles.formInput} ${decoStyles.formTextarea}`}
              rows={2}
            />
          </div>

          <div className={decoStyles.formGroup}>
            <label className={decoStyles.formLabel}><Clock size={16} /> Business Hours</label>
            <input
              type="text"
              value={settings.hours}
              onChange={(e) => setSettings((p) => ({ ...p, hours: e.target.value }))}
              className={decoStyles.formInput}
            />
          </div>

          <Button variant="primary" size="md" leftIcon={Save} onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}
