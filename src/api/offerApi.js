import api from './axiosInstance';

export const offerApi = {
  offerHelp: async (requestId) => {
    const response = await api.post(`/api/requests/${requestId}/offers`);
    return response.data;
  },
  getOffersForRequest: async (requestId) => {
    const response = await api.get(`/api/requests/${requestId}/offers`);
    return response.data;
  },
  updateOfferStatus: async (offerId, status) => {
    const response = await api.patch(`/api/offers/${offerId}/status`, { status });
    return response.data;
  },
  getMyOffers: async () => {
    const response = await api.get('/api/offers/my');
    return response.data;
  },
};
