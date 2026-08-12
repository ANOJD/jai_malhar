import { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Image,
  CalendarCheck,
  GalleryHorizontalEnd,
  Star,
  Users,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Sparkles,
  ChevronLeft,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { ROUTES } from '../utils/constants.js';
import styles from './AdminLayout.module.css';

const sidebarItems = [
  { to: ROUTES.ADMIN_DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
  { to: ROUTES.ADMIN_DECORATIONS, label: 'Decorations', icon: Image },
  { to: ROUTES.ADMIN_BOOKINGS, label: 'Bookings', icon: CalendarCheck },
  { to: ROUTES.ADMIN_GALLERY, label: 'Gallery', icon: GalleryHorizontalEnd },
  { to: ROUTES.ADMIN_REVIEWS, label: 'Reviews', icon: Star },
  { to: ROUTES.ADMIN_CUSTOMERS, label: 'Customers', icon: Users },
  { to: ROUTES.ADMIN_REPORTS, label: 'Reports', icon: FileText },
  { to: ROUTES.ADMIN_SETTINGS, label: 'Settings', icon: Settings },
];

export default function AdminLayout() {
  const { logout, adminUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate(ROUTES.ADMIN_LOGIN);
  };

  const currentPage = sidebarItems.find((item) => location.pathname.startsWith(item.to));

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${mobileOpen ? styles.mobileOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <Link to={ROUTES.ADMIN_DASHBOARD} className={styles.logo}>
            <span className={styles.logoIcon}>
              <Sparkles size={20} />
            </span>
            <span className={styles.logoText}>
              <span className={styles.logoMain}>Jai Malhar</span>
              <span className={styles.logoSub}>Admin Panel</span>
            </span>
          </Link>
        </div>

        <nav className={styles.nav}>
          {sidebarItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.navActive : ''}`
              }
              onClick={() => setMobileOpen(false)}
            >
              <item.icon size={20} className={styles.navIcon} />
              <span className={styles.navLabel}>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
              {adminUser?.name?.[0] || 'A'}
            </div>
            <div className={styles.userDetails}>
              <span className={styles.userName}>{adminUser?.name || 'Admin'}</span>
              <span className={styles.userRole}>Administrator</span>
            </div>
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className={styles.overlay} onClick={() => setMobileOpen(false)} />
      )}

      {/* Main */}
      <div className={styles.main}>
        <header className={styles.topbar}>
          <button
            className={styles.menuToggle}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle sidebar"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <div className={styles.topbarTitle}>
            <h1>{currentPage?.label || 'Dashboard'}</h1>
          </div>
          <Link to={ROUTES.HOME} className={styles.viewSite}>
            View Site
            <ChevronLeft size={16} />
          </Link>
        </header>

        <AnimatePresence mode="wait">
          <motion.main
            key={location.pathname}
            className={styles.content}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <Outlet />
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
}
