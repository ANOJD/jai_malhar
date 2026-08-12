import { motion } from 'framer-motion';
import {
  CalendarCheck,
  Clock,
  CheckCircle2,
  PartyPopper,
  XCircle,
  Image,
  Star,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useAsync } from '../../hooks/useAsync.js';
import { bookingService, decorationService, reviewService } from '../../services/api.service.js';
import { BarChart, DonutChart, LineChart } from '../../components/Chart.jsx';
import styles from './Dashboard.module.css';

const statCards = [
  { key: 'todayBookings', label: "Today's Bookings", icon: CalendarCheck, color: 'var(--color-primary)' },
  { key: 'pendingBookings', label: 'Pending Bookings', icon: Clock, color: 'var(--color-warning)' },
  { key: 'approvedBookings', label: 'Approved Bookings', icon: CheckCircle2, color: 'var(--color-info)' },
  { key: 'completedEvents', label: 'Completed Events', icon: PartyPopper, color: 'var(--color-success)' },
  { key: 'cancelledBookings', label: 'Cancelled', icon: XCircle, color: 'var(--color-error)' },
  { key: 'galleryImages', label: 'Gallery Images', icon: Image, color: 'var(--color-secondary-600)' },
  { key: 'customerReviews', label: 'Customer Reviews', icon: Star, color: 'var(--color-secondary)' },
];

export default function Dashboard() {
  const { data: bookings, loading: bookingsLoading } =
    useAsync(() => bookingService.getAll(), []);
  const { data: decorations, loading: decorationsLoading } =
    useAsync(() => decorationService.getAll(), []);
  const { data: reviews, loading: reviewsLoading } =
    useAsync(() => reviewService.getAll(), []);

  const statsLoading = bookingsLoading || decorationsLoading || reviewsLoading;

  const stats = {
    todayBookings: bookings?.filter(
      (b) => b.eventDate === new Date().toISOString().split('T')[0]
    ).length || 0,

    pendingBookings:
      bookings?.filter((b) => b.status?.toLowerCase() === 'pending').length || 0,

    approvedBookings:
      bookings?.filter((b) => b.status?.toLowerCase() === 'approved').length || 0,

    completedEvents:
      bookings?.filter((b) => b.status?.toLowerCase() === 'completed').length || 0,

    cancelledBookings:
      bookings?.filter((b) => b.status?.toLowerCase() === 'cancelled').length || 0,

    galleryImages: decorations?.length || 0,

    customerReviews: reviews?.length || 0,
  };

  const chartLoading = statsLoading;

  const buildMonthlyBookings = (items = []) => {
    const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const counts = {};

    items.forEach((item) => {
      const date = new Date(item.eventDate || item.date || item.createdAt);
      if (Number.isNaN(date.getTime())) return;
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      counts[key] = (counts[key] || 0) + 1;
    });

    const sortedKeys = Object.keys(counts).sort();
    if (sortedKeys.length === 0) {
      return monthLabels.slice(0, 6).map((label) => ({ label, value: 0 }));
    }

    return sortedKeys.map((key) => {
      const [year, month] = key.split('-').map(Number);
      return {
        label: `${monthLabels[month]} ${year}`,
        value: counts[key],
      };
    });
  };

  const buildEventCategories = (items = []) => {
    const counts = items.reduce((acc, item) => {
      const type = item.eventType || 'unknown';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    }));
  };

  const buildBookingStatus = (items = []) => {
    const statuses = ['pending', 'approved', 'completed', 'cancelled', 'rejected'];
    const counts = items.reduce((acc, item) => {
      const status = (item.status || 'pending').toLowerCase();
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    return statuses
      .filter((status) => counts[status] > 0)
      .map((status) => ({
        status: status.charAt(0).toUpperCase() + status.slice(1),
        value: counts[status],
      }));
  };

  const buildCustomerGrowth = (items = []) => {
    const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const counts = {};

    items.forEach((item) => {
      const date = new Date(item.eventDate || item.date || item.createdAt);
      if (Number.isNaN(date.getTime())) return;
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      counts[key] = (counts[key] || 0) + 1;
    });

    const sortedKeys = Object.keys(counts).sort();
    return sortedKeys.map((key) => {
      const [year, month] = key.split('-').map(Number);
      return {
        label: `${monthLabels[month]} ${year}`,
        value: counts[key],
      };
    });
  };

  const chartData = bookings
    ? {
        monthlyBookings: buildMonthlyBookings(bookings),
        eventCategories: buildEventCategories(bookings),
        bookingStatus: buildBookingStatus(bookings),
        customerGrowth: buildCustomerGrowth(bookings),
      }
    : null;

  return (
    <div className={styles.page}>
      {/* Stat Cards */}
      <div className={styles.statGrid}>
        {statCards.map((card, i) => (
          <motion.div
            key={card.key}
            className={styles.statCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            whileHover={{ y: -4 }}
          >
            <div className={styles.statIcon} style={{ background: card.color }}>
              <card.icon size={22} />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>
                {statsLoading ? '…' : stats?.[card.key] ?? 0}
              </span>
              <span className={styles.statLabel}>{card.label}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className={styles.chartsGrid}>
        {/* Monthly Bookings */}
        <motion.div
          className={styles.chartCard}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className={styles.chartHeader}>
            <div className={styles.chartTitleWrap}>
              <TrendingUp size={20} className={styles.chartTitleIcon} />
              <h3 className={styles.chartTitle}>Monthly Bookings</h3>
            </div>
            <span className={styles.chartBadge}>2025</span>
          </div>
          {!chartLoading && chartData && (
            <BarChart data={chartData.monthlyBookings} color="var(--color-primary)" />
          )}
        </motion.div>

        {/* Event Categories */}
        <motion.div
          className={styles.chartCard}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <div className={styles.chartHeader}>
            <div className={styles.chartTitleWrap}>
              <PartyPopper size={20} className={styles.chartTitleIcon} />
              <h3 className={styles.chartTitle}>Event Categories</h3>
            </div>
          </div>
          {!chartLoading && chartData && (
            <DonutChart data={chartData.eventCategories} />
          )}
        </motion.div>

        {/* Booking Status */}
        <motion.div
          className={styles.chartCard}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <div className={styles.chartHeader}>
            <div className={styles.chartTitleWrap}>
              <CheckCircle2 size={20} className={styles.chartTitleIcon} />
              <h3 className={styles.chartTitle}>Booking Status</h3>
            </div>
          </div>
          {!chartLoading && chartData && (
            <DonutChart data={chartData.bookingStatus} size={180} />
          )}
        </motion.div>

        {/* Customer Growth */}
        <motion.div
          className={styles.chartCard}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <div className={styles.chartHeader}>
            <div className={styles.chartTitleWrap}>
              <Users size={20} className={styles.chartTitleIcon} />
              <h3 className={styles.chartTitle}>Customer Growth</h3>
            </div>
            <span className={styles.chartBadge}>+27%</span>
          </div>
          {!chartLoading && chartData && (
            <LineChart data={chartData.customerGrowth} color="var(--color-secondary)" />
          )}
        </motion.div>
      </div>
    </div>
  );
}
