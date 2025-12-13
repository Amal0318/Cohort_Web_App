import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Users, TrendingUp, Award, Calendar, Bell, User, Mail, Phone, Hash } from 'lucide-react';
import GlassCard from '../../components/GlassCard';
import { useAuth } from '../../context/AuthContext';
import './MentorHome_new.css';

function MentorHome() {
    const { user } = useAuth();
    const [showProfile, setShowProfile] = useState(false);

    // Mock mentor data
    const mentorInfo = {
        name: user?.name || 'Dr. Sarah Johnson',
        email: user?.email || 'mentor@test.com',
        phone: '+91 9876543210',
        mentorId: 'MNT-001',
        studentsHandling: 5,
    };

    const stats = {
        totalStudents: 5,
        activeSubmissions: 8,
        completedReviews: 42,
        pendingReviews: 8,
    };

    const recentActivity = [
        { id: 1, student: 'Amal R', action: 'Submitted CLT project', time: '2 hours ago', type: 'submission' },
        { id: 2, student: 'Priya S', action: 'Completed CFC milestone', time: '5 hours ago', type: 'completed' },
        { id: 3, student: 'Raj K', action: 'Needs review for IIPC', time: '1 day ago', type: 'pending' },
        { id: 4, student: 'Meera L', action: 'Submitted CFC project', time: '1 day ago', type: 'submission' },
        { id: 5, student: 'Karthik M', action: 'Completed SRI task', time: '2 days ago', type: 'completed' },
    ];

    const upcomingDeadlines = [
        { id: 1, title: 'CLT Project Review', dueDate: 'Tomorrow', priority: 'high' },
        { id: 2, title: 'SRI Evaluation', dueDate: 'In 3 days', priority: 'medium' },
        { id: 3, title: 'IIPC Assessment', dueDate: 'In 5 days', priority: 'low' },
    ];

    return (
        <div className="mentor-home-container">
            {/* Profile Modal */}
            {showProfile && (
                <div className="profile-modal-overlay" onClick={() => setShowProfile(false)}>
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <GlassCard>
                            <div className="profile-modal-content">
                                <div className="profile-avatar">
                                    <User size={48} />
                                </div>
                                <h2>{mentorInfo.name}</h2>
                                <div className="profile-details">
                                    <div className="profile-detail-item">
                                        <Mail size={20} />
                                        <span>{mentorInfo.email}</span>
                                    </div>
                                    <div className="profile-detail-item">
                                        <Phone size={20} />
                                        <span>{mentorInfo.phone}</span>
                                    </div>
                                    <div className="profile-detail-item">
                                        <Hash size={20} />
                                        <span>Mentor ID: {mentorInfo.mentorId}</span>
                                    </div>
                                    <div className="profile-detail-item">
                                        <Users size={20} />
                                        <span>Students Handling: {mentorInfo.studentsHandling}</span>
                                    </div>
                                </div>
                            </div>
                        </GlassCard>
                    </motion.div>
                </div>
            )}

            {/* Header */}
            <div className="mentor-home-header">
                <div className="home-welcome">
                    <h1>Welcome back, {mentorInfo.name.split(' ')[0]}!</h1>
                    <p>Track your progress and stay updated with your learning journey</p>
                </div>
                <button className="profile-icon-btn" onClick={() => setShowProfile(true)}>
                    <User size={24} />
                </button>
            </div>

            {/* Stats Grid - Full Width Row */}
            <div className="mentor-stats-grid">
                <GlassCard hoverable>
                    <div className="mentor-stat-card">
                        <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                            <Users size={28} />
                        </div>
                        <div className="stat-info">
                            <p className="stat-label">Total Students</p>
                            <h3 className="stat-value">{stats.totalStudents}</h3>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard hoverable>
                    <div className="mentor-stat-card">
                        <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                            <TrendingUp size={28} />
                        </div>
                        <div className="stat-info">
                            <p className="stat-label">Active Submissions</p>
                            <h3 className="stat-value">{stats.activeSubmissions}</h3>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard hoverable>
                    <div className="mentor-stat-card">
                        <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                            <Award size={28} />
                        </div>
                        <div className="stat-info">
                            <p className="stat-label">Completed Reviews</p>
                            <h3 className="stat-value">{stats.completedReviews}</h3>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard hoverable>
                    <div className="mentor-stat-card">
                        <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
                            <BookOpen size={28} />
                        </div>
                        <div className="stat-info">
                            <p className="stat-label">Pending Reviews</p>
                            <h3 className="stat-value">{stats.pendingReviews}</h3>
                        </div>
                    </div>
                </GlassCard>
            </div>

            {/* Dashboard Layout */}
            <div className="mentor-home-dashboard">
                {/* Left Column */}
                <div className="mentor-home-left-column">
                    {/* Recent Activity */}
                    <GlassCard>
                        <div className="section-header">
                            <h2 className="section-title">
                                <Bell size={24} />
                                Recent Activity
                            </h2>
                        </div>
                        <div className="activity-list">
                            {recentActivity.map((activity) => (
                                <div key={activity.id} className="activity-item">
                                    <div className={`activity-indicator ${activity.type}`}></div>
                                    <div className="activity-info">
                                        <p className="activity-student">{activity.student}</p>
                                        <p className="activity-action">{activity.action}</p>
                                    </div>
                                    <span className="activity-time">{activity.time}</span>
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                </div>

                {/* Right Column */}
                <div className="mentor-home-right-column">
                    {/* Upcoming Deadlines */}
                    <GlassCard>
                        <div className="section-header">
                            <h2 className="section-title">
                                <Calendar size={24} />
                                Upcoming Deadlines
                            </h2>
                        </div>
                        <div className="deadlines-list">
                            {upcomingDeadlines.map((deadline) => (
                                <div key={deadline.id} className="deadline-item">
                                    <div className={`deadline-priority ${deadline.priority}`}></div>
                                    <div className="deadline-info">
                                        <p className="deadline-title">{deadline.title}</p>
                                        <span className="deadline-date">{deadline.dueDate}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
}

export default MentorHome;
