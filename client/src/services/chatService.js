import axiosInstance from '../api/axiosInstance';

const chatService = {
  sendMessage: async (text, userName, visitorId) => {
    const response = await axiosInstance.post('/chat/send', { text, userName, visitorId });
    return response.data;
  },
};

export default chatService;
