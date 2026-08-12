import { useState, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Pencil, Trash2, X, Upload, ImageIcon } from 'lucide-react';
import { useAsync } from '../../hooks/useAsync.js';
import { decorationService } from '../../services/api.service.js';
import { EVENT_CATEGORIES } from '../../utils/constants.js';
import { getCategoryLabel } from '../../utils/helpers.js';
import Button from '../../components/Button.jsx';
import Modal from '../../components/Modal.jsx';
import styles from './admin.module.css';
import decoStyles from './Decorations.module.css';

export default function AdminDecorations() {
  const { data: decorations, loading, refetch } = useAsync(() => decorationService.getAll(), []);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    eventType: 'wedding',
    description: '',
    imageUrl: '',
    available: true,
  });
  const [imagePreview, setImagePreview] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const filtered = useMemo(() => {
    if (!decorations) return [];
    return decorations.filter((d) => {
      const matchSearch = !search || d.title?.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === 'all' || d.eventType?.toLowerCase() === category.toLowerCase();
      return matchSearch && matchCat;
    });
  }, [decorations, search, category]);

  const handleEdit = (dec) => {
  setEditing(dec);

  setFormData({
    title: dec.title || '',
    eventType: dec.eventType || 'wedding',
    description: dec.description || '',
    imageUrl: dec.imageUrl || '',
    available: dec.available ?? true,
  });
  setImagePreview(dec.imageUrl || '');

  setShowForm(true);
};

  const handleAdd = () => {
  setEditing(null);

  setFormData({
    title: '',
    eventType: 'wedding',
    description: '',
    imageUrl: '',
    available: true,
  });
  setImagePreview('');

  setShowForm(true);
};
  const handleSave = async () => {
  if (!formData.title.trim() || !formData.description.trim()) {
    alert('Please provide a title and description for the decoration.');
    return;
  }

  try {
    const payload = { ...formData };
    if (selectedFile) {
      payload.imageUrl = editing?.imageUrl || '';
    }

    let savedDecoration;

    if (editing) {
      savedDecoration = await decorationService.update(editing.id, payload);
    } else {
      savedDecoration = await decorationService.create(payload);
    }

    if (selectedFile) {
      const uploadData = new FormData();
      uploadData.append('image', selectedFile);
      savedDecoration = await decorationService.uploadImage(savedDecoration.id, uploadData);
    }

    setShowForm(false);
    setEditing(null);
    setSelectedFile(null);
    setImagePreview('');
    await refetch();
  } catch (error) {
    alert(error.message || 'Failed to save decoration.');
  }
};

  const handleDelete = async (id) => {
  if (!confirm('Are you sure you want to delete this decoration?')) {
    return;
  }

  try {
    await decorationService.remove(id);
    await refetch();
  } catch (error) {
    alert(error.message || 'Failed to delete decoration.');
  }
};

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Decoration Management</h1>
          <p className={styles.pageDesc}>Add, edit, and manage your decoration catalog.</p>
        </div>
        <Button variant="primary" size="md" leftIcon={Plus} onClick={handleAdd}>
          Add Decoration
        </Button>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search decorations..."
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

      <div className={styles.tableCard}>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Decoration</th>
                <th>Category</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className={styles.emptyState}>Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={4} className={styles.emptyState}>No decorations found.</td></tr>
              ) : (
                filtered.map((dec) => (
                  <tr key={dec.id}>
                    <td>
                      <div className={styles.thumbCell}>
                        <img src={dec.imageUrl} alt={dec.title} className={styles.thumb}/>
                        <span className={styles.thumbName}>{dec.title}</span>
                      </div>
                    </td>
                    <td>{dec.eventType}</td>  
                    <td>{dec.available ? 'Available' : 'Unavailable'}</td>
                    <td>
                      <div className={styles.actionBtns}>
                        <button className={`${styles.actionBtn} ${styles.actionEdit}`} onClick={() => handleEdit(dec)}>
                          <Pencil size={16} />
                        </button>
                        <button className={`${styles.actionBtn} ${styles.actionDelete}`} onClick={() => handleDelete(dec.id)}>
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

      {/* Add/Edit Modal */}
      <Modal open={showForm} onClose={() => setShowForm(false)} maxWidth={560}>
        <div className={decoStyles.formModal}>
          <div className={decoStyles.formHeader}>
            <h2>{editing ? 'Edit Decoration' : 'Add Decoration'}</h2>
            <button className={decoStyles.formClose} onClick={() => setShowForm(false)}>
              <X size={22} />
            </button>
          </div>
          <div className={decoStyles.formBody}>
            <div className={decoStyles.formGroup}>
              <label className={decoStyles.formLabel}>Decoration Name *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                className={decoStyles.formInput}
                placeholder="e.g. Royal Marigold Mandap"
              />
            </div>
            <div className={decoStyles.formGroup}>
              <label className={decoStyles.formLabel}>Category *</label>
              <select
                value={formData.eventType}
                onChange={(e) => setFormData((p) => ({ ...p, eventType: e.target.value }))}
              >
                {EVENT_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </select>
            </div>
            <div className={decoStyles.formGroup}>
              <label className={decoStyles.formLabel}>Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                className={`${decoStyles.formInput} ${decoStyles.formTextarea}`}
                placeholder="Short description of the decoration..."
                rows={3}
              />
            </div>
            <div className={decoStyles.formGroup}>
              <label className={decoStyles.formLabel}>Image URL</label>
              <input
                type="text"
                value={formData.imageUrl}
                onChange={(e) => setFormData((p) => ({ ...p, imageUrl: e.target.value }))}
                className={decoStyles.formInput}
                placeholder="https://..."
              />
            </div>
            <div className={decoStyles.formGroup}>
              <label className={decoStyles.formLabel}>Upload Image</label>
              <input
                id="decoration-image-upload"
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setSelectedFile(file);
                  const reader = new FileReader();
                  reader.onload = () => {
                    const url = reader.result;
                    setImagePreview(url);
                  };
                  reader.readAsDataURL(file);
                }}
              />
              <label className={decoStyles.uploadZone} htmlFor="decoration-image-upload" onClick={() => fileInputRef.current?.click()}>
                <Upload size={24} />
                <span>{selectedFile ? selectedFile.name : 'Click to select an image for this decoration'}</span>
                <span className={decoStyles.uploadHint}>JPEG, PNG recommended</span>
              </label>
              {imagePreview ? (
                <div className={decoStyles.imagePreview}>
                  <img src={imagePreview} alt="Decoration preview" />
                </div>
              ) : null}
            </div>
            <label className={decoStyles.checkboxLabel}>
              <input
                type="checkbox"
                checked={formData.available}
                onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  available: e.target.checked,
                 }))
              }
            />
              <span>Available for Booking</span>
            </label>
            <Button variant="primary" size="md" fullWidth onClick={handleSave}>
              {editing ? 'Update Decoration' : 'Add Decoration'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
