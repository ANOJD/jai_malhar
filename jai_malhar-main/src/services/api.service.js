import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../utils/constants.js';


// Axios instance configured for the Spring Boot backend
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

// Request interceptor — attach admin JWT if present and preserve FormData headers
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jm_admin_token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      if (config.headers) {
        delete config.headers['Content-Type'];
        delete config.headers['content-type'];
      }
    } else {
      config.headers = config.headers || {};
      if (!config.headers['Content-Type'] && !config.headers['content-type']) {
        config.headers['Content-Type'] = 'application/json';
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — unwrap data, normalize errors
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const normalized = {
      message:
        error.response?.data?.message ||
        error.message ||
        'Something went wrong. Please try again.',
      status: error.response?.status || 0,
      data: error.response?.data || null,
    };
    return Promise.reject(normalized);
  }
);

// ===== Decorations =====
export const decorationService = {
  getAll: (params = {}) => apiClient.get(API_ENDPOINTS.decorations, { params }),
  getById: (id) => apiClient.get(API_ENDPOINTS.decorationById(id)),
  getCategories: () => apiClient.get(API_ENDPOINTS.decorationCategories),
  create: (data) => apiClient.post(API_ENDPOINTS.decorations, data),
  update: (id, data) => apiClient.put(API_ENDPOINTS.decorationById(id), data),
  remove: (id) => apiClient.delete(API_ENDPOINTS.decorationById(id)),
  uploadImage: (id, formData) =>
    apiClient.post(`${API_ENDPOINTS.decorationById(id)}/images`, formData),
};

// ===== Gallery =====
export const galleryService = {
  getAll: (params = {}) => apiClient.get(API_ENDPOINTS.gallery, { params }),
  getById: (id) => apiClient.get(API_ENDPOINTS.galleryById(id)),
  create: (data) => apiClient.post(API_ENDPOINTS.gallery, data),
  remove: (id) => apiClient.delete(API_ENDPOINTS.galleryById(id)),
  uploadImages: (formData) =>
    apiClient.post(`${API_ENDPOINTS.gallery}/upload`, formData),
};

// ===== Business settings and customers =====
export const settingsService = {
  get: () => apiClient.get(API_ENDPOINTS.settings),
  update: (data) => apiClient.put(API_ENDPOINTS.settings, data),
};

export const customerService = {
  getAll: () => apiClient.get(API_ENDPOINTS.customers),
};

// ===== Bookings =====
export const bookingService = {
  getAll: (params = {}) => apiClient.get(API_ENDPOINTS.bookings, { params }),
  getById: (id) => apiClient.get(API_ENDPOINTS.bookingById(id)),
  create: (data) => apiClient.post(API_ENDPOINTS.bookings, data),
  updateStatus: (id, status) =>
    apiClient.put(API_ENDPOINTS.bookingStatus(id), { status }),
  remove: (id) => apiClient.delete(API_ENDPOINTS.bookingById(id)),
};

// ===== Reviews =====
export const reviewService = {
  getAll: (params = {}) => apiClient.get(API_ENDPOINTS.reviews, { params }),
  create: (data) => apiClient.post(API_ENDPOINTS.reviews, data),
  remove: (id) => apiClient.delete(API_ENDPOINTS.reviewById(id)),
};

// ===== Auth =====
export const authService = {
  adminLogin: (credentials) =>
    apiClient.post(API_ENDPOINTS.adminLogin, credentials),
  adminLogout: () => apiClient.post(API_ENDPOINTS.adminLogout),
};

// ===== Contact =====
export const contactService = {
  submit: (data) => apiClient.post(API_ENDPOINTS.contact, data),
};

// ===== Reports =====
export const reportService = {
  generateBookingReport: (id) =>
    apiClient.get(API_ENDPOINTS.reportBooking(id), { responseType: 'blob' }),
};

export default apiClient;
