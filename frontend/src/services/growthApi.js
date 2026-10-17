import api from './api';

export const loyaltyApi = {
  getWallet: () => api.get('/wallet'),
  getRewards: () => api.get('/rewards'),
};

export const membershipApi = {
  getTiers: () => api.get('/membership/tiers'),
  getMyReferralCode: () => api.get('/membership/referrals/my-code'),
  applyReferralCode: (code) => api.post('/membership/referrals/apply', { code }),
};

export const subscriptionApi = {
  create: (payload) => api.post('/subscriptions', payload),
  getMy: () => api.get('/subscriptions/my'),
  pause: (id) => api.patch(`/subscriptions/${id}/pause`),
  cancel: (id) => api.delete(`/subscriptions/${id}`),
};

export const engagementApi = {
  trackRecentlyViewed: (productId) => api.post(`/engagement/recently-viewed/${productId}`),
  getRecentlyViewed: () => api.get('/engagement/recently-viewed'),
  trackSearch: (keyword, resultCount) => api.post('/engagement/search-history', { keyword, resultCount }),
  getRecentSearches: () => api.get('/engagement/search-history/recent'),
  getPopularSearches: () => api.get('/engagement/search-history/popular'),
  subscribeStockAlert: (payload) => api.post('/engagement/stock-alerts', payload),
};

export const promotionApi = {
  getComboOffers: () => api.get('/promotions/combo-offers'),
  addComboToCart: (id) => api.post(`/promotions/combo-offers/${id}/add-to-cart`),
  getHamperTemplates: () => api.get('/promotions/hamper-templates'),
  buildHamper: (id, payload) => api.post(`/promotions/hamper-templates/${id}/build`, payload),
};

export const contentApi = {
  getArtisans: () => api.get('/content/artisans'),
  getArtisanBySlug: (slug) => api.get(`/content/artisans/${slug}`),
  getSustainabilityStats: () => api.get('/content/sustainability-stats'),
  getBambooSpecies: () => api.get('/content/bamboo-species'),
  getBambooSpeciesBySlug: (slug) => api.get(`/content/bamboo-species/${slug}`),
  getCertificates: () => api.get('/content/certificates'),
};

export const verifyApi = {
  verifyProduct: (serialNumber) => api.get(`/verify/${serialNumber}`),
};
