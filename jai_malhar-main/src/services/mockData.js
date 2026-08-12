// Mock data — used as fallback when the Spring Boot backend is not yet connected.
// Each function returns a Promise that resolves after a short delay to simulate network latency.

import { bookingService, decorationService } from './api.service.js';

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

const toCategory = (eventType = '') => eventType.toLowerCase().replace(/\s+/g, '-');

const toDecoration = (decoration) => ({
  ...decoration,
  name: decoration.title || 'Untitled decoration',
  category: toCategory(decoration.eventType),
  image: decoration.imageUrl || '',
  gallery: decoration.imageUrl ? [decoration.imageUrl] : [],
  featured: Boolean(decoration.available),
  popularity: 0,
  createdAt: decoration.createdAt || new Date(0).toISOString(),
});

const img = (id, w = 940, h = 650) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}&h=${h}`;

export const mockDecorations = [
  {
    id: 'dec-001',
    name: 'Royal Marigold Mandap',
    category: 'wedding',
    description: 'A breathtaking mandap adorned with fresh marigolds, roses, and golden drapes. Perfect for traditional Indian weddings with a royal touch.',
    image: img('14395559'),
    gallery: [img('14395559'), img('34079355'), img('12432503')],
    featured: true,
    popularity: 98,
    createdAt: '2025-07-15T10:00:00Z',
  },
  {
    id: 'dec-002',
    name: 'Golden Glow Reception Stage',
    category: 'reception',
    description: 'Elegant reception stage with cascading golden lights, crystal chandeliers, and luxurious floral arrangements for an unforgettable evening.',
    image: img('35985211'),
    gallery: [img('35985211'), img('16120244'), img('17001756')],
    featured: true,
    popularity: 95,
    createdAt: '2025-07-20T10:00:00Z',
  },
  {
    id: 'dec-003',
    name: 'Pastel Dream Baby Shower',
    category: 'baby-shower',
    description: 'Soft pastel-themed baby shower decor with balloons, floral arches, and a charming dessert table setup.',
    image: img('1682459'),
    gallery: [img('1682459'), img('17637268'), img('1682462')],
    featured: true,
    popularity: 87,
    createdAt: '2025-07-22T10:00:00Z',
  },
  {
    id: 'dec-004',
    name: 'Marigold Haldi Ceremony Setup',
    category: 'haldi',
    description: 'Vibrant yellow marigold decorations with traditional pots, floral garlands, and a festive Haldi stage full of joy.',
    image: img('31002035'),
    gallery: [img('31002035'), img('33078524'), img('33078527')],
    featured: true,
    popularity: 91,
    createdAt: '2025-07-25T10:00:00Z',
  },
  {
    id: 'dec-005',
    name: 'Birthday Bash Balloon Arch',
    category: 'birthday',
    description: 'Colorful balloon arches, themed backdrops, and playful decorations to make every birthday celebration magical.',
    image: img('14457430'),
    gallery: [img('14457430'), img('8652621'), img('3394219')],
    featured: true,
    popularity: 84,
    createdAt: '2025-07-28T10:00:00Z',
  },
  {
    id: 'dec-006',
    name: 'Diwali Festival of Lights',
    category: 'festival',
    description: 'Dazzling Diwali decoration with brass diyas, warm lighting, rangoli, and festive ambiance for the festival of lights.',
    image: img('36950762'),
    gallery: [img('36950762'), img('34899896'), img('3135229')],
    featured: false,
    popularity: 79,
    createdAt: '2025-08-01T10:00:00Z',
  },
  {
    id: 'dec-007',
    name: 'Corporate Grand Stage',
    category: 'corporate',
    description: 'Professional corporate event setup with branded backdrop, premium stage lighting, and elegant seating arrangements.',
    image: img('16120243'),
    gallery: [img('16120243'), img('16985184'), img('29708240')],
    featured: false,
    popularity: 76,
    createdAt: '2025-08-02T10:00:00Z',
  },
  {
    id: 'dec-008',
    name: 'Mehendi Floral Canopy',
    category: 'mehendi',
    description: 'Lush green and floral canopy setup for Mehendi ceremonies with vibrant colors and traditional decor elements.',
    image: img('33417234'),
    gallery: [img('33417234'), img('13156145'), img('30215316')],
    featured: false,
    popularity: 82,
    createdAt: '2025-08-03T10:00:00Z',
  },
  {
    id: 'dec-009',
    name: 'Engagement Elegance',
    category: 'engagement',
    description: 'Romantic engagement decor with soft florals, candlelight ambiance, and a beautifully designed stage for the special moment.',
    image: img('30482895'),
    gallery: [img('30482895'), img('35872915'), img('32679917')],
    featured: false,
    popularity: 80,
    createdAt: '2025-08-04T10:00:00Z',
  },
  {
    id: 'dec-010',
    name: 'Ganpati Festival Mandap',
    category: 'ganpati',
    description: 'Sacred Ganpati decoration with traditional flowers, themed backdrops, and devotional ambiance for the beloved festival.',
    image: img('29422078'),
    gallery: [img('29422078'), img('36950762'), img('34899896')],
    featured: false,
    popularity: 88,
    createdAt: '2025-07-18T10:00:00Z',
  },
  {
    id: 'dec-011',
    name: 'Housewarming Welcome Decor',
    category: 'housewarming',
    description: 'Warm and welcoming housewarming decoration with floral rangoli, torans, and traditional elements for your new home.',
    image: img('17294737'),
    gallery: [img('17294737'), img('17001756'), img('16120244')],
    featured: false,
    popularity: 72,
    createdAt: '2025-07-10T10:00:00Z',
  },
  {
    id: 'dec-012',
    name: 'Jayanti Celebration Stage',
    category: 'jayanti',
    description: 'Devotional Jayanti decoration with spiritual themes, floral arrangements, and elegant stage setup for sacred celebrations.',
    image: img('34079355'),
    gallery: [img('34079355'), img('14395559'), img('12432503')],
    featured: false,
    popularity: 70,
    createdAt: '2025-07-05T10:00:00Z',
  },
];

export const mockGalleryImages = [
  { id: 'g-001', url: img('13156145', 940, 1200), category: 'wedding', title: 'Royal Wedding Stage', createdAt: '2025-08-03T10:00:00Z' },
  { id: 'g-002', url: img('34079355', 940, 700), category: 'wedding', title: 'Mandap with Chandeliers', createdAt: '2025-08-02T10:00:00Z' },
  { id: 'g-003', url: img('14395559', 940, 1100), category: 'wedding', title: 'Floral Garlands Stage', createdAt: '2025-08-01T10:00:00Z' },
  { id: 'g-004', url: img('33417234', 940, 800), category: 'wedding', title: 'Red & Gold Canopy', createdAt: '2025-07-31T10:00:00Z' },
  { id: 'g-005', url: img('35985211', 940, 1000), category: 'reception', title: 'Reception Floral Tables', createdAt: '2025-07-30T10:00:00Z' },
  { id: 'g-006', url: img('16120244', 940, 650), category: 'reception', title: 'Candlelight Reception', createdAt: '2025-07-29T10:00:00Z' },
  { id: 'g-007', url: img('17001756', 940, 900), category: 'reception', title: 'Elegant Centerpiece', createdAt: '2025-07-28T10:00:00Z' },
  { id: 'g-008', url: img('14457430', 940, 750), category: 'birthday', title: 'Pink Birthday Setup', createdAt: '2025-07-27T10:00:00Z' },
  { id: 'g-009', url: img('8652621', 940, 1050), category: 'birthday', title: "Children's Birthday", createdAt: '2025-07-26T10:00:00Z' },
  { id: 'g-010', url: img('1682459', 940, 800), category: 'baby-shower', title: 'Pastel Dessert Table', createdAt: '2025-07-25T10:00:00Z' },
  { id: 'g-011', url: img('17637268', 940, 950), category: 'baby-shower', title: 'Baby Shower Balloons', createdAt: '2025-07-24T10:00:00Z' },
  { id: 'g-012', url: img('31002035', 940, 1000), category: 'haldi', title: 'Marigold Haldi Setup', createdAt: '2025-07-23T10:00:00Z' },
  { id: 'g-013', url: img('33078524', 940, 700), category: 'haldi', title: 'Haldi Ceremony Joy', createdAt: '2025-07-22T10:00:00Z' },
  { id: 'g-014', url: img('36950762', 940, 850), category: 'festival', title: 'Diwali Lamps', createdAt: '2025-07-21T10:00:00Z' },
  { id: 'g-015', url: img('3135229', 940, 1100), category: 'festival', title: 'Diya Arrangement', createdAt: '2025-07-20T10:00:00Z' },
  { id: 'g-016', url: img('16120243', 940, 700), category: 'corporate', title: 'Corporate Banquet Hall', createdAt: '2025-07-19T10:00:00Z' },
  { id: 'g-017', url: img('16985184', 940, 800), category: 'corporate', title: 'Conference Stage', createdAt: '2025-07-18T10:00:00Z' },
  { id: 'g-018', url: img('33417234', 940, 1000), category: 'mehendi', title: 'Mehendi Canopy', createdAt: '2025-07-17T10:00:00Z' },
  { id: 'g-019', url: img('30482895', 940, 750), category: 'engagement', title: 'Engagement Florals', createdAt: '2025-07-16T10:00:00Z' },
  { id: 'g-020', url: img('17294737', 940, 900), category: 'housewarming', title: 'Housewarming Table', createdAt: '2025-07-15T10:00:00Z' },
  { id: 'g-021', url: img('29422078', 940, 850), category: 'ganpati', title: 'Festive Diya Lights', createdAt: '2025-07-14T10:00:00Z' },
  { id: 'g-022', url: img('16935999', 940, 950), category: 'reception', title: 'Luxurious Banquet', createdAt: '2025-07-13T10:00:00Z' },
  { id: 'g-023', url: img('35872915', 940, 700), category: 'wedding', title: 'Bright Wedding Ceremony', createdAt: '2025-07-12T10:00:00Z' },
  { id: 'g-024', url: img('30215316', 940, 1000), category: 'wedding', title: 'Floral Stage Couple', createdAt: '2025-07-11T10:00:00Z' },
];

export const mockReviews = [
  { id: 'rev-001', name: 'Priya & Rohan Sharma', rating: 5, comment: 'Absolutely stunning decoration for our wedding! The team transformed the venue into a royal palace. Every guest was amazed. Highly recommend Jai Malhar Events!', createdAt: '2025-08-01T10:00:00Z', event: 'Wedding' },
  { id: 'rev-002', name: 'Anjali Deshmukh', rating: 5, comment: 'My baby shower was a dream come true! The pastel decor was so elegant and beautiful. Thank you for making it so special.', createdAt: '2025-07-28T10:00:00Z', event: 'Baby Shower' },
  { id: 'rev-003', name: 'Suresh Patil', rating: 4, comment: 'Great corporate event setup. Professional team and on-time delivery. The stage looked fantastic for our annual conference.', createdAt: '2025-07-25T10:00:00Z', event: 'Corporate' },
  { id: 'rev-004', name: 'Kavya & Mahesh', rating: 5, comment: 'The Haldi ceremony decoration was so vibrant and full of life! Marigolds everywhere, it felt truly traditional and royal.', createdAt: '2025-07-20T10:00:00Z', event: 'Haldi' },
  { id: 'rev-005', name: 'Rutuja Kale', rating: 5, comment: 'My daughter birthday party was magical! The balloon arch and themed backdrop were perfect. Kids loved it!', createdAt: '2025-07-15T10:00:00Z', event: 'Birthday' },
  { id: 'rev-006', name: 'Amit & Sneha Joshi', rating: 5, comment: 'Reception decor was beyond our expectations. The golden lights and floral arrangements created a magical evening. Thank you Jai Malhar team!', createdAt: '2025-07-10T10:00:00Z', event: 'Reception' },
];

export const mockBookings = [
  { id: 'JM-A1B2C3', customerName: 'Rajesh Kulkarni', phone: '9876543210', email: 'rajesh@example.com', eventType: 'wedding', decorationId: 'dec-001', decorationName: 'Royal Marigold Mandap', date: '2025-08-10', time: '10:00', venue: 'Grand Hall, Pune', landmark: 'Near FC Road', guests: 500, requirements: 'Need extra floral arrangements', status: 'pending', createdAt: '2025-08-04T08:00:00Z' },
  { id: 'JM-D4E5F6', customerName: 'Sunita More', phone: '9876512345', email: 'sunita@example.com', eventType: 'birthday', decorationId: 'dec-005', decorationName: 'Birthday Bash Balloon Arch', date: '2025-08-08', time: '18:00', venue: 'Home, Kothrud', landmark: 'Near Dmart', guests: 50, requirements: 'Princess theme', status: 'approved', createdAt: '2025-08-03T12:00:00Z' },
  { id: 'JM-G7H8I9', customerName: 'Vijay Chavan', phone: '9876567890', email: 'vijay@example.com', eventType: 'corporate', decorationId: 'dec-007', decorationName: 'Corporate Grand Stage', date: '2025-08-05', time: '09:00', venue: 'Hotel Hyatt, Pune', landmark: 'Near Airport', guests: 300, requirements: 'Company branding on stage', status: 'completed', createdAt: '2025-07-30T10:00:00Z' },
  { id: 'JM-J1K2L3', customerName: 'Meena Pawar', phone: '9876598765', email: 'meena@example.com', eventType: 'baby-shower', decorationId: 'dec-003', decorationName: 'Pastel Dream Baby Shower', date: '2025-08-12', time: '11:00', venue: 'Banquet, Wakad', landmark: 'Near Wakad Bridge', guests: 80, requirements: 'Pastel pink and blue theme', status: 'pending', createdAt: '2025-08-04T06:00:00Z' },
  { id: 'JM-M4N5O6', customerName: 'Sandip Jadhav', phone: '9876523456', email: 'sandip@example.com', eventType: 'reception', decorationId: 'dec-002', decorationName: 'Golden Glow Reception Stage', date: '2025-07-28', time: '19:00', venue: 'Lawns, Baner', landmark: 'Near Baner Gaon', guests: 400, requirements: 'Golden theme with crystal chandeliers', status: 'cancelled', createdAt: '2025-07-20T14:00:00Z' },
];

export const mockDashboardStats = {
  todayBookings: 3,
  pendingBookings: 8,
  approvedBookings: 15,
  completedEvents: 42,
  cancelledBookings: 5,
  galleryImages: 24,
  customerReviews: 6,
};

export const mockChartData = {
  monthlyBookings: [
    { month: 'Jan', bookings: 12 },
    { month: 'Feb', bookings: 18 },
    { month: 'Mar', bookings: 25 },
    { month: 'Apr', bookings: 22 },
    { month: 'May', bookings: 30 },
    { month: 'Jun', bookings: 38 },
    { month: 'Jul', bookings: 45 },
    { month: 'Aug', bookings: 52 },
  ],
  eventCategories: [
    { name: 'Wedding', value: 35 },
    { name: 'Reception', value: 20 },
    { name: 'Birthday', value: 15 },
    { name: 'Corporate', value: 10 },
    { name: 'Haldi', value: 8 },
    { name: 'Other', value: 12 },
  ],
  bookingStatus: [
    { status: 'Pending', value: 8 },
    { status: 'Approved', value: 15 },
    { status: 'Completed', value: 42 },
    { status: 'Cancelled', value: 5 },
  ],
  customerGrowth: [
    { month: 'Jan', customers: 20 },
    { month: 'Feb', customers: 35 },
    { month: 'Mar', customers: 50 },
    { month: 'Apr', customers: 68 },
    { month: 'May', customers: 85 },
    { month: 'Jun', customers: 110 },
    { month: 'Jul', customers: 140 },
    { month: 'Aug', customers: 175 },
  ],
};

export const mockCustomers = [
  { id: 'cust-001', name: 'Rajesh Kulkarni', phone: '9876543210', email: 'rajesh@example.com', totalBookings: 3, status: 'active', lastBooking: '2025-08-04' },
  { id: 'cust-002', name: 'Sunita More', phone: '9876512345', email: 'sunita@example.com', totalBookings: 1, status: 'active', lastBooking: '2025-08-03' },
  { id: 'cust-003', name: 'Vijay Chavan', phone: '9876567890', email: 'vijay@example.com', totalBookings: 2, status: 'active', lastBooking: '2025-07-30' },
  { id: 'cust-004', name: 'Meena Pawar', phone: '9876598765', email: 'meena@example.com', totalBookings: 1, status: 'active', lastBooking: '2025-08-04' },
  { id: 'cust-005', name: 'Sandip Jadhav', phone: '9876523456', email: 'sandip@example.com', totalBookings: 2, status: 'inactive', lastBooking: '2025-07-20' },
  { id: 'cust-006', name: 'Priya Sharma', phone: '9876534567', email: 'priya@example.com', totalBookings: 1, status: 'active', lastBooking: '2025-08-01' },
];

// ===== Simulated async API methods =====
export const mockApi = {
  getDecorations: async () => {
    const decorations = await decorationService.getAll();
    return decorations.map(toDecoration);
  },
  getGallery: async () => {
    await delay();
    return [...mockGalleryImages];
  },
  getReviews: async () => {
    await delay();
    return [...mockReviews];
  },
  getBookings: async () => {
    return bookingService.getAll();
  },
  getDashboardStats: async () => {
    await delay(200);
    return { ...mockDashboardStats };
  },
  getChartData: async () => {
    await delay(200);
    return { ...mockChartData };
  },
  getCustomers: async () => {
    await delay();
    return [...mockCustomers];
  },
  createBooking: async (data) => {
    if (!data.decorationId) {
      throw new Error('Please select a decoration before submitting your booking.');
    }

    return bookingService.create({
      customerName: data.customerName,
      customerPhone: data.phone,
      customerEmail: data.email || null,
      eventType: data.eventType,
      eventDate: data.date,
      eventTime: data.time,
      venue: data.venue,
      guestCount: Number(data.guests),
      specialRequirement: data.requirements || null,
      decorationId: Number(data.decorationId),
    });
  },
  createReview: async (data) => {
    await delay(500);
    return { ...data, id: 'rev-' + Date.now().toString(36) };
  },
  adminLogin: async (credentials) => {
    await delay(500);
    if (credentials.username === 'admin' && credentials.password === 'admin123') {
      return { token: 'mock-jwt-token-' + Date.now(), user: { name: 'Admin', role: 'admin' } };
    }
    throw { message: 'Invalid credentials. Please try again.' };
  },
};
