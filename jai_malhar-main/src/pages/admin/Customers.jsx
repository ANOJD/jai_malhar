import { useState, useMemo } from 'react';
import { Search, Phone, Mail, Calendar } from 'lucide-react';
import { useAsync } from '../../hooks/useAsync.js';
import { customerService } from '../../services/api.service.js';
import { formatDate } from '../../utils/helpers.js';
import styles from './admin.module.css';

export default function AdminCustomers() {
  const { data: customers, loading } = useAsync(() => customerService.getAll(), []);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!customers) return [];
    return customers.filter((c) =>
      !search ||
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.phone?.includes(search) ||
      c.email?.toLowerCase().includes(search.toLowerCase())
    );
  }, [customers, search]);

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Customers</h1>
          <p className={styles.pageDesc}>View all customers who have booked events with you.</p>
        </div>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Total Bookings</th>
                <th>Last Booking</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className={styles.emptyState}>Loading customers...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className={styles.emptyState}>No customers found.</td></tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id}>
                    <td><strong style={{ color: 'var(--color-primary)' }}>{c.name}</strong></td>
                    <td>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Phone size={14} style={{ color: 'var(--color-text-muted)' }} />
                        {c.phone}
                      </span>
                    </td>
                    <td>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Mail size={14} style={{ color: 'var(--color-text-muted)' }} />
                        {c.email}
                      </span>
                    </td>
                    <td><strong>{c.totalBookings}</strong></td>
                    <td>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Calendar size={14} style={{ color: 'var(--color-text-muted)' }} />
                        {formatDate(c.lastBooking)}
                      </span>
                    </td>
                    <td>
                      <span className={`${styles.statusBadge} ${c.status === 'active' ? styles.statusCompleted : styles.statusCancelled}`}>
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
