// Centralized app-wide constants for Jai Malhar Events & Decorations

export const BUSINESS = {
  name: 'Jai Malhar Events & Decorations',
  shortName: 'Jai Malhar Events',
  tagline: 'Crafting Royal Moments, One Celebration at a Time',
  phone: '+91 90198 26640',
  whatsapp: '+91 90198 26640',
  email: 'anojtd.24@gmail.com',
  address: 'Near Government School, Sonkera, Tq. Humnabad, Dist. Bidar, Karnataka',
  hours: '24x7 Available',
  ownerName: 'Sadanand Nelge',
};

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || '';

export const API_ENDPOINTS = {
  // Decorations
  decorations: '/api/decorations',
  decorationById: (id) => `/api/decorations/${id}`,
  decorationCategories: '/api/decorations/categories',

  // Gallery
  gallery: '/api/gallery',
  galleryById: (id) => `/api/gallery/${id}`,

  // Admin settings and customers
  settings: '/api/settings',
  customers: '/api/customers',

  // Bookings
  bookings: '/api/bookings',
  bookingById: (id) => `/api/bookings/${id}`,
  bookingStatus: (id) => `/api/bookings/${id}/status`,

  // Reviews
  reviews: '/api/reviews',
  reviewById: (id) => `/api/reviews/${id}`,

  // Auth
  adminLogin: '/api/auth/admin/login',
  adminLogout: '/api/auth/admin/logout',

  // Contact
  contact: '/api/contact',

  // Reports
  reportBooking: (id) => `/api/reports/booking/${id}`,
};

export const EVENT_CATEGORIES = [
  { id: 'wedding', label: 'Wedding', icon: 'Heart' },
  { id: 'reception', label: 'Reception', icon: 'Sparkles' },
  { id: 'birthday', label: 'Birthday', icon: 'Cake' },
  { id: 'baby-shower', label: 'Baby Shower', icon: 'Baby' },
  { id: 'haldi', label: 'Haldi', icon: 'Flower2' },
  { id: 'mehendi', label: 'Mehendi', icon: 'Leaf' },
  { id: 'engagement', label: 'Engagement', icon: 'Gem' },
  { id: 'corporate', label: 'Corporate', icon: 'Building2' },
  { id: 'ganpati', label: 'Ganpati', icon: 'Sparkle' },
  { id: 'jayanti', label: 'Jayanti', icon: 'Star' },
  { id: 'housewarming', label: 'Housewarming', icon: 'Home' },
  { id: 'festival', label: 'Festival', icon: 'PartyPopper' },
];

export const BOOKING_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const SORT_OPTIONS = {
  NEWEST: 'newest',
  POPULAR: 'popular',
  ALPHABETICAL: 'alphabetical',
};

export const ROUTES = {
  HOME: '/',
  GALLERY: '/gallery',
  DECORATIONS: '/decorations',
  BOOKING: '/booking',
  BOOKING_SUCCESS: '/booking-success',
  REVIEWS: '/reviews',
  CONTACT: '/contact',
  ADMIN_LOGIN: '/admin/login',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_DECORATIONS: '/admin/decorations',
  ADMIN_BOOKINGS: '/admin/bookings',
  ADMIN_GALLERY: '/admin/gallery',
  ADMIN_REVIEWS: '/admin/reviews',
  ADMIN_CUSTOMERS: '/admin/customers',
  ADMIN_REPORTS: '/admin/reports',
  ADMIN_SETTINGS: '/admin/settings',
};
