'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSettings, clearSettingsCache } from '@/utils/settings';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSettings = async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);
      const settingsData = await getSettings(forceRefresh);
      setSettings(settingsData);
    } catch (err) {
      console.error('Error fetching settings:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshSettings = async () => {
    clearSettingsCache();
    await fetchSettings(true);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const value = {
    settings,
    loading,
    error,
    refreshSettings,
    fetchSettings,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsContext;