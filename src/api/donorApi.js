import api from './axiosInstance';

export const donorApi = {
  createProfile: async (profileData) => {
    const response = await api.post('/api/donors/profile', profileData);
    return response.data;
  },
  getMyProfile: async () => {
    const response = await api.get('/api/donors/profile');
    return response.data;
  },
  updateProfile: async (profileData) => {
    const response = await api.put('/api/donors/profile', profileData);
    return response.data;
  },
  toggleAvailability: async () => {
    const response = await api.patch('/api/donors/profile/availability');
    return response.data;
  },
  searchDonors: async (params) => {
    const response = await api.get('/api/donors/search', { params });
    return response.data;
  },
};
