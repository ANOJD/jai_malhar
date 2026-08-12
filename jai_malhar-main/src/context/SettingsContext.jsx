import { createContext, useContext, useEffect, useState } from 'react';
import { settingsService } from '../services/api.service.js';
import { BUSINESS } from '../utils/constants.js';

const SettingsContext = createContext(null);

const defaultSettings = {
  businessName: BUSINESS.name,
  ownerName: BUSINESS.ownerName,
  primaryPhone: BUSINESS.phone,
  secondaryPhone: '',
  email: BUSINESS.email,
  whatsapp: BUSINESS.whatsapp,
  address: BUSINESS.address,
  hours: BUSINESS.hours,
};

export function normalizeSettings(savedSettings = {}) {
  const primaryPhone = savedSettings.primaryPhone || savedSettings.phone || defaultSettings.primaryPhone;
  return {
    ...defaultSettings,
    ...savedSettings,
    primaryPhone,
    secondaryPhone: savedSettings.secondaryPhone || '',
  };
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    settingsService.get()
      .then((savedSettings) => setSettings(normalizeSettings(savedSettings)))
      .catch(() => {
        // Keep the existing business values when settings are temporarily unavailable.
      });
  }, []);

  return <SettingsContext.Provider value={settings}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const settings = useContext(SettingsContext);
  if (!settings) throw new Error('useSettings must be used within SettingsProvider');
  return settings;
}
