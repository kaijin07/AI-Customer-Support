import { useState } from 'react';
import chatService from '../services/chatService';

export const useChat = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = async (text, userName) => {
    setLoading(true);
    setError(null);
    try {
      const data = await chatService.sendMessage(text, userName);
      setLoading(false);
      return data;
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      setError(message);
      setLoading(false);
      throw new Error(message);
    }
  };

  return {
    sendMessage,
    loading,
    error,
  };
};
