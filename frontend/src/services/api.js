import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
  return config;
});

export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getProfile: () => API.get('/auth/profile'),
  updateProfile: (data) => API.put('/auth/profile', data),
};

export const productAPI = {
  getAll: (params) => API.get('/products', { params }),
  getFeatured: () => API.get('/products/featured'),
  getById: (id) => API.get(`/products/${id}`),
  getAdminAll: () => API.get('/products/admin/all'),
  create: (data) => API.post('/products', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => API.put(`/products/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => API.delete(`/products/${id}`),
  createReview: (id, data) => API.post(`/products/${id}/reviews`, data),
};

export const orderAPI = {
  create: (data) => API.post('/orders', data),
  getMyOrders: () => API.get('/orders/myorders'),
  getById: (id) => API.get(`/orders/${id}`),
  getAllOrders: () => API.get('/orders'),
  updateStatus: (id, status) => API.put(`/orders/${id}/status`, { status }),
  cancelOrder: (id) => API.put(`/orders/${id}/cancel`),
  getStats: () => API.get('/orders/stats'),
};

export const offerAPI = {
  getActive: () => API.get('/offers'),
  getAll: () => API.get('/offers/admin'),
  create: (data) => API.post('/offers', data),
  update: (id, data) => API.put(`/offers/${id}`, data),
  delete: (id) => API.delete(`/offers/${id}`),
};

export const userAPI = {
  getAll: () => API.get('/users'),
  deleteUser: (id) => API.delete(`/users/${id}`),
};

export default API;
