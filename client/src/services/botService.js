import axiosInstance from '../api/axiosInstance';

const botService = {
  getBotConfig: async () => {
    const response = await axiosInstance.get('/bot-config');
    return response.data;
  },
  updateBotConfig: async (configData) => {
    const response = await axiosInstance.post('/bot-config', configData);
    return response.data;
  },
};

export default botService;
