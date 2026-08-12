import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { BookingProvider } from './context/BookingContext.jsx';
import { LanguageProvider } from './context/LanguageContext.jsx';
import { SettingsProvider } from './context/SettingsContext.jsx';
import { ROUTES } from './utils/constants.js';

import PublicLayout from './layouts/PublicLayout.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';

import Home from './pages/Home.jsx';
import Gallery from './pages/Gallery.jsx';
import Decorations from './pages/Decorations.jsx';
import Booking from './pages/Booking.jsx';
import BookingSuccess from './pages/BookingSuccess.jsx';
import Reviews from './pages/Reviews.jsx';
import Contact from './pages/Contact.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import AdminDashboard from './pages/admin/Dashboard.jsx';
import AdminDecorations from './pages/admin/Decorations.jsx';
import AdminBookings from './pages/admin/Bookings.jsx';
import AdminGallery from './pages/admin/Gallery.jsx';
import AdminReviews from './pages/admin/Reviews.jsx';
import AdminCustomers from './pages/admin/Customers.jsx';
import AdminReports from './pages/admin/Reports.jsx';
import AdminSettings from './pages/admin/Settings.jsx';

function ProtectedRoute({ children }) {
  const { isAdmin } = useAuth();
  if (!isAdmin) return <Navigate to={ROUTES.ADMIN_LOGIN} replace />;
  return children;
}

export default function App() {
  return (
    <LanguageProvider>
      <SettingsProvider>
        <AuthProvider>
          <BookingProvider>
        <Routes>
          {/* Public */}
          <Route element={<PublicLayout />}>
            <Route path={ROUTES.HOME} element={<Home />} />
            <Route path={ROUTES.GALLERY} element={<Gallery />} />
            <Route path={ROUTES.DECORATIONS} element={<Decorations />} />
            <Route path={ROUTES.BOOKING} element={<Booking />} />
            <Route path={ROUTES.BOOKING_SUCCESS} element={<BookingSuccess />} />
            <Route path={ROUTES.REVIEWS} element={<Reviews />} />
            <Route path={ROUTES.CONTACT} element={<Contact />} />
          </Route>

          {/* Admin */}
          <Route path={ROUTES.ADMIN_LOGIN} element={<AdminLogin />} />
          <Route
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminDashboard />} />
            <Route path={ROUTES.ADMIN_DECORATIONS} element={<AdminDecorations />} />
            <Route path={ROUTES.ADMIN_BOOKINGS} element={<AdminBookings />} />
            <Route path={ROUTES.ADMIN_GALLERY} element={<AdminGallery />} />
            <Route path={ROUTES.ADMIN_REVIEWS} element={<AdminReviews />} />
            <Route path={ROUTES.ADMIN_CUSTOMERS} element={<AdminCustomers />} />
            <Route path={ROUTES.ADMIN_REPORTS} element={<AdminReports />} />
            <Route path={ROUTES.ADMIN_SETTINGS} element={<AdminSettings />} />
          </Route>

          <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
        </Routes>
          </BookingProvider>
        </AuthProvider>
      </SettingsProvider>
    </LanguageProvider>
  );
}
