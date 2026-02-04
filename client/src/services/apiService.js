import api from './api';

// Authentication APIs
export const authAPI = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};

// Bouquets APIs
export const bouquetAPI = {
  getAll: async () => {
    const response = await api.get('/bouquets');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/bouquets/${id}`);
    return response.data;
  },
  
  getVariants: async (id) => {
    const response = await api.get(`/bouquets/${id}/variants`);
    return response.data;
  }
};

// Cart APIs
export const cartAPI = {
  getCart: async () => {
    const response = await api.get('/cart');
    return response.data;
  },
  
  addToCart: async (item) => {
    const response = await api.post('/cart/add', item);
    return response.data;
  },
  
  updateCart: async (itemData) => {
    const response = await api.put('/cart/update', itemData);
    return response.data;
  },
  
  removeFromCart: async (itemId) => {
    const response = await api.delete(`/cart/remove/${itemId}`);
    return response.data;
  }
};

// Order APIs
export const orderAPI = {
  checkout: async (orderData) => {
    const response = await api.post('/checkout', orderData);
    return response.data;
  },
  
  getUserOrders: async () => {
    const response = await api.get('/orders');
    return response.data;
  },
  
  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  }
};
