import { useState, useMemo } from 'react';
import {
  Search,
  CheckCircle2,
  XCircle,
  PartyPopper,
  FileText,
  Eye,
  X,
  Trash2
} from 'lucide-react';
import { useAsync } from '../../hooks/useAsync.js';
import { bookingService } from '../../services/api.service.js';
import { EVENT_CATEGORIES } from '../../utils/constants.js';
import { formatDate, getCategoryLabel, getStatusLabel } from '../../utils/helpers.js';
import Button from '../../components/Button.jsx';
import Modal from '../../components/Modal.jsx';
import styles from './admin.module.css';
import decoStyles from './Decorations.module.css';

export default function AdminBookings() {
  const { data: bookings, loading, refetch } = useAsync(
  () => bookingService.getAll(),
  []
);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewBooking, setViewBooking] = useState(null);

  const filtered = useMemo(() => {
    if (!bookings) return [];
    return bookings.filter((b) => {
      const matchSearch =
        !search ||
        b.customerName.toLowerCase().includes(search.toLowerCase()) ||
        b.customerPhone?.includes(search) ||
        String(b.id).includes(search);
      const matchStatus =
  statusFilter === 'all' ||
  b.status?.toLowerCase() === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [bookings, search, statusFilter]);

  const statusClass = (status) => {
    const s = status || '';
    return `status${s.charAt(0).toUpperCase() + s.slice(1)}`;
  };

  const handleDelete = async (id) => {
  if (!window.confirm('Are you sure you want to delete this booking?')) {
    return;
  }

  try {
    await bookingService.remove(id);
    await refetch();
  } catch (error) {
    alert(error.message || 'Failed to delete booking.');
  }
};

  const handleStatusChange = async (id, newStatus) => {
  try {
    await bookingService.updateStatus(id, newStatus);
    await refetch();
  } catch (error) {
    alert(error.message || 'Failed to update booking status.');
  }
};

  const handleGenerateReport = (booking) => {
    alert(`Generating PDF report for booking ${booking.id}...`);
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Booking Management</h1>
          <p className={styles.pageDesc}>View, approve, reject, and manage all event bookings.</p>
        </div>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search by name, phone, or booking ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Customer</th>
                <th>Phone</th>
                <th>Event Date</th>
                <th>Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className={styles.emptyState}>Loading bookings...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className={styles.emptyState}>No bookings found.</td></tr>
              ) : (
                filtered.map((b) => (
                  <tr key={b.id}>
                    <td><strong style={{ color: 'var(--color-primary)' }}>{b.id}</strong></td>
                    <td>{b.customerName}</td>
                    <td>{b.customerPhone}</td>
                    <td>{formatDate(b.eventDate)}</td>
                    <td>{getCategoryLabel(b.eventType)}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${styles[statusClass(b.status)]}`}>
                        {getStatusLabel(b.status)}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actionBtns}>
                        <button className={`${styles.actionBtn} ${styles.actionView}`} onClick={() => setViewBooking(b)} title="View">
                          <Eye size={16} />
                        </button>
                        {b.status?.toLowerCase() === 'pending' && (
                          <>
                            <button
                              className={`${styles.actionBtn} ${styles.actionApprove}`}
                              onClick={() => handleStatusChange(b.id, 'APPROVED')}
                              title="Approve"
                            >
                              <CheckCircle2 size={16} />
                            </button>

                            <button
                              className={`${styles.actionBtn} ${styles.actionReject}`}
                              onClick={() => handleStatusChange(b.id, 'CANCELLED')}
                              title="Cancel"
                            >
                              <XCircle size={16} />
                            </button>
                          </>
                        )}

                        {b.status?.toLowerCase() === 'approved' && (
                          <button
                            className={`${styles.actionBtn} ${styles.actionComplete}`}
                            onClick={() => handleStatusChange(b.id, 'COMPLETED')}
                            title="Mark Completed"
                          >
                            <PartyPopper size={16} />
                          </button>
                        )}

                        <button
                          className={`${styles.actionBtn} ${styles.actionView}`}
                          onClick={() => handleGenerateReport(b)}
                          title="Generate Report"
                        >
                          <FileText size={16} />
                        </button>

                        <button
                          className={`${styles.actionBtn} ${styles.actionDelete}`}
                          onClick={() => handleDelete(b.id)}
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Booking Modal */}
      <Modal open={!!viewBooking} onClose={() => setViewBooking(null)} maxWidth={560}>
        {viewBooking && (
          <div className={decoStyles.formModal}>
            <div className={decoStyles.formHeader}>
              <h2>Booking Details</h2>
              <button className={decoStyles.formClose} onClick={() => setViewBooking(null)}>
                <X size={22} />
              </button>
            </div>
            <div className={decoStyles.formBody}>
              <div className={decoStyles.detailGrid}>
                <div className={decoStyles.detailItem}>
                  <span className={decoStyles.detailLabel}>Booking ID</span>
                  <span className={decoStyles.detailValue}>{viewBooking.id}</span>
                </div>
                <div className={decoStyles.detailItem}>
                  <span className={decoStyles.detailLabel}>Status</span>
                  <span className={`${styles.statusBadge} ${styles[statusClass(viewBooking.status)]}`}>
                    {getStatusLabel(viewBooking.status)}
                  </span>
                </div>
                <div className={decoStyles.detailItem}>
                  <span className={decoStyles.detailLabel}>Customer Name</span>
                  <span className={decoStyles.detailValue}>{viewBooking.customerName}</span>
                </div>
                <div className={decoStyles.detailItem}>
                  <span className={decoStyles.detailLabel}>Phone</span>
                  <span className={decoStyles.detailValue}>{viewBooking.customerPhone}</span>
                </div>
                <div className={decoStyles.detailItem}>
                  <span className={decoStyles.detailLabel}>Email</span>
                  <span className={decoStyles.detailValue}>{viewBooking.customerEmail || '—'}</span>
                </div>
                <div className={decoStyles.detailItem}>
                  <span className={decoStyles.detailLabel}>Event Type</span>
                  <span className={decoStyles.detailValue}>{getCategoryLabel(viewBooking.eventType)}</span>
                </div>
                <div className={decoStyles.detailItem}>
                  <span className={decoStyles.detailLabel}>Decoration</span>
                  <span className={decoStyles.detailValue}>{viewBooking.decoration?.title || viewBooking.decorationName || 'Decorator will choose the best design'}</span>
                </div>
                <div className={decoStyles.detailItem}>
                  <span className={decoStyles.detailLabel}>Event Date</span>
                  <span className={decoStyles.detailValue}>{formatDate(viewBooking.eventDate)}</span>
                </div>
                <div className={decoStyles.detailItem}>
                  <span className={decoStyles.detailLabel}>Event Time</span>
                  <span className={decoStyles.detailValue}>{viewBooking.eventTime}</span>
                </div>
                <div className={decoStyles.detailItem}>
                  <span className={decoStyles.detailLabel}>Venue</span>
                  <span className={decoStyles.detailValue}>{viewBooking.venue}</span>
                </div>
                <div className={decoStyles.detailItem}>
                  <span className={decoStyles.detailLabel}>Landmark</span>
                  <span className={decoStyles.detailValue}>{viewBooking.landmark || '—'}</span>
                </div>
                <div className={decoStyles.detailItem}>
                  <span className={decoStyles.detailLabel}>Expected Guests</span>
                  <span className={decoStyles.detailValue}>{viewBooking.guestCount}</span>
                </div>
                <div className={decoStyles.detailItemFull}>
                  <span className={decoStyles.detailLabel}>Special Requirements</span>
                  <span className={decoStyles.detailValue}>{viewBooking.specialRequirement || 'None'}</span>
                </div>
              </div>
              <Button variant="primary" size="md" fullWidth leftIcon={FileText} onClick={() => handleGenerateReport(viewBooking)}>
                Generate Report PDF
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
