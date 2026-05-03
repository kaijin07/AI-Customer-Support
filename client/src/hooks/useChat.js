import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import chatService from '../services/chatService';

export const useChat = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getVisitorId = () => {
    let vid = localStorage.getItem('hermes_visitor_id');
    if (!vid) {
      vid = uuidv4();
      localStorage.setItem('hermes_visitor_id', vid);
    }
    return vid;
  };

  const sendMessage = async (text, userName) => {
    setLoading(true);
    setError(null);
    try {
      const visitorId = getVisitorId();
      const data = await chatService.sendMessage(text, userName, visitorId);
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
