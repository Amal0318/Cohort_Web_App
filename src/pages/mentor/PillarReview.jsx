import React, { useState, useEffect, useMemo } from 'react';
import { Lightbulb, Heart, Trophy, Linkedin, Code, Grid, CheckCircle, Clock, XCircle, FileText, ExternalLink, Image, Link as LinkIcon, Eye, Search, Filter, X, ThumbsUp, ThumbsDown, RotateCcw, MessageSquare, Calendar, User, Mail, Phone } from 'lucide-react';
import './PillarReview.css';

const PILLARS = [
    { id: 'all', name: 'All', icon: Grid, color: '#3b82f6' },
    { id: 'clt', name: 'CLT', icon: Lightbulb, color: '#f59e0b' },
    { id: 'sri', name: 'SRI', icon: Heart, color: '#ef4444' },
    { id: 'cfc', name: 'CFC', icon: Trophy, color: '#10b981' },
    { id: 'iipc', name: 'IIPC', icon: Linkedin, color: '#0ea5e9' },
    { id: 'scd', name: 'SCD', icon: Code, color: '#8b5cf6' },
];

// Mock data for pillar statistics
const MOCK_STATS = {
    all: { total: 156, pending: 23, approved: 118, rejected: 15 },
    clt: { total: 28, pending: 5, approved: 21, rejected: 2 },
    sri: { total: 32, pending: 4, approved: 25, rejected: 3 },
    cfc: { total: 26, pending: 3, approved: 20, rejected: 3 },
    iipc: { total: 35, pending: 6, approved: 27, rejected: 2 },
    scd: { total: 35, pending: 5, approved: 25, rejected: 5 },
};

// Mock submission data with enhanced details
const MOCK_SUBMISSIONS = [
    {
        id: 1,
        student: {
            name: 'Amal R',
            avatar: 'A',
            year: '3rd Year',
            department: 'CSE',
            email: 'amal.r@college.edu',
            phone: '+91 98765 43210',
            rollNo: 'CSE2021045'
        },
        title: 'Web Development Workshop Completion',
        description: 'Successfully completed the 3-day web development workshop covering HTML, CSS, JavaScript, and React fundamentals. Built a portfolio website as the final project.',
        fullDescription: 'Successfully completed the 3-day web development workshop covering HTML, CSS, JavaScript, and React fundamentals. Built a portfolio website as the final project.\n\nThe workshop included hands-on sessions on responsive design, REST API integration, and deployment strategies. Created a fully functional portfolio website showcasing personal projects and skills.',
        submittedDate: '2024-12-10',
        status: 'pending',
        pillar: 'clt',
        evidenceLinks: { images: 2, links: 1 },
        evidence: {
            images: ['certificate.jpg', 'project-screenshot.png'],
            links: ['https://github.com/amalr/portfolio', 'https://portfolio.amalr.dev']
        },
        timeline: [
            { date: '2024-12-10 14:30', event: 'Submission created', type: 'submit' },
            { date: '2024-12-10 14:25', event: 'Evidence uploaded', type: 'upload' }
        ]
    },
    {
        id: 2,
        student: {
            name: 'Priya S',
            avatar: 'P',
            year: '2nd Year',
            department: 'ECE',
            email: 'priya.s@college.edu',
            phone: '+91 98765 43211',
            rollNo: 'ECE2022032'
        },
        title: 'Community Service Initiative',
        description: 'Organized and participated in a community clean-up drive at local park. Coordinated with 20+ volunteers and collected recyclable materials.',
        fullDescription: 'Organized and participated in a community clean-up drive at local park. Coordinated with 20+ volunteers and collected recyclable materials.\n\nThe initiative resulted in collection of over 200kg of recyclable waste. Partnered with local NGO for proper waste disposal and recycling.',
        submittedDate: '2024-12-09',
        status: 'approved',
        pillar: 'sri',
        evidenceLinks: { images: 5, links: 0 },
        evidence: {
            images: ['event-photo1.jpg', 'event-photo2.jpg', 'certificate.jpg', 'team-photo.jpg', 'waste-collection.jpg'],
            links: []
        },
        timeline: [
            { date: '2024-12-09 16:45', event: 'Approved by mentor', type: 'approve' },
            { date: '2024-12-09 10:20', event: 'Submission created', type: 'submit' }
        ]
    },
    {
        id: 3,
        student: {
            name: 'Raj K',
            avatar: 'R',
            year: '4th Year',
            department: 'MECH',
            email: 'raj.k@college.edu',
            phone: '+91 98765 43212',
            rollNo: 'MECH2020018'
        },
        title: 'Inter-College Hackathon Participation',
        description: 'Participated in TechFest 2024 hackathon. Developed an IoT-based smart home automation system. Team secured 2nd place.',
        fullDescription: 'Participated in TechFest 2024 hackathon. Developed an IoT-based smart home automation system. Team secured 2nd place.\n\nBuilt a complete home automation solution using Arduino, ESP8266, and mobile app interface. Implemented features like remote control, scheduling, and energy monitoring.',
        submittedDate: '2024-12-08',
        status: 'approved',
        pillar: 'cfc',
        evidenceLinks: { images: 3, links: 2 },
        evidence: {
            images: ['hackathon-certificate.jpg', 'team-photo.jpg', 'project-demo.jpg'],
            links: ['https://github.com/rajk/smart-home', 'https://devpost.com/software/smart-home-iot']
        },
        timeline: [
            { date: '2024-12-08 18:20', event: 'Approved by mentor', type: 'approve' },
            { date: '2024-12-08 11:15', event: 'Submission created', type: 'submit' }
        ]
    },
    {
        id: 4,
        student: {
            name: 'Meera L',
            avatar: 'M',
            year: '3rd Year',
            department: 'IT',
            email: 'meera.l@college.edu',
            phone: '+91 98765 43213',
            rollNo: 'IT2021027'
        },
        title: 'LinkedIn Profile Optimization',
        description: 'Updated LinkedIn profile with professional summary, skills, and project details. Received endorsements from 5+ connections.',
        fullDescription: 'Updated LinkedIn profile with professional summary, skills, and project details. Received endorsements from 5+ connections.\n\nNote: Profile needs more substantial professional experience and project descriptions.',
        submittedDate: '2024-12-07',
        status: 'rejected',
        pillar: 'iipc',
        evidenceLinks: { images: 1, links: 1 },
        evidence: {
            images: ['profile-screenshot.png'],
            links: ['https://linkedin.com/in/meeral']
        },
        timeline: [
            { date: '2024-12-07 15:30', event: 'Rejected - Insufficient content', type: 'reject' },
            { date: '2024-12-07 09:45', event: 'Submission created', type: 'submit' }
        ]
    },
    {
        id: 5,
        student: {
            name: 'Karthik M',
            avatar: 'K',
            year: '2nd Year',
            department: 'CSE',
            email: 'karthik.m@college.edu',
            phone: '+91 98765 43214',
            rollNo: 'CSE2022056'
        },
        title: 'Python Data Analysis Project',
        description: 'Completed data analysis project using Python, Pandas, and Matplotlib. Analyzed student performance data and created visualization dashboards.',
        fullDescription: 'Completed data analysis project using Python, Pandas, and Matplotlib. Analyzed student performance data and created visualization dashboards.\n\nProject includes statistical analysis, trend identification, and interactive visualizations. Code is well-documented and follows best practices.',
        submittedDate: '2024-12-11',
        status: 'pending',
        pillar: 'scd',
        evidenceLinks: { images: 4, links: 3 },
        evidence: {
            images: ['dashboard1.png', 'dashboard2.png', 'analysis-chart.png', 'code-screenshot.png'],
            links: ['https://github.com/karthikm/data-analysis', 'https://colab.research.google.com/notebook', 'https://kaggle.com/karthikm/analysis']
        },
        timeline: [
            { date: '2024-12-11 13:20', event: 'Submission created', type: 'submit' },
            { date: '2024-12-11 13:10', event: 'Evidence uploaded', type: 'upload' }
        ]
    },
    {
        id: 6,
        student: {
            name: 'Divya P',
            avatar: 'D',
            year: '3rd Year',
            department: 'EEE',
            email: 'divya.p@college.edu',
            phone: '+91 98765 43215',
            rollNo: 'EEE2021041'
        },
        title: 'Technical Seminar Presentation',
        description: 'Delivered a technical seminar on Renewable Energy Solutions to 50+ students. Received positive feedback from faculty members.',
        fullDescription: 'Delivered a technical seminar on Renewable Energy Solutions to 50+ students. Received positive feedback from faculty members.\n\nPresentation covered solar, wind, and hydroelectric power systems. Included practical case studies and future trends in renewable energy.',
        submittedDate: '2024-12-10',
        status: 'approved',
        pillar: 'clt',
        evidenceLinks: { images: 2, links: 1 },
        evidence: {
            images: ['presentation-certificate.jpg', 'seminar-photo.jpg'],
            links: ['https://slides.com/divyap/renewable-energy']
        },
        timeline: [
            { date: '2024-12-10 17:10', event: 'Approved by mentor', type: 'approve' },
            { date: '2024-12-10 12:30', event: 'Submission created', type: 'submit' }
        ]
    },
];

// Animated counter hook
function useCountUp(end, duration = 1000) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime;
        let animationFrame;

        const animate = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            setCount(Math.floor(progress * end));

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        animationFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame);
    }, [end, duration]);

    return count;
}

function PillarReview() {
    const [activePillar, setActivePillar] = useState('all');
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [submissions, setSubmissions] = useState(MOCK_SUBMISSIONS);
    const [mentorComment, setMentorComment] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [actionAnimation, setActionAnimation] = useState(null);

    // Filter states
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState('latest');
    const [yearFilter, setYearFilter] = useState('all');

    // Simulate loading
    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, [activePillar]);

    const getActivePillar = () => {
        return PILLARS.find(p => p.id === activePillar) || PILLARS[0];
    };

    const currentPillar = getActivePillar();
    const stats = MOCK_STATS[activePillar];

    // Filter and sort submissions
    const filteredSubmissions = useMemo(() => {
        let filtered = activePillar === 'all'
            ? [...submissions]
            : submissions.filter(sub => sub.pillar === activePillar);

        // Apply status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(sub => sub.status === statusFilter);
        }

        // Apply search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(sub =>
                sub.student.name.toLowerCase().includes(query) ||
                sub.title.toLowerCase().includes(query) ||
                sub.description.toLowerCase().includes(query)
            );
        }

        // Apply year filter
        if (yearFilter !== 'all') {
            filtered = filtered.filter(sub => sub.student.year === yearFilter);
        }

        // Apply sorting
        filtered.sort((a, b) => {
            const dateA = new Date(a.submittedDate);
            const dateB = new Date(b.submittedDate);
            return sortOrder === 'latest' ? dateB - dateA : dateA - dateB;
        });

        return filtered;
    }, [submissions, activePillar, statusFilter, searchQuery, sortOrder, yearFilter]);

    // Animated counts
    const animatedTotal = useCountUp(stats.total);
    const animatedPending = useCountUp(stats.pending);
    const animatedApproved = useCountUp(stats.approved);
    const animatedRejected = useCountUp(stats.rejected);

    // Calculate completion percentage
    const completionPercentage = Math.round(((stats.approved + stats.rejected) / stats.total) * 100);

    const handleReviewClick = (submission) => {
        setSelectedSubmission(submission);
        setMentorComment('');
    };

    const closeReviewDrawer = () => {
        setSelectedSubmission(null);
        setMentorComment('');
    };

    const updateSubmissionStatus = (submissionId, newStatus, comment = '') => {
        const now = new Date();
        const timestamp = now.toISOString().split('T')[0] + ' ' + now.toTimeString().split(' ')[0].substring(0, 5);

        // Set animation based on action
        if (newStatus === 'approved') {
            setActionAnimation('success');
        } else if (newStatus === 'rejected') {
            setActionAnimation('warning');
        } else {
            setActionAnimation('resubmit');
        }

        // Clear animation after delay
        setTimeout(() => {
            setActionAnimation(null);
        }, 2000);

        setSubmissions(prevSubmissions =>
            prevSubmissions.map(sub => {
                if (sub.id === submissionId) {
                    const eventMap = {
                        'approved': 'Approved by mentor',
                        'rejected': 'Rejected by mentor',
                        'pending': 'Resubmission requested'
                    };

                    return {
                        ...sub,
                        status: newStatus,
                        timeline: [
                            { date: timestamp, event: comment || eventMap[newStatus], type: newStatus === 'pending' ? 'request' : newStatus.substring(0, 7) },
                            ...sub.timeline
                        ]
                    };
                }
                return sub;
            })
        );

        // Close drawer after short delay to show animation
        setTimeout(() => {
            closeReviewDrawer();
        }, 1500);
    };

    const handleApprove = () => {
        if (selectedSubmission) {
            updateSubmissionStatus(selectedSubmission.id, 'approved', mentorComment || 'Approved by mentor');
        }
    };

    const handleReject = () => {
        if (selectedSubmission && mentorComment.trim()) {
            updateSubmissionStatus(selectedSubmission.id, 'rejected', `Rejected: ${mentorComment}`);
        } else {
            alert('Please provide a reason for rejection');
        }
    };

    const handleRequestResubmission = () => {
        if (selectedSubmission && mentorComment.trim()) {
            updateSubmissionStatus(selectedSubmission.id, 'pending', `Resubmission requested: ${mentorComment}`);
        } else {
            alert('Please provide feedback for resubmission');
        }
    };

    const getStatusConfig = (status) => {
        switch (status) {
            case 'pending':
                return { label: 'Pending', color: '#fbbf24', bgColor: 'rgba(251, 191, 36, 0.1)' };
            case 'approved':
                return { label: 'Approved', color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.1)' };
            case 'rejected':
                return { label: 'Rejected', color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.1)' };
            default:
                return { label: status, color: '#6b7280', bgColor: 'rgba(107, 114, 128, 0.1)' };
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    return (
        <div className="pillar-review">
            {/* Header Section */}
            <div className="pillar-review__header">
                <h1 className="pillar-review__title">Pillar Review</h1>
                <p className="pillar-review__subtitle">
                    Review all student submissions under this pillar
                </p>
            </div>

            {/* Pillar Selector Tabs */}
            <div className="pillar-review__tabs">
                {PILLARS.map((pillar) => {
                    const Icon = pillar.icon;
                    const isActive = activePillar === pillar.id;

                    return (
                        <button
                            key={pillar.id}
                            className={`pillar-review__tab ${isActive ? 'pillar-review__tab--active' : ''}`}
                            onClick={() => setActivePillar(pillar.id)}
                            style={{
                                '--pillar-color': isActive ? '#fbbf24' : pillar.color
                            }}
                        >
                            <Icon size={20} />
                            <span>{pillar.name}</span>
                        </button>
                    );
                })}
            </div>

            {/* Pillar Summary Section */}
            <div className="pillar-review__summary">
                <div className="pillar-summary-card">
                    <div className="pillar-summary-card__header">
                        <div className="pillar-summary-card__icon" style={{ color: currentPillar.color }}>
                            <currentPillar.icon size={28} />
                        </div>
                        <div className="pillar-summary-card__title">
                            <h2>{currentPillar.name} Overview</h2>
                            <p>Submission statistics and progress</p>
                        </div>

                        <div className="pillar-summary-card__stats">
                            <div className="stat-item">
                                <div className="stat-item__icon" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
                                    <FileText size={16} color="#3b82f6" />
                                </div>
                                <div className="stat-item__content">
                                    <span className="stat-item__label">Total Submissions</span>
                                    <span className="stat-item__value">{animatedTotal}</span>
                                </div>
                            </div>

                            <div className="stat-item">
                                <div className="stat-item__icon" style={{ background: 'rgba(251, 191, 36, 0.1)' }}>
                                    <Clock size={16} color="#fbbf24" />
                                </div>
                                <div className="stat-item__content">
                                    <span className="stat-item__label">Pending</span>
                                    <span className="stat-item__value">{animatedPending}</span>
                                </div>
                            </div>

                            <div className="stat-item">
                                <div className="stat-item__icon" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
                                    <CheckCircle size={16} color="#10b981" />
                                </div>
                                <div className="stat-item__content">
                                    <span className="stat-item__label">Approved</span>
                                    <span className="stat-item__value">{animatedApproved}</span>
                                </div>
                            </div>

                            <div className="stat-item">
                                <div className="stat-item__icon" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
                                    <XCircle size={16} color="#ef4444" />
                                </div>
                                <div className="stat-item__content">
                                    <span className="stat-item__label">Rejected</span>
                                    <span className="stat-item__value">{animatedRejected}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pillar-summary-card__progress">
                        <div className="progress-header">
                            <span className="progress-label">Completion Rate</span>
                            <span className="progress-percentage">{completionPercentage}%</span>
                        </div>
                        <div className="progress-bar">
                            <div
                                className="progress-bar__fill"
                                style={{
                                    width: `${completionPercentage}%`,
                                    background: completionPercentage >= 75
                                        ? 'linear-gradient(90deg, #10b981, #059669)'
                                        : completionPercentage >= 50
                                            ? 'linear-gradient(90deg, #f59e0b, #d97706)'
                                            : 'linear-gradient(90deg, #ef4444, #dc2626)'
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="filter-bar filter-bar--sticky">
                <div className="filter-bar__search">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search by student name or submission..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="filter-search-input"
                    />
                </div>

                <div className="filter-bar__controls">
                    <div className="filter-group">
                        <label className="filter-label">
                            <Filter size={14} />
                            Status
                        </label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="filter-select"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label className="filter-label">
                            <Clock size={14} />
                            Sort By
                        </label>
                        <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            className="filter-select"
                        >
                            <option value="latest">Latest First</option>
                            <option value="oldest">Oldest First</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label className="filter-label">Year</label>
                        <select
                            value={yearFilter}
                            onChange={(e) => setYearFilter(e.target.value)}
                            className="filter-select"
                        >
                            <option value="all">All Years</option>
                            <option value="2nd Year">2nd Year</option>
                            <option value="3rd Year">3rd Year</option>
                            <option value="4th Year">4th Year</option>
                        </select>
                    </div>
                </div>

                <div className="filter-bar__results">
                    Showing {filteredSubmissions.length} submission{filteredSubmissions.length !== 1 ? 's' : ''}
                </div>
            </div>

            {/* Content Container */}
            <div className="pillar-review__content">
                {isLoading ? (
                    /* Loading Skeletons */
                    <div className="submissions-grid">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="submission-card skeleton-card">
                                <div className="skeleton-header">
                                    <div className="skeleton-avatar skeleton-animate" />
                                    <div className="skeleton-text-group">
                                        <div className="skeleton-text skeleton-text--short skeleton-animate" />
                                        <div className="skeleton-text skeleton-text--tiny skeleton-animate" />
                                    </div>
                                    <div className="skeleton-badge skeleton-animate" />
                                </div>
                                <div className="skeleton-body">
                                    <div className="skeleton-text skeleton-text--medium skeleton-animate" />
                                    <div className="skeleton-text skeleton-text--long skeleton-animate" />
                                    <div className="skeleton-text skeleton-text--long skeleton-animate" />
                                    <div className="skeleton-text skeleton-text--medium skeleton-animate" />
                                </div>
                                <div className="skeleton-footer">
                                    <div className="skeleton-text skeleton-text--tiny skeleton-animate" />
                                    <div className="skeleton-button skeleton-animate" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredSubmissions.length === 0 ? (
                    /* Enhanced Empty State */
                    <div className="empty-state">
                        <div className="empty-state__icon">
                            <FileText size={80} />
                        </div>
                        <h3 className="empty-state__title">No Submissions Found</h3>
                        <p className="empty-state__message">
                            {searchQuery.trim() || statusFilter !== 'all' || yearFilter !== 'all'
                                ? 'Try adjusting your filters to see more results.'
                                : `There are no submissions for ${currentPillar.name === 'All' ? 'any pillar' : currentPillar.name} yet.`
                            }
                        </p>
                        {(searchQuery.trim() || statusFilter !== 'all' || yearFilter !== 'all') && (
                            <button
                                className="empty-state__button"
                                onClick={() => {
                                    setSearchQuery('');
                                    setStatusFilter('all');
                                    setYearFilter('all');
                                }}
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                ) : (
                    /* Submission Cards */
                    <div className="submissions-grid">
                        {filteredSubmissions.map((submission) => {
                            const statusConfig = getStatusConfig(submission.status);

                            return (
                                <div
                                    key={submission.id}
                                    className={`submission-card submission-card--${submission.status}`}
                                >
                                    {/* Student Info Header */}
                                    <div className="submission-card__header">
                                        <div className="student-info">
                                            <div className="student-avatar">
                                                {submission.student.avatar}
                                            </div>
                                            <div className="student-details">
                                                <h3 className="student-name">{submission.student.name}</h3>
                                                <p className="student-meta">
                                                    {submission.student.year} • {submission.student.department}
                                                </p>
                                            </div>
                                        </div>
                                        <div
                                            className="status-badge"
                                            style={{
                                                color: statusConfig.color,
                                                background: statusConfig.bgColor,
                                                boxShadow: `0 0 20px ${statusConfig.bgColor}`
                                            }}
                                        >
                                            {statusConfig.label}
                                        </div>
                                    </div>

                                    {/* Submission Content */}
                                    <div className="submission-card__body">
                                        <h4 className="submission-title">{submission.title}</h4>
                                        <p className="submission-description">
                                            {submission.description}
                                        </p>
                                    </div>

                                    {/* Submission Footer */}
                                    <div className="submission-card__footer">
                                        <div className="submission-meta">
                                            <span className="submission-date">
                                                <Clock size={14} />
                                                {formatDate(submission.submittedDate)}
                                            </span>
                                            <div className="evidence-links">
                                                {submission.evidenceLinks.images > 0 && (
                                                    <span className="evidence-badge" title="Images">
                                                        <Image size={14} />
                                                        {submission.evidenceLinks.images}
                                                    </span>
                                                )}
                                                {submission.evidenceLinks.links > 0 && (
                                                    <span className="evidence-badge" title="Links">
                                                        <LinkIcon size={14} />
                                                        {submission.evidenceLinks.links}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            className="review-button"
                                            onClick={() => handleReviewClick(submission)}
                                        >
                                            <Eye size={16} />
                                            Review
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Review Drawer */}
            {selectedSubmission && (
                <>
                    <div className="drawer-overlay" onClick={closeReviewDrawer} />
                    <div className="review-drawer">
                        {/* Action Animation Overlay */}
                        {actionAnimation && (
                            <div className={`action-animation action-animation--${actionAnimation}`}>
                                <div className="action-animation__icon">
                                    {actionAnimation === 'success' && <CheckCircle size={80} />}
                                    {actionAnimation === 'warning' && <XCircle size={80} />}
                                    {actionAnimation === 'resubmit' && <RotateCcw size={80} />}
                                </div>
                                <p className="action-animation__text">
                                    {actionAnimation === 'success' && 'Submission Approved!'}
                                    {actionAnimation === 'warning' && 'Submission Rejected'}
                                    {actionAnimation === 'resubmit' && 'Resubmission Requested'}
                                </p>
                            </div>
                        )}

                        <div className="review-drawer__header">
                            <h2>Review Submission</h2>
                            <button className="close-drawer-btn" onClick={closeReviewDrawer}>
                                <X size={24} />
                            </button>
                        </div>

                        <div className="review-drawer__content">
                            {/* Student Info Card */}
                            <div className="review-section student-info-card">
                                <div className="review-section__header">
                                    <User size={18} />
                                    <h3>Student Information</h3>
                                </div>
                                <div className="student-info-details">
                                    <div className="student-info-primary">
                                        <div className="student-avatar-large">
                                            {selectedSubmission.student.avatar}
                                        </div>
                                        <div>
                                            <h4>{selectedSubmission.student.name}</h4>
                                            <p className="student-roll">{selectedSubmission.student.rollNo}</p>
                                        </div>
                                    </div>
                                    <div className="student-info-grid">
                                        <div className="info-item">
                                            <span className="info-label">Year</span>
                                            <span className="info-value">{selectedSubmission.student.year}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">Department</span>
                                            <span className="info-value">{selectedSubmission.student.department}</span>
                                        </div>
                                        <div className="info-item">
                                            <Mail size={14} />
                                            <span className="info-value">{selectedSubmission.student.email}</span>
                                        </div>
                                        <div className="info-item">
                                            <Phone size={14} />
                                            <span className="info-value">{selectedSubmission.student.phone}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Submission Details */}
                            <div className="review-section submission-details-card">
                                <div className="review-section__header">
                                    <FileText size={18} />
                                    <h3>Submission Details</h3>
                                </div>
                                <div className="submission-details-content">
                                    <div className="detail-item">
                                        <span className="detail-label">Title</span>
                                        <h4 className="detail-value">{selectedSubmission.title}</h4>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Description</span>
                                        <p className="detail-description">{selectedSubmission.fullDescription}</p>
                                    </div>
                                    <div className="detail-meta">
                                        <div className="meta-item">
                                            <Clock size={14} />
                                            <span>Submitted: {formatDate(selectedSubmission.submittedDate)}</span>
                                        </div>
                                        <div className="meta-item">
                                            <span
                                                className="status-badge-large"
                                                style={{
                                                    color: getStatusConfig(selectedSubmission.status).color,
                                                    background: getStatusConfig(selectedSubmission.status).bgColor
                                                }}
                                            >
                                                {getStatusConfig(selectedSubmission.status).label}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Evidence Preview */}
                            <div className="review-section evidence-card">
                                <div className="review-section__header">
                                    <Image size={18} />
                                    <h3>Evidence</h3>
                                </div>
                                <div className="evidence-content">
                                    {selectedSubmission.evidence.images.length > 0 && (
                                        <div className="evidence-group">
                                            <span className="evidence-group-label">Images ({selectedSubmission.evidence.images.length})</span>
                                            <div className="evidence-items">
                                                {selectedSubmission.evidence.images.map((img, idx) => (
                                                    <div key={idx} className="evidence-item">
                                                        <Image size={16} />
                                                        <span>{img}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {selectedSubmission.evidence.links.length > 0 && (
                                        <div className="evidence-group">
                                            <span className="evidence-group-label">Links ({selectedSubmission.evidence.links.length})</span>
                                            <div className="evidence-items">
                                                {selectedSubmission.evidence.links.map((link, idx) => (
                                                    <a key={idx} href={link} target="_blank" rel="noopener noreferrer" className="evidence-link">
                                                        <ExternalLink size={14} />
                                                        <span>{link}</span>
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Timeline */}
                            <div className="review-section timeline-card">
                                <div className="review-section__header">
                                    <Calendar size={18} />
                                    <h3>Submission Timeline</h3>
                                </div>
                                <div className="timeline-content">
                                    {selectedSubmission.timeline.map((event, idx) => (
                                        <div key={idx} className={`timeline-event timeline-event--${event.type}`}>
                                            <div className="timeline-dot" />
                                            <div className="timeline-info">
                                                <span className="timeline-event-text">{event.event}</span>
                                                <span className="timeline-date">{event.date}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Mentor Actions */}
                            <div className="review-section mentor-actions-card">
                                <div className="review-section__header">
                                    <MessageSquare size={18} />
                                    <h3>Mentor Actions</h3>
                                </div>
                                <div className="mentor-actions-content">
                                    <div className="comment-section">
                                        <label htmlFor="mentor-comment">Comment / Feedback</label>
                                        <textarea
                                            id="mentor-comment"
                                            value={mentorComment}
                                            onChange={(e) => setMentorComment(e.target.value)}
                                            placeholder="Provide feedback or comments for the student..."
                                            rows={4}
                                            className="mentor-comment-input"
                                        />
                                    </div>
                                    <div className="action-buttons">
                                        <button
                                            className="action-btn action-btn--approve"
                                            onClick={handleApprove}
                                        >
                                            <ThumbsUp size={18} />
                                            Approve
                                        </button>
                                        <button
                                            className="action-btn action-btn--reject"
                                            onClick={handleReject}
                                        >
                                            <ThumbsDown size={18} />
                                            Reject
                                        </button>
                                        <button
                                            className="action-btn action-btn--resubmit"
                                            onClick={handleRequestResubmission}
                                        >
                                            <RotateCcw size={18} />
                                            Request Resubmission
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default PillarReview;
