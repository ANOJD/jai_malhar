import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Calendar, User, MapPin, Users, Sparkles, Phone, Search } from 'lucide-react';
import { useAsync } from '../../hooks/useAsync.js';
import { bookingService } from '../../services/api.service.js';
import { BUSINESS } from '../../utils/constants.js';
import { formatDate, getCategoryLabel, getStatusLabel } from '../../utils/helpers.js';
import Button from '../../components/Button.jsx';
import styles from './admin.module.css';
import decoStyles from './Decorations.module.css';

export default function AdminReports() {
  const { data: bookings, loading } = useAsync(() => bookingService.getAll(), []);
  const [selectedId, setSelectedId] = useState('');
  const [generated, setGenerated] = useState(false);
  const [search, setSearch] = useState('');

  const filteredBookings = useMemo(() => {
    if (!bookings) return [];
    const normalized = search.trim().toLowerCase();
    if (!normalized) return bookings;
    return bookings.filter((b) =>
      String(b.id).toLowerCase().includes(normalized) ||
      b.customerName?.toLowerCase().includes(normalized) ||
      b.customerPhone?.toLowerCase().includes(normalized)
    );
  }, [bookings, search]);

  const selectedBooking = filteredBookings?.find((b) => String(b.id) === selectedId) ||
    bookings?.find((b) => String(b.id) === selectedId);

  const handleGenerate = () => {
    if (!selectedBooking) return;
    setGenerated(true);
  };

  const handleDownload = () => {
    if (!selectedBooking) return;

    const reportText = `Malhar Events Report\n\n` +
      `Report ID: RPT-${selectedBooking.id}\n` +
      `Customer: ${selectedBooking.customerName}\n` +
      `Phone: ${selectedBooking.customerPhone || '—'}\n` +
      `Email: ${selectedBooking.customerEmail || '—'}\n` +
      `Event Type: ${getCategoryLabel(selectedBooking.eventType)}\n` +
      `Date: ${formatDate(selectedBooking.eventDate)}\n` +
      `Time: ${selectedBooking.eventTime || '—'}\n` +
      `Decoration: ${selectedBooking.decoration?.title || selectedBooking.decorationName || 'Decorator will choose the best design'}\n` +
      `Venue: ${selectedBooking.venue || '—'}\n` +
      `Landmark: ${selectedBooking.landmark || '—'}\n` +
      `Guests: ${selectedBooking.guestCount ?? '—'}\n` +
      `Special Requirements: ${selectedBooking.specialRequirement || 'None specified'}\n` +
      `Status: ${getStatusLabel(selectedBooking.status)}\n`;

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `report-${selectedBooking.id}.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Reports</h1>
          <p className={styles.pageDesc}>Generate detailed PDF reports for any booking.</p>
        </div>
      </div>

      {/* Report Generator */}
      <div className={decoStyles.reportCard}>
        <div className={decoStyles.reportHeader}>
          <FileText size={24} className={decoStyles.reportIcon} />
          <h2 className={decoStyles.reportTitle}>Generate Malhar Events Report</h2>
        </div>

        <div className={decoStyles.reportForm}>
          <div className={decoStyles.formGroup}>
            <label className={decoStyles.formLabel}>Search booking</label>
            <div className={decoStyles.searchField}>
              <Search size={18} />
              <input
                type="text"
                placeholder="Search by booking ID, customer, or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={decoStyles.formInput}
              />
            </div>
          </div>
          <div className={decoStyles.formGroup}>
            <label className={decoStyles.formLabel}>Select Booking</label>
            <select
              value={selectedId}
              onChange={(e) => { setSelectedId(e.target.value); setGenerated(false); }}
              className={decoStyles.formInput}
            >
              <option value="">Choose a booking...</option>
              {filteredBookings?.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.id} — {b.customerName} ({formatDate(b.eventDate)})
                </option>
              ))}
            </select>
          </div>
          <Button variant="primary" size="md" leftIcon={FileText} onClick={handleGenerate} disabled={!selectedBooking}>
            Generate Report
          </Button>
        </div>
      </div>

      {/* Report Preview */}
      {generated && selectedBooking && (
        <motion.div
          className={decoStyles.reportPreview}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className={decoStyles.reportDoc}>
            {/* Header */}
            <div className={decoStyles.reportDocHeader}>
              <div className={decoStyles.reportLogo}>
                <Sparkles size={24} />
              </div>
              <div>
                <h2 className={decoStyles.reportDocTitle}>{BUSINESS.name}</h2>
                <p className={decoStyles.reportDocSub}>Event Booking Report</p>
              </div>
            </div>

            <div className={decoStyles.reportMeta}>
              <span>Report ID: RPT-{selectedBooking.id}</span>
              <span>Generated: {formatDate(new Date().toISOString())}</span>
            </div>

            {/* Customer Details */}
            <div className={decoStyles.reportSection}>
              <h3 className={decoStyles.reportSectionTitle}>
                <User size={16} /> Customer Details
              </h3>
              <div className={decoStyles.reportField}><strong>Name:</strong> {selectedBooking.customerName}</div>
              <div className={decoStyles.reportField}><strong>Phone:</strong> {selectedBooking.customerPhone || '—'}</div>
              <div className={decoStyles.reportField}><strong>Email:</strong> {selectedBooking.customerEmail || '—'}</div>
            </div>

            {/* Event Details */}
            <div className={decoStyles.reportSection}>
              <h3 className={decoStyles.reportSectionTitle}>
                <Calendar size={16} /> Event Details
              </h3>
              <div className={decoStyles.reportField}><strong>Event Type:</strong> {getCategoryLabel(selectedBooking.eventType)}</div>
              <div className={decoStyles.reportField}><strong>Date:</strong> {formatDate(selectedBooking.eventDate)}</div>
              <div className={decoStyles.reportField}><strong>Time:</strong> {selectedBooking.eventTime || '—'}</div>
              <div className={decoStyles.reportField}><strong>Decoration:</strong> {selectedBooking.decoration?.title || selectedBooking.decorationName || 'Decorator will choose the best design'}</div>
            </div>

            {/* Venue */}
            <div className={decoStyles.reportSection}>
              <h3 className={decoStyles.reportSectionTitle}>
                <MapPin size={16} /> Venue
              </h3>
              <div className={decoStyles.reportField}><strong>Venue:</strong> {selectedBooking.venue || '—'}</div>
              <div className={decoStyles.reportField}><strong>Landmark:</strong> {selectedBooking.landmark || '—'}</div>
              <div className={decoStyles.reportField}><strong>Expected Guests:</strong> {selectedBooking.guestCount ?? '—'}</div>
            </div>

            {/* Special Requirements */}
            <div className={decoStyles.reportSection}>
              <h3 className={decoStyles.reportSectionTitle}>
                <Sparkles size={16} /> Special Requirements
              </h3>
              <div className={decoStyles.reportField}>{selectedBooking.specialRequirement || 'None specified'}</div>
            </div>

            {/* Status */}
            <div className={decoStyles.reportSection}>
              <h3 className={decoStyles.reportSectionTitle}>
                <FileText size={16} /> Booking Status
              </h3>
              <div className={decoStyles.reportField}>
                <span className={`${styles.statusBadge} ${styles[`status${selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}`]}`}>
                  {getStatusLabel(selectedBooking.status)}
                </span>
              </div>
            </div>

            {/* Owner Details */}
            <div className={decoStyles.reportFooter}>
              <div>
                <strong>{BUSINESS.ownerName}</strong>
                <p>{BUSINESS.phone}</p>
                <p>{BUSINESS.email}</p>
              </div>
              <div className={decoStyles.reportStamp}>
                {BUSINESS.name}
              </div>
            </div>

            <Button variant="gold" size="md" leftIcon={Download} onClick={handleDownload} style={{ marginTop: 20 }}>
              Download PDF
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
