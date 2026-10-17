import api from './api';

export const adminProductApi = {
  create: (formData) => api.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, formData) => api.put(`/products/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/products/${id}`),
  duplicate: (id) => api.post(`/products/${id}/duplicate`),
  bulkUpdateStatus: (productIds, status) => api.patch('/products/bulk/status', { productIds, status }),
  bulkDelete: (productIds) => api.delete('/products/bulk', { data: { productIds } }),
};

export const adminCategoryApi = {
  create: (formData) => api.post('/categories', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, formData) => api.put(`/categories/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/categories/${id}`),
};

export const adminOrderApi = {
  getAll: (params) => api.get('/admin/orders', { params }),
  getStats: () => api.get('/admin/orders/stats'),
  updateStatus: (id, payload) => api.patch(`/admin/orders/${id}/status`, payload),
  refund: (id, payload) => api.post(`/admin/orders/${id}/refund`, payload),
  cancel: (id) => api.post(`/admin/orders/${id}/cancel`),
};

export const adminCouponApi = {
  getAll: (params) => api.get('/admin/coupons', { params }),
  getById: (id) => api.get(`/admin/coupons/${id}`),
  create: (payload) => api.post('/admin/coupons', payload),
  update: (id, payload) => api.put(`/admin/coupons/${id}`, payload),
  toggle: (id) => api.patch(`/admin/coupons/${id}/toggle`),
  delete: (id) => api.delete(`/admin/coupons/${id}`),
};

export const adminReviewApi = {
  getAll: (params) => api.get('/admin/reviews', { params }),
  updateStatus: (id, status) => api.patch(`/admin/reviews/${id}/status`, { status }),
  reply: (id, message) => api.post(`/admin/reviews/${id}/reply`, { message }),
  delete: (id) => api.delete(`/admin/reviews/${id}`),
};

export const adminQuestionApi = {
  getAll: (params) => api.get('/admin/questions', { params }),
  answer: (id, answer) => api.patch(`/admin/questions/${id}/answer`, { answer }),
  delete: (id) => api.delete(`/admin/questions/${id}`),
};

export const adminReturnApi = {
  getAll: (params) => api.get('/admin/returns', { params }),
  update: (id, payload) => api.patch(`/admin/returns/${id}`, payload),
};

export const adminCmsApi = {
  getBanners: () => api.get('/admin/cms/banners'),
  createBanner: (formData) => api.post('/admin/cms/banners', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateBanner: (id, formData) => api.put(`/admin/cms/banners/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteBanner: (id) => api.delete(`/admin/cms/banners/${id}`),
  getSettings: () => api.get('/cms/settings'),
  updateSettings: (formData) => api.put('/admin/cms/settings', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
   getPages: () => api.get('/admin/cms/pages'),                                                        // ← add
  getPage: (slug) => api.get(`/admin/cms/pages/${slug}`),                                              // ← add
  updatePage: (slug, formData) => api.put(`/admin/cms/pages/${slug}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }), // ← add
};

export const adminBlogApi = {
  getAll: () => api.get('/admin/blogs'),
  create: (formData) => api.post('/admin/blogs', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, formData) => api.put(`/admin/blogs/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/admin/blogs/${id}`),
};

export const adminContactApi = {
  getAll: (params) => api.get('/admin/contact', { params }),
  reply: (id, reply) => api.patch(`/admin/contact/${id}/reply`, { reply }),
  updateStatus: (id, status) => api.patch(`/admin/contact/${id}/status`, { status }),
};

export const adminCustomerApi = {
  getAll: (params) => api.get('/admin/customers', { params }),
  getById: (id) => api.get(`/admin/customers/${id}`),
  toggleBlock: (id) => api.patch(`/admin/customers/${id}/block`),
};

export const adminWarehouseApi = {
  getAll: () => api.get('/admin/warehouses'),
  create: (payload) => api.post('/admin/warehouses', payload),
  update: (id, payload) => api.put(`/admin/warehouses/${id}`, payload),
  delete: (id) => api.delete(`/admin/warehouses/${id}`),
  getProductInventory: (productId) => api.get(`/admin/warehouses/inventory/${productId}`),
  adjustInventory: (payload) => api.post('/admin/warehouses/inventory/adjust', payload),
  getInventoryLogs: (productId) => api.get(`/admin/warehouses/logs/${productId}`),
};

export const adminAuditLogApi = {
  getAll: (params) => api.get('/admin/audit-logs', { params }),
};

export const adminBackupApi = {
  listCollections: () => api.get('/admin/backups/collections'),
  exportBackup: () => api.get('/admin/backups/export', { responseType: 'blob' }),
  restoreBackup: (formData) => api.post('/admin/backups/restore', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
};

export const adminProductIoApi = {
  exportCsv: () => api.get('/admin/products-io/export', { responseType: 'blob' }),
  importCsv: (formData) => api.post('/admin/products-io/import', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
};

export const adminQrApi = {
  generate: (productId) => api.post(`/admin/products/${productId}/generate-qr`),
};

// export const adminPromotionApi = { 
//   getComboOffers: () => api.get('/admin/promotions/combo-offers'),
//   createComboOffer: (formData) => api.post('/admin/promotions/combo-offers', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
//   updateComboOffer: (id, formData) => api.put(`/admin/promotions/combo-offers/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
//   deleteComboOffer: (id) => api.delete(`/admin/promotions/combo-offers/${id}`),
//   createHamperTemplate: (payload) => api.post('/admin/promotions/hamper-templates', payload),
//   updateHamperTemplate: (id, payload) => api.put(`/admin/promotions/hamper-templates/${id}`, payload),
  
// };
export const adminPromotionApi = {
  getComboOffers: () => api.get('/admin/promotions/combo-offers'),
  createComboOffer: (formData) => api.post('/admin/promotions/combo-offers', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateComboOffer: (id, formData) => api.put(`/admin/promotions/combo-offers/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteComboOffer: (id) => api.delete(`/admin/promotions/combo-offers/${id}`),

  getHamperTemplates: () => api.get('/admin/promotions/hamper-templates'),
  createHamperTemplate: (payload) => api.post('/admin/promotions/hamper-templates', payload),
  updateHamperTemplate: (id, payload) => api.put(`/admin/promotions/hamper-templates/${id}`, payload),
  deleteHamperTemplate: (id) => api.delete(`/admin/promotions/hamper-templates/${id}`),
};

// export const adminContentApi = {
//   getArtisans: () => api.get('/admin/artisans'),
//   createArtisan: (formData) => api.post('/admin/artisans', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
//   updateArtisan: (id, formData) => api.put(`/admin/artisans/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
//   deleteArtisan: (id) => api.delete(`/admin/artisans/${id}`),
//   updateSustainabilityStat: (key, payload) => api.put(`/admin/sustainability-stats/${key}`, payload),
//   createBambooSpecies: (formData) => api.post('/admin/bamboo-species', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
//   updateBambooSpecies: (id, formData) => api.put(`/admin/bamboo-species/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
//   createCertificate: (formData) => api.post('/admin/certificates', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
//   deleteCertificate: (id) => api.delete(`/admin/certificates/${id}`),
// };

export const adminContentApi = {
  getArtisans: () => api.get('/admin/artisans'),
  createArtisan: (formData) => api.post('/admin/artisans', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateArtisan: (id, formData) => api.put(`/admin/artisans/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteArtisan: (id) => api.delete(`/admin/artisans/${id}`),

  getSustainabilityStats: () => api.get('/admin/sustainability-stats'),
  updateSustainabilityStat: (key, payload) => api.put(`/admin/sustainability-stats/${key}`, payload),
  deleteSustainabilityStat: (key) => api.delete(`/admin/sustainability-stats/${key}`),

  getBambooSpecies: () => api.get('/admin/bamboo-species'),
  createBambooSpecies: (formData) => api.post('/admin/bamboo-species', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateBambooSpecies: (id, formData) => api.put(`/admin/bamboo-species/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteBambooSpecies: (id) => api.delete(`/admin/bamboo-species/${id}`),

  getCertificates: () => api.get('/admin/certificates'),
  createCertificate: (formData) => api.post('/admin/certificates', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateCertificate: (id, formData) => api.put(`/admin/certificates/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteCertificate: (id) => api.delete(`/admin/certificates/${id}`),
};
 
export const adminLoyaltyApi = {
  creditWallet: (userId, payload) => api.post(`/admin/wallet/${userId}/credit`, payload),
  adjustRewards: (userId, payload) => api.post(`/admin/rewards/${userId}/adjust`, payload),
};

export const adminSubscriptionApi = {
  getAll: (params) => api.get('/admin/subscriptions', { params }),
};

export const adminNewsletterApi = {
  getSubscribers: () => api.get('/admin/newsletter/subscribers'),
  deleteSubscriber: (id) => api.delete(`/admin/newsletter/subscribers/${id}`),
  sendNewsletter: (data) => api.post('/admin/newsletter/send', data),
};


export const adminFeatureApi = {
  getAll: () => api.get('/features/admin'),
  create: (payload) => api.post('/features/admin', payload),
  update: (id, payload) => api.put(`/features/admin/${id}`, payload),
  delete: (id) => api.delete(`/features/admin/${id}`),
};

/**
 * Add this block into your existing `services/adminApi.js`, next to
 * `adminFeatureApi`. It follows the same shape, just with multipart
 * form-data for the two endpoints that carry a video file.
 */

export const adminVideoApi = {
  getAll: () => api.get('/videos/admin'),

  // payload is a FormData instance: title, order, status, video (File)
  create: (formData) =>
    api.post('/videos/admin', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // payload is a FormData instance; only include `video` if replacing the file
  update: (id, formData) =>
    api.put(`/videos/admin/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  delete: (id) => api.delete(`/videos/admin/${id}`),
};


