import api from './axiosInstance';

export const statsApi = {
  getStats: async () => {
    const response = await api.get('/api/stats');
    return response.data;
  },
};
