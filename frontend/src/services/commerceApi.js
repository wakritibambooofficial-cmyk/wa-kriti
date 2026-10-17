// import api from './api';

// export const cartApi = {
//   getCart: () => api.get('/cart'),
//   addItem: (payload) => api.post('/cart/items', payload),
//   updateItem: (itemId, quantity) => api.put(`/cart/items/${itemId}`, { quantity }),
//   removeItem: (itemId) => api.delete(`/cart/items/${itemId}`),
//   toggleSaveForLater: (itemId) => api.patch(`/cart/items/${itemId}/save-for-later`),
//   clearCart: () => api.delete('/cart'),
//   mergeGuestCart: (items) => api.post('/cart/merge', { items }),
//   applyCoupon: (code) => api.post('/cart/coupon', { code }),
//   removeCoupon: () => api.delete('/cart/coupon'),
// };

// export const wishlistApi = {
//   getWishlist: () => api.get('/wishlist'),
//   addItem: (productId) => api.post('/wishlist/items', { productId }),
//   removeItem: (productId) => api.delete(`/wishlist/items/${productId}`),
//   moveToCart: (productId) => api.post(`/wishlist/items/${productId}/move-to-cart`),
//   mergeGuestWishlist: (productIds) => api.post('/wishlist/merge', { productIds }),
// };

// export const addressApi = {
//   getAddresses: () => api.get('/addresses'),
//   createAddress: (payload) => api.post('/addresses', payload),
//   updateAddress: (id, payload) => api.put(`/addresses/${id}`, payload),
//   deleteAddress: (id) => api.delete(`/addresses/${id}`),
//   setDefault: (id) => api.patch(`/addresses/${id}/default`),
//   checkPincode: (pincode) => api.get(`/addresses/check-pincode/${pincode}`),
// };

// export const orderApi = {
//   checkout: (payload) => api.post('/orders/checkout', payload),
//   verifyPayment: (payload) => api.post('/orders/verify-payment', payload),
//   paymentFailed: (payload) => api.post('/orders/payment-failed', payload),
//   getMyOrders: (params) => api.get('/orders/my', { params }),
//   getOrderById: (id) => api.get(`/orders/${id}`),
//   downloadInvoice: (id) => api.get(`/orders/${id}/invoice`, { responseType: 'blob' }),
//   cancelOrder: (id, reason) => api.post(`/orders/${id}/cancel`, { reason }),
// };


import api from './api';

export const cartApi = {
  getCart: () => api.get('/cart'),
  addItem: (payload) => api.post('/cart/items', payload),
  updateItem: (itemId, quantity) => api.put(`/cart/items/${itemId}`, { quantity }),
  removeItem: (itemId) => api.delete(`/cart/items/${itemId}`),
  toggleSaveForLater: (itemId) => api.patch(`/cart/items/${itemId}/save-for-later`),
  clearCart: () => api.delete('/cart'),
  mergeGuestCart: (items) => api.post('/cart/merge', { items }),
  applyCoupon: (code) => api.post('/cart/coupon', { code }),
  removeCoupon: () => api.delete('/cart/coupon'),
};

export const wishlistApi = {
  getWishlist: () => api.get('/wishlist'),
  addItem: (productId) => api.post('/wishlist/items', { productId }),
  removeItem: (productId) => api.delete(`/wishlist/items/${productId}`),
  moveToCart: (productId) => api.post(`/wishlist/items/${productId}/move-to-cart`),
  mergeGuestWishlist: (productIds) => api.post('/wishlist/merge', { productIds }),
};

export const addressApi = {
  getAddresses: () => api.get('/addresses'),
  createAddress: (payload) => api.post('/addresses', payload),
  updateAddress: (id, payload) => api.put(`/addresses/${id}`, payload),
  deleteAddress: (id) => api.delete(`/addresses/${id}`),
  setDefault: (id) => api.patch(`/addresses/${id}/default`),
  checkPincode: (pincode) => api.get(`/addresses/check-pincode/${pincode}`),
};

export const orderApi = {
  checkout: (payload) => api.post('/orders/checkout', payload),
  verifyPayment: (payload) => api.post('/orders/verify-payment', payload),
  paymentFailed: (payload) => api.post('/orders/payment-failed', payload),
  getMyOrders: (params) => api.get('/orders/my', { params }),
  getOrderById: (id) => api.get(`/orders/${id}`),
  downloadInvoice: (id) => api.get(`/orders/${id}/invoice`, { responseType: 'blob' }),
  cancelOrder: (id, reason) => api.post(`/orders/${id}/cancel`, { reason }),
};