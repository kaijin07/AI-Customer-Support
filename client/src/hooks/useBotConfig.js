import { useState, useEffect, useCallback } from 'react';
import botService from '../services/botService';

export const useBotConfig = () => {
  const [botConfig, setBotConfig] = useState({ faqs: [], instructions: '' });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const fetchBotConfig = useCallback(async () => {
    setLoading(true);
    try {
      const data = await botService.getBotConfig();
      setBotConfig(data.data || { faqs: [], instructions: '' });
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateBotConfig = async (configData) => {
    setSaving(true);
    try {
      const data = await botService.updateBotConfig(configData);
      setBotConfig(data.data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  return {
    botConfig,
    setBotConfig,
    loading,
    saving,
    error,
    fetchBotConfig,
    updateBotConfig,
  };
};
