// Formatting and validation utilities

export const formatPhoneNumber = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 10);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)} ${digits.slice(5)}`;
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const formatDateTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const generateBookingId = () => {
  const prefix = 'JM';
  const timestamp = Date.now().toString(36).toUpperCase().slice(-6);
  const random = Math.random().toString(36).toUpperCase().slice(2, 6);
  return `${prefix}${timestamp}${random}`;
};

export const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validatePhone = (phone) => {
  return /^[6-9]\d{9}$/.test(phone.replace(/\s/g, ''));
};

export const validateRequired = (value) => {
  return value !== undefined && value !== null && String(value).trim() !== '';
};

export const truncateText = (text, maxLength) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '…';
};

export const getStatusColor = (status) => {
  const colors = {
    pending: 'var(--color-warning)',
    approved: 'var(--color-info)',
    completed: 'var(--color-success)',
    rejected: 'var(--color-error)',
    cancelled: 'var(--color-text-muted)',
  };
  return colors[status] || 'var(--color-text-muted)';
};

export const getStatusLabel = (status) => {
  const labels = {
    pending: 'Pending',
    approved: 'Approved',
    completed: 'Completed',
    rejected: 'Rejected',
    cancelled: 'Cancelled',
  };
  return labels[status] || status;
};

export const getCategoryLabel = (categoryId) => {
  const labels = {
    wedding: 'Wedding',
    reception: 'Reception',
    birthday: 'Birthday',
    'baby-shower': 'Baby Shower',
    haldi: 'Haldi',
    mehendi: 'Mehendi',
    engagement: 'Engagement',
    corporate: 'Corporate',
    ganpati: 'Ganpati',
    jayanti: 'Jayanti',
    housewarming: 'Housewarming',
    festival: 'Festival',
  };
  return labels[categoryId] || categoryId;
};
