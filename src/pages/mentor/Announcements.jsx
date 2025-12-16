import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Calendar, AlertCircle, Megaphone, X, Edit2, Trash2, CheckCircle } from 'lucide-react';
import GlassCard from '../../components/GlassCard';
import Button from '../../components/Button';
import { getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement } from '../../services/announcements';
import './Announcements.css';

function Announcements() {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingAnnouncement, setEditingAnnouncement] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'general',
        priority: 'medium',
        event_date: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        loadAnnouncements();
    }, []);

    const loadAnnouncements = async () => {
        try {
            setLoading(true);
            const data = await getAnnouncements();
            setAnnouncements(data.announcements || []);
        } catch (error) {
            console.error('Error loading announcements:', error);
            showMessage('error', 'Failed to load announcements');
        } finally {
            setLoading(false);
        }
    };

    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            if (editingAnnouncement) {
                await updateAnnouncement(editingAnnouncement.id, formData);
                showMessage('success', 'Announcement updated successfully!');
            } else {
                await createAnnouncement(formData);
                showMessage('success', 'Announcement created and sent to all students!');
            }
            
            setShowModal(false);
            setEditingAnnouncement(null);
            setFormData({
                title: '',
                description: '',
                category: 'general',
                priority: 'medium',
                event_date: ''
            });
            await loadAnnouncements();
        } catch (error) {
            console.error('Error saving announcement:', error);
            showMessage('error', 'Failed to save announcement');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (announcement) => {
        setEditingAnnouncement(announcement);
        // Extract date only (YYYY-MM-DD) from event_date if it exists
        const dateOnly = announcement.event_date ? announcement.event_date.split('T')[0] : '';
        setFormData({
            title: announcement.title,
            description: announcement.description,
            category: announcement.category,
            priority: announcement.priority,
            event_date: dateOnly
        });
        setShowModal(true);
    };

    const handleDelete = async (announcementId) => {
        if (!window.confirm('Are you sure you want to delete this announcement?')) return;

        try {
            await deleteAnnouncement(announcementId);
            showMessage('success', 'Announcement deleted successfully');
            await loadAnnouncements();
        } catch (error) {
            console.error('Error deleting announcement:', error);
            showMessage('error', 'Failed to delete announcement');
        }
    };

    const getCategoryColor = (category) => {
        const colors = {
            general: '#6b7280',
            event: '#8b5cf6',
            deadline: '#ef4444',
            important: '#f59e0b',
            reminder: '#10b981'
        };
        return colors[category] || colors.general;
    };

    const getCategoryIcon = (category) => {
        switch(category) {
            case 'event':
                return '🎉';
            case 'deadline':
                return '⏰';
            case 'important':
                return '❗';
            case 'reminder':
                return '🔔';
            default:
                return 'ℹ️';
        }
    };

    return (
        <div className="announcements-container">
            {/* Header */}
            <div className="announcements-header">
                <div>
                    <h1 className="announcements-title">
                        <Megaphone size={32} />
                        Announcements
                    </h1>
                    <p className="announcements-subtitle">
                        Create and manage announcements for your students
                    </p>
                </div>
                <Button onClick={() => {
                    setEditingAnnouncement(null);
                    setFormData({
                        title: '',
                        description: '',
                        category: 'general',
                        priority: 'medium',
                        event_date: ''
                    });
                    setShowModal(true);
                }}>
                    <Plus size={20} />
                    New Announcement
                </Button>
            </div>

            {/* Success/Error Message */}
            <AnimatePresence>
                {message.text && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`message-alert message-alert-${message.type}`}
                    >
                        {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                        {message.text}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Announcements List */}
            {loading ? (
                <div className="loading-state">Loading announcements...</div>
            ) : announcements.length === 0 ? (
                <GlassCard>
                    <div className="empty-state">
                        <Megaphone size={64} opacity={0.3} />
                        <h3>No Announcements Yet</h3>
                        <p>Create your first announcement to notify your students</p>
                        <Button onClick={() => setShowModal(true)}>
                            <Plus size={20} />
                            Create Announcement
                        </Button>
                    </div>
                </GlassCard>
            ) : (
                <div className="announcements-grid">
                    {announcements.map((announcement) => (
                        <motion.div
                            key={announcement.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <GlassCard hoverable>
                                <div className="announcement-card">
                                    <div className="announcement-card-header">
                                        <div className="announcement-category" style={{ background: getCategoryColor(announcement.category) }}>
                                            <span>{getCategoryIcon(announcement.category)}</span>
                                            <span>{announcement.category}</span>
                                        </div>
                                        <div className="announcement-actions">
                                            <button
                                                className="action-btn edit-btn"
                                                onClick={() => handleEdit(announcement)}
                                                title="Edit"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                className="action-btn delete-btn"
                                                onClick={() => handleDelete(announcement.id)}
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <h3 className="announcement-card-title">{announcement.title}</h3>
                                    <p className="announcement-card-description">{announcement.description}</p>
                                    <div className="announcement-card-footer">
                                        {announcement.event_date && (
                                            <div className="announcement-date">
                                                <Calendar size={14} />
                                                {new Date(announcement.event_date).toLocaleDateString()}
                                            </div>
                                        )}
                                        <div className={`announcement-priority priority-${announcement.priority}`}>
                                            {announcement.priority}
                                        </div>
                                        <div className="announcement-time">
                                            {announcement.time_ago}
                                        </div>
                                    </div>
                                </div>
                            </GlassCard>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Create/Edit Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="modal-overlay" onClick={() => setShowModal(false)}>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="modal-content"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <GlassCard>
                                <div className="modal-header">
                                    <h2>{editingAnnouncement ? 'Edit Announcement' : 'New Announcement'}</h2>
                                    <button className="modal-close" onClick={() => setShowModal(false)}>
                                        <X size={24} />
                                    </button>
                                </div>
                                <form onSubmit={handleSubmit} className="announcement-form">
                                    <div className="form-group">
                                        <label>Title *</label>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            required
                                            placeholder="Enter announcement title"
                                            className="form-input"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Description *</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            required
                                            placeholder="Enter announcement description"
                                            className="form-textarea"
                                            rows={5}
                                        />
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Category *</label>
                                            <select
                                                value={formData.category}
                                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                className="form-select"
                                            >
                                                <option value="general">General</option>
                                                <option value="event">Event</option>
                                                <option value="deadline">Deadline</option>
                                                <option value="important">Important</option>
                                                <option value="reminder">Reminder</option>
                                            </select>
                                        </div>

                                        <div className="form-group">
                                            <label>Priority *</label>
                                            <select
                                                value={formData.priority}
                                                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                                className="form-select"
                                            >
                                                <option value="low">Low</option>
                                                <option value="medium">Medium</option>
                                                <option value="high">High</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Event/Deadline Date (Optional)</label>
                                        <input
                                            type="date"
                                            value={formData.event_date}
                                            onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                                            className="form-input"
                                        />
                                    </div>

                                    <div className="form-actions">
                                        <button
                                            type="button"
                                            onClick={() => setShowModal(false)}
                                            className="btn-secondary"
                                            disabled={submitting}
                                        >
                                            Cancel
                                        </button>
                                        <Button type="submit" disabled={submitting}>
                                            {submitting ? 'Saving...' : editingAnnouncement ? 'Update' : 'Create & Notify'}
                                        </Button>
                                    </div>
                                </form>
                            </GlassCard>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default Announcements;
