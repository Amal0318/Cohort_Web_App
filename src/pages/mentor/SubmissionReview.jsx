import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Lightbulb, Heart, Trophy, Linkedin, Code, Filter, Search,
    CheckCircle, XCircle, Clock, AlertCircle, Eye, FileText,
    Calendar, ExternalLink, User, MessageSquare, Send, ChevronDown
} from 'lucide-react';
import GlassCard from '../../components/GlassCard';
import Button from '../../components/Button';
import './SubmissionReview.css';

const PILLARS = [
    { id: 'all', label: 'All Pillars', icon: Filter, color: '#F7C948' },
    { id: 'clt', label: 'CLT', icon: Lightbulb, color: '#F7C948' },
    { id: 'sri', label: 'SRI', icon: Heart, color: '#E53935' },
    { id: 'cfc', label: 'CFC', icon: Trophy, color: '#FFC107' },
    { id: 'iipc', label: 'IIPC', icon: Linkedin, color: '#0A66C2' },
    { id: 'scd', label: 'SCD', icon: Code, color: '#FF5722' },
];

const STATUS_OPTIONS = [
    { value: 'all', label: 'All Status', color: '#757575' },
    { value: 'pending', label: 'Pending', color: '#FF9800' },
    { value: 'approved', label: 'Approved', color: '#4CAF50' },
    { value: 'rejected', label: 'Rejected', color: '#f44336' },
    { value: 'resubmit', label: 'Needs Resubmission', color: '#FFC107' },
];

function SubmissionReview({ selectedStudent }) {
    const [selectedPillar, setSelectedPillar] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [reviewComment, setReviewComment] = useState('');

    // Mock submissions data
    const mockSubmissions = [
        {
            id: 1,
            student: selectedStudent || { id: 1, name: 'Amal R', email: 'amal@student.com', rollNo: 'CS101' },
            pillar: 'clt',
            title: 'Full Stack Development Course',
            platform: 'Coursera',
            submittedDate: '2024-12-10',
            status: 'pending',
            evidence: 'https://drive.google.com/certificate/123',
            description: 'Completed a comprehensive full-stack web development course covering React, Node.js, and MongoDB.',
            duration: '40 hours',
            completionDate: '2024-12-08',
        },
        {
            id: 2,
            student: selectedStudent || { id: 1, name: 'Amal R', email: 'amal@student.com', rollNo: 'CS101' },
            pillar: 'cfc',
            title: 'Smart India Hackathon 2024',
            platform: 'Government of India',
            submittedDate: '2024-12-09',
            status: 'approved',
            evidence: 'https://drive.google.com/certificate/456',
            description: 'Participated in Smart India Hackathon and developed an AI-based solution for traffic management.',
            mode: 'Online',
            participationDate: '2024-11-15',
        },
        {
            id: 3,
            student: selectedStudent || { id: 1, name: 'Amal R', email: 'amal@student.com', rollNo: 'CS101' },
            pillar: 'iipc',
            title: 'LinkedIn Post Verification',
            platform: 'LinkedIn',
            submittedDate: '2024-12-08',
            status: 'approved',
            evidence: 'https://linkedin.com/posts/123',
            description: 'Posted about recent tech trends and innovations in AI.',
            totalPosts: 5,
        },
        {
            id: 4,
            student: selectedStudent || { id: 1, name: 'Amal R', email: 'amal@student.com', rollNo: 'CS101' },
            pillar: 'scd',
            title: 'LeetCode Daily Challenge',
            platform: 'LeetCode',
            submittedDate: '2024-12-07',
            status: 'pending',
            evidence: 'https://leetcode.com/profile/amal',
            description: 'Completed 10 medium-level algorithm problems.',
            problemsSolved: 10,
        },
        {
            id: 5,
            student: selectedStudent || { id: 1, name: 'Amal R', email: 'amal@student.com', rollNo: 'CS101' },
            pillar: 'sri',
            title: 'Community Beach Cleanup Drive',
            platform: 'Local NGO',
            submittedDate: '2024-12-05',
            status: 'resubmit',
            evidence: 'https://drive.google.com/photos/789',
            description: 'Organized and participated in a beach cleanup drive with 50+ volunteers.',
            hours: '4',
            participants: 50,
        },
    ];

    // Filter submissions
    const filteredSubmissions = mockSubmissions.filter(submission => {
        const pillarMatch = selectedPillar === 'all' || submission.pillar === selectedPillar;
        const statusMatch = selectedStatus === 'all' || submission.status === selectedStatus;
        const searchMatch = searchQuery === '' ||
            submission.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            submission.platform.toLowerCase().includes(searchQuery.toLowerCase());
        return pillarMatch && statusMatch && searchMatch;
    });

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { label: 'Pending', color: '#FF9800', icon: Clock },
            approved: { label: 'Approved', color: '#4CAF50', icon: CheckCircle },
            rejected: { label: 'Rejected', color: '#f44336', icon: XCircle },
            resubmit: { label: 'Resubmit', color: '#FFC107', icon: AlertCircle },
        };
        const config = statusConfig[status] || statusConfig.pending;
        const Icon = config.icon;
        return (
            <div className="status-badge" style={{ '--status-color': config.color }}>
                <Icon size={14} />
                <span>{config.label}</span>
            </div>
        );
    };

    const getPillarIcon = (pillarId) => {
        const pillar = PILLARS.find(p => p.id === pillarId);
        if (!pillar) return null;
        const Icon = pillar.icon;
        return (
            <div className="pillar-icon-small" style={{ backgroundColor: `${pillar.color}20`, color: pillar.color }}>
                <Icon size={18} />
            </div>
        );
    };

    const handleReview = (submission, action) => {
        console.log(`${action} submission:`, submission.id);
        // Update submission status in real implementation
        alert(`Submission ${action}!`);
        setSelectedSubmission(null);
        setReviewComment('');
    };

    return (
        <div className="submission-review">
            {/* Header */}
            <motion.div
                className="review-header"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div>
                    <h1 className="review-title">Submission Review</h1>
                    <p className="review-subtitle">
                        {selectedStudent ? `Reviewing submissions for ${selectedStudent.name}` : 'Review student submissions'}
                    </p>
                </div>
                <div className="submission-stats">
                    <div className="stat-chip">
                        <Clock size={16} />
                        <span>{mockSubmissions.filter(s => s.status === 'pending').length} Pending</span>
                    </div>
                    <div className="stat-chip">
                        <CheckCircle size={16} />
                        <span>{mockSubmissions.filter(s => s.status === 'approved').length} Approved</span>
                    </div>
                </div>
            </motion.div>

            {/* Filters */}
            <motion.div
                className="review-filters"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <GlassCard>
                    <div className="filters-container">
                        {/* Pillar Filter */}
                        <div className="filter-group">
                            <label className="filter-label">Pillar</label>
                            <div className="pillar-filter-buttons">
                                {PILLARS.map(pillar => {
                                    const Icon = pillar.icon;
                                    return (
                                        <button
                                            key={pillar.id}
                                            className={`pillar-filter-btn ${selectedPillar === pillar.id ? 'active' : ''}`}
                                            onClick={() => setSelectedPillar(pillar.id)}
                                            style={{ '--pillar-color': pillar.color }}
                                        >
                                            <Icon size={16} />
                                            <span>{pillar.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Status and Search */}
                        <div className="filter-row">
                            <div className="filter-group">
                                <label className="filter-label">Status</label>
                                <select
                                    className="status-select"
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                >
                                    {STATUS_OPTIONS.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="filter-group search-group">
                                <label className="filter-label">Search</label>
                                <div className="search-input-wrapper">
                                    <Search size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search by title or platform..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="search-input"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </GlassCard>
            </motion.div>

            {/* Submissions Grid */}
            <motion.div
                className="submissions-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                {filteredSubmissions.length === 0 ? (
                    <GlassCard>
                        <div className="no-submissions">
                            <FileText size={64} opacity={0.3} />
                            <h3>No Submissions Found</h3>
                            <p>Try adjusting your filters or check back later.</p>
                        </div>
                    </GlassCard>
                ) : (
                    filteredSubmissions.map((submission, index) => (
                        <motion.div
                            key={submission.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index }}
                        >
                            <GlassCard hoverable>
                                <div className="submission-card">
                                    <div className="submission-card-header">
                                        {getPillarIcon(submission.pillar)}
                                        <div className="submission-info">
                                            <h3 className="submission-title">{submission.title}</h3>
                                            <p className="submission-platform">{submission.platform}</p>
                                        </div>
                                        {getStatusBadge(submission.status)}
                                    </div>

                                    <p className="submission-description">{submission.description}</p>

                                    <div className="submission-meta">
                                        <div className="meta-item">
                                            <Calendar size={14} />
                                            <span>{new Date(submission.submittedDate).toLocaleDateString()}</span>
                                        </div>
                                        {submission.duration && (
                                            <div className="meta-item">
                                                <Clock size={14} />
                                                <span>{submission.duration}</span>
                                            </div>
                                        )}
                                        <div className="meta-item">
                                            <ExternalLink size={14} />
                                            <a href={submission.evidence} target="_blank" rel="noopener noreferrer">
                                                View Evidence
                                            </a>
                                        </div>
                                    </div>

                                    <div className="submission-actions">
                                        <Button
                                            variant="primary"
                                            size="small"
                                            onClick={() => setSelectedSubmission(submission)}
                                        >
                                            <Eye size={16} />
                                            <span>Review</span>
                                        </Button>
                                    </div>
                                </div>
                            </GlassCard>
                        </motion.div>
                    ))
                )}
            </motion.div>

            {/* Review Modal */}
            <AnimatePresence>
                {selectedSubmission && (
                    <motion.div
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedSubmission(null)}
                    >
                        <motion.div
                            className="review-modal"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <GlassCard>
                                <div className="modal-content">
                                    {/* Modal Header */}
                                    <div className="modal-header">
                                        <div>
                                            <div className="modal-title-row">
                                                {getPillarIcon(selectedSubmission.pillar)}
                                                <h2>{selectedSubmission.title}</h2>
                                            </div>
                                            <p className="modal-platform">{selectedSubmission.platform}</p>
                                        </div>
                                        {getStatusBadge(selectedSubmission.status)}
                                    </div>

                                    {/* Student Info */}
                                    <div className="modal-section">
                                        <h3 className="section-title">
                                            <User size={18} />
                                            Student Information
                                        </h3>
                                        <div className="student-info-grid">
                                            <div className="info-item">
                                                <span className="info-label">Name</span>
                                                <span className="info-value">{selectedSubmission.student.name}</span>
                                            </div>
                                            <div className="info-item">
                                                <span className="info-label">Roll No</span>
                                                <span className="info-value">{selectedSubmission.student.rollNo}</span>
                                            </div>
                                            <div className="info-item">
                                                <span className="info-label">Email</span>
                                                <span className="info-value">{selectedSubmission.student.email}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Submission Details */}
                                    <div className="modal-section">
                                        <h3 className="section-title">
                                            <FileText size={18} />
                                            Submission Details
                                        </h3>
                                        <div className="detail-grid">
                                            <div className="detail-item">
                                                <span className="detail-label">Submitted On</span>
                                                <span className="detail-value">
                                                    {new Date(selectedSubmission.submittedDate).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                            {selectedSubmission.duration && (
                                                <div className="detail-item">
                                                    <span className="detail-label">Duration</span>
                                                    <span className="detail-value">{selectedSubmission.duration}</span>
                                                </div>
                                            )}
                                            {selectedSubmission.mode && (
                                                <div className="detail-item">
                                                    <span className="detail-label">Mode</span>
                                                    <span className="detail-value">{selectedSubmission.mode}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="detail-description">
                                            <span className="detail-label">Description</span>
                                            <p className="detail-value">{selectedSubmission.description}</p>
                                        </div>
                                        <a
                                            href={selectedSubmission.evidence}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="evidence-link"
                                        >
                                            <ExternalLink size={16} />
                                            <span>View Evidence / Certificate</span>
                                        </a>
                                    </div>

                                    {/* Review Actions */}
                                    <div className="modal-section">
                                        <h3 className="section-title">
                                            <MessageSquare size={18} />
                                            Mentor Review
                                        </h3>
                                        <textarea
                                            className="review-textarea"
                                            placeholder="Add your feedback or comments for the student..."
                                            value={reviewComment}
                                            onChange={(e) => setReviewComment(e.target.value)}
                                            rows={4}
                                        />
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="modal-actions">
                                        <Button
                                            variant="secondary"
                                            onClick={() => handleReview(selectedSubmission, 'Rejected')}
                                            className="reject-btn"
                                        >
                                            <XCircle size={16} />
                                            <span>Reject</span>
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            onClick={() => handleReview(selectedSubmission, 'Resubmission Requested')}
                                            className="resubmit-btn"
                                        >
                                            <AlertCircle size={16} />
                                            <span>Request Resubmission</span>
                                        </Button>
                                        <Button
                                            variant="primary"
                                            onClick={() => handleReview(selectedSubmission, 'Approved')}
                                            className="approve-btn"
                                        >
                                            <CheckCircle size={16} />
                                            <span>Approve</span>
                                        </Button>
                                    </div>
                                </div>
                            </GlassCard>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default SubmissionReview;
