import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Lightbulb, Heart, Trophy, Linkedin, Code,
  User, Mail, Phone, Users, Bell, Clock,
  CheckCircle, XCircle, AlertCircle, FileText, Settings
} from 'lucide-react';
import GlassCard from '../../components/GlassCard';
import Button from '../../components/Button';
import { useAuth } from '../../context/AuthContext';
import './Home.css';

const PILLARS = [
  {
    id: 'clt',
    title: 'Center for Learning and Teaching',
    description: 'Document your creative projects and showcase your learning journey',
    icon: Lightbulb,
    color: '#F7C948',
    path: '/clt',
  },
  {
    id: 'sri',
    title: 'Social Responsibility Initiatives',
    description: 'Track your community service and social impact activities',
    icon: Heart,
    color: '#E53935',
    path: '/sri',
  },
  {
    id: 'cfc',
    title: 'Center for Creativity',
    description: 'Build your professional portfolio and track career development',
    icon: Trophy,
    color: '#FFC107',
    path: '/cfc',
  },
  {
    id: 'iipc',
    title: 'Industry Institute Partnership Cell',
    description: 'Verify your LinkedIn activity and professional network',
    icon: Linkedin,
    color: '#0A66C2',
    path: '/iipc',
  },
  {
    id: 'scd',
    title: 'Skill and Career Development',
    description: 'Track your coding skills and competitive programming journey',
    icon: Code,
    color: '#FF5722',
    path: '/scd',
  },
];

export const HomePage = () => {
  const { user } = useAuth();
  const [showProfile, setShowProfile] = useState(false);

  // Mock data - Replace with actual API calls
  const pillarProgress = {
    clt: { completed: 3, total: 5, percentage: 60 },
    sri: { completed: 2, total: 4, percentage: 50 },
    cfc: { completed: 1, total: 3, percentage: 33 },
    iipc: { completed: 4, total: 5, percentage: 80 },
    scd: { completed: 0, total: 3, percentage: 0 },
  };

  const notifications = [
    { id: 1, message: 'Your CLT submission has been reviewed', time: '2 hours ago', read: false },
    { id: 2, message: 'New assignment available in SRI', time: '1 day ago', read: false },
    { id: 3, message: 'Mentor feedback on CFC project', time: '2 days ago', read: true },
  ];

  const recentActivities = [
    { id: 1, title: 'CLT: Web Development Course', status: 'completed', date: '2 days ago' },
    { id: 2, title: 'IIPC: LinkedIn Post Verified', status: 'completed', date: '3 days ago' },
    { id: 3, title: 'CFC: Portfolio Project', status: 'pending', date: '5 days ago' },
  ];

  const overallProgress = Math.round(
    (Object.values(pillarProgress).reduce((acc, p) => acc + p.percentage, 0) / 5)
  );

  const getStatusIcon = (status) => {
    if (status === 'completed') return <CheckCircle size={16} color="#4CAF50" />;
    if (status === 'pending') return <AlertCircle size={16} color="#FF9800" />;
    return <XCircle size={16} color="#f44336" />;
  };

  return (
    <div className="home-container">
      {/* Profile Modal */}
      {showProfile && (
        <motion.div
          className="profile-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowProfile(false)}
        >
          <motion.div
            className="profile-modal"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <GlassCard>
              <div className="profile-modal-content">
                <div className="profile-avatar">
                  <User size={48} />
                </div>
                <h2>{user?.username || 'Student'}</h2>
                <div className="profile-details">
                  <div className="profile-detail-item">
                    <Mail size={18} />
                    <span>{user?.email || 'student@test.com'}</span>
                  </div>
                  <div className="profile-detail-item">
                    <FileText size={18} />
                    <span>Roll No: CS101</span>
                  </div>
                  <div className="profile-detail-item">
                    <Phone size={18} />
                    <span>+91 9876543210</span>
                  </div>
                  <div className="profile-detail-item">
                    <Users size={18} />
                    <span>Mentor: Dr. Priya Sharma</span>
                  </div>
                </div>
                <Link to="/profile-settings" className="profile-settings-button">
                  <Button variant="primary" icon={<Settings size={18} />}>
                    Profile Settings
                  </Button>
                </Link>
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>
      )}

      {/* Header with Profile */}
      <div className="home-header">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="home-welcome"
        >
          <h1>Welcome back, <span className="home-title-gradient">{user?.username || 'Student'}!</span></h1>
          <p>Track your progress and stay updated with your learning journey</p>
        </motion.div>

        <motion.button
          className="profile-icon-btn"
          onClick={() => setShowProfile(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <User size={24} />
        </motion.button>
      </div>

      {/* Main Dashboard Content */}
      <div className="home-dashboard">
        {/* Left Column */}
        <div className="home-left-column">
          {/* Overall Progress */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard>
              <div className="overall-progress-card">
                <h2>Overall Progress</h2>
                <div className="progress-circle">
                  <svg viewBox="0 0 100 100">
                    <defs>
                      <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#F7C948" />
                        <stop offset="100%" stopColor="#E53935" />
                      </linearGradient>
                    </defs>
                    <circle cx="50" cy="50" r="45" className="progress-bg" />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      className="progress-fill"
                      style={{ strokeDashoffset: 283 - (283 * overallProgress) / 100 }}
                    />
                  </svg>
                  <div className="progress-text">{overallProgress}%</div>
                </div>
                <p className="progress-label">Completed</p>
              </div>
            </GlassCard>
          </motion.div>

          {/* 5 Pillars Status */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <GlassCard>
              <div className="pillars-status-card">
                <h2>5 Pillars Status</h2>
                <div className="pillars-status-list">
                  {PILLARS.map((pillar) => {
                    const Icon = pillar.icon;
                    const progress = pillarProgress[pillar.id];
                    return (
                      <Link key={pillar.id} to={pillar.path} className="pillar-status-item">
                        <div className="pillar-status-icon" style={{ backgroundColor: `${pillar.color}20` }}>
                          <Icon size={20} style={{ color: pillar.color }} />
                        </div>
                        <div className="pillar-status-info">
                          <h4>{pillar.id.toUpperCase()}</h4>
                          <div className="pillar-progress-bar">
                            <div
                              className="pillar-progress-fill"
                              style={{
                                width: `${progress.percentage}%`,
                                backgroundColor: pillar.color
                              }}
                            />
                          </div>
                          <span>{progress.completed}/{progress.total} completed</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="home-right-column">
          {/* Mentor Notifications */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard>
              <div className="notifications-card">
                <h2><Bell size={20} /> Notifications</h2>
                <div className="notifications-list">
                  {notifications.map((notif) => (
                    <div key={notif.id} className={`notification-item ${notif.read ? 'read' : 'unread'}`}>
                      <div className="notification-dot" />
                      <div className="notification-content">
                        <p>{notif.message}</p>
                        <span><Clock size={14} /> {notif.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Recent Activities */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <GlassCard>
              <div className="activities-card">
                <h2>Recent Activities</h2>
                <div className="activities-list">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="activity-item">
                      <div className="activity-status">
                        {getStatusIcon(activity.status)}
                      </div>
                      <div className="activity-content">
                        <h4>{activity.title}</h4>
                        <div className="activity-meta">
                          <span className={`status-badge ${activity.status}`}>
                            {activity.status}
                          </span>
                          <span className="activity-date">
                            <Clock size={14} /> {activity.date}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Cohort Web</h3>
            <p>© 2025 All rights reserved</p>
          </div>
          <div className="footer-section">
            <h3>Contact</h3>
            <p>Email: support@cohortweb.edu</p>
            <p>Phone: +91 1234567890</p>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <div className="footer-links">
              <Link to="/clt">CLT</Link>
              <Link to="/sri">SRI</Link>
              <Link to="/cfc">CFC</Link>
              <Link to="/iipc">IIPC</Link>
              <Link to="/scd">SCD</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
