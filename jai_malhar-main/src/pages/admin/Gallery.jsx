import { useState, useMemo, useRef } from 'react';
import { Search, Plus, Trash2, X, Upload } from 'lucide-react';
import { useAsync } from '../../hooks/useAsync.js';
import { galleryService } from '../../services/api.service.js';
import { EVENT_CATEGORIES } from '../../utils/constants.js';
import Button from '../../components/Button.jsx';
import Modal from '../../components/Modal.jsx';
import styles from './admin.module.css';
import decoStyles from './Decorations.module.css';

export default function AdminGallery() {
  const { data: images, loading, refetch } = useAsync(() => galleryService.getAll(), []);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [showUpload, setShowUpload] = useState(false);
  const [uploadData, setUploadData] = useState({ title: '', category: 'wedding' });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadError, setUploadError] = useState('');
  const [uploadLoading, setUploadLoading] = useState(false);
  const fileInputRef = useRef(null);

  const filtered = useMemo(() => {
    if (!images) return [];
    return images.filter((img) => {
      const matchSearch = !search || img.title.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === 'all' || img.category === category;
      return matchSearch && matchCat;
    });
  }, [images, search, category]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this image?')) return;

    try {
      await galleryService.remove(id);
      await refetch();
    } catch (error) {
      alert(error.message || 'Failed to delete image.');
    }
  };

  const handleFileSelection = (event) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(files);
    setUploadError('');
  };

  const handleUpload = async () => {
    if (!uploadData.title.trim()) {
      setUploadError('Please provide an image title.');
      return;
    }
    if (selectedFiles.length === 0) {
      setUploadError('Please select at least one image to upload.');
      return;
    }

    setUploadLoading(true);
    setUploadError('');

    try {
      const formData = new FormData();
      formData.append('title', uploadData.title);
      formData.append('category', uploadData.category);
      selectedFiles.forEach((file) => formData.append('images', file));

      await galleryService.uploadImages(formData);
      setShowUpload(false);
      setUploadData({ title: '', category: 'wedding' });
      setSelectedFiles([]);
      await refetch();
    } catch (error) {
      setUploadError(error.message || 'Upload failed.');
    } finally {
      setUploadLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Gallery Management</h1>
          <p className={styles.pageDesc}>Upload and manage recent event images for the public gallery.</p>
        </div>
        <Button variant="primary" size="md" leftIcon={Plus} onClick={() => setShowUpload(true)}>
          Upload Images
        </Button>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search images..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="all">All Categories</option>
          {EVENT_CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.label}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className={styles.emptyState}>Loading gallery...</div>
      ) : filtered.length === 0 ? (
        <div className={styles.emptyState}>No images found.</div>
      ) : (
        <div className={decoStyles.galleryGrid}>
          {filtered.map((img) => (
            <div key={img.id} className={decoStyles.galleryItem}>
              <img src={img.url} alt={img.title} loading="lazy" />
              <div className={decoStyles.galleryOverlay}>
                <div className={decoStyles.galleryInfo}>
                  <span className={decoStyles.galleryTitle}>{img.title}</span>
                  <span className={decoStyles.galleryCat}>{img.category}</span>
                </div>
                <button className={`${styles.actionBtn} ${styles.actionDelete}`} onClick={() => handleDelete(img.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <Modal open={showUpload} onClose={() => setShowUpload(false)} maxWidth={560}>
        <div className={decoStyles.formModal}>
          <div className={decoStyles.formHeader}>
            <h2>Upload Event Images</h2>
            <button className={decoStyles.formClose} onClick={() => setShowUpload(false)}>
              <X size={22} />
            </button>
          </div>
          <div className={decoStyles.formBody}>
            <div className={decoStyles.formGroup}>
              <label className={decoStyles.formLabel}>Event Title *</label>
              <input
                type="text"
                value={uploadData.title}
                onChange={(e) => setUploadData((p) => ({ ...p, title: e.target.value }))}
                className={decoStyles.formInput}
                placeholder="e.g. Royal Wedding Stage"
              />
            </div>
            <div className={decoStyles.formGroup}>
              <label className={decoStyles.formLabel}>Category *</label>
              <select
                value={uploadData.category}
                onChange={(e) => setUploadData((p) => ({ ...p, category: e.target.value }))}
                className={decoStyles.formInput}
              >
                {EVENT_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </select>
            </div>
            <div className={decoStyles.formGroup}>
              <label className={decoStyles.formLabel}>Upload Images</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={handleFileSelection}
              />
              <div
                className={decoStyles.uploadZone}
                onClick={() => fileInputRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyPress={() => fileInputRef.current?.click()}
              >
                <Upload size={24} />
                <span>{selectedFiles.length > 0 ? `${selectedFiles.length} image(s) selected` : 'Click to select image files'}</span>
                <span className={decoStyles.uploadHint}>JPG, PNG up to 10MB each</span>
              </div>
              {uploadError && <p className={decoStyles.errorText}>{uploadError}</p>}
            </div>
            <Button variant="primary" size="md" fullWidth onClick={handleUpload} disabled={uploadLoading}>
              {uploadLoading ? 'Uploading...' : 'Upload Images'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
