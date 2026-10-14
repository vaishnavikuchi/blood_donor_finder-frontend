import api from './axiosInstance';

export const requestApi = {
  createRequest: async (data) => {
    const response = await api.post('/api/requests', data);
    return response.data;
  },
  getRequests: async (params) => {
    const response = await api.get('/api/requests', { params });
    return response.data;
  },
  getMyRequests: async () => {
    const response = await api.get('/api/requests/my');
    return response.data;
  },
  getRequestById: async (id) => {
    const response = await api.get(`/api/requests/${id}`);
    return response.data;
  },
  updateRequest: async (id, data) => {
    const response = await api.put(`/api/requests/${id}`, data);
    return response.data;
  },
  cancelRequest: async (id) => {
    const response = await api.patch(`/api/requests/${id}/cancel`);
    return response.data;
  },
  getMatches: async (id, includeOtherCities = false) => {
    const response = await api.get(`/api/requests/${id}/matches`, {
      params: { includeOtherCities },
    });
    return response.data;
  },
};
