import axiosInstance from '../api/axiosInstance';

const chatService = {
  sendMessage: async (text, userName) => {
    const response = await axiosInstance.post('/chat/send', { text, userName });
    return response.data;
  },
};

export default chatService;
